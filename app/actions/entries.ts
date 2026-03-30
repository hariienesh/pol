'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type DisciplineType = 'merit' | 'teguran' | 'amaran_lisan' | 'surat_amaran' | 'suspension'

function getTable(type: DisciplineType) {
    switch (type) {
        case 'merit': return 'merits'
        case 'teguran': return 'tegurans'
        case 'amaran_lisan': return 'amaran_lisan'
        case 'surat_amaran': return 'surat_amaran'
        case 'suspension': return 'suspensions'
    }
}

function revalidateAll(prefectId: string) {
    revalidatePath('/')
    revalidatePath('/prefects')
    revalidatePath(`/prefects/${prefectId}`)
    revalidatePath('/entries')
}

export async function recordEntry(formData: FormData) {
    const supabase = await createClient()
    const prefectId = formData.get('prefectId') as string
    const type = formData.get('type') as DisciplineType
    const description = formData.get('description') as string
    const severity = formData.get('severity') as string | null
    const startDate = formData.get('start_date') as string | null
    const endDate = formData.get('end_date') as string | null
    const date = formData.get('date') as string

    const { data: { user } } = await supabase.auth.getUser()

    if (type === 'merit') {
        const { error } = await supabase.from('merits').insert({
            prefect_id: prefectId,
            date,
            description,
            recorded_by: user?.id,
        })
        if (error) return { error: error.message }

    } else if (type === 'teguran') {
        const { error } = await supabase.from('tegurans').insert({
            prefect_id: prefectId,
            date,
            description,
            severity: severity || 'ringan',
            recorded_by: user?.id,
        })
        if (error) return { error: error.message }

    } else if (type === 'amaran_lisan') {
        const { error } = await supabase.from('amaran_lisan').insert({
            prefect_id: prefectId,
            date,
            description,
            recorded_by: user?.id,
        })
        if (error) return { error: error.message }

    } else if (type === 'surat_amaran') {
        const { error: insertError } = await supabase.from('surat_amaran').insert({
            prefect_id: prefectId,
            date,
            description,
            recorded_by: user?.id,
        })
        if (insertError) return { error: insertError.message }

        // Check if 3+ surat_amaran → fire the prefect
        const { count } = await supabase
            .from('surat_amaran')
            .select('*', { count: 'exact', head: true })
            .eq('prefect_id', prefectId)

        if ((count ?? 0) >= 3) {
            await supabase.from('prefects').update({ status: 'dipecat' }).eq('id', prefectId)
        }

    } else if (type === 'suspension') {
        const { error } = await supabase.from('suspensions').insert({
            prefect_id: prefectId,
            start_date: startDate || date,
            end_date: endDate || date,
            reason: description,
            recorded_by: user?.id,
        })
        if (error) return { error: error.message }
    }

    revalidateAll(prefectId)
    return { success: true }
}

export async function deleteEntry(id: string, type: DisciplineType, prefectId: string) {
    const supabase = await createClient()
    const table = getTable(type)

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) return { error: error.message }

    // If we deleted a surat_amaran, check if we should un-fire the prefect
    if (type === 'surat_amaran') {
        const { count } = await supabase
            .from('surat_amaran')
            .select('*', { count: 'exact', head: true })
            .eq('prefect_id', prefectId)

        if ((count ?? 0) < 3) {
            await supabase.from('prefects').update({ status: 'active' }).eq('id', prefectId)
        }
    }

    revalidateAll(prefectId)
    return { success: true }
}
