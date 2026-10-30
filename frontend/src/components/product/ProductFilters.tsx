import type { Category } from '../../types/catalog'

interface ProductFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categorySlug: string
  onCategoryChange: (value: string) => void
  brand: string
  onBrandChange: (value: string) => void
  categories: Category[]
  brands: string[]
}

export function ProductFilters({
  search,
  onSearchChange,
  categorySlug,
  onCategoryChange,
  brand,
  onBrandChange,
  categories,
  brands,
}: ProductFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre..."
        aria-label="Buscar productos"
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
      />
      <select
        value={categorySlug}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filtrar por categoría"
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={brand}
        onChange={(event) => onBrandChange(event.target.value)}
        aria-label="Filtrar por marca o viña"
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
      >
        <option value="">Todas las marcas / viñas</option>
        {brands.map((brandOption) => (
          <option key={brandOption} value={brandOption}>
            {brandOption}
          </option>
        ))}
      </select>
    </div>
  )
}
