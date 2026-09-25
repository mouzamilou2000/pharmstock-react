import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Affiché dans la console au démarrage si le .env.local n'est pas configuré
  console.warn(
    '[PharmStock] Variables Supabase manquantes. Copiez .env.example en .env.local et renseignez VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(url, anonKey)
