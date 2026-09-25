import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import Login from './auth/Login'
import Register from './auth/Register'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Topbar from './components/Topbar'
import Dashboard from './components/views/Dashboard'
import Stock from './components/views/Stock'
import Alertes from './components/views/Alertes'
import Entrees from './components/views/Entrees'
import Sorties from './components/views/Sorties'
import Fournisseurs from './components/views/Fournisseurs'
import Rapports from './components/views/Rapports'
import MedicamentModal from './components/modals/MedicamentModal'
import EntreeModal from './components/modals/EntreeModal'
import SortieModal from './components/modals/SortieModal'
import FournisseurModal from './components/modals/FournisseurModal'
import DetailModal from './components/modals/DetailModal'
import { useMedicaments } from './hooks/useMedicaments'
import { useEntrees, useSorties } from './hooks/useMouvements'
import { useFournisseurs } from './hooks/useFournisseurs'
import { useToast } from './ToastContext'
import { isPeremptionProche } from './utils'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [authMode, setAuthMode] = useState('login')
  const [view, setView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [medModalOpen, setMedModalOpen] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [entreeModalOpen, setEntreeModalOpen] = useState(false)
  const [sortieModalOpen, setSortieModalOpen] = useState(false)
  const [fournModalOpen, setFournModalOpen] = useState(false)
  const [detailMed, setDetailMed] = useState(null)

  const toast = useToast()
  const { medicaments, loading: medLoading, error: medError, addMedicament, updateMedicament, deleteMedicament } = useMedicaments()
  const { entrees, loading: entLoading, error: entError, addEntree } = useEntrees()
  const { sorties, loading: sorLoading, error: sorError, addSortie } = useSorties()
  const { fournisseurs, loading: fourLoading, error: fourError, addFournisseur, deleteFournisseur } = useFournisseurs()

  const critiqueCount = medicaments.filter(m => m.quantite <= m.seuil).length
  const peremptionCount = medicaments.filter(m => isPeremptionProche(m.peremption)).length
  const alertesCount = critiqueCount + peremptionCount

  const globalError = medError || entError || sorError || fourError
  const anyLoading = medLoading || entLoading || sorLoading || fourLoading
 
  function openAddModalFor(currentView) {
    if (currentView === 'entrees') setEntreeModalOpen(true)
    else if (currentView === 'sorties') setSortieModalOpen(true)
    else if (currentView === 'fournisseurs') setFournModalOpen(true)
    else { setEditingMed(null); setMedModalOpen(true) }
  }

  async function handleSaveMedicament(payload, editId) {
    setSaving(true)
    const res = editId ? await updateMedicament(editId, payload) : await addMedicament(payload)
    setSaving(false)
    if (res.ok) {
      toast(editId ? 'Médicament modifié avec succès' : 'Médicament ajouté avec succès', 'success')
      setMedModalOpen(false)
      setEditingMed(null)
    } else {
      toast(res.error || "Erreur lors de l'enregistrement", 'error')
    }
  }

  async function handleDeleteMedicament(m) {
    if (!confirm(`Supprimer "${m.nom}" ? Cette action est irréversible.`)) return
    const res = await deleteMedicament(m.id)
    toast(res.ok ? 'Médicament supprimé' : (res.error || 'Erreur lors de la suppression'), res.ok ? 'warning' : 'error')
  }

  async function handleSaveEntree(payload) {
    setSaving(true)
    const res = await addEntree(payload)
    setSaving(false)
    if (res.ok) { toast('Entrée enregistrée — stock mis à jour', 'success'); setEntreeModalOpen(false) }
    else toast(res.error || "Erreur lors de l'enregistrement", 'error')
  }

  async function handleSaveSortie(payload) {
    setSaving(true)
    const res = await addSortie(payload)
    setSaving(false)
    if (res.ok) { toast('Sortie enregistrée — stock mis à jour', 'success'); setSortieModalOpen(false) }
    else toast(res.error || 'Erreur lors de la sortie', 'error')
  }

  async function handleSaveFournisseur(payload) {
    setSaving(true)
    const res = await addFournisseur(payload)
    setSaving(false)
    if (res.ok) { toast('Fournisseur ajouté', 'success'); setFournModalOpen(false) }
    else toast(res.error || "Erreur lors de l'enregistrement", 'error')
  }

  async function handleDeleteFournisseur(f) {
    if (!confirm(`Supprimer "${f.nom}" ?`)) return
    const res = await deleteFournisseur(f.id)
    toast(res.ok ? 'Fournisseur supprimé' : (res.error || 'Erreur lors de la suppression'), res.ok ? 'warning' : 'error')
  }

    if (authLoading) {
    return (
      <div className="auth-loading">
        Chargement de PharmStock...
      </div>
    )
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onRegister={() => setAuthMode('register')} />
    ) : (
      <Register onLogin={() => setAuthMode('login')} />
    )
  }
  return (
    <div className="app">
      <Sidebar
        view={view}
        setView={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        critiqueCount={critiqueCount}
        alertesCount={alertesCount}
      />

      <div className="main">
        <Topbar view={view} onMenuClick={() => setSidebarOpen(true)} onAddClick={() => openAddModalFor(view)} />

        <div className="content">
          {globalError && <div className="banner-error">Erreur Supabase : {globalError}</div>}

          {anyLoading ? (
            <div className="spinner-wrap">Chargement…</div>
          ) : (
            <>
              {view === 'dashboard' && <Dashboard medicaments={medicaments} setView={setView} />}
              {view === 'stock' && (
                <Stock
                  medicaments={medicaments}
                  onAdd={() => { setEditingMed(null); setMedModalOpen(true) }}
                  onEdit={(m) => { setEditingMed(m); setMedModalOpen(true) }}
                  onDelete={handleDeleteMedicament}
                  onDetail={(m) => setDetailMed(m)}
                />
              )}
              {view === 'alertes' && <Alertes medicaments={medicaments} />}
              {view === 'entrees' && <Entrees entrees={entrees} medicaments={medicaments} onAdd={() => setEntreeModalOpen(true)} />}
              {view === 'sorties' && <Sorties sorties={sorties} medicaments={medicaments} onAdd={() => setSortieModalOpen(true)} />}
              {view === 'fournisseurs' && <Fournisseurs fournisseurs={fournisseurs} onAdd={() => setFournModalOpen(true)} onDelete={handleDeleteFournisseur} />}
              {view === 'rapports' && <Rapports medicaments={medicaments} entrees={entrees} sorties={sorties} />}
            </>
          )}
        </div>
      </div>

      <BottomNav view={view} setView={setView} />

      <MedicamentModal
        open={medModalOpen}
        onClose={() => { setMedModalOpen(false); setEditingMed(null) }}
        editing={editingMed}
        onSave={handleSaveMedicament}
        saving={saving}
      />
      <EntreeModal
        open={entreeModalOpen}
        onClose={() => setEntreeModalOpen(false)}
        medicaments={medicaments}
        onSave={handleSaveEntree}
        saving={saving}
      />
      <SortieModal
        open={sortieModalOpen}
        onClose={() => setSortieModalOpen(false)}
        medicaments={medicaments}
        onSave={handleSaveSortie}
        saving={saving}
      />
      <FournisseurModal
        open={fournModalOpen}
        onClose={() => setFournModalOpen(false)}
        onSave={handleSaveFournisseur}
        saving={saving}
      />
      <DetailModal
        open={!!detailMed}
        onClose={() => setDetailMed(null)}
        medicament={detailMed}
        onEdit={(m) => { setEditingMed(m); setMedModalOpen(true) }}
      />
    </div>
  )
}
