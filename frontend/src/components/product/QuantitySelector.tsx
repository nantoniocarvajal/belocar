interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
}

export function QuantitySelector({ value, onChange, min = 1 }: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1))
  const increase = () => onChange(value + 1)

  const handleInput = (raw: string) => {
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      onChange(min)
      return
    }
    onChange(Math.max(min, parsed))
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-ink-200">
      <button
        type="button"
        onClick={decrease}
        aria-label="Disminuir cantidad de cajas"
        className="px-3 py-2 text-lg font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40"
        disabled={value <= min}
      >
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        onChange={(event) => handleInput(event.target.value)}
        aria-label="Cantidad de cajas"
        className="w-14 border-x border-ink-200 py-2 text-center text-sm font-semibold text-ink-900 focus:outline-none"
      />
      <button
        type="button"
        onClick={increase}
        aria-label="Aumentar cantidad de cajas"
        className="px-3 py-2 text-lg font-semibold text-brand-700 hover:bg-brand-50"
      >
        +
      </button>
    </div>
  )
}
