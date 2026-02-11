import { supabase } from './supabase'

export type TransactionType = 'income' | 'expense'

export type Category = {
  id: string
  user_id: string
  name: string
  type: TransactionType
  budget_limit: number | null
  color: string
}

// Unique categories: one entry per (name, type). No duplicates.
const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id'>[] = [
  // Income
  { name: 'Salary', type: 'income', budget_limit: null, color: '#059669' },
  { name: 'Freelance', type: 'income', budget_limit: null, color: '#10b981' },
  { name: 'Bonus', type: 'income', budget_limit: null, color: '#0d9488' },
  { name: 'Investments', type: 'income', budget_limit: null, color: '#34d399' },
  { name: 'Rental Income', type: 'income', budget_limit: null, color: '#6ee7b7' },
  { name: 'Side Hustle', type: 'income', budget_limit: null, color: '#5eead4' },
  { name: 'Gifts Received', type: 'income', budget_limit: null, color: '#a7f3d0' },
  { name: 'Refunds', type: 'income', budget_limit: null, color: '#86efac' },
  { name: 'Interest & Dividends', type: 'income', budget_limit: null, color: '#4ade80' },
  { name: 'Other Income', type: 'income', budget_limit: null, color: '#bbf7d0' },
  // Expense
  { name: 'Uncategorized', type: 'expense', budget_limit: null, color: '#64748b' },
  { name: 'Food & Dining', type: 'expense', budget_limit: null, color: '#f59e0b' },
  { name: 'Groceries', type: 'expense', budget_limit: null, color: '#fbbf24' },
  { name: 'Transport', type: 'expense', budget_limit: null, color: '#3b82f6' },
  { name: 'Bills & Utilities', type: 'expense', budget_limit: null, color: '#8b5cf6' },
  { name: 'Rent / Mortgage', type: 'expense', budget_limit: null, color: '#a855f7' },
  { name: 'Shopping', type: 'expense', budget_limit: null, color: '#ec4899' },
  { name: 'Healthcare', type: 'expense', budget_limit: null, color: '#06b6d4' },
  { name: 'Insurance', type: 'expense', budget_limit: null, color: '#0ea5e9' },
  { name: 'Entertainment', type: 'expense', budget_limit: null, color: '#eab308' },
  { name: 'Personal Care', type: 'expense', budget_limit: null, color: '#f97316' },
  { name: 'Subscriptions', type: 'expense', budget_limit: null, color: '#c084fc' },
  { name: 'Education', type: 'expense', budget_limit: null, color: '#14b8a6' },
  { name: 'Travel', type: 'expense', budget_limit: null, color: '#f43f5e' },
  { name: 'Charity & Donations', type: 'expense', budget_limit: null, color: '#e11d48' },
  { name: 'Kids & Family', type: 'expense', budget_limit: null, color: '#db2777' },
  { name: 'Pets', type: 'expense', budget_limit: null, color: '#ca8a04' },
  { name: 'Other Expense', type: 'expense', budget_limit: null, color: '#94a3b8' },
]

export const categoryService = {
  async list(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('type')
      .order('name')
    if (error) throw error
    const rows = (data ?? []) as Category[]
    // Deduplicate by (type, name) so dropdown never shows repeated categories
    const seen = new Map<string, Category>()
    rows.forEach((c) => {
      const key = `${c.type}:${c.name}`
      if (!seen.has(key)) seen.set(key, c)
    })
    return Array.from(seen.values())
  },

  async ensureDefaults(userId: string): Promise<Category[]> {
    const existing = await this.list(userId)
    if (existing.length > 0) return existing
    const toInsert = DEFAULT_CATEGORIES.map((c) => ({
      user_id: userId,
      name: c.name,
      type: c.type,
      budget_limit: c.budget_limit,
      color: c.color,
    }))
    const { data, error } = await supabase
      .from('categories')
      .insert(toInsert)
      .select()
    if (error) throw error
    return (data ?? []) as Category[]
  },

  async getUncategorizedId(userId: string): Promise<string> {
    const categories = await this.ensureDefaults(userId)
    const uncategorized = categories.find((c) => c.name === 'Uncategorized' && c.type === 'expense')
    if (uncategorized) return uncategorized.id
    return categories[0]?.id ?? ''
  },
}
