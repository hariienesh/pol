import { Overview } from "@/components/overview"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
    const supabase = await createClient()

    // Fetch counts for SectionCards and Overview
    const { data: prefectsData } = await supabase
        .from('prefects')
        .select(`
            id,
            name,
            class,
            merits:merits(count),
            strikes:strikes(count)
        `)

    const { count: meritsCount } = await supabase
        .from('merits')
        .select('*', { count: 'exact', head: true })

    const { count: strikesCount } = await supabase
        .from('strikes')
        .select('*', { count: 'exact', head: true })

    const prefects = (prefectsData || []).map((p: any) => ({
        ...p,
        meritsCount: p.merits?.[0]?.count || 0,
        strikesCount: p.strikes?.[0]?.count || 0
    }))

    const today = new Date().toISOString().split('T')[0]

    const [{ count: todayMerits }, { count: todayStrikes }] = await Promise.all([
        supabase.from('merits').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('strikes').select('*', { count: 'exact', head: true }).eq('date', today)
    ])

    const stats = {
        meritsThisMonth: meritsCount || 0,
        strikesThisMonth: strikesCount || 0,
        atRiskCount: prefects.filter(p => p.strikesCount >= 3).length,
        entriesToday: (todayMerits || 0) + (todayStrikes || 0)
    }

    const atRiskPrefects = prefects
        .filter(p => p.strikesCount >= 3)
        .map(p => ({ id: p.id, name: p.name, class: p.class, strikes: p.strikesCount }))

    const topPerformers = [...prefects]
        .sort((a, b) => b.meritsCount - a.meritsCount)
        .slice(0, 5)
        .map(p => ({ id: p.id, name: p.name, class: p.class, merits: p.meritsCount }))

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <Overview
                    stats={stats}
                    atRiskPrefects={atRiskPrefects}
                    topPerformers={topPerformers}
                />
            </div>
        </div>
    )
}