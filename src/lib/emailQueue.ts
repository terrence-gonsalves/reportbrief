import { supabaseAdmin } from "./supabaseServer";
import { logAuditEvent } from "./auditLog";
import type { EmailData } from "@/emails/utils/render-email";

export type EmailType =
  | "welcome"
  | "summary_ready"
  | "usage_warning"
  | "usage_limit"
  | "monthly_reset"
  | "first_report_reminder"
  | "inactive_user";

const subjectMap: Record<EmailType, (data: EmailData) => string> = {
  welcome: () => "Welcome to ReportBrief! 🎉",
  summary_ready: () => "Your report summary is ready ✓",
  usage_warning: () => "You have 1 report remaining this month",
  usage_limit: () => "You've reached your monthly limit",
  monthly_reset: () => "Your monthly ReportBrief limit has reset! 🔄",
  first_report_reminder: () => "Don’t forget your first ReportBrief summary 🎯",
  inactive_user: () => "We miss you at ReportBrief 👋",
};

const preferenceMap: Record<EmailType, string> = {
  welcome: "welcome_email",
  summary_ready: "summary_ready",
  usage_warning: "usage_warnings",
  usage_limit: "usage_warnings",
  monthly_reset: "monthly_reset",
  first_report_reminder: "engagement_emails",
  inactive_user: "engagement_emails",
};

interface QueueEmailParams {
  userId: string;
  emailType: EmailType;
  data: EmailData;
  scheduledAt?: string;
}

/**
 * Queue an email for a user in the email_queue table.
 * Respects email_preferences and logs audit events.
 */
export async function queueEmailForUser({
  userId,
  emailType,
  data,
  scheduledAt,
}: QueueEmailParams) {
  // fetch user with preferences
  const { data: userData, error: userError } = await supabaseAdmin
    .from("users")
    .select("email, email_preferences(*)")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    await logAuditEvent("email_failed", userId, {
      emailType,
      reason: "user_not_found",
      error: userError,
    });

    throw userError || new Error("User not found");
  }

  const preferencesArray = userData.email_preferences;
  const preferences =
    Array.isArray(preferencesArray) && preferencesArray.length > 0
      ? (preferencesArray[0] as Record<string, boolean>)
      : null;

  if (preferences) {
    const preferenceField = preferenceMap[emailType];

    if (
      preferenceField &&
      Object.prototype.hasOwnProperty.call(preferences, preferenceField) &&
      preferences[preferenceField] === false
    ) {
      await logAuditEvent("email_processed", userId, {
        emailType,
        queued: false,
        reason: "user_opted_out",
      });

      return { queued: false, emailId: null };
    }
  }

  const subjectFn = subjectMap[emailType];
  const subject = subjectFn ? subjectFn(data) : "ReportBrief Notifications";

  const insertData = {
    user_id: userId,
    email_type: emailType,
    to_email: userData.email,
    subject,
    status: "pending",
    metadata: data,
    scheduled_at: scheduledAt || new Date().toISOString(),
  };

  const { data: queuedEmail, error: queueError } = await supabaseAdmin
    .from("email_queue")
    .insert(insertData)
    .select()
    .single();

  if (queueError) {
    await logAuditEvent("email_failed", userId, {
      emailType,
      error: queueError,
    });

    throw queueError;
  }

  await logAuditEvent("email_queued", userId, {
    emailType,
    emailId: queuedEmail.id,
    subject,
  });

  return {
    queued: true,
    emailId: queuedEmail.id as string,
  };
}

