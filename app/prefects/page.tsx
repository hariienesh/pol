import { createClient } from "@/lib/supabase/server"
import { PrefectsListContent } from "@/app/prefects/prefects-list-content"

export default async function PrefectsListPage() {
    const supabase = await createClient()

    const { data: prefectsData } = await supabase
        .from('prefects')
        .select(`
            id,
            name,
            class,
            merits:merits(count),
            strikes:strikes(count)
        `)

    const prefects = (prefectsData || []).map((p: any) => ({
        ...p,
        merits: p.merits?.[0]?.count || 0,
        strikes: p.strikes?.[0]?.count || 0
    }))

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PrefectsListContent initialPrefects={prefects} />
        </div>
    )
}
