import { PageHeader } from '@/components/ui/page-header'
import { updateLandingSettings } from '@/lib/admin-data/actions'
import { getAdminSession } from '@/lib/admin-auth/server'
import { getLandingSettings } from '@/lib/landing-settings'

export default async function ConfiguracionPage() {
  const [admin, landingSettings] = await Promise.all([
    getAdminSession(),
    getLandingSettings(),
  ])

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Ajustes del panel de administración."
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <form action={updateLandingSettings} className="rounded-hero border border-slate/10 bg-white p-8 shadow-card">
          <p className="eyebrow mb-4">Personalización del landing</p>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Color principal</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.brandColor}
                name="brandColor"
                type="color"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">URL del logo</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.logoUrl}
                name="logoUrl"
                placeholder="/toke-logo.svg o URL pública"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Imagen hero</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.heroImageUrl}
                name="heroImageUrl"
                placeholder="/hero-mockup.webp o URL pública de Storage"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Título hero</span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate/15 bg-white px-3 py-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.heroTitle}
                name="heroTitle"
                placeholder="Usa saltos de línea para separar el título"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Subtítulo hero</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-slate/15 bg-white px-3 py-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.heroSubtitle}
                name="heroSubtitle"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Texto de descarga</span>
              <textarea
                className="min-h-20 w-full rounded-xl border border-slate/15 bg-white px-3 py-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.promoBanner}
                name="promoBanner"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Google Play</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.androidUrl}
                name="androidUrl"
                placeholder="https://play.google.com/..."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">App Store</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.iosUrl}
                name="iosUrl"
                placeholder="https://apps.apple.com/..."
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate/10 pt-5">
            <p className="text-xs leading-relaxed text-slate">
              Guarda textos, color y enlaces sin recompilar. Las imágenes deben ser públicas.
            </p>
            <button
              className="rounded-full bg-[#EE7070] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95f5f]"
              type="submit"
            >
              Guardar landing
            </button>
          </div>
        </form>

        {/* Admin profile card */}
        <div className="rounded-hero border border-slate/10 bg-white p-8 shadow-card">
          <p className="eyebrow mb-4">Perfil del administrador</p>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate/5 pb-3">
              <span className="text-sm text-slate">Nombre</span>
              <span className="text-sm font-medium text-ink">
                {admin?.nombreCompleto ?? '—'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate/5 pb-3">
              <span className="text-sm text-slate">Email</span>
              <span className="text-sm font-medium text-ink">
                {admin?.email ?? '—'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate/5 pb-3">
              <span className="text-sm text-slate">Rol</span>
              <span className="text-sm font-medium text-ink">Administrador</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate">Último ingreso</span>
              <span className="text-sm font-medium text-ink">
                {admin?.ultimoIngreso
                  ? new Date(admin.ultimoIngreso).toLocaleString('es-PE')
                  : '—'}
              </span>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-canvas p-5">
            <p className="text-sm font-semibold text-ink">Qué se actualiza</p>
            <p className="mt-2 text-xs leading-relaxed text-slate">
              Hero, color principal, logo del navbar/footer, CTA de descarga y enlaces de tiendas.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
          <p className="text-sm font-medium text-ink">Gestión de categorías</p>
          <p className="mt-1 text-xs text-slate">
            CRUD completo de categorías de servicio — próximamente.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-hero border border-dashed border-slate/30 bg-canvas px-8 py-16 text-center">
          <p className="text-sm font-medium text-ink">Variables de entorno</p>
          <p className="mt-1 text-xs text-slate">
            Configuración de tasas de comisión, timeouts, etc. — próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
