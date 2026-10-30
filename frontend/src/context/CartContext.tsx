import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { QuoteItem } from '../types/quote'
import type { ProductDetail, ProductSummary } from '../types/catalog'

const STORAGE_KEY = 'belocar_quote_cart_v1'

interface CartContextValue {
  items: QuoteItem[]
  totalBoxes: number
  addItem: (product: ProductSummary | ProductDetail, boxes: number) => void
  updateBoxes: (productId: number, boxes: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function readInitialItems(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(readInitialItems)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: ProductSummary | ProductDetail, boxes: number) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, boxes: item.boxes + boxes } : item,
        )
      }
      const newItem: QuoteItem = {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        format: product.format,
        unitsPerBox: product.unitsPerBox,
        mainImageUrl: product.mainImageUrl,
        boxes,
      }
      return [...current, newItem]
    })
  }

  const updateBoxes = (productId: number, boxes: number) => {
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, boxes } : item)),
    )
  }

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }

  const clearCart = () => setItems([])

  const totalBoxes = useMemo(() => items.reduce((sum, item) => sum + item.boxes, 0), [items])

  return (
    <CartContext.Provider value={{ items, totalBoxes, addItem, updateBoxes, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
