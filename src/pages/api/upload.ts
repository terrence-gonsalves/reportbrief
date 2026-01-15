import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { parseCsv } from "@/lib/csv";
import { createSupabaseServerClient  } from "@/lib/supabaseServer";
import { logAuditEvent, logError } from "@/lib/auditLog";

export const config = {
    api: { bodyParser: false }
};

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // authenticate user
    const supabase = createSupabaseServerClient(req);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return res.status(401).json({ error: "Unauthorised" });
    }
    try {

        //parse data
        const form = formidable();
        const [ fields, files ] = await form.parse(req);

        const file = files.file?.[0];

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // read/parse CSV
        const csvText = fs.readFileSync(file.filepath, "utf8");
        const { rows, columns } = parseCsv(csvText);

        if (!rows || rows.length === 0) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // get filename
        const filename = file.originalFilename || "report.csv";

        // create report record
        const { data: report, error: reportError } = await supabase
            .from("reports")
            .insert({
                user_id: user.id,
                title: filename,
                num_rows: rows.length,
                columns: columns,
                status: "parsed",
                file_id: null // we're not storing any files permanently (yet!!!!)
            })
            .select()
            .single();

        if (reportError || !report) {
            console.error("Failed to create report: ", reportError);

            await logError(user.id, "Failed to create report", {
                error: reportError?.message,
                filename: filename,
                rowCount: rows.length
            });

            return res.status(500).json({ error: "Failed to create report" });
        }

        // log successful upload
        await logAuditEvent("report_uploaded", user.id, {
            report_id: report.id,
            filename: filename,
            row_count: rows.length,
            column_count: columns.length
        });

        // store sample rows
        const { error: samplesError } = await supabase
            .from("report_row_samples")
            .insert({
                report_id: report.id,
                sample_rows: rows.slice(0, 50)
            });

        if (samplesError) {
            console.error("Failed to store samples: ", samplesError);
        }

        fs.unlinkSync(file.filepath);

        return res.json({
            success: true,
            reportId: report.id,
            rowCount: rows.length,
            columnCount: columns.length
        });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "unknown error";
        console.error("Upload error: ", errorMessage);

        // log error
        const supabase = createSupabaseServerClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await logError(user.id, errorMessage, {
                context: "csv_upload"
            });
        }

        return res.status(500).json({ 
            error: "Failed to process upload", 
            details: errorMessage
        });
    }
}