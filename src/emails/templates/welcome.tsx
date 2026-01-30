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

interface WelcomeEmailProps {
    name: string,
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return(
        <Html>
            <Head />
            <Preview>Welcome to ReportBrief! Start transforming your Salesforce reports.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to ReportBrief! 🎉</Heading>
          
                    <Text style={text}>Hi {name},</Text>
          
                    <Text style={text}>
                        Thanks for signing up! You&apos;re now ready to transform your Salesforce 
                        reports into AI-powered insights.
                    </Text>

                    <Section style={featuresSection}>
                        <Text style={featuresTitle}>Here&apos;s what you get:</Text>
                        <Text style={feature}>✓ 5 free AI summaries per month</Text>
                        <Text style={feature}>✓ Instant PDF downloads</Text>
                        <Text style={feature}>✓ Searchable dashboard</Text>
                    </Section>

                    <Section style={quickStartSection}>
                        <Text style={quickStartTitle}>Quick Start:</Text>
                        <Text style={step}>1. Upload a Salesforce CSV report</Text>
                        <Text style={step}>2. Click &ldquo;Generate AI Summary&ldquo;</Text>
                        <Text style={step}>3. Download your PDF</Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/upload`}>
                            Get Started
                        </Button>
                    </Section>

                    <Text style={text}>
                        Questions? Reply to this email.
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

export default WelcomeEmail;

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