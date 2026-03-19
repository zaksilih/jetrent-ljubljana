'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Save, Settings, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface BookingRules {
  minDays: number
  requiredStartDay: number | null
  weekendEnabled: boolean
  weekendStartDays: number[]
  weekendDurations: number[]
  singleDayEnabled: boolean
}

const dayLabels: Record<number, string> = {
  0: 'Nedelja',
  1: 'Ponedeljek',
  2: 'Torek',
  3: 'Sreda',
  4: 'Četrtek',
  5: 'Petek',
  6: 'Sobota',
}

export default function SettingsPage() {
  const [rules, setRules] = useState<BookingRules | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchRules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings?key=booking_rules')
      if (res.ok) {
        const data = await res.json()
        setRules(data.setting?.value || null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  async function handleSave() {
    if (!rules) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'booking_rules', value: rules }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  function toggleArrayValue(arr: number[], val: number): number[] {
    return arr.includes(val)
      ? arr.filter((v) => v !== val)
      : [...arr, val].sort((a, b) => a - b)
  }

  if (loading || !rules) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nastavitve</h1>
          <p className="text-sm text-gray-500 mt-1">Pravila rezervacij in omejitve</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Shranjujem...</>
          ) : saved ? (
            <><Save className="w-4 h-4 mr-1.5" /> Shranjeno ✓</>
          ) : (
            <><Save className="w-4 h-4 mr-1.5" /> Shrani</>
          )}
        </Button>
      </div>

      {/* How it works */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-sm text-primary-800 flex gap-2">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Kako deluje:</strong> Ta pravila omejujejo, katere datume lahko stranke izberejo
          v koledarju za rezervacijo. Cene se upravljajo ločeno na strani &quot;Cenik&quot;.
        </div>
      </div>

      {/* Minimum days + required start day */}
      <Section title="Dolgotrajni najem" icon={Settings}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">
              Minimalno število dni
            </Label>
            <p className="text-xs text-gray-400">
              Stranke morajo rezervirati vsaj toliko dni. Vikend in enodnevni najem sta izjemi (spodaj).
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    rules.minDays === d
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setRules({ ...rules, minDays: d })}
                >
                  {d} {d === 1 ? 'dan' : 'dni'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">
              Obvezen začetni dan (neobvezno)
            </Label>
            <p className="text-xs text-gray-400">
              Če izberete dan, se morajo dolgotrajne rezervacije začeti na ta dan. Pustite prazno za prost izbor.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  rules.requiredStartDay === null
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setRules({ ...rules, requiredStartDay: null })}
              >
                Brez omejitve
              </button>
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    rules.requiredStartDay === d
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setRules({ ...rules, requiredStartDay: d })}
                >
                  {dayLabels[d]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Weekend exceptions */}
      <Section title="Vikend izjema" icon={Settings}>
        <ToggleRow
          label="Dovoli vikend rezervacije"
          description="Izjema za kratke najeme (npr. petek–nedelja ali sobota–nedelja), ne glede na minimalno število dni. Cena za vikend se nastavi v pravilih ceniku s tipom 'Vikend'."
          checked={rules.weekendEnabled}
          onChange={(v) => setRules({ ...rules, weekendEnabled: v })}
        />

        {rules.weekendEnabled && (
          <>
            <div className="space-y-2 mt-4">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">
                Dovoljeni začetni dnevi za vikend
              </Label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      rules.weekendStartDays.includes(d)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() =>
                      setRules({
                        ...rules,
                        weekendStartDays: toggleArrayValue(
                          rules.weekendStartDays,
                          d
                        ),
                      })
                    }
                  >
                    {dayLabels[d]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">
                Dovoljeno trajanje vikend najema (dni)
              </Label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      rules.weekendDurations.includes(d)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() =>
                      setRules({
                        ...rules,
                        weekendDurations: toggleArrayValue(
                          rules.weekendDurations,
                          d
                        ),
                      })
                    }
                  >
                    {d} {d === 1 ? 'dan' : 'dni'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* Single day */}
      <Section title="Enodnevni najem" icon={Settings}>
        <ToggleRow
          label="Dovoli enodnevne rezervacije"
          description="Če je vklopljeno, stranke lahko rezervirajo sam 1 dan. Cena se nastavi v pravilih ceniku s tipom 'Dnevni'."
          checked={rules.singleDayEnabled}
          onChange={(v) => setRules({ ...rules, singleDayEnabled: v })}
        />
      </Section>
    </div>
  )
}

// ── Reusable sub-components ──────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gray-400" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'mt-0.5 w-10 h-6 rounded-full transition-colors relative flex-shrink-0',
          checked ? 'bg-primary-600' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'block w-4 h-4 bg-white rounded-full shadow transition-transform absolute top-1',
            checked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}
