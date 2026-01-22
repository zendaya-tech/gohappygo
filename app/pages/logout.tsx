import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore, type AuthState } from "../store/auth";

export default function Logout() {
    const navigate = useNavigate();
    const logout = useAuthStore((s: AuthState) => s.logout);

    useEffect(() => {
        try { window.localStorage.removeItem("auth_token"); } catch { }
        logout();
        const timeout = setTimeout(() => navigate("/", { replace: true }), 200);
        return () => clearTimeout(timeout);
    }, [navigate, logout]);

    return (
        <div className="min-h-screen grid place-items-center bg-white">
            <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 8v8a4 4 0 004 4h1" />
                    </svg>
                </div>
                <p className="text-gray-700">Déconnexion en cours…</p>
            </div>
        </div>
    );
}

