import { useSiteConfig } from '../../hooks/useSiteConfig'
import { buildWhatsAppLink } from '../../lib/whatsapp'

export function WhatsAppFloatingButton() {
  const { config } = useSiteConfig()

  if (!config) return null

  const link = buildWhatsAppLink(
    config.whatsappNumber,
    'Hola, quiero más información sobre los productos de Distribuidora Belocar.',
  )

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar a Distribuidora Belocar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.383.688 4.6 1.877 6.463L4 29l7.716-1.837A12.93 12.93 0 0 0 16 27c6.628 0 12-5.373 12-12S22.628 3 16.001 3Zm0 21.6c-1.86 0-3.6-.51-5.09-1.394l-.365-.216-4.58 1.09 1.12-4.463-.238-.375A9.57 9.57 0 0 1 5.4 15c0-5.85 4.75-10.6 10.601-10.6 5.85 0 10.6 4.75 10.6 10.6s-4.75 10.6-10.6 10.6Zm5.79-7.89c-.317-.159-1.874-.925-2.164-1.03-.29-.106-.502-.159-.713.159-.212.318-.82 1.03-1.005 1.242-.185.212-.37.238-.687.08-.317-.159-1.338-.494-2.548-1.575-.942-.84-1.578-1.877-1.762-2.194-.185-.318-.02-.49.139-.648.142-.142.317-.37.476-.556.159-.185.212-.318.317-.53.106-.212.053-.397-.026-.556-.08-.159-.713-1.72-.977-2.355-.257-.618-.518-.534-.713-.544l-.607-.011c-.212 0-.556.08-.847.397-.29.318-1.111 1.086-1.111 2.649 0 1.563 1.138 3.073 1.297 3.285.159.212 2.24 3.42 5.427 4.796.758.327 1.35.522 1.81.668.76.242 1.452.208 1.999.126.61-.091 1.874-.766 2.138-1.507.264-.74.264-1.375.185-1.507-.08-.132-.29-.212-.607-.37Z" />
      </svg>
    </a>
  )
}
