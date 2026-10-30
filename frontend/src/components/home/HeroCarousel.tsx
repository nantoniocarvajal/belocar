import { useEffect, useState } from 'react'

const SLIDES = [
  { src: '/hero/kolinas-vinedo.jpeg', alt: 'Viñedo de Kolinas en otoño' },
  { src: '/hero/aves-del-sur-linea.jpeg', alt: 'Línea de vinos Aves del Sur' },
  { src: '/hero/fruit-splash-mango.jpeg', alt: 'Aves del Sur Fruit Splash sabor mango' },
  { src: '/hero/fruit-splash-pina.jpeg', alt: 'Aves del Sur Fruit Splash sabor piña' },
  { src: '/hero/fruit-splash-cranberry.jpeg', alt: 'Aves del Sur Fruit Splash sabor cranberry' },
  { src: '/hero/fruit-splash-durazno.jpeg', alt: 'Aves del Sur Fruit Splash sabor durazno' },
]

const INTERVAL_MS = 4500

export function HeroCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl sm:aspect-square lg:aspect-[4/5]">
      {SLIDES.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ver imagen ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
