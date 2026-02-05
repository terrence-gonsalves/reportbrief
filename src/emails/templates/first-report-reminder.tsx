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
    Text
} from "@react-email/components";
import * as React from "react";

interface FirstReportReminderEmailProps {
    name: string,
}

export const FirstReportReminderEmail = ({ name }: FirstReportReminderEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return(
        <Html>
            <Head />
            <Preview>Don&apos;t forget your first ReportBrief summary 🎯</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Don&apos;t forget your first ReportBrief summary 🎯</Heading>
          
                    <Text style={text}>Hi {name},</Text>
          
                    <Text style={text}>
                        We noticed you signed up a few days ago but haven&apos;t uploaded your first 
                        Salesforce report yet. Let&apos;s get you started!
                    </Text>

                    <Section style={featuresSection}>
                        <Text style={featuresTitle}>Get started in 3 steps:</Text>
                        <Text style={feature}>1. Upload a Salesforce CSV report</Text>
                        <Text style={feature}>2. Click &ldquo;Generate AI Summary&ldquo;</Text>
                        <Text style={feature}>3. Download your PDF summary</Text>
                    </Section>

                    <Section style={quickStartSection}>
                        <Text style={quickStartTitle}>Why ReportBrief?</Text>
                        <Text style={step}>✓ Transform complex reports into clear insights</Text>
                        <Text style={step}>✓ Save hours of manual analysis</Text>
                        <Text style={step}>✓ Get actionable recommendations instantly</Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/upload`}>
                            Upload Your First Report
                        </Button>
                    </Section>

                    <Text style={text}>
                        Questions? Reply to this email and we&apos;ll help you get started.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        — The ReportBrief Team<br />
                        Transform your Salesforce reports into AI-powered insights
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default FirstReportReminderEmail;

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

const featuresSection = {
    padding: "0 48px",
    margin: "24px 0",
};

const featuresTitle = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px",
};

const feature = {
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "4px 0",
};

const quickStartSection = {
    backgroundColor: "#f9fafb",
    padding: "24px 48px",
    margin: "24px 0",
    borderRadius: "8px",
};

const quickStartTitle = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px",
};

const step = {
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "4px 0",
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
