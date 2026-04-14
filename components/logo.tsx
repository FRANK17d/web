export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
      {...props}
    >
      {/* 
        Logotipo Temático: Casa sólida con un engranaje.
        Representa claramente el concepto de "servicios y reparaciones para el hogar"
        con un diseño robusto y profesional, alejándose de los brazos de línea fina.
      */}
      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm1 14h-2v-1.1c-.3-.1-.5-.2-.7-.4l-1 .7-1.4-1.4.7-1c-.2-.2-.3-.5-.4-.7H7v-2h1.1c.1-.3.2-.5.4-.7l-.7-1 1.4-1.4 1 .7c.2-.2.5-.3.7-.4V9h2v1.1c.3.1.5.2.7.4l1-.7 1.4 1.4-.7 1c.2.2.3.5.4.7H17v2h-1.1c-.1.3-.2.5-.4.7l.7 1-1.4 1.4-1-.7c-.2.2-.5.3-.7.4V17zm-1-6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
    </svg>
  )
}
