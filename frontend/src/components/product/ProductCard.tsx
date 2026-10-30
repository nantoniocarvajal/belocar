import { Link } from 'react-router-dom'
import type { ProductSummary } from '../../types/catalog'

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      to={`/catalogo/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      {product.featured && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
          Destacado
        </span>
      )}
      <div className="aspect-square w-full overflow-hidden bg-sand-100">
        <img
          src={product.mainImageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{product.brand}</p>
        <h3 className="font-display font-bold text-ink-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-500">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs font-medium text-ink-400">
          <span>{product.format}</span>
          <span>{product.unitsPerBox} un. x caja</span>
        </div>
      </div>
    </Link>
  )
}
