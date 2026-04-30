import Image from 'next/image'

const wavePatternStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='20' viewBox='0 0 120 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 30 0, 60 10 T 120 10' fill='none' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundSize: '120px 20px',
  backgroundRepeat: 'repeat',
} as const

export function HeroSection() {
  return (
    <section className="relative z-30 min-h-[90vh] flex items-center overflow-x-clip overflow-y-visible bg-gradient-to-br from-[#EE7070] to-[#D94F4F] pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Wavy pattern background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="hero-wave-motion absolute inset-y-0 -inset-x-[120px] opacity-[0.15]"
          style={wavePatternStyle}
        />
      </div>

      {/* Curved bottom divider to replace the linear gradient */}
      <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C300,120 400,0 600,0 C800,0 900,120 1200,120 Z" fill="#ffffff"></path>
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 z-40 w-full lg:px-8">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-4 lg:text-left xl:gap-6">
          {/* Copy column */}
          <div className="flex-1 max-w-xl lg:max-w-[42rem] lg:pl-8 xl:pl-12">
            <h1 className="mt-10 text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:mt-0 lg:text-[52px] lg:leading-[1.2]">
              La app para el
              <br />
              <span className="lg:whitespace-nowrap">mantenimiento de tu</span>
              <br />
              hogar
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg font-normal leading-relaxed text-white/95 sm:text-xl lg:mx-0 lg:max-w-[30rem] lg:text-[26px] lg:leading-[1.25]">
              <strong className="font-bold text-white">Toke+</strong> te conecta con plomeros, electricistas, herreros, albañiles, jardineros, fleteros y más...
            </p>

            <div className="hero-store-buttons mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <a
                href="#descargar"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#D94F4F] sm:px-8"
              >
                <svg className="h-5 w-5 mr-1" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                Google Play
              </a>
              <a
                href="#descargar"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#D94F4F] sm:px-8"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            </div>
          </div>

          {/* Hero image & floating icon */}
          <div className="relative z-30 mx-auto mt-12 flex shrink-0 justify-center sm:mt-14 lg:mx-0 lg:mt-0 lg:ml-2 lg:translate-y-6">
            <div className="relative w-[220px] sm:w-[250px] md:w-[265px] lg:h-[570px] lg:w-[290px] animate-floating">
              {/* Resplandor ambiental rojo para potenciar la iluminación */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-red-500/30 blur-[60px] rounded-full z-0" />
              
              {/* Resplandor de contorno intenso */}
              <Image
                src="/hero-mockup.png"
                alt="App toke+ mostrando servicios"
                width={290}
                height={570}
                sizes="(min-width: 1024px) 290px, (min-width: 768px) 265px, (min-width: 640px) 250px, 220px"
                className="hero-phone-perspective relative z-10 h-auto w-full lg:h-[570px] lg:w-[290px] object-contain contrast-95 brightness-105 drop-shadow-[0_0_35px_rgba(255,33,49,0.9)]"
                priority
              />

              {/* Floating 3D Icon overlay — clamped to avoid overflow on mobile */}
              <div className="hero-toke-icon absolute z-[70]">
                <div className="toke-icon-motion">
                  <Image
                    src="/toke-3d-icon.png"
                    alt="toke+ 3D Icon"
                    width={500}
                    height={500}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 176px, (min-width: 430px) 160px, 136px"
                    className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
