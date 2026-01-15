import { supabaseAdmin } from "./supabaseServer";

export type AuditEventType = 
    | "user_signup"
    | "user_login"
    | "report_uploaded"
    | "report_summarised"
    | "report_failed"
    | "pdf_generated"
    | "error"
    | "subscription_created"
    | "subscription_cancelled";

interface AuditLogPayload {
    [key: string]: unknown;
}

/**
 * Log an audit event
 * Uses service role to bypass RLS
 */
export async function logAuditEvent(
    eventType: AuditEventType,
    userId: string | null,
    payload: AuditLogPayload = {}
) {
    try {
        const { error } = await supabaseAdmin.from("audit_logs").insert({
            user_id: userId,
            event_type: eventType,
            payload: payload,
        });

        if (error) {
            console.error("Failed to log audit event: ", error);
        }
    } catch (e) {
        
        // lets not break the app because audit logging failed
        console.error("Audit logging error: ", e);
    }
}

/**
 * Log an error with context
 */
export async function logError(
    userId: string | null, 
    errorMessage: string,
    context: AuditLogPayload = {}
) {
    return logAuditEvent("error", userId, {
        error: errorMessage,
        ...context
    });
}
