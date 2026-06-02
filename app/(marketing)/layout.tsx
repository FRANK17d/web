import { plusJakartaSans } from '@/app/fonts'
import { MarketingNavbar } from '@/components/marketing/marketing-navbar'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${plusJakartaSans.variable} bg-mkt-bg font-jakarta overflow-x-hidden`}>
      <MarketingNavbar />
      <main id="main-content">{children}</main>
      <MarketingFooter />
    </div>
  )
}
