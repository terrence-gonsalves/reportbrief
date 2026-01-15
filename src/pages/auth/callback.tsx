import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

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
                    console.error("Error setting session: ", error);
                    router.push("/login?error=auth_failed");

                    return;
                }

                // create user profile
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { error: profileError } = await supabase  
                        .from("users")
                        .upsert({
                            id: user.id,
                            email: user.email,
                            update_at: new Date().toISOString(),
                        },
                        {
                            onConflict: 'id'
                        });
                    
                    if (profileError) {
                        console.error("Error creating profile: ", profileError);
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