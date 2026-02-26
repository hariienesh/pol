'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function recordEntry(formData: FormData) {
    const supabase = await createClient()

    const prefectId = formData.get('prefectId') as string
    const type = formData.get('type') as 'merit' | 'strike'
    const date = formData.get('date') as string
    const description = formData.get('description') as string

    // Get current user for recorded_by
    const { data: { user } } = await supabase.auth.getUser()

    const table = type === 'merit' ? 'merits' : 'strikes'

    const { error } = await supabase
        .from(table)
        .insert({
            prefect_id: prefectId,
            date,
            description,
            recorded_by: user?.id
        })

    if (error) {
        console.error(`Error recording ${type}:`, error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/prefects')
    revalidatePath(`/prefects/${prefectId}`)
    revalidatePath('/entries')

    return { success: true }
}

export async function deleteEntry(id: string, type: 'merit' | 'strike', prefectId: string) {
    const supabase = await createClient()
    const table = type === 'merit' ? 'merits' : 'strikes'

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

    if (error) {
        console.error(`Error deleting ${type}:`, error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/prefects')
    revalidatePath(`/prefects/${prefectId}`)
    revalidatePath('/entries')

    return { success: true }
}
