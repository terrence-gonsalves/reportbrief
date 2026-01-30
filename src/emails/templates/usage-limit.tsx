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

interface UsageLimitEmailProps {
    name: string;
    currentMonth: string;
    resetDate: string;
}

export const UsageLimitEmail = ({
    name,
    currentMonth,
    resetDate,
}: UsageLimitEmailProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Html>
            <Head />
            <Preview>You&apos;ve reached your monthly limit</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>You&apos;ve reached your monthly limit</Heading>
        
                    <Text style={text}>Hi {name},</Text>
        
                    <Text style={text}>
                        You&apos;ve used all <strong>5 of your free AI summaries</strong> for {currentMonth}.
                    </Text>

                    <Section style={limitSection}>
                        <Text style={limitText}>
                            Your reports will reset on <strong>{resetDate}</strong>.
                        </Text>
                    </Section>

                    <Text style={text}>
                        Can&apos;t wait? Upgrade to Pro for unlimited reports:
                    </Text>

                    <Section style={featuresSection}>
                        <Text style={feature}>✓ Unlimited AI summaries</Text>
                        <Text style={feature}>✓ Priority support</Text>
                        <Text style={feature}>✓ Advanced features</Text>
                    </Section>

                    <Section style={buttonSection}>
                        <Button style={button} href={`${baseUrl}/pricing`}>
                            Upgrade Now
                        </Button>
                    </Section>

                    <Text style={text}>
                        See you next month!
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        — ReportBrief
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default UsageLimitEmail;

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

const limitSection = {
    backgroundColor: "#fee2e2",
    padding: "20px 48px",
    margin: "24px 0",
    borderRadius: "8px",
    borderLeft: "4px solid #ef4444",
};

const limitText = {
    color: "#991b1b",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0",
};

const featuresSection = {
    padding: "0 48px",
    margin: "24px 0",
};

const feature = {
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