import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { favoritesApi } from '../api/favorites'
import type { AuthResponse } from '../api/auth'

interface FavoritesContextValue {
  favoriteIds: Set<number>
  toggleFavorite: (productId: number) => Promise<void>
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: AuthResponse | null
}) {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set())
      return
    }
    try {
      const ids = await favoritesApi.getFavoriteIds()
      setFavoriteIds(new Set(ids))
    } catch {
      setFavoriteIds(new Set())
    }
  }, [user])

  useEffect(() => {
    refreshFavorites()
  }, [refreshFavorites])

  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (!user) return
      try {
        const isFavorite = favoriteIds.has(productId)
        if (isFavorite) {
          await favoritesApi.removeFavorite(productId)
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.delete(productId)
            return next
          })
        } else {
          await favoritesApi.addFavorite(productId)
          setFavoriteIds((prev) => new Set(prev).add(productId))
        }
      } catch {
        // ignore
      }
    },
    [user, favoriteIds]
  )

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  return ctx
}
