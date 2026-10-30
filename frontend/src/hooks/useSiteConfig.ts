import { useEffect, useState } from 'react'
import { fetchSiteConfig } from '../lib/api'
import type { SiteConfig } from '../types/catalog'

interface UseSiteConfigResult {
  config: SiteConfig | null
  loading: boolean
  error: string | null
}

export function useSiteConfig(): UseSiteConfigResult {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchSiteConfig()
      .then((data) => {
        if (!cancelled) setConfig(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { config, loading, error }
}
