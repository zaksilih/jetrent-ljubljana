'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Ship,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface JetSkiPricing {
  id: string
  name: string
  daily_price_low: number
  daily_price_high: number
  daily_price_short: number
  is_active: boolean
}

interface PricingRule {
  id: string
  name: string
  rule_type: string
  start_date: string
  end_date: string
  price_per_day: number
  priority: number
  is_active: boolean
  created_at: string
}

const ruleTypeLabels: Record<string, string> = {
  low_season: 'Nizka sezona',
  high_season: 'Visoka sezona',
  weekend: 'Vikend',
  daily: 'Dnevni',
  custom: 'Po meri',
}

const ruleTypeColors: Record<string, string> = {
  low_season: 'bg-blue-100 text-blue-700',
  high_season: 'bg-red-100 text-red-700',
  weekend: 'bg-violet-100 text-violet-700',
  daily: 'bg-gray-100 text-gray-700',
  custom: 'bg-amber-100 text-amber-700',
}

const RULE_TYPES = ['low_season', 'high_season', 'weekend', 'daily', 'custom']

interface FormState {
  name: string
  ruleType: string
  startDate: string
  endDate: string
  pricePerDay: string
  priority: string
}

const emptyForm: FormState = {
  name: '',
  ruleType: 'low_season',
  startDate: '',
  endDate: '',
  pricePerDay: '',
  priority: '10',
}

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [jetskis, setJetskis] = useState<JetSkiPricing[]>([])
  const [jetskiPrices, setJetskiPrices] = useState<Record<string, { low: string; high: string; short: string }>>({})
  const [savingJetskiId, setSavingJetskiId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rulesRes, jetskisRes] = await Promise.all([
        fetch('/api/admin/pricing'),
        fetch('/api/admin/jetskis'),
      ])
      if (rulesRes.ok) {
        const data = await rulesRes.json()
        setRules(data.rules || [])
      }
      if (jetskisRes.ok) {
        const data = await jetskisRes.json()
        const jsList: JetSkiPricing[] = data.jetskis || []
        setJetskis(jsList)
        const prices: Record<string, { low: string; high: string; short: string }> = {}
        for (const js of jsList) {
          prices[js.id] = {
            low: String(js.daily_price_low),
            high: String(js.daily_price_high),
            short: String(js.daily_price_short),
          }
        }
        setJetskiPrices(prices)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function saveJetskiPrices(id: string) {
    const p = jetskiPrices[id]
    if (!p) return
    setSavingJetskiId(id)
    try {
      await fetch('/api/admin/jetskis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          dailyPriceLow: parseFloat(p.low),
          dailyPriceHigh: parseFloat(p.high),
          dailyPriceShort: parseFloat(p.short),
        }),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setSavingJetskiId(null)
    }
  }

  function openNewForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(rule: PricingRule) {
    setForm({
      name: rule.name,
      ruleType: rule.rule_type,
      startDate: rule.start_date,
      endDate: rule.end_date,
      pricePerDay: String(rule.price_per_day),
      priority: String(rule.priority),
    })
    setEditingId(rule.id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      id: editingId || undefined,
      name: form.name,
      ruleType: form.ruleType,
      startDate: form.startDate,
      endDate: form.endDate,
      pricePerDay: parseFloat(form.pricePerDay),
      priority: parseInt(form.priority) || 0,
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/pricing', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        closeForm()
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Ali ste prepričani, da želite izbrisati to pravilo?')) return
    try {
      await fetch(`/api/admin/pricing?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleActive(rule: PricingRule) {
    try {
      await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule.id, isActive: !rule.is_active }),
      })
      fetchData()
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
          <h1 className="text-2xl font-bold text-gray-900">Cenik</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upravljanje cenikov in sezonskih pravil
          </p>
        </div>
        <Button onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-1.5" /> Novo pravilo
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-sm text-primary-800">
        <strong>Kako deluje:</strong> Za vsak dan rezervacije sistem poišče aktivno pravilo z
        najvišjo prioriteto, ki pokriva ta datum. Če pravila ni, se uporabi privzeta cena jet skija.
      </div>

      {/* Jet ski base prices */}
      {jetskis.filter((js) => js.is_active).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Privzete cene jet skijev</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Te cene se uporabijo, kadar nobeno sezonsko pravilo ne pokriva izbranega datuma.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {jetskis
              .filter((js) => js.is_active)
              .map((js) => {
                const p = jetskiPrices[js.id]
                if (!p) return null
                return (
                  <div key={js.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2 sm:w-48 shrink-0">
                      <Ship className="w-4 h-4 text-primary-600" />
                      <span className="font-medium text-sm text-gray-900">{js.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[11px] text-gray-400 whitespace-nowrap">Nizka €</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-20 h-8 text-sm"
                          value={p.low}
                          onChange={(e) =>
                            setJetskiPrices((prev) => ({
                              ...prev,
                              [js.id]: { ...prev[js.id], low: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[11px] text-gray-400 whitespace-nowrap">Visoka €</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-20 h-8 text-sm"
                          value={p.high}
                          onChange={(e) =>
                            setJetskiPrices((prev) => ({
                              ...prev,
                              [js.id]: { ...prev[js.id], high: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[11px] text-gray-400 whitespace-nowrap">Kratko €</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-20 h-8 text-sm"
                          value={p.short}
                          onChange={(e) =>
                            setJetskiPrices((prev) => ({
                              ...prev,
                              [js.id]: { ...prev[js.id], short: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs ml-auto"
                        disabled={savingJetskiId === js.id}
                        onClick={() => saveJetskiPrices(js.id)}
                      >
                        {savingJetskiId === js.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <><Save className="w-3.5 h-3.5 mr-1" /> Shrani</>
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Uredi pravilo' : 'Novo cenovno pravilo'}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Ime pravila</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="npr. Visoka sezona 2026"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tip</Label>
              <select
                className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
                value={form.ruleType}
                onChange={(e) => setForm((f) => ({ ...f, ruleType: e.target.value }))}
              >
                {RULE_TYPES.map((t) => (
                  <option key={t} value={t}>{ruleTypeLabels[t]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cena / dan (€)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerDay}
                onChange={(e) => setForm((f) => ({ ...f, pricePerDay: e.target.value }))}
                placeholder="80"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Začetek</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Konec</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prioriteta</Label>
              <Input
                type="number"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                placeholder="10"
              />
              <p className="text-[10px] text-gray-400">Višja = prednost</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Prekliči
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Shranjujem...</>
                ) : editingId ? (
                  <><Check className="w-4 h-4 mr-1.5" /> Posodobi</>
                ) : (
                  <><Plus className="w-4 h-4 mr-1.5" /> Ustvari</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Rules table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_120px_80px_80px_60px_80px] gap-3 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
          <span>Ime</span>
          <span>Tip</span>
          <span>Začetek</span>
          <span>Konec</span>
          <span className="text-right">€/dan</span>
          <span className="text-center">Prioriteta</span>
          <span className="text-center">Aktiven</span>
          <span />
        </div>

        <div className="divide-y divide-gray-100">
          {rules.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              Ni cenikov. Ustvarite novo pravilo.
            </div>
          )}
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'px-5 py-3.5 sm:grid sm:grid-cols-[1fr_100px_120px_120px_80px_80px_60px_80px] sm:gap-3 sm:items-center flex flex-wrap items-center gap-2',
                !rule.is_active && 'opacity-50'
              )}
            >
              <span className="font-medium text-sm text-gray-900">{rule.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[11px] border-0',
                  ruleTypeColors[rule.rule_type] || 'bg-gray-100 text-gray-600'
                )}
              >
                {ruleTypeLabels[rule.rule_type] || rule.rule_type}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(parseISO(rule.start_date), 'dd.MM.yyyy')}
              </span>
              <span className="text-sm text-gray-500">
                {format(parseISO(rule.end_date), 'dd.MM.yyyy')}
              </span>
              <span className="text-sm font-semibold text-gray-900 text-right">
                {Number(rule.price_per_day).toFixed(0)} €
              </span>
              <span className="text-sm text-gray-500 text-center">{rule.priority}</span>
              <div className="text-center">
                <button
                  onClick={() => toggleActive(rule)}
                  className={cn(
                    'w-5 h-5 rounded border-2 inline-flex items-center justify-center transition-colors',
                    rule.is_active
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {rule.is_active && <Check className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => openEditForm(rule)}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
