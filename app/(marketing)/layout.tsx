import { plusJakartaSans } from '@/app/fonts'
import { MarketingNavbar } from '@/components/marketing/marketing-navbar'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { getLandingSettings } from '@/lib/landing-settings'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getLandingSettings()

  return (
    <div className={`${plusJakartaSans.variable} bg-mkt-bg font-jakarta overflow-x-hidden`}>
      <MarketingNavbar brandColor={settings.brandColor} logoUrl={settings.logoUrl} />
      <main id="main-content">{children}</main>
      <MarketingFooter
        androidUrl={settings.androidUrl}
        brandColor={settings.brandColor}
        iosUrl={settings.iosUrl}
        logoUrl={settings.logoUrl}
      />
    </div>
  )
}
