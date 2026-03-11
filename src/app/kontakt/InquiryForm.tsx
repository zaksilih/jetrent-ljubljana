'use client'

import { useActionState } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitInquiry, type InquiryFormState } from './actions'
import { cn } from '@/lib/utils'

export function InquiryForm() {
  const [state, formAction, isPending] = useActionState<InquiryFormState | null, FormData>(
    submitInquiry,
    null
  )

  // Show success message
  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Povpraševanje poslano!
        </h3>
        <p className="text-green-700">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Error message */}
      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{state.message}</p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" required>
          Ime in priimek
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Janez Novak"
          error={!!state?.errors?.name}
          disabled={isPending}
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name}</p>
        )}
      </div>

      {/* Email & Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" required>
            E-pošta
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="janez@email.si"
            error={!!state?.errors?.email}
            disabled={isPending}
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600">{state.errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" required>
            Telefon
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+386 40 123 456"
            error={!!state?.errors?.phone}
            disabled={isPending}
          />
          {state?.errors?.phone && (
            <p className="text-sm text-red-600">{state.errors.phone}</p>
          )}
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom" required>
            Želeni termin od
          </Label>
          <Input
            id="dateFrom"
            name="dateFrom"
            type="date"
            error={!!state?.errors?.dateFrom}
            disabled={isPending}
          />
          {state?.errors?.dateFrom && (
            <p className="text-sm text-red-600">{state.errors.dateFrom}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo" required>
            Želeni termin do
          </Label>
          <Input
            id="dateTo"
            name="dateTo"
            type="date"
            error={!!state?.errors?.dateTo}
            disabled={isPending}
          />
          {state?.errors?.dateTo && (
            <p className="text-sm text-red-600">{state.errors.dateTo}</p>
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination">
          Destinacija / kraj uporabe
        </Label>
        <Input
          id="destination"
          name="destination"
          type="text"
          placeholder="npr. Poreč, Hrvaška"
          disabled={isPending}
        />
      </div>

      {/* Tow hitch */}
      <div className="space-y-3">
        <Label required>Ali imate vozilo s kljuko?</Label>
        <div className="flex gap-4">
          <label
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors',
              'hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50'
            )}
          >
            <input
              type="radio"
              name="hasTowHitch"
              value="yes"
              className="w-4 h-4 text-primary-600"
              disabled={isPending}
            />
            <span>Da</span>
          </label>
          <label
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors',
              'hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50'
            )}
          >
            <input
              type="radio"
              name="hasTowHitch"
              value="no"
              className="w-4 h-4 text-primary-600"
              disabled={isPending}
            />
            <span>Ne</span>
          </label>
        </div>
        {state?.errors?.hasTowHitch && (
          <p className="text-sm text-red-600">{state.errors.hasTowHitch}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Sporočilo</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Dodatna vprašanja ali želje..."
          rows={4}
          disabled={isPending}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Pošiljam...
          </>
        ) : (
          'Pošlji povpraševanje'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        S pošiljanjem obrazca se strinjate, da vas lahko kontaktiramo glede vašega povpraševanja.
      </p>
    </form>
  )
}
