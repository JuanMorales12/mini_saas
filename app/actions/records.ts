'use server'

import { createClient } from '@/lib/supabase/server'
import { requireProAccess, checkProAccess } from './subscription'

/**
 * Example: Create a record
 * This demonstrates plan-based access control
 *
 * Free users: max 3 records
 * Pro users: unlimited records
 */
export async function createRecord(name: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if user is on pro plan
  const isPro = await checkProAccess()

  // If not pro, check record limit
  if (!isPro) {
    // Count existing records (you'll need to create this table)
    const { count } = await supabase
      .from('records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count >= 3) {
      throw new Error(
        'Free plan limit reached (3 records). Upgrade to Pro for unlimited records.'
      )
    }
  }

  // Create the record
  const { data, error } = await supabase
    .from('records')
    .insert({
      user_id: user.id,
      name,
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create record')
  }

  return data
}

/**
 * Example: Access advanced analytics (Pro only)
 */
export async function getAdvancedAnalytics() {
  // This will throw error if user is not Pro
  await requireProAccess()

  // Your analytics logic here
  return {
    views: 1500,
    conversions: 45,
    revenue: 2250,
  }
}

/**
 * Example: Export data (Pro only)
 */
export async function exportData() {
  await requireProAccess()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get all user's records
  const { data: records } = await supabase
    .from('records')
    .select('*')
    .eq('user_id', user.id)

  // Convert to CSV or other format
  return records
}
