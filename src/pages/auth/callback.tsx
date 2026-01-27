import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { logException } from "@/lib/errorLog";

interface UserUpsertData {
    id: string;
    email: string | undefined;
    name: string | null;
    login_count: number;
    updated_at: string;
    first_login_at?: string;
}

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {

            // get the hash from the URL (supabase token)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (accessToken && refreshToken) {

                // set session
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (error) {
                    await logException(error, {
                        component: "AuthCallBack",
                        action: "setSession",
                    });

                    console.error("Error setting session: ", error);
                    router.push("/login?error=auth_failed");

                    return;
                }

                // create user profile
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const userName = user.user_metadata?.name || null;

                    // determine if this is the first login
                    const { data: existingUser, error: fetchError } = await supabase
                        .from("users")
                        .select("login_count, first_login_at")
                        .eq("id", user.id)
                        .single();
                    
                    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
                        console.error("Error fetching existing user: ", fetchError);
                    }

                    const isFirstLogin = !existingUser;
                    const newLoginCount = (existingUser?.login_count || 0) + 1;

                    console.log("Is first login:", isFirstLogin);
                    console.log("New login count:", newLoginCount);

                    const upsertData: UserUpsertData = {
                        id: user.id,
                        email: user.email,
                        name: userName,
                        login_count: newLoginCount,
                        updated_at: new Date().toISOString(),
                    };

                    if (isFirstLogin) {
                        upsertData.first_login_at = new Date().toISOString();
                    }

                    console.log("Upserting data:", upsertData);

                    const { data: upsertedUser, error: profileError } = await supabase  
                        .from("users")
                        .upsert(upsertData, {
                            onConflict: 'id',
                            ignoreDuplicates: false,
                        })
                        .select();
    
                    console.log("Upserted user:", upsertedUser);
                    
                    if (profileError) {
                        await logException(profileError, {
                            component: "AuthCallback",
                            action: "createProfile",
                            userId: user.id,
                        });

                        console.error("Error creating profile: ", profileError);
                    }

                    // queue welcome email for first login attempt
                    if (newLoginCount === 1) {
                        try {
                            await fetch("/api/emails/queue", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({
                                    userId: user.id,
                                    emailType: "welcome",
                                    data: {
                                        name: userName,
                                        email: user.email,
                                    },
                                }),
                            });

                            // log event for queuing email
                            await fetch("/api/log-events", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({
                                    eventType: "welcome_email_queue",
                                    payload: {
                                        level: "info",
                                        message: "Welcome email queued",
                                        component: "AuthCallback",
                                        action: "queueWelcomeEmail",
                                        userId: user.id,
                                        metadata: {
                                            email: user.email,
                                            emilType: "welcome",
                                        },
                                    },
                                }),
                            });
                        } catch (e) {
                            await logException(e, {
                                component: "AuthCallback",
                                action: "queueWelcomeEmail",
                                userId: user.id,
                            });

                            console.error("Failed to queue welcome email: ", e);
                        }
                    }

                    // log the login event
                    try {
                        await fetch("/api/log-events", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({
                                eventType: "user_login",
                                payload: {
                                    email: user.email,
                                    login_method: "magic_link",
                                },
                            }),
                        });
                    } catch (logError) {
                        await logException(logError, {
                            component: "AuthCallback",
                            action: "logLoginEvent",
                        });

                        console.error("Failed to log login event: ", logError);
                    }
                }

                // redirect to upload page
                router.push("/upload");
            } else {
                router.push("/login");
            }
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Signing you in...</p>
            </div>
        </div>
    );
}