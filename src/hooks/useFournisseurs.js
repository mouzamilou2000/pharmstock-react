import { supabase } from '../supabaseClient'
import { useTable } from './useTable'

export function useFournisseurs() {
  const { data, loading, error, refresh, setError } = useTable('fournisseurs', {
    order: { column: 'created_at', ascending: true },
  })

  async function addFournisseur(payload) {
    const { error } = await supabase.from('fournisseurs').insert(payload)
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  async function deleteFournisseur(id) {
    const { error } = await supabase.from('fournisseurs').delete().eq('id', id)
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  return { fournisseurs: data, loading, error, refresh, addFournisseur, deleteFournisseur }
}
