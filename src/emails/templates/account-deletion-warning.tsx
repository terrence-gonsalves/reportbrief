import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
  
interface AccountDeletionWarningEmailProps {
    name: string;
    deletionDate: string;
}
  
export const AccountDeletionWarningEmail = ({
    name,
    deletionDate,
}: AccountDeletionWarningEmailProps) => (
    <Html>
        <Head />
        <Preview>Your account will be deleted on {deletionDate}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={box}>
                    <Text style={heading}>Action Required: Account Deletion Notice</Text>
  
                    <Text style={paragraph}>
                        Hi {name},
                    </Text>
  
                    <Text style={paragraph}>
                        We noticed you haven&apos;t used ReportBrief in the past 30 days. Due to our data retention policy, your account and all associated data will be permanently deleted on <strong>{deletionDate}</strong>.
                    </Text>
        
                    <Text style={paragraph}>
                        This includes:
                    </Text>
                    <Text style={{ ...paragraph, marginLeft: 20 }}>
                        • Your user account<br />
                        • All uploaded reports<br />
                        • All generated summaries<br />
                        • Email preferences<br />
                    </Text>
  
                    <Text style={paragraph}>
                        <strong>To prevent deletion, simply log in to your account before {deletionDate}.</strong>
                    </Text>
        
                    <Section style={buttonContainer}>
                        <Button style={button} href="https://reportbrief.vercel.app">
                            Log In to ReportBrief
                        </Button>
                    </Section>
  
                    <Hr style={hr} />
        
                    <Text style={footer}>
                        If you have any questions or concerns, please contact us at support@reportbrief.com
                    </Text>
                </Section>
         </Container>
        </Body>
    </Html>
);
  
export default AccountDeletionWarningEmail;
  
// styles
const main = {
    backgroundColor: "#f9fafb",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
  
const container = {
    maxWidth: "600px",
    margin: "0 auto",
};

const box = {
    padding: "32px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const heading = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: "16px",
};

const paragraph = {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "12px",
};

const buttonContainer = {
    textAlign: "center" as const,
    marginTop: "24px",
    marginBottom: "24px",
};

const button = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
};

const footer = {
    color: "#9ca3af",
    fontSize: "12px",
    textAlign: "center" as const,
};