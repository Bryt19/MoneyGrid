import { supabase } from './supabase'

export type SavingsGoal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
}

export const savingsService = {
  async list(userId: string) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as SavingsGoal[]
  },

  async create(input: {
    userId: string
    name: string
    targetAmount: number
    deadline?: string | null
  }) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{
        user_id: input.userId,
        name: input.name,
        target_amount: input.targetAmount,
        current_amount: 0,
        deadline: input.deadline ?? null,
      }])
      .select()
      .single()
    if (error) throw error
    return data as SavingsGoal
  },

  async update(id: string, input: { name?: string; targetAmount?: number; currentAmount?: number; deadline?: string | null }) {
    const body: Record<string, unknown> = {}
    if (input.name != null) body.name = input.name
    if (input.targetAmount != null) body.target_amount = input.targetAmount
    if (input.currentAmount != null) body.current_amount = input.currentAmount
    if (input.deadline !== undefined) body.deadline = input.deadline
    const { data, error } = await supabase.from('savings_goals').update(body).eq('id', id).select().single()
    if (error) throw error
    return data as SavingsGoal
  },

  async delete(id: string) {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (error) throw error
  },
}
