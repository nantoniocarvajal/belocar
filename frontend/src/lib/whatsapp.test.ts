import { describe, expect, it } from 'vitest'
import { buildQuoteMessage, buildWhatsAppLink } from './whatsapp'
import type { CustomerDetails, QuoteItem } from '../types/quote'

const baseCustomer: CustomerDetails = {
  name: 'Juan Pérez',
  clientType: 'particular',
  companyName: '',
  phone: '+56 9 1234 5678',
  email: '',
  commune: 'Ñuñoa',
  fulfillmentMode: 'despacho',
  notes: '',
}

const items: QuoteItem[] = [
  {
    productId: 1,
    name: 'Tinto Reserva Cabernet Sauvignon',
    brand: 'Viña Terrual',
    slug: 'tinto-reserva-cabernet-sauvignon',
    format: '750 ml',
    unitsPerBox: 12,
    mainImageUrl: '/demo/products/tinto-1.svg',
    boxes: 3,
  },
  {
    productId: 2,
    name: 'Blanco Sauvignon Blanc',
    brand: 'Casa Nogal',
    slug: 'blanco-sauvignon-blanc',
    format: '750 ml',
    unitsPerBox: 12,
    mainImageUrl: '/demo/products/blanco-1.svg',
    boxes: 5,
  },
]

describe('buildQuoteMessage', () => {
  it('incluye los datos del cliente y el total de cajas', () => {
    const message = buildQuoteMessage(items, baseCustomer)

    expect(message).toContain('Hola, quiero solicitar una cotización a Distribuidora Belocar.')
    expect(message).toContain('Nombre: Juan Pérez')
    expect(message).toContain('Tipo de cliente: Particular')
    expect(message).toContain('Teléfono: +56 9 1234 5678')
    expect(message).toContain('Comuna: Ñuñoa')
    expect(message).toContain('Modalidad: Despacho')
    expect(message).toContain('Total de cajas: 8')
  })

  it('lista cada producto con su cantidad de cajas y marca', () => {
    const message = buildQuoteMessage(items, baseCustomer)

    expect(message).toContain('- 3 caja(s) de Tinto Reserva Cabernet Sauvignon (Viña Terrual)')
    expect(message).toContain('- 5 caja(s) de Blanco Sauvignon Blanc (Casa Nogal)')
  })

  it('incluye el nombre de la empresa solo si el cliente es de tipo empresa', () => {
    const empresaCustomer: CustomerDetails = {
      ...baseCustomer,
      clientType: 'empresa',
      companyName: 'Restaurante El Buen Sabor',
    }

    const message = buildQuoteMessage(items, empresaCustomer)
    expect(message).toContain('Empresa: Restaurante El Buen Sabor')

    const particularMessage = buildQuoteMessage(items, baseCustomer)
    expect(particularMessage).not.toContain('Empresa:')
  })

  it('omite el correo cuando no se informa', () => {
    const message = buildQuoteMessage(items, baseCustomer)
    expect(message).not.toContain('Correo:')

    const withEmail = buildQuoteMessage(items, { ...baseCustomer, email: 'juan@example.com' })
    expect(withEmail).toContain('Correo: juan@example.com')
  })

  it('incluye observaciones solo si no estan vacias', () => {
    const withoutNotes = buildQuoteMessage(items, baseCustomer)
    expect(withoutNotes).not.toContain('Observaciones:')

    const withNotes = buildQuoteMessage(items, { ...baseCustomer, notes: '  Entregar en la tarde  ' })
    expect(withNotes).toContain('Observaciones:')
    expect(withNotes).toContain('Entregar en la tarde')
  })

  it('calcula el total de cajas sumando todos los productos', () => {
    const message = buildQuoteMessage(
      [
        { ...items[0], boxes: 2 },
        { ...items[1], boxes: 1 },
      ],
      baseCustomer,
    )
    expect(message).toContain('Total de cajas: 3')
  })
})

describe('buildWhatsAppLink', () => {
  it('limpia el numero dejando solo digitos', () => {
    const link = buildWhatsAppLink('+56 9 1234 5678', 'hola')
    expect(link).toBe('https://wa.me/56912345678?text=hola')
  })

  it('codifica el mensaje para que sea valido en una URL', () => {
    const link = buildWhatsAppLink('56900000000', 'Línea 1\nLínea 2')
    expect(link).toBe(
      `https://wa.me/56900000000?text=${encodeURIComponent('Línea 1\nLínea 2')}`,
    )
  })
})
