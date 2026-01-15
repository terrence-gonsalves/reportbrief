import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: "Invalid rows data" });
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const sampleData = rows.slice(0, 50);
        const headers = Object.keys(sampleData[0] || {});
        const rowCount = sampleData.length;

        const mockSummary = {
            summary: `Analysis of ${rowCount} Salesforce records across ${headers.length} fields. The data shows a diverse set of ${headers.includes('Amount') || headers.includes('amount') ? 'financial transactions' : 'business activities'} with varying characteristics. ${headers.includes('Stage') || headers.includes('stage') ? 'Multiple pipeline stages are represented, ' : ''}${headers.includes('Owner') || headers.includes('owner') ? 'distributed across different team members. ' : ''}Key patterns emerge in the distribution and relationships between fields.`,
      
            metrics: [
                `Total Records Analyzed: ${rowCount}`,
                `Data Fields: ${headers.length} columns`,
                headers.includes('Amount') || headers.includes('amount') 
                ? `Value Range: Mixed transaction sizes detected`
                : `Field Variety: Diverse data types present`,
                `Data Quality: ${rowCount > 10 ? 'Good sample size' : 'Limited sample size'} for analysis`
            ],
      
            trends: [
                headers.includes('Stage') || headers.includes('stage')
                ? "Multiple pipeline stages present, indicating active deal flow"
                : "Records show consistent field population patterns",
                headers.includes('Date') || headers.includes('date') || headers.includes('Close_Date')
                ? "Temporal distribution suggests ongoing business activity"
                : "Data appears to be current and actively maintained",
                `${headers.length > 5 ? 'Rich' : 'Standard'} data structure provides ${headers.length > 5 ? 'detailed' : 'essential'} business context`
            ],

      
            recommendations: [
                "Review the complete dataset for comprehensive insights beyond this sample",
                headers.includes('Amount') || headers.includes('amount')
                  ? "Consider segmenting by transaction value for targeted analysis"
                  : "Look for patterns in field relationships and data completeness",
                headers.includes('Owner') || headers.includes('owner')
                  ? "Analyze performance distribution across team members"
                  : "Ensure consistent data entry standards across all records",
                "Set up regular reporting cadence to track changes over time"
            ]
        };

        console.log("Mock summary generated for columns, headers");

        res.status(200).json({ result: mockSummary });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("Mock summary error", errorMessage);

        return res.status(500).json({
            error: "Failed to generate summary",
            details: errorMessage,
        });
    }
}