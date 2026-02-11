import { supabase } from './supabase'

export type UserSettings = {
  id: string
  user_id: string
  gross_income: number | null
  red_line_amount: number | null
  currency: string
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
  }) {
    const payloadWithRedLine = {
      user_id: userId,
      gross_income: input.grossIncome,
      red_line_amount: input.redLineAmount,
      currency: input.currency,
    }
    const payloadWithoutRedLine = {
      user_id: userId,
      gross_income: input.grossIncome,
      currency: input.currency,
    }

    const run = (payload: typeof payloadWithRedLine) =>
      supabase
        .from('user_settings')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()

    const { data, error } = await run(payloadWithRedLine)

    if (error) {
      const msg = error.message ?? ''
      const looksLikeMissingColumn =
        /red_line_amount|column.*does not exist|unknown column/i.test(msg)
      if (looksLikeMissingColumn) {
        const { data: data2, error: error2 } = await run(payloadWithoutRedLine as any)
        if (error2) throw error2
        return data2 as UserSettings
      }
      throw error
    }
    return data as UserSettings
  },
}

