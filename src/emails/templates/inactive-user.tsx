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

interface InactiveUserEmailProps {
    name: string,
}

export const InactiveUserEmail = ({ name }: InactiveUserEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return(
        <Html>
            <Head />
            <Preview>We miss you at ReportBrief 👋</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>We miss you at ReportBrief 👋</Heading>
          
                    <Text style={text}>Hi {name},</Text>
          
                    <Text style={text}>
                        It&apos;s been a while since you last used ReportBrief. We&apos;d love to 
                        have you back and help you transform more Salesforce reports into insights.
                    </Text>

                    <Section style={featuresSection}>
                        <Text style={featuresTitle}>What you might have missed:</Text>
                        <Text style={feature}>✓ AI-powered report summaries</Text>
                        <Text style={feature}>✓ Instant PDF downloads</Text>
                        <Text style={feature}>✓ Searchable dashboard</Text>
                        <Text style={feature}>✓ Monthly report limits reset automatically</Text>
                    </Section>

                    <Section style={quickStartSection}>
                        <Text style={quickStartTitle}>Ready to dive back in?</Text>
                        <Text style={step}>Your account is still active and ready to use.</Text>
                        <Text style={step}>Upload a new report or review your past summaries.</Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/dashboard`}>
                            View Dashboard
                        </Button>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={secondaryButton} href={`${baseUrl}/upload`}>
                            Upload New Report
                        </Button>
                    </Section>

                    <Text style={text}>
                        If you have any questions or feedback, just reply to this email.
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

export default InactiveUserEmail;

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
    margin: "16px 0",
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

const secondaryButton = {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 20px",
    border: "2px solid #000000",
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
