import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'danger'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary: 'bg-white text-ink-900 hover:bg-sand-100 focus-visible:outline-brand-600',
  outline: 'border border-brand-600 text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-600',
  whatsapp: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
}

export function buttonClasses(variant: ButtonVariant = 'primary', className = ''): string {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANT_CLASSES[variant]} ${className}`
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />
}
