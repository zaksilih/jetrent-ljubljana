'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  X,
  Loader2,
  Check,
  Ship,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface JetSkiRow {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
}

interface FormState {
  name: string
  slug: string
  description: string
  imageUrl: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '/images/1.jpg',
}

export default function JetSkisPage() {
  const [jetskis, setJetskis] = useState<JetSkiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchJetskis = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/jetskis')
      if (!res.ok) return
      const data = await res.json()
      setJetskis(data.jetskis || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJetskis()
  }, [fetchJetskis])

  function openNewForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(js: JetSkiRow) {
    setForm({
      name: js.name,
      slug: js.slug,
      description: js.description,
      imageUrl: js.image_url,
    })
    setEditingId(js.id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  // Auto-generate slug from name
  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: editingId
        ? f.slug
        : value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      id: editingId || undefined,
      name: form.name,
      slug: form.slug,
      description: form.description,
      imageUrl: form.imageUrl,
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/jetskis', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        closeForm()
        fetchJetskis()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(js: JetSkiRow) {
    try {
      await fetch('/api/admin/jetskis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: js.id, isActive: !js.is_active }),
      })
      fetchJetskis()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jet skiji</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upravljanje flote jet skijev — cene nastavite na strani <a href="/admin/pricing" className="text-primary-600 hover:underline">Cenik</a>
          </p>
        </div>
        <Button onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-1.5" /> Dodaj jet ski
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Uredi jet ski' : 'Nov jet ski'}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Ime</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Sea-Doo Spark 2UP 90HP"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Slug (URL)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="sea-doo-spark-2up"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Opis</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Kratek opis jet skija..."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Slika (URL)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="/images/1.jpg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Prekliči
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Shranjujem...</>
                ) : editingId ? (
                  <><Check className="w-4 h-4 mr-1.5" /> Posodobi</>
                ) : (
                  <><Plus className="w-4 h-4 mr-1.5" /> Dodaj</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Jet ski cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jetskis.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm">
            Ni jet skijev. Dodajte prvega.
          </div>
        )}
        {jetskis.map((js) => (
          <div
            key={js.id}
            className={cn(
              'bg-white rounded-xl border border-gray-200 overflow-hidden transition-opacity',
              !js.is_active && 'opacity-50'
            )}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Ship className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{js.name}</h3>
                    <p className="text-xs text-gray-400">/{js.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs border-0',
                      js.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {js.is_active ? 'Aktiven' : 'Neaktiven'}
                  </Badge>
                </div>
              </div>

              {js.description && (
                <p className="text-sm text-gray-500 mb-3">{js.description}</p>
              )}

              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openEditForm(js)}
                >
                  <Pencil className="w-3 h-3 mr-1" /> Uredi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => toggleActive(js)}
                >
                  {js.is_active ? 'Deaktiviraj' : 'Aktiviraj'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
