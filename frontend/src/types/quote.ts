export interface QuoteItem {
  productId: number
  name: string
  brand: string
  slug: string
  format: string
  unitsPerBox: number
  mainImageUrl: string
  boxes: number
}

export type ClientType = 'empresa' | 'particular'
export type FulfillmentMode = 'despacho' | 'retiro'

export interface CustomerDetails {
  name: string
  clientType: ClientType
  companyName: string
  phone: string
  email: string
  commune: string
  fulfillmentMode: FulfillmentMode
  notes: string
}

export interface QuoteItemDto {
  productId: number | null
  productName: string
  productBrand: string
  format: string
  unitsPerBox: number
  boxes: number
}

export interface QuoteSummary {
  id: number
  customerName: string
  clientType: ClientType
  phone: string
  commune: string
  fulfillmentMode: FulfillmentMode
  totalBoxes: number
  itemCount: number
  createdAt: string
}

export interface QuoteDetail {
  id: number
  customerName: string
  clientType: ClientType
  companyName: string | null
  phone: string
  email: string | null
  commune: string
  fulfillmentMode: FulfillmentMode
  notes: string | null
  totalBoxes: number
  items: QuoteItemDto[]
  createdAt: string
}
