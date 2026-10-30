import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider, useCart } from './CartContext'
import type { ProductSummary } from '../types/catalog'

const product: ProductSummary = {
  id: 1,
  name: 'Tinto Reserva Cabernet Sauvignon',
  slug: 'tinto-reserva-cabernet-sauvignon',
  brand: 'Viña Terrual',
  categoryName: 'Tintos',
  categorySlug: 'tintos',
  format: '750 ml',
  unitsPerBox: 12,
  mainImageUrl: '/demo/products/tinto-1.svg',
  shortDescription: 'Tinto reserva.',
  featured: true,
}

const otherProduct: ProductSummary = {
  ...product,
  id: 2,
  name: 'Blanco Sauvignon Blanc',
  slug: 'blanco-sauvignon-blanc',
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

beforeEach(() => {
  localStorage.clear()
})

describe('CartContext', () => {
  it('empieza vacio cuando no hay nada en localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.totalBoxes).toBe(0)
  })

  it('agrega un producto nuevo con la cantidad de cajas indicada', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 3))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({ productId: 1, boxes: 3, brand: 'Viña Terrual' })
    expect(result.current.totalBoxes).toBe(3)
  })

  it('suma las cajas si se agrega el mismo producto de nuevo', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 2))
    act(() => result.current.addItem(product, 4))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].boxes).toBe(6)
  })

  it('actualiza la cantidad de cajas de un producto especifico', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 2))
    act(() => result.current.updateBoxes(1, 10))

    expect(result.current.items[0].boxes).toBe(10)
  })

  it('elimina un producto del carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 2))
    act(() => result.current.addItem(otherProduct, 1))
    act(() => result.current.removeItem(1))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].productId).toBe(2)
  })

  it('vacia el carrito por completo', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 2))
    act(() => result.current.addItem(otherProduct, 1))
    act(() => result.current.clearCart())

    expect(result.current.items).toEqual([])
    expect(result.current.totalBoxes).toBe(0)
  })

  it('calcula el total de cajas sumando todos los productos', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addItem(product, 3))
    act(() => result.current.addItem(otherProduct, 5))

    expect(result.current.totalBoxes).toBe(8)
  })

  it('persiste los items en localStorage y los recupera al montar de nuevo', () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(product, 3))
    unmount()

    const { result: secondResult } = renderHook(() => useCart(), { wrapper })
    expect(secondResult.current.items).toHaveLength(1)
    expect(secondResult.current.items[0].productId).toBe(1)
  })
})
