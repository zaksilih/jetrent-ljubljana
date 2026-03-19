'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { bookingContent } from '@/data/booking'
import {
  validateCustomerForm,
  type CustomerFormData,
  type CustomerFormErrors,
} from '@/lib/booking'

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData>
  onSubmit: (data: CustomerFormData) => void
}

export default function CustomerForm({ initialData, onSubmit }: CustomerFormProps) {
  const content = bookingContent.customerForm

  const [form, setForm] = useState<CustomerFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    country: initialData?.country || 'Slovenija',
    message: initialData?.message || '',
    pickupLocation: initialData?.pickupLocation || '',
    deliveryKm: initialData?.deliveryKm || 0,
  })
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  function handleChange(field: keyof CustomerFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field as keyof CustomerFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validateCustomerForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{content.firstName} *</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-400' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{content.lastName} *</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-400' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{content.email} *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-400' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">{content.phone} *</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={errors.phone ? 'border-red-400' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">{content.country} *</Label>
          <Input
            id="country"
            value={form.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={errors.country ? 'border-red-400' : ''}
          />
          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
        </div>

        {/* Pickup location */}
        <div className="space-y-2">
          <Label htmlFor="pickupLocation">{content.pickupLocation}</Label>
          <Input
            id="pickupLocation"
            value={form.pickupLocation}
            onChange={(e) => handleChange('pickupLocation', e.target.value)}
            placeholder={content.pickupLocationPlaceholder}
          />
        </div>

        {/* Delivery km */}
        <div className="space-y-2">
          <Label htmlFor="deliveryKm">{content.deliveryKm}</Label>
          <Input
            id="deliveryKm"
            type="number"
            min={0}
            value={form.deliveryKm || ''}
            onChange={(e) => handleChange('deliveryKm', Number(e.target.value) || 0)}
          />
          <p className="text-xs text-gray-400">{content.deliveryKmNote}</p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">{content.message}</Label>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder={content.messagePlaceholder}
            rows={3}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <Button type="submit" variant="cta" size="lg">
            {content.next}
          </Button>
        </div>
      </form>
    </div>
  )
}
