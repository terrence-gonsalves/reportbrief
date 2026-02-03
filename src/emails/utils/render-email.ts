import { render } from "@react-email/components";
import WelcomeEmail from "../templates/welcome";
import SummaryReadyEmail from "../templates/summary-ready";
import UsageWarningEmail from "../templates/usage-warning";
import UsageLimitEmail from "../templates/usage-limit";
import MonthlyResetEmail from "../templates/monthly-reset";

export interface EmailData {
    name?: string;
    reportName?: string;
    reportId?: string;
    topMetric?: string;
    notableTrend?: string;
    generationTime?: number;
    reportsRemaining?: number;
    reportsUsed?: number;
    reportsLimit?: number;
    resetDate?: string;
    currentMonth?: string;
    lastMonthReports?: number;
}

/**
 * Renders an email template to HTML
 * @param emailType - The type of email to render
 * @param data - The data to pass to the email template
 * @returns HTML string ready to be sent
 */
export async function renderEmail(
    emailType: string,
    data: EmailData
): Promise<string> {
    console.log("\n--- RENDER EMAIL FUNCTION ---");
    console.log("Email Type:", emailType);
    console.log("Data received:", JSON.stringify(data, null, 2));

    let emailComponent;

    try {
        switch (emailType) {
            case "welcome":
                console.log("Rendering Welcome email with name:", data.name);
                emailComponent = WelcomeEmail({
                    name: data.name!,
                });
                break;
            case "summary_ready":
                console.log("Rendering Summary Ready email");
                emailComponent = SummaryReadyEmail({
                    name: data.name!,
                    reportName: data.reportName!,
                    reportId: data.reportId!,
                    topMetric: data.topMetric!,
                    notableTrend: data.notableTrend!,
                    generationTime: data.generationTime!,
                    reportsRemaining: data.reportsRemaining!,
                });
                break;
            case "usage_warning":
                console.log("Rendering Usage Warning email");
                emailComponent = UsageWarningEmail({
                    name: data.name!,
                    reportsUsed: data.reportsUsed!,
                    reportsLimit: data.reportsLimit!,
                    resetDate: data.resetDate!,
                });
                break;
            case "usage_limit":
                console.log("Rendering Usage Limit email");
                emailComponent = UsageLimitEmail({
                    name: data.name!,
                    currentMonth: data.currentMonth!,
                    resetDate: data.resetDate!,
                });
                break;
            case "monthly_reset":
                console.log("Rendering Monthly Reset email");
                emailComponent = MonthlyResetEmail({
                    name: data.name!,
                    currentMonth: data.currentMonth!,
                    reportsLimit: data.reportsLimit!,
                    lastMonthReports: data.lastMonthReports!,
                });
                break;
            default: 
                throw new Error(`Unknown email type: ${emailType}`);
        }

        console.log("Email component created successfully");
        console.log("Rendering to HTML...");

        // render component to HTML
        const html = await render(emailComponent);

        console.log("HTML rendered successfully (length:", html.length, "chars)");
        
        return html;
    } catch (e) {
        console.error("\n❌ ERROR IN RENDER EMAIL:");
        console.error("Error type:", e?.constructor?.name);
        console.error("Error message:", e instanceof Error ? e.message : e);
        console.error("Error stack:", e instanceof Error ? e.stack : "No stack trace");

        if (e && typeof e === 'object' && 'response' in e) {
            console.error("Render error details:", JSON.stringify(e, null, 2));
        }
            
        throw e;
    }
}