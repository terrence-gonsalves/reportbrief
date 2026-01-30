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

interface MonthlyResetEmailProps {
    name: string;
    currentMonth: string;
    reportsLimit: number;
    lastMonthReports: number;
}

export const MonthlyResetEmail = ({
    name,
    currentMonth,
    reportsLimit,
    lastMonthReports,
}: MonthlyResetEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Html>
            <Head />
            <Preview>{`Your ${reportsLimit} free reports have reset!`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Your {reportsLimit} free reports have reset! 🔄</Heading>
          
                    <Text style={text}>Hi {name},</Text>
                    
                    <Text style={text}>
                        Good news! Your monthly limit has reset.
                    </Text>

                    <Section style={resetSection}>
                        <Text style={resetText}>
                            You now have <strong>{reportsLimit} fresh AI summaries</strong> ready to use for {currentMonth}.
                        </Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/upload`}>
                            Upload a Report
                        </Button>
                    </Section>

                {lastMonthReports > 0 && (
                    <Text style={statsText}>
                        Last month you analyzed <strong>{lastMonthReports} report{lastMonthReports !== 1 ? 's' : ''}</strong>. 
                        Let&apos;s make this month even better!
                    </Text>
                )}

                    <Hr style={hr} />

                    <Text style={footer}>
                        — ReportBrief
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default MonthlyResetEmail;

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

const resetSection = {
    backgroundColor: "#dbeafe",
    padding: "20px 48px",
    margin: "24px 0",
    borderRadius: "8px",
    borderLeft: "4px solid #3b82f6",
};

const resetText = {
    color: "#1e40af",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0",
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

const statsText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    padding: "0 48px",
    margin: "16px 0",
    fontStyle: "italic" as const,
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