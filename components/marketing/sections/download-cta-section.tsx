import { TokeLogo } from '@/components/marketing/toke-logo'

export function DownloadCtaSection() {
  return (
    <section id="descargar" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#EE7070] to-[#D94F4F] px-8 py-16 text-center sm:px-16 sm:py-20 shadow-xl shadow-[#D94F4F]/20">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <TokeLogo size="lg" variant="white" className="justify-center mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Descarga la app<br />y empieza hoy
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/90">
              Disponible para Android y próximamente en iOS. El servicio que necesitas, a un toque.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#" className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#D94F4F] transition-all duration-200 hover:bg-neutral-50 shadow-md">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 2.002l-5.478 9.503 5.478 9.503a.513.513 0 00.044-.105L21 12.477a1.957 1.957 0 000-1.954l-3.433-5.926a.513.513 0 00-.044-.105zM1.592 1.47l-.079.042A1.957 1.957 0 000 3.365v17.27a1.957 1.957 0 001.513 1.853l.079.042L7.95 12 1.592 1.47z" />
                  <path d="M11.267 11.505L2.456.623a.483.483 0 01.111-.043L11.267 6.4l-4.14 5.105zM11.267 12.495l-4.14 5.105 8.7 5.82a.483.483 0 00.111-.043l-8.811-10.882z" />
                </svg>
                Google Play
              </a>
              <a href="#" className="inline-flex items-center gap-3 rounded-full bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/20">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Próximamente en iOS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
