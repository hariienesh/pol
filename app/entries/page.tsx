import { createClient } from "@/lib/supabase/server"
import { AwardIcon, AlertTriangleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function RecentEntriesPage() {
    const supabase = await createClient()

    // Fetch merits and strikes separately. 
    // We attempt the join with profiles, but if it fails, we fetch without it.
    let merits: any[] = []
    let strikes: any[] = []

    const { data: meritsData, error: meritsError } = await supabase
        .from('merits')
        .select(`
            id,
            date,
            description,
            prefects(name, class),
            recorded_by:profiles(full_name)
        `)
        .order('date', { ascending: false })

    if (meritsError) {
        // Fallback without profiles if join fails
        const { data: fallback } = await supabase
            .from('merits')
            .select(`id, date, description, prefects(name, class)`)
            .order('date', { ascending: false })
        merits = fallback || []
    } else {
        merits = meritsData || []
    }

    const { data: strikesData, error: strikesError } = await supabase
        .from('strikes')
        .select(`
            id,
            date,
            description,
            prefects(name, class),
            recorded_by:profiles(full_name)
        `)
        .order('date', { ascending: false })

    if (strikesError) {
        // Fallback without profiles
        const { data: fallback } = await supabase
            .from('strikes')
            .select(`id, date, description, prefects(name, class)`)
            .order('date', { ascending: false })
        strikes = fallback || []
    } else {
        strikes = strikesData || []
    }

    const allEntries = [
        ...merits.map(m => ({ ...m, type: 'merit' as const })),
        ...strikes.map(s => ({ ...s, type: 'strike' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                    <CardDescription>Complete historical ledger of merits and strikes</CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] font-bold px-4 whitespace-nowrap">Type</TableHead>
                                    <TableHead className="font-bold whitespace-nowrap">Prefect</TableHead>
                                    <TableHead className="font-bold whitespace-nowrap">Class</TableHead>
                                    <TableHead className="font-bold whitespace-nowrap">Date</TableHead>
                                    <TableHead className="font-bold whitespace-nowrap">Recorder</TableHead>
                                    <TableHead className="font-bold px-4 whitespace-nowrap">Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allEntries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                            The ledger is currently empty.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    allEntries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell className="px-4 py-4">
                                                {entry.type === "merit" ? (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 border-none font-bold">
                                                        MERIT
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 border-none font-bold">
                                                        STRIKE
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-bold py-4 whitespace-nowrap">{(entry.prefects as any)?.name}</TableCell>
                                            <TableCell className="text-muted-foreground py-4 whitespace-nowrap">{(entry.prefects as any)?.class}</TableCell>
                                            <TableCell className="whitespace-nowrap py-4">
                                                {new Date(entry.date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {(entry as any).recorded_by?.full_name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {(entry as any).recorded_by?.full_name || "Unknown"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate py-4 px-4 text-muted-foreground">
                                                {entry.description}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
