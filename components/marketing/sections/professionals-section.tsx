import Image from 'next/image'
import { professionalBenefits } from './data'

export function ProfessionalsSection() {
  return (
    <section id="profesionales" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#EE7070_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left — Phone mockup */}
          <div className="relative flex-shrink-0 lg:w-[40%]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-[80%] rounded-full bg-gradient-to-br from-[#EE7070]/10 to-[#EE7070]/5 blur-3xl" />
            <div className="relative mx-auto w-[280px] sm:w-[300px]">
              <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-neutral-800 bg-neutral-800 shadow-2xl shadow-neutral-900/30">
                <div className="flex items-center justify-between bg-neutral-800 px-6 py-2">
                  <span className="text-[10px] font-medium text-white/70">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-white/70" />
                    <div className="h-2 w-3 rounded-sm bg-white/70" />
                  </div>
                </div>
                <Image src="/prestador.png" alt="Panel profesional de toke+" width={600} height={1200} className="w-full h-auto" quality={95} />
              </div>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-neutral-300" />
            </div>
            {/* Floating badges */}
            <div className="absolute -right-4 top-16 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-lg border border-neutral-100 animate-floating sm:-right-8">
              <span className="text-lg">⭐</span>
              <div><p className="text-xs font-bold text-neutral-800">4.9 / 5.0</p><p className="text-[10px] text-neutral-400">Calificación</p></div>
            </div>
            <div className="absolute -left-4 bottom-32 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-lg border border-neutral-100 sm:-left-8" style={{ animation: 'floating 3s ease-in-out 0.5s infinite' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm">✅</div>
              <div><p className="text-xs font-bold text-neutral-800">Verificado</p><p className="text-[10px] text-neutral-400">Identidad</p></div>
            </div>
          </div>
          {/* Right — Copy */}
          <div className="flex-1 lg:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EE7070]">Panel profesional</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-800 sm:text-4xl lg:text-[42px] lg:leading-[1.12]">¿Brindas un servicio?</h2>
            <div className="mt-8">
              <h3 className="text-lg font-bold text-neutral-800">Prestadores de servicio</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-600">
                ¿Tenés experiencia en plomería, electricidad, pintura, jardinería u otro oficio? Con <span className="font-semibold text-neutral-800">toke+</span> podés conseguir clientes, gestionar tu trabajo y generar ingresos desde tu celular.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-neutral-800 mb-4">Beneficios:</p>
              <ul className="space-y-3">
                {professionalBenefits.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EE7070]/10 text-sm">{b.icon}</span>
                    <span className="text-sm text-neutral-600 leading-relaxed">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#descargar" className="inline-flex items-center gap-2.5 rounded-full bg-[#EE7070] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#D94F4F] shadow-lg shadow-[#EE7070]/25 active:scale-[0.97]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z"/></svg>
                Google Play
              </a>
              <a href="#descargar" className="inline-flex items-center gap-2.5 rounded-full border-2 border-neutral-800 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-neutral-800 hover:text-white active:scale-[0.97]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
