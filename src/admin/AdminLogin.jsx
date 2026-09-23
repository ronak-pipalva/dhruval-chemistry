import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const { login, isAdminLoggedIn } = useNotes();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (login(email, password)) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-input-bg text-text placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all";

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-heading">Admin Access</h1>
            <p className="text-muted">
              Manage your chemistry notes and resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-heading mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-heading mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-input-bg text-text placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-accent hover:bg-dark text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all duration-300"
            >
              Log In
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
