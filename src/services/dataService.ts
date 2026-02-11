import { supabase } from './supabase'

/**
 * Deletes all app data for a user (transactions, budgets, savings, categories, settings).
 * Does not delete the auth account. Order respects foreign keys.
 */
export async function clearAllUserData(userId: string): Promise<void> {
  // Order: savings_goals (CASCADE removes savings_contributions), budgets, transactions, categories, user_settings
  const { error: e1 } = await supabase.from('savings_goals').delete().eq('user_id', userId)
  if (e1) throw e1

  const { error: e2 } = await supabase.from('budgets').delete().eq('user_id', userId)
  if (e2) throw e2

  const { error: e3 } = await supabase.from('transactions').delete().eq('user_id', userId)
  if (e3) throw e3

  const { error: e4 } = await supabase.from('categories').delete().eq('user_id', userId)
  if (e4) throw e4

  const { error: e5 } = await supabase.from('user_settings').delete().eq('user_id', userId)
  if (e5) throw e5
}
