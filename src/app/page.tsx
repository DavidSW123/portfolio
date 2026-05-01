import Link from "next/link";
import { Car, Shield, Globe, Users, ArrowRight, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                AutoImport <span className="text-blue-600">Pro</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/catalog" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Catálogo
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-800/50 border border-blue-600 px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            Plataforma líder en importación de vehículos
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Importa tu coche ideal
            <br />
            <span className="text-blue-300">al mejor precio</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-10">
            Conectamos proveedores, colaboradores y clientes en una plataforma profesional y
            segura para la importación y venta de vehículos de todo el mundo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg">
                Ver Catálogo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-blue-400 text-white hover:bg-blue-800">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegir AutoImport Pro?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Todo lo que necesitas en una sola plataforma
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Máxima Seguridad",
                desc: "Cifrado SSL, autenticación segura y registro de auditoría completo.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Globe,
                title: "APIs Integradas",
                desc: "Importa vehículos directamente desde fuentes externas con un solo clic.",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Users,
                title: "Gestión de Roles",
                desc: "Perfiles para Administrador, Proveedor, Colaborador y Cliente.",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: Car,
                title: "Catálogo Completo",
                desc: "Fichas técnicas detalladas con fotos ilimitadas y especificaciones.",
                color: "text-orange-600 bg-orange-50",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Perfiles de usuario</h2>
            <p className="mt-3 text-gray-500">Cada perfil con sus propias herramientas y accesos</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                role: "Administrador",
                color: "border-purple-200 bg-purple-50",
                badge: "bg-purple-100 text-purple-700",
                perms: ["Control total del panel", "Gestión de usuarios y roles", "Aprobación de coches", "Configuración de APIs"],
              },
              {
                role: "Proveedor",
                color: "border-blue-200 bg-blue-50",
                badge: "bg-blue-100 text-blue-700",
                perms: ["Añadir coches manualmente", "Gestión de su inventario", "Seguimiento de aprobaciones", "Panel de métricas"],
              },
              {
                role: "Colaborador",
                color: "border-green-200 bg-green-50",
                badge: "bg-green-100 text-green-700",
                perms: ["Publicar coches a venta", "Gestión de listings", "Seguimiento de estado", "Panel propio"],
              },
              {
                role: "Cliente",
                color: "border-gray-200 bg-gray-50",
                badge: "bg-gray-100 text-gray-700",
                perms: ["Ver catálogo completo", "Consultar disponibilidad", "Historial de consultas", "Perfil personalizado"],
              },
            ].map((r) => (
              <div key={r.role} className={`rounded-xl border p-5 ${r.color}`}>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-4 ${r.badge}`}>
                  {r.role}
                </span>
                <ul className="space-y-2">
                  {r.perms.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-blue-100 mb-8">
            Regístrate gratis y explora el catálogo de vehículos importados
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
              Crear Cuenta Gratuita
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
              <Car className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">AutoImport Pro</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 AutoImport Pro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
