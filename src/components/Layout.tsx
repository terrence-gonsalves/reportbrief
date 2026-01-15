import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

interface LayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    simpleHeader?: boolean;
}

export default function Layout({ children, showHeader = true, showFooter = true, simpleHeader = false }: LayoutProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
        {showHeader && (
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RB</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            ReportBrief
                        </span>
                    </Link>
                    
                    {!simpleHeader && (
                    <nav className="flex items-center space-x-6">

                        {isLoggedIn ? (
                        <>
                            <Link
                                href="/upload"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Dashboard
                                    </Link>
                                    <Link
                                    href="/upload"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Upload
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Sign Out
                            </button>
                        </>

                        ) : (

                        <Link
                            href="/login"
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Sign In
                        </Link>

                        )}

                    </nav>
                    )}

                </div>
            </header>
        )}
        
            <main className="flex-1">{children}</main>

        {showFooter && (
            <footer className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">RB</span>
                            </div>
                            <span className="text-sm text-gray-600">
                                © 2025 ReportBrief. All rights reserved.
                            </span>
                        </div>
                        <div className="flex space-x-6 text-sm text-gray-600">
                            <Link href="/privacy" className="hover:text-gray-900">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-gray-900">
                                Terms
                            </Link>
                            <Link href="/contact" className="hover:text-gray-900">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        )}

        </div>
    );
}