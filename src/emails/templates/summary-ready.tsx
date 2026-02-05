import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface SummaryReadyEmailProps {
    name: string;
    reportName: string;
    reportId: string;
    topMetric: string;
    notableTrend: string;
    generationTime: number;
    reportsRemaining?: number;
    reportsLimit?: number;
}

export const SummaryReadyEmail = ({
    name,
    reportName,
    reportId,
    topMetric,
    notableTrend,
    generationTime,
    reportsRemaining,
    reportsLimit,
}: SummaryReadyEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const limit = reportsLimit || 5;

    return (
        <Html>
            <Head />
            <Preview>Your report summary for {reportName} is ready!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Your report summary is ready ✓</Heading>
          
                    <Text style={text}>Hi {name},</Text>
          
                    <Text style={text}>
                        Your AI summary for <strong>{reportName}</strong> is ready!
                    </Text>

                {(topMetric || notableTrend) && (
                    <Section style={highlightsSection}>
                        <Text style={highlightsTitle}>Key Highlights:</Text>
                        {topMetric && <Text style={highlight}>• {topMetric}</Text>}
                        {notableTrend && <Text style={highlight}>• {notableTrend}</Text>}
                    </Section>
                )}

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/report/${reportId}`}>
                            View Summary
                        </Button>
                    </Section>

                    <Section style={statsSection}>
                        <Text style={statItem}>
                            Generated in: <strong>{generationTime}s</strong>
                        </Text>
                        {reportsRemaining !== undefined && (
                            <Text style={statItem}>
                                Reports remaining this month: <strong>{reportsRemaining} of {limit}</strong>
                            </Text>
                        )}
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        — ReportBrief
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default SummaryReadyEmail;

// styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "32px",
    padding: "0 48px",
    margin: "32px 0 24px",
};

const text = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "24px",
    padding: "0 48px",
    margin: "16px 0",
};

const highlightsSection = {
    backgroundColor: "#f0fdf4",
    padding: "24px 48px",
    margin: "24px 0",
    borderRadius: "8px",
    borderLeft: "4px solid #10b981",
};

const highlightsTitle = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px",
};

const highlight = {
    color: "#059669",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "8px 0",
};

const buttonSection = {
    padding: "0 48px",
    margin: "32px 0",
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 20px",
};

const statsSection = {
    backgroundColor: "#f9fafb",
    padding: "16px 48px",
    margin: "24px 0",
    borderRadius: "8px",
};

const statItem = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "4px 0",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "32px 48px",
};

const footer = {
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "20px",
    padding: "0 48px",
    margin: "16px 0",
};