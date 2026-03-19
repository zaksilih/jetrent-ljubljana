import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/supabase/auth'

/**
 * GET /api/admin/pricing
 *
 * Returns all pricing rules ordered by priority.
 */
export async function GET() {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('pricing_rules')
    .select('*')
    .order('priority', { ascending: false })
    .order('start_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rules: data })
}

/**
 * POST /api/admin/pricing
 *
 * Create a new pricing rule.
 */
export async function POST(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, ruleType, startDate, endDate, pricePerDay, priority } = body

  if (!name || !ruleType || !startDate || !endDate || !pricePerDay) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('pricing_rules')
    .insert({
      name,
      rule_type: ruleType,
      start_date: startDate,
      end_date: endDate,
      price_per_day: pricePerDay,
      priority: priority || 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rule: data })
}

/**
 * PUT /api/admin/pricing
 *
 * Update an existing pricing rule.
 */
export async function PUT(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, ruleType, startDate, endDate, pricePerDay, priority, isActive } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing rule id' }, { status: 400 })
  }

  const supabase = createServerClient()

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (ruleType !== undefined) updateData.rule_type = ruleType
  if (startDate !== undefined) updateData.start_date = startDate
  if (endDate !== undefined) updateData.end_date = endDate
  if (pricePerDay !== undefined) updateData.price_per_day = pricePerDay
  if (priority !== undefined) updateData.priority = priority
  if (isActive !== undefined) updateData.is_active = isActive

  const { data, error } = await supabase
    .from('pricing_rules')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rule: data })
}

/**
 * DELETE /api/admin/pricing?id=uuid
 *
 * Delete a pricing rule.
 */
export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = new URL(req.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { error } = await supabase
    .from('pricing_rules')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
