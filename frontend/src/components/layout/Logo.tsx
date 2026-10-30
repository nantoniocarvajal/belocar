interface LogoProps {
  showWordmark?: boolean
  className?: string
}

/**
 * Isotipo + wordmark real de Distribuidora Belocar (extraídos del logo oficial y recortados
 * con fondo transparente), usados como imágenes ya que el diseño 3D no se puede replicar en CSS/SVG.
 */
export function Logo({ showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/brand/belocar-icon.png" alt="Belocar" className="h-9 w-auto object-contain" />
      {showWordmark && (
        <img src="/brand/belocar-wordmark.png" alt="BELOCAR" className="h-5 w-auto object-contain" />
      )}
    </span>
  )
}
