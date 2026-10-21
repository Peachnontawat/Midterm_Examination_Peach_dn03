import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../api/client";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 " +
  "aria-[invalid=true]:border-red-600";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/contacts";

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(redirectTo, { replace: true }),
  });

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = "กรอกอีเมล";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!form.password) {
      next.password = "กรอกรหัสผ่าน";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-6">
      <section className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-5 py-7 sm:px-8 sm:py-9">
        <h1 className="mb-1.5 text-3xl font-semibold text-slate-900">
          เข้าสู่ระบบ
        </h1>
        <p className="mb-7 leading-relaxed text-slate-600">
          ใช้อีเมลและรหัสผ่านที่ลงทะเบียนไว้
        </p>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block font-medium text-slate-900"
            >
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-medium text-slate-900"
            >
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded px-2.5 py-1.5 text-sm text-teal-700 hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2.5 text-red-700"
            >
              {getErrorMessage(mutation.error, "อีเมลหรือรหัสผ่านไม่ถูกต้อง")}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </section>
    </main>
  );
}
