import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldAlert, CheckCircle, RefreshCw, Globe, Database, Mail } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const HealthCheck = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the official Supabase Client to invoke functions.
      // This automatically appends the Authorization header containing the anon key.
      const { data: resData, error: resError } = await supabase.functions.invoke("notify-teacher", {
        method: "GET",
      });

      if (resError) {
        throw new Error(resError.message || JSON.stringify(resError));
      }

      setData(resData);
    } catch (err) {
      console.error("Health check fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1020] via-[#0e172e] to-[#0c1020] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Activity className="text-accent w-6 h-6 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight">System Status</h1>
          </div>
          <button
            onClick={checkHealth}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all text-gray-400 hover:text-white disabled:opacity-50"
            title="Refresh diagnostics"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* System Checks */}
        <div className="space-y-4">
          {/* 1. Client App (Local Server) */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Frontend Web App</h3>
                <p className="text-xs text-gray-400">Serving client UI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-green-400 uppercase">Operational</span>
            </div>
          </div>

          {/* 2. Supabase DB Check */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Supabase Database</h3>
                <p className="text-xs text-gray-400">Study materials & records</p>
              </div>
            </div>
            {loading ? (
              <span className="text-xs text-gray-400">Checking...</span>
            ) : error || !data || data.status !== "healthy" || !data.supabase || data.supabase.startsWith("error") ? (
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert size={16} />
                <span className="text-xs font-bold uppercase">Disconnected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-xs font-bold uppercase">Connected</span>
              </div>
            )}
          </div>

          {/* 3. Resend Email Check */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 text-accent rounded-lg">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Email Mailer (Resend)</h3>
                <p className="text-xs text-gray-400">Admin booking notifications</p>
              </div>
            </div>
            {loading ? (
              <span className="text-xs text-gray-400">Checking...</span>
            ) : error || !data || data.status !== "healthy" || !data.resend || data.resend.startsWith("error") ? (
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert size={16} />
                <span className="text-xs font-bold uppercase">Unverified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-xs font-bold uppercase">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Logs Box */}
        <div className="mt-8 bg-black/30 rounded-2xl p-4 border border-white/5 font-mono text-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2 border-b border-white/5 pb-2">
            <span>Diagnostics Output</span>
            <span>v1.0.0</span>
          </div>
          {loading ? (
            <div className="text-gray-400 animate-pulse">Running checks, querying edge runtime...</div>
          ) : error ? (
            <div className="text-red-400">
              [CRITICAL ERROR] Failed to fetch edge function status: {error}
            </div>
          ) : (
            <div className="space-y-1">
              <div className={(!data || !data.supabase || data.supabase.startsWith("error")) ? "text-red-400" : "text-green-400"}>
                {(!data || !data.supabase || data.supabase.startsWith("error")) ? "[ERROR]" : "[OK]"} Supabase: {data?.supabase || "Unknown status"}
              </div>
              <div className={(!data || !data.resend || data.resend.startsWith("error")) ? "text-red-400" : "text-green-400"}>
                {(!data || !data.resend || data.resend.startsWith("error")) ? "[ERROR]" : "[OK]"} Resend API: {data?.resend || "Unknown status"}
              </div>
              <div className="text-gray-400">Timestamp: {data?.timestamp || "N/A"}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-accent transition-colors">
            &larr; Back to Home page
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default HealthCheck;
