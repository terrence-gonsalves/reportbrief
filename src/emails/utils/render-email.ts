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

export async function renderEmail(
    emailType: string,
    data: EmailData
): Promise<string> {
    let emailComponent;

    switch (emailType) {
        case "welcome":
            emailComponent = WelcomeEmail({
                name: data.name!,
            });
            break;
        case "summary_ready":
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
            emailComponent = UsageWarningEmail({
                name: data.name!,
                reportsUsed: data.reportsUsed!,
                reportsLimit: data.reportsLimit!,
                resetDate: data.resetDate!,
            });
            break;
        case "usage_limit":
            emailComponent = UsageLimitEmail({
                name: data.name!,
                currentMonth: data.currentMonth!,
                resetDate: data.resetDate!,
            });
            break;
        case "monthly_reset":
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

    // render component to HTML
    const html = render(emailComponent);
    
    return html;
}