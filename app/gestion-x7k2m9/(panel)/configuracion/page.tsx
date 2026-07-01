import { PageHeader } from '@/components/ui/page-header'
import { updateLandingSettings } from '@/lib/admin-data/actions'
import { getAdminSession } from '@/lib/admin-auth/server'
import { getLandingSettings, getIntegrationSettings } from '@/lib/landing-settings'
import { getAdminUsers } from '@/lib/admin-data/queries'
import { AdminUsersPanel } from './admin-users-panel'
import { IntegrationSettingsForm, ImageUploadCard } from './integration-settings'

export default async function ConfiguracionPage() {
  const [admin, landingSettings, adminUsers, integrations] = await Promise.all([
    getAdminSession(),
    getLandingSettings(),
    getAdminUsers(),
    getIntegrationSettings(),
  ])

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Sistema"
        title="Configuracion"
        description="Ajustes del panel de administracion."
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <form action={updateLandingSettings} className="rounded-hero border border-slate/10 bg-white p-8 shadow-card">
          <p className="eyebrow mb-4">Personalizacion del landing</p>
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
                placeholder="/toke-logo.svg o URL publica"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Imagen hero</span>
              <input
                className="h-11 w-full rounded-xl border border-slate/15 bg-white px-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.heroImageUrl}
                name="heroImageUrl"
                placeholder="/hero-mockup.webp o URL publica de Storage"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Titulo hero</span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate/15 bg-white px-3 py-3 text-sm text-ink outline-none focus:border-[#EE7070]"
                defaultValue={landingSettings.heroTitle}
                name="heroTitle"
                placeholder="Usa saltos de linea para separar el titulo"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-ink">Subtitulo hero</span>
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
              Guarda textos, color y enlaces sin recompilar.
            </p>
            <button
              className="rounded-full bg-[#EE7070] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95f5f]"
              type="submit"
            >
              Guardar landing
            </button>
          </div>
        </form>

        {/* Right column: profile + image uploads */}
        <div className="space-y-6">
          {/* Admin profile card */}
          <div className="rounded-hero border border-slate/10 bg-white p-6 shadow-card">
            <p className="eyebrow mb-4">Perfil del administrador</p>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate/5 pb-2">
                <span className="text-sm text-slate">Nombre</span>
                <span className="text-sm font-medium text-ink">
                  {admin?.nombreCompleto ?? '--'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate/5 pb-2">
                <span className="text-sm text-slate">Email</span>
                <span className="text-sm font-medium text-ink">
                  {admin?.email ?? '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate">Nivel</span>
                <span className="text-sm font-medium text-ink capitalize">
                  {admin?.adminLevel ?? 'admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Image uploads */}
          <ImageUploadCard
            imageType="logo"
            label="Logo del sitio"
            currentUrl={landingSettings.logoUrl}
          />
          <ImageUploadCard
            imageType="hero"
            label="Imagen hero"
            currentUrl={landingSettings.heroImageUrl}
          />
        </div>
      </div>

      {/* Integration settings */}
      <div className="mt-8">
        <IntegrationSettingsForm settings={integrations} />
      </div>

      {/* Admin Users Management */}
      <div className="mt-8">
        <AdminUsersPanel
          admins={adminUsers}
          currentAdminId={admin?.id ?? ''}
          isSuperadmin={admin?.adminLevel === 'superadmin'}
        />
      </div>
    </div>
  )
}
