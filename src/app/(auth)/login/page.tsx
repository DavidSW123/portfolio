"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const a = t.auth.login;
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.email) errs.email = a.email;
    if (!form.password) errs.password = a.pass;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("✓", "success");
      router.push(data.redirect || "/client");
      router.refresh();
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
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />

      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={a.email} id="email" type="email" autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} placeholder="you@example.com"
            />
            <div className="relative">
              <Input
                label={a.pass} id="password" type={showPass ? "text" : "password"}
                autoComplete="current-password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password} placeholder="••••••••" className="pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-8" style={{ color: "var(--text-subtle)" }}>
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              {a.btn}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {a.no_acc}{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--accent)" }}>
              {a.link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
