import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PrefectDetailContent } from "./prefect-detail-content"

export default async function PrefectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // We split the query to make it more resilient. 
    // If the profiles table doesn't exist, the joins will fail the whole query.
    const { data: prefect, error: prefectError } = await supabase
        .from('prefects')
        .select(`id, name, class`)
        .eq('id', id)
        .single()

    if (prefectError || !prefect) {
        console.error("Error fetching prefect:", prefectError)
        notFound()
    }

    // Attempt to fetch merits and strikes with recorder info
    // We do these separately so if one fails (e.g. missing profiles table), we still show the prefect
    const { data: merits } = await supabase
        .from('merits')
        .select(`id, date, description, recorded_by:profiles(full_name)`)
        .eq('prefect_id', id)

    const { data: strikes } = await supabase
        .from('strikes')
        .select(`id, date, description, recorded_by:profiles(full_name)`)
        .eq('prefect_id', id)

    const allEntries = [
        ...(merits || []).map((m: any) => ({ ...m, type: 'merit' as const })),
        ...(strikes || []).map((s: any) => ({ ...s, type: 'strike' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const meritsCount = merits?.length || 0
    const strikesCount = strikes?.length || 0

    return (
        <PrefectDetailContent
            prefect={prefect}
            allEntries={allEntries}
            meritsCount={meritsCount}
            strikesCount={strikesCount}
        />
    )
}
