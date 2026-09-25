import { supabase } from '../supabaseClient'
import { useTable } from './useTable'

export function useMedicaments() {
  const { data, loading, error, refresh, setError } = useTable('medicaments', {
    order: { column: 'created_at', ascending: true },
  })

  async function addMedicament(payload) {
    const { error } = await supabase.from('medicaments').insert(payload)
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  async function updateMedicament(id, payload) {
    const { error } = await supabase.from('medicaments').update(payload).eq('id', id)
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  async function deleteMedicament(id) {
    const { error } = await supabase.from('medicaments').delete().eq('id', id)
    if (error) { setError(error.message); return { ok: false, error: error.message } }
    return { ok: true }
  }

  return { medicaments: data, loading, error, refresh, addMedicament, updateMedicament, deleteMedicament }
}
