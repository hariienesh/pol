import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function RecentEntriesPage() {
    const supabase = await createClient()

    // Fetch all discipline types in parallel
    const [meritsRes, teguransRes, amaranLisanRes, suratAmaranRes, suspensionsRes] = await Promise.all([
        supabase.from('merits')
            .select(`id, date, description, prefects(name, class), recorded_by:profiles(full_name)`),
        supabase.from('tegurans')
            .select(`id, date, description, severity, prefects(name, class), recorded_by:profiles(full_name)`),
        supabase.from('amaran_lisan')
            .select(`id, date, description, prefects(name, class), recorded_by:profiles(full_name)`),
        supabase.from('surat_amaran')
            .select(`id, date, description, prefects(name, class), recorded_by:profiles(full_name)`),
        supabase.from('suspensions')
            .select(`id, start_date, end_date, reason, prefects(name, class), recorded_by:profiles(full_name)`),
    ])

    const merits = meritsRes.data || []
    const tegurans = teguransRes.data || []
    const amaranLisan = amaranLisanRes.data || []
    const suratAmaran = suratAmaranRes.data || []
    const suspensions = suspensionsRes.data || []

    const allEntries = [
        ...merits.map(m => ({ ...m, type: 'merit' as const })),
        ...tegurans.map(t => ({ ...t, type: 'teguran' as const })),
        ...amaranLisan.map(a => ({ ...a, type: 'amaran_lisan' as const })),
        ...suratAmaran.map(s => ({ ...s, type: 'surat_amaran' as const })),
        ...suspensions.map(s => ({ ...s, type: 'suspension' as const, date: s.start_date })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Activity Feed</CardTitle>
                    <CardDescription>Complete historical ledger of all merits and discipline actions</CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px] px-4">Type</TableHead>
                                    <TableHead>Prefect</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Recorder</TableHead>
                                    <TableHead className="px-4">Details</TableHead>
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
                                        <TableRow key={`${entry.type}-${entry.id}`}>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                {entry.type === "merit" && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 border-none font-medium">Merit</Badge>
                                                )}
                                                {entry.type === "teguran" && (
                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-400 border-none font-medium">Teguran</Badge>
                                                )}
                                                {entry.type === "amaran_lisan" && (
                                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 border-none font-medium">Amaran Lisan</Badge>
                                                )}
                                                {entry.type === "surat_amaran" && (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 border-none font-medium">Surat Amaran</Badge>
                                                )}
                                                {entry.type === "suspension" && (
                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 border-none font-medium">Tangguhan</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium py-4 whitespace-nowrap">{(entry.prefects as any)?.name}</TableCell>
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
                                                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                                        {(entry as any).recorded_by?.full_name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="text-sm">
                                                        {(entry as any).recorded_by?.full_name || "Unknown"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-4 text-muted-foreground">
                                                {entry.type === "teguran" && (
                                                    <span className="font-medium capitalize text-foreground mr-1">
                                                        [{entry.severity}]
                                                    </span>
                                                )}
                                                {entry.type === "suspension" && (
                                                    <span className="font-medium text-foreground mr-1">
                                                        [{new Date(entry.start_date).toLocaleDateString()} to {new Date(entry.end_date).toLocaleDateString()}]
                                                    </span>
                                                )}
                                                {'description' in entry ? entry.description : entry.reason}
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
