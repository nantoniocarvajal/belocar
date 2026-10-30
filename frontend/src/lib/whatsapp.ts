import type { QuoteItem, CustomerDetails } from '../types/quote'

const CLIENT_TYPE_LABELS: Record<CustomerDetails['clientType'], string> = {
  empresa: 'Empresa',
  particular: 'Particular',
}

const FULFILLMENT_LABELS: Record<CustomerDetails['fulfillmentMode'], string> = {
  despacho: 'Despacho',
  retiro: 'Retiro en tienda',
}

export function buildQuoteMessage(items: QuoteItem[], customer: CustomerDetails): string {
  const totalBoxes = items.reduce((sum, item) => sum + item.boxes, 0)

  const lines: string[] = []
  lines.push('Hola, quiero solicitar una cotización a Distribuidora Belocar.')
  lines.push('')
  lines.push('Datos del cliente:')
  lines.push(`Nombre: ${customer.name}`)
  lines.push(`Tipo de cliente: ${CLIENT_TYPE_LABELS[customer.clientType]}`)
  if (customer.clientType === 'empresa' && customer.companyName) {
    lines.push(`Empresa: ${customer.companyName}`)
  }
  lines.push(`Teléfono: ${customer.phone}`)
  if (customer.email) {
    lines.push(`Correo: ${customer.email}`)
  }
  lines.push(`Comuna: ${customer.commune}`)
  lines.push(`Modalidad: ${FULFILLMENT_LABELS[customer.fulfillmentMode]}`)
  lines.push('')
  lines.push('Productos:')
  for (const item of items) {
    lines.push(`- ${item.boxes} caja(s) de ${item.name} (${item.brand})`)
  }
  lines.push('')
  lines.push(`Total de cajas: ${totalBoxes}`)

  if (customer.notes.trim()) {
    lines.push('')
    lines.push('Observaciones:')
    lines.push(customer.notes.trim())
  }

  return lines.join('\n')
}

export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`
}
