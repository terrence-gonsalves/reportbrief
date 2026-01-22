import { supabase } from "./supabaseClient";

interface ErrorContext {
    component?: string;
    action?: string;
    [key: string]: unknown;
}

// log error to both console and audit_logs table
export async function logError(
    errorMessage: string,
    context?: ErrorContext
): Promise<void> {

    // keep logging to console for development purposes
    console.error("Error: ", errorMessage, context);

    try {

        // get current user
        const { data: { user } } = await supabase.auth.getUser();

        // log to DB
        await fetch("/api/log-events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventType: "error",
                payload: {
                    error: errorMessage,
                    context: context || {},
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                },
            }),
        });
    } catch (e) {

        // if logging fails at least console.error
        console.error("Failed to log error to database: ", e);
    }
}

// log an error
export async function logException(
    error: unknown,
    context?: ErrorContext
): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    await logError(errorMessage, {
        ...context,
        stack: stackTrace,
    });
}

// wrapper for async functions
export function withErrorLogging<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context: ErrorContext
): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args);
        } catch (error) {
            await logException(error, context);
            throw error; // re-throw after logging
        }
    };
}
