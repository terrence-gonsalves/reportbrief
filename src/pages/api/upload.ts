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
        
        // check if forceNew flag is set (from form field)
        const forceNew = fields.forceNew?.[0] === "true";

        // check if a report with the same title already exists for this user
        const { data: existingReports, error: checkError } = await supabase
            .from("reports")
            .select("id, title, status, summary_id, uploaded_at")
            .eq("user_id", user.id)
            .ilike("title", filename); // case-insensitive match

        if (checkError) {
            console.error("Error checking for existing reports: ", checkError);
        }

        // if duplicate exists and forceNew is not set, return existing report info
        if (!forceNew && existingReports && existingReports.length > 0) {
            const existingReport = existingReports[0];
            
            fs.unlinkSync(file.filepath);
            
            return res.status(409).json({ 
                error: "Report with this title already exists",
                existingReport: {
                    id: existingReport.id,
                    title: existingReport.title,
                    status: existingReport.status,
                    summary_id: existingReport.summary_id,
                    uploaded_at: existingReport.uploaded_at
                },
                duplicate: true
            });
        }

        // if forceNew is true and duplicate exists, create new report with unique title
        let finalFilename = filename;

        if (forceNew && existingReports && existingReports.length > 0) {

            // append timestamp to make title unique
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
            const fileExt = filename.endsWith(".csv") ? ".csv" : "";
            const baseName = filename.replace(/\.csv$/i, "");
            finalFilename = `${baseName}_${timestamp}${fileExt}`;
        }

        // create report record with unique title
        const { data: report, error: reportError } = await supabase
            .from("reports")
            .insert({
                user_id: user.id,
                title: finalFilename,
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
                filename: finalFilename,
                rowCount: rows.length
            });

            return res.status(500).json({ error: "Failed to create report" });
        }

        // log successful upload
        await logAuditEvent("report_uploaded", user.id, {
            report_id: report.id,
            filename: finalFilename,
            row_count: rows.length,
            column_count: columns.length,
            original_filename: filename !== finalFilename ? filename : undefined
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