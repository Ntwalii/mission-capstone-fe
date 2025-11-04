import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Chrome,
  Building2,
  TrendingUp,
  X,
} from "lucide-react";

const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL ?? "http://localhost:3000";
type Provider = "google" | "microsoft" | null;

// small helper
const setToken = (t: string) => localStorage.setItem("token", t);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // role for sign-up + social
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // role modal only for sign-up social flow
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingSocialProvider, setPendingSocialProvider] =
    useState<Provider>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // ----- call backend to start oauth -----
  async function startSocial(
    provider: "google" | "microsoft",
    role?: string,
    fullName?: string
  ) {
    const params = new URLSearchParams({ provider });
    if (role) params.set("role", role);
    if (fullName) params.set("name", fullName);
    // backend route sets cookie then redirects to provider
    window.location.href = `${AUTH_BASE}/auth/oauth/start?${params.toString()}`;
  }

  const handleSocialLoginClick = (provider: Provider) => {
    if (!provider) return;
    if (isLogin) {
      // LOGIN: go straight to provider (no role prompt)
      startSocial(provider);
    } else {
      // SIGN UP: ask for role
      setPendingSocialProvider(provider);
      setShowRoleModal(true);
    }
  };

  const completeSocialLogin = () => {
    setError("");
    const finalRole = role === "other" ? customRole.trim() : role;
    if (!finalRole) {
      setError("Please select a role to continue");
      return;
    }
    if (!pendingSocialProvider) {
      setError("No provider selected");
      return;
    }
    // backend will save this in a short-lived cookie and then redirect to provider
    startSocial(pendingSocialProvider, finalRole, name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch(`${AUTH_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Login failed");
        }
        const data = await res.json(); // { token }
        if (!data?.token) throw new Error("No token returned from server");
        setToken(data.token);
        navigate(from, { replace: true });
      } else {
        // SIGN UP: create user then auto-login
        const job_position = role === "other" ? customRole.trim() : role;
        if (!job_position) throw new Error("Please pick your role");

        // we will store username as email's local-part (or you can use the full email)
        const username = email.split("@")[0];

        const res = await fetch(`${AUTH_BASE}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            full_name: name,
            job_position,
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Registration failed");
        }

        // auto-login with the SAME username we created above
        const loginRes = await fetch(`${AUTH_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          if (data?.token) {
            setToken(data.token);
            navigate(from, { replace: true });
          } else {
            navigate("/auth");
          }
        } else {
          navigate("/auth");
        }
      }
    } catch (err) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* left */}
        <div className="hidden md:block text-white space-y-6 px-8">
          <div className="flex items-center gap-3 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Rwanda Trade Pulse</h1>
              <p className="text-blue-300 text-sm">
                Advanced Analytics Platform
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Access Real-Time
              <br />
              Trade Intelligence
            </h2>
            <p className="text-blue-200 text-lg">
              Make data-driven decisions with comprehensive trade analytics and
              market insights.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            {["Advanced Analytics Dashboard"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right */}
        <div className="w-full max-w-md mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            {/* toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-blue-200 mb-6">
              {isLogin
                ? "Enter your credentials to continue"
                : "Get started with your free account"}
            </p>

            {/* social */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLoginClick("google")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLoginClick("microsoft")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              >
                <Building2 className="w-5 h-5" />
                Continue with Microsoft
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-blue-200 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* form fields */}
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <select
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value);
                          if (e.target.value !== "other") setCustomRole("");
                        }}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        required={!isLogin}
                      >
                        <option value="" className="bg-slate-800">
                          Select your role
                        </option>
                        <option value="importer" className="bg-slate-800">
                          Importer
                        </option>
                        <option value="exporter" className="bg-slate-800">
                          Exporter
                        </option>
                        <option value="analyst" className="bg-slate-800">
                          Trade Analyst
                        </option>
                        <option value="researcher" className="bg-slate-800">
                          Researcher
                        </option>
                        <option value="government" className="bg-slate-800">
                          Government Official
                        </option>
                        <option value="logistics" className="bg-slate-800">
                          Logistics Provider
                        </option>
                        <option value="other" className="bg-slate-800">
                          Other
                        </option>
                      </select>
                    </div>

                    {role === "other" && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                          placeholder="Specify your role"
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-blue-200 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </div>

            <p className="text-center text-sm text-blue-200 mt-6">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Role modal (only for Sign Up + Social) */}
      {showRoleModal && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Choose your role
              </h3>
              <button
                className="text-blue-200 hover:text-white"
                onClick={() => {
                  setShowRoleModal(false);
                  setPendingSocialProvider(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-blue-200 mb-4 text-sm">
              Before continuing with{" "}
              {pendingSocialProvider === "google" ? "Google" : "Microsoft"},
              please select your role.
            </p>

            <div className="space-y-3">
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value !== "other") setCustomRole("");
                }}
                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/20 text-white"
              >
                <option value="" className="bg-slate-800">
                  Select your role
                </option>
                <option value="importer" className="bg-slate-800">
                  Importer
                </option>
                <option value="exporter" className="bg-slate-800">
                  Exporter
                </option>
                <option value="analyst" className="bg-slate-800">
                  Trade Analyst
                </option>
                <option value="researcher" className="bg-slate-800">
                  Researcher
                </option>
                <option value="government" className="bg-slate-800">
                  Government Official
                </option>
                <option value="logistics" className="bg-slate-800">
                  Logistics Provider
                </option>
                <option value="other" className="bg-slate-800">
                  Other
                </option>
              </select>

              {role === "other" && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Specify your role"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/20 text-white"
                />
              )}

              {error && <div className="text-red-300 text-sm">{error}</div>}

              <button
                onClick={completeSocialLogin}
                className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
