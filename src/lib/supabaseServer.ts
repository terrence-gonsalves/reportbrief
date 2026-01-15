import { createClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";

// admin client with service role key
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);


// client for authenticated requests
export function createSupabaseServerClient(req: NextApiRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, anonKey, {
        global: {
            headers: {
                Authorization: req.headers.authorization || ""
            }
        }
    });
}
