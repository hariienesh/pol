import { Overview } from "@/components/overview"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
    const supabase = await createClient()

    // Fetch prefects and their new discipline counts
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

    const { count: meritsCount } = await supabase
        .from('merits')
        .select('*', { count: 'exact', head: true })

    // Total discipline entries this month (can aggregate all if needed, here we just do a sum from prefects for simplicity, or we do separate counts)
    const [teguransRes, amaranLisanRes, suratAmaranRes, suspensionsRes] = await Promise.all([
        supabase.from('tegurans').select('*', { count: 'exact', head: true }),
        supabase.from('amaran_lisan').select('*', { count: 'exact', head: true }),
        supabase.from('surat_amaran').select('*', { count: 'exact', head: true }),
        supabase.from('suspensions').select('*', { count: 'exact', head: true }),
    ])

    const totalDiscipline =
        (teguransRes.count || 0) +
        (amaranLisanRes.count || 0) +
        (suratAmaranRes.count || 0) +
        (suspensionsRes.count || 0)

    const prefects = (prefectsData || []).map((p: any) => ({
        ...p,
        meritsCount: p.merits?.[0]?.count || 0,
        teguransCount: p.tegurans?.[0]?.count || 0,
        amaranLisanCount: p.amaran_lisan?.[0]?.count || 0,
        suratAmaranCount: p.surat_amaran?.[0]?.count || 0,
    }))

    const today = new Date().toISOString().split('T')[0]

    // Calculate start of current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const monthStartStr = startOfMonth.toISOString().split('T')[0]

    const [todayMerits, todayTegurans, todayAmaranLisan, todaySuratAmaran, todaySuspensions, monthlyMeritsData] = await Promise.all([
        supabase.from('merits').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('tegurans').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('amaran_lisan').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('surat_amaran').select('*', { count: 'exact', head: true }).eq('date', today),
        supabase.from('suspensions').select('*', { count: 'exact', head: true }).gte('start_date', today).lte('start_date', today),
        supabase.from('merits').select('prefect_id').gte('date', monthStartStr)
    ])

    const entriesToday =
        (todayMerits.count || 0) +
        (todayTegurans.count || 0) +
        (todayAmaranLisan.count || 0) +
        (todaySuratAmaran.count || 0) +
        (todaySuspensions.count || 0)

    // Calculate Prefect of the Month
    const monthlyMeritsCount: Record<string, number> = {}
    if (monthlyMeritsData.data) {
        monthlyMeritsData.data.forEach((m) => {
            monthlyMeritsCount[m.prefect_id] = (monthlyMeritsCount[m.prefect_id] || 0) + 1
        })
    }

    let topPrefectId: string | null = null
    let maxMerits = 0
    Object.entries(monthlyMeritsCount).forEach(([id, count]) => {
        if (count > maxMerits) {
            maxMerits = count
            topPrefectId = id
        }
    })

    let prefectOfTheMonth = null
    if (topPrefectId) {
        const p = prefects.find((p: any) => p.id === topPrefectId)
        if (p && p.status !== 'dipecat') {
            prefectOfTheMonth = {
                id: p.id,
                name: p.name,
                class: p.class,
                meritCount: maxMerits
            }
        }
    }

    const atRiskPrefects = prefects
        .filter(p => p.suratAmaranCount > 0 && p.status !== 'dipecat')

    const stats = {
        meritsThisMonth: meritsCount || 0,
        disciplineThisMonth: totalDiscipline,
        atRiskCount: atRiskPrefects.length,
        entriesToday: entriesToday
    }

    const topPerformers = [...prefects]
        .sort((a, b) => b.meritsCount - a.meritsCount)
        .slice(0, 5)

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <Overview
                    stats={stats}
                    atRiskPrefects={atRiskPrefects}
                    topPerformers={topPerformers}
                    prefectOfTheMonth={prefectOfTheMonth}
                />
            </div>
        </div>
    )
}