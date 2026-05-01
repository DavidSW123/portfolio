"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";
import { Eye, EyeOff, CheckCircle, Zap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const a = t.auth.register;
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const passwordChecks = [
    { label: a.check1, ok: form.password.length >= 8 },
    { label: a.check2, ok: /[A-Z]/.test(form.password) },
    { label: a.check3, ok: /[0-9]/.test(form.password) },
  ];

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = a.name;
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = a.email;
    if (!passwordChecks.every((c) => c.ok)) errs.password = a.pass;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("✓", "success");
      router.push("/login");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />

      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "var(--accent)", boxShadow: "var(--shadow-accent)" }}
            >
              <Zap className="h-5 w-5" style={{ color: "var(--accent-fg)" }} />
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>
              AutoImport <span style={{ color: "var(--accent)" }}>Pro</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{a.title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{a.sub}</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={a.name} id="name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name} placeholder={a.name_ph} />
            <Input label={a.email} id="email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} placeholder="you@example.com" />
            <Input label={a.phone_opt} id="phone" type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+34 600 000 000" />
            <div>
              <div className="relative">
                <Input label={a.pass} id="password" type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-8" style={{ color: "var(--text-subtle)" }}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle className="h-3 w-3" style={{ color: c.ok ? "var(--success)" : "var(--text-subtle)" }} />
                      <span style={{ color: c.ok ? "var(--success)" : "var(--text-subtle)" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              {a.btn}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {a.have_acc}{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
              {a.link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
