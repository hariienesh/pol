import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PrefectDetailContent } from "./prefect-detail-content"

export default async function PrefectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: prefect, error: prefectError } = await supabase
        .from('prefects')
        .select(`id, name, class, status`)
        .eq('id', id)
        .single()

    if (prefectError || !prefect) {
        console.error("Error fetching prefect:", prefectError)
        notFound()
    }

    // Fetch all discipline types with recorder info
    const [meritsRes, teguransRes, amaranLisanRes, suratAmaranRes, suspensionsRes] = await Promise.all([
        supabase.from('merits')
            .select(`id, date, description, recorded_by:profiles(full_name)`)
            .eq('prefect_id', id),
        supabase.from('tegurans')
            .select(`id, date, description, severity, recorded_by:profiles(full_name)`)
            .eq('prefect_id', id),
        supabase.from('amaran_lisan')
            .select(`id, date, description, recorded_by:profiles(full_name)`)
            .eq('prefect_id', id),
        supabase.from('surat_amaran')
            .select(`id, date, description, recorded_by:profiles(full_name)`)
            .eq('prefect_id', id),
        supabase.from('suspensions')
            .select(`id, start_date, end_date, reason, recorded_by:profiles(full_name)`)
            .eq('prefect_id', id),
    ])

    const merits = meritsRes.data || []
    const tegurans = teguransRes.data || []
    const amaranLisan = amaranLisanRes.data || []
    const suratAmaran = suratAmaranRes.data || []
    const suspensions = suspensionsRes.data || []

    const allEntries = [
        ...merits.map((m: any) => ({ ...m, type: 'merit' as const })),
        ...tegurans.map((t: any) => ({ ...t, type: 'teguran' as const })),
        ...amaranLisan.map((a: any) => ({ ...a, type: 'amaran_lisan' as const })),
        ...suratAmaran.map((s: any) => ({ ...s, type: 'surat_amaran' as const })),
        ...suspensions.map((s: any) => ({ ...s, type: 'suspension' as const })),
    ].sort((a, b) => {
        const dateA = (a as any).date || (a as any).start_date
        const dateB = (b as any).date || (b as any).start_date
        return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    // Determine active suspension (today falls within start_date..end_date)
    const today = new Date().toISOString().split('T')[0]
    const activeSuspension = suspensions.find((s: any) =>
        s.start_date <= today && s.end_date >= today
    ) || null

    return (
        <PrefectDetailContent
            prefect={prefect}
            allEntries={allEntries}
            meritsCount={merits.length}
            teguransCount={tegurans.length}
            amaranLisanCount={amaranLisan.length}
            suratAmaranCount={suratAmaran.length}
            activeSuspension={activeSuspension}
        />
    )
}
