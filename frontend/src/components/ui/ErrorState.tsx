import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="font-semibold text-red-800">No se pudo cargar la información</p>
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-red-600 text-red-700 hover:bg-red-100">
          Reintentar
        </Button>
      )}
    </div>
  )
}
