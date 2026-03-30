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
            status,
            merits:merits(count),
            tegurans:tegurans(count),
            amaran_lisan:amaran_lisan(count),
            surat_amaran:surat_amaran(count)
        `)

    const prefects = (prefectsData || []).map((p: any) => ({
        ...p,
        merits: p.merits?.[0]?.count || 0,
        tegurans: p.tegurans?.[0]?.count || 0,
        amaran_lisan: p.amaran_lisan?.[0]?.count || 0,
        surat_amaran: p.surat_amaran?.[0]?.count || 0,
    }))

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PrefectsListContent initialPrefects={prefects} />
        </div>
    )
}
