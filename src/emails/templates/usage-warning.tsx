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

interface UsageWarningEmailProps {
    name: string;
    reportsUsed: number;
    reportsLimit: number;
    resetDate: string;
}

export const UsageWarningEmail = ({
    name,
    reportsUsed,
    reportsLimit,
    resetDate,
}: UsageWarningEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const reportsRemaining = reportsLimit - reportsUsed;

    return (
        <Html>
            <Head />
            <Preview>{`You have ${reportsRemaining} report remaining this month`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>You have {reportsRemaining} report remaining this month</Heading>
          
                    <Text style={text}>Hi {name},</Text>
          
                    <Text style={text}>
                        Heads up! You&apos;ve used <strong>{reportsUsed} of your {reportsLimit}</strong> free reports this month.
                    </Text>

                    <Section style={warningSection}>
                        <Text style={warningText}>
                            You have <strong>{reportsRemaining} summary remaining</strong> until {resetDate}.
                        </Text>
                    </Section>

                    <Text style={text}>
                        Need more reports? Check out our paid plans for unlimited AI summaries.
                    </Text>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/pricing`}>
                            View Pricing
                        </Button>
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

export default UsageWarningEmail;

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

const warningSection = {
    backgroundColor: "#fef3c7",
    padding: "20px 48px",
    margin: "24px 0",
    borderRadius: "8px",
    borderLeft: "4px solid #f59e0b",
};

const warningText = {
    color: "#92400e",
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