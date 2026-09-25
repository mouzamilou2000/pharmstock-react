import { supabase } from '../supabaseClient'
import { useTable } from './useTable'

export function useEntrees() {
  const { data, loading, error, refresh, setError } = useTable('entrees', {
    order: { column: 'date', ascending: false },
  })

  async function addEntree({ medId, qty, date, fournisseur, lot }) {
    const { error } = await supabase.rpc('enregistrer_entree', {
      p_med_id: medId, p_qty: qty, p_date: date, p_fournisseur: fournisseur, p_lot: lot,
    })
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  return { entrees: data, loading, error, refresh, addEntree }
}

export function useSorties() {
  const { data, loading, error, refresh, setError } = useTable('sorties', {
    order: { column: 'date', ascending: false },
  })

  async function addSortie({ medId, qty, date, motif }) {
    const { error } = await supabase.rpc('enregistrer_sortie', {
      p_med_id: medId, p_qty: qty, p_date: date, p_motif: motif,
    })
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  return { sorties: data, loading, error, refresh, addSortie }
}
