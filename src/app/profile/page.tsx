"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import { ROLE_LABELS } from "@/lib/utils";
import { User, Lock, Phone, MapPin, CreditCard, Save } from "lucide-react";
import type { Role } from "@/types";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: string;
  client?: {
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    dni?: string | null;
    notes?: string | null;
  } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "contact" | "password">("profile");

  const [profileForm, setProfileForm] = useState({ name: "" });
  const [contactForm, setContactForm] = useState({
    phone: "", address: "", city: "", country: "", dni: "", notes: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [passErrors, setPassErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          fetchUserDetail(data.user.id);
        } else {
          router.push("/login");
        }
      });
  }, [router]);

  async function fetchUserDetail(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setUser(data);
      setProfileForm({ name: data.name });
      setContactForm({
        phone: data.client?.phone || "",
        address: data.client?.address || "",
        city: data.client?.city || "",
        country: data.client?.country || "",
        dni: data.client?.dni || "",
        notes: data.client?.notes || "",
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setUser((u) => u ? { ...u, name: profileForm.name } : u);
      showToast("Perfil actualizado", "success");
    } catch {
      showToast("Error al guardar el perfil", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveContact() {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) throw new Error("Error al guardar");
      showToast("Datos de contacto actualizados", "success");
    } catch {
      showToast("Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword() {
    const errs: Record<string, string> = {};
    if (!passwordForm.currentPassword) errs.currentPassword = "Obligatorio";
    if (passwordForm.newPassword.length < 8) errs.newPassword = "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(passwordForm.newPassword)) errs.newPassword = "Debe tener una mayúscula";
    if (!/[0-9]/.test(passwordForm.newPassword)) errs.newPassword = "Debe tener un número";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = "Las contraseñas no coinciden";
    setPassErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Contraseña actualizada", "success");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al cambiar contraseña", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const roleInfo = ROLE_LABELS[user.role] || { label: user.role, color: "bg-gray-100 text-gray-700" };

  return (
    <DashboardLayout role={user.role as Role} userName={user.name} userEmail={user.email}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tu información personal y seguridad</p>
        </div>

        {/* Profile header card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "profile", label: "Información", icon: User },
            { id: "contact", label: "Contacto", icon: Phone },
            { id: "password", label: "Contraseña", icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nombre completo"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ name: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 h-10 rounded-md border border-gray-200 bg-gray-50 px-3 flex items-center text-sm text-gray-500">
                  {user.email}
                  <span className="ml-2 text-xs text-gray-400">(no editable)</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Rol</label>
                <div className="mt-1 h-10 rounded-md border border-gray-200 bg-gray-50 px-3 flex items-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={saveProfile} loading={saving}>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "contact" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Teléfono"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                />
                <Input
                  label="DNI / NIE"
                  value={contactForm.dni}
                  onChange={(e) => setContactForm({ ...contactForm, dni: e.target.value })}
                  placeholder="12345678A"
                />
                <Input
                  label="Ciudad"
                  value={contactForm.city}
                  onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                  placeholder="Madrid"
                />
                <Input
                  label="País"
                  value={contactForm.country}
                  onChange={(e) => setContactForm({ ...contactForm, country: e.target.value })}
                  placeholder="España"
                />
              </div>
              <Textarea
                label="Dirección"
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                placeholder="Calle, número, piso..."
              />
              <Textarea
                label="Notas adicionales"
                value={contactForm.notes}
                onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                placeholder="Información adicional..."
              />
              <div className="flex justify-end pt-2">
                <Button onClick={saveContact} loading={saving}>
                  <Save className="h-4 w-4" />
                  Guardar contacto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Contraseña actual"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                error={passErrors.currentPassword}
              />
              <Input
                label="Nueva contraseña"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                error={passErrors.newPassword}
              />
              <Input
                label="Confirmar nueva contraseña"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                error={passErrors.confirmPassword}
              />
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700 space-y-0.5">
                <p className={passwordForm.newPassword.length >= 8 ? "text-green-700" : ""}>✓ Mínimo 8 caracteres</p>
                <p className={/[A-Z]/.test(passwordForm.newPassword) ? "text-green-700" : ""}>✓ Al menos una mayúscula</p>
                <p className={/[0-9]/.test(passwordForm.newPassword) ? "text-green-700" : ""}>✓ Al menos un número</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={savePassword} loading={saving}>
                  <Lock className="h-4 w-4" />
                  Cambiar contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
