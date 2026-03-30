import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CrownIcon, TrophyIcon, CalendarIcon, AwardIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Winner = {
    monthKey: string
    date: Date
    prefect: {
        id: string
        name: string
        class: string
    }
    meritCount: number
}

export default async function HallOfFamePage() {
    const supabase = await createClient()

    // 1. Fetch data
    const [meritsRes, prefectsRes] = await Promise.all([
        supabase.from('merits').select('prefect_id, date'),
        supabase.from('prefects').select('id, name, class, status')
    ])

    const merits = meritsRes.data || []
    const prefects = prefectsRes.data || []

    // 2. Aggregate merits by YYYY-MM and then prefect_id
    const monthlyData: Record<string, Record<string, number>> = {}

    merits.forEach(merit => {
        if (!merit.date || !merit.prefect_id) return
        // Extract YYYY-MM
        const monthKey = merit.date.substring(0, 7)
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {}
        }
        monthlyData[monthKey][merit.prefect_id] = (monthlyData[monthKey][merit.prefect_id] || 0) + 1
    })

    // 3. Find the winner for each month
    const winners: Winner[] = []

    Object.entries(monthlyData).forEach(([monthKey, counts]) => {
        let topPrefectId: string | null = null
        let maxMerits = 0

        Object.entries(counts).forEach(([id, count]) => {
            if (count > maxMerits) {
                maxMerits = count
                topPrefectId = id
            }
        })

        if (topPrefectId) {
            const prefect = prefects.find(p => p.id === topPrefectId)
            // exclude dipecat prefects if needed, or keep them for historical accuracy. History should remain accurate.
            if (prefect) {
                // Determine a safe date for parsing timezone issues
                const dateObj = new Date(`${monthKey}-01T12:00:00Z`)
                winners.push({
                    monthKey,
                    date: dateObj,
                    prefect,
                    meritCount: maxMerits
                })
            }
        }
    })

    // Sort newest to oldest
    winners.sort((a, b) => b.monthKey.localeCompare(a.monthKey))

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-amber-600 flex items-center gap-3">
                        <TrophyIcon className="h-8 w-8" />
                        Hall of Fame
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Honoring the top performing prefects of each month.
                    </p>
                </div>
            </div>

            {winners.length === 0 ? (
                <Card className="border-dashed bg-muted/30">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center opacity-70 grayscale">
                        <div className="p-4 bg-muted rounded-full mb-4 shrink-0">
                            <AwardIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No Records Yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                            The Hall of Fame is currently empty. Record merits for prefects to crown your very first winner!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {winners.map((winner, index) => {
                        const isLatest = index === 0;

                        return (
                            <Card
                                key={winner.monthKey}
                                className={isLatest ?
                                    "bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-900/50 relative overflow-hidden shadow-md ring-1 ring-amber-500/20" :
                                    "transition-all hover:shadow-md"
                                }
                            >
                                {isLatest && (
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                )}

                                <CardHeader className="pb-3 border-b border-border/50 relative z-10 flex flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4" />
                                        {format(winner.date, "MMMM yyyy")}
                                    </div>
                                    {isLatest && (
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded-full">
                                            Reigning
                                        </span>
                                    )}
                                </CardHeader>

                                <CardContent className="p-6 relative z-10">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`p-3 rounded-2xl shrink-0 ${isLatest ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-muted'}`}>
                                            <CrownIcon className={`w-8 h-8 ${isLatest ? 'text-amber-600 dark:text-amber-400' : 'text-foreground/70'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-xl line-clamp-2 leading-tight">
                                                {winner.prefect.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm font-medium">Class {winner.prefect.class}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Merits</span>
                                            <span className={`text-2xl font-black ${isLatest ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                                                {winner.meritCount}
                                            </span>
                                        </div>

                                        <Button asChild variant={isLatest ? "default" : "outline"} className={isLatest ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}>
                                            <Link href={`/prefects/${winner.prefect.id}`}>Profile</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
