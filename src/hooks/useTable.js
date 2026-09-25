import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

/**
 * Charge une table Supabase et reste synchronisée en temps réel.
 *
 * order: {
 *   column: string,
 *   ascending?: boolean
 * }
 */
export function useTable(table, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orderColumn = options.order?.column
  const orderAscending = options.order?.ascending ?? true

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      let query = supabase
        .from(table)
        .select('*')

      if (orderColumn) {
        query = query.order(orderColumn, {
          ascending: orderAscending
        })
      }

      const { data: rows, error: queryError } = await query

      if (queryError) {
        setError(queryError.message)
        setData([])
      } else {
        setData(rows ?? [])
        setError(null)
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, orderColumn, orderAscending])

  useEffect(() => {
    refresh()

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table
        },
        () => {
          refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, refresh])

  return {
    data,
    loading,
    error,
    refresh,
    setError
  }
}