import { supabase } from './supabase'

export type UserSettings = {
  id: string
  user_id: string
  gross_income: number | null
  red_line_amount: number | null
  currency: string
  theme: 'light' | 'dark'
}

export const userSettingsService = {
  async getForUser(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return data as UserSettings | null
  },

  async upsert(userId: string, input: {
    grossIncome: number | null
    redLineAmount: number | null
    currency: string
    theme?: 'light' | 'dark'
  }) {
    const payloadFull = {
      user_id: userId,
      gross_income: input.grossIncome,
      red_line_amount: input.redLineAmount,
      currency: input.currency,
      theme: input.theme,
    }
    
    // Fallback if columns are missing (for local dev / older DB state)
    const payloadMinimal = {
      user_id: userId,
      gross_income: input.grossIncome,
      currency: input.currency,
    }

    const run = (payload: any) =>
      supabase
        .from('user_settings')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()

    const { data, error } = await run(payloadFull)

    if (error) {
      const msg = error.message ?? ''
      // If red_line_amount or theme columns don't exist yet, try a safer payload
      const isMissingColumn = /column.*does not exist|unknown column/i.test(msg)
      
      if (isMissingColumn) {
        // Try removing red_line_amount and theme if they fail
        const payloadSafe = { ...payloadFull } as any
        if (msg.includes('red_line_amount')) delete payloadSafe.red_line_amount
        if (msg.includes('theme')) delete payloadSafe.theme
        
        const { data: data2, error: error2 } = await run(payloadSafe)
        if (error2) {
          // Final fallback to absolute minimum
          const { data: data3, error: error3 } = await run(payloadMinimal)
          if (error3) throw error3
          return data3 as UserSettings
        }
        return data2 as UserSettings
      }
      throw error
    }
    return data as UserSettings
  },
}

