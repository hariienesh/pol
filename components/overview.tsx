"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeIcon, AwardIcon, AlertTriangleIcon, ActivityIcon, UsersIcon, CrownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type PrefectOfTheMonth = {
    id: string
    name: string
    class: string
    meritCount: number
}

interface OverviewProps {
    stats: {
        meritsThisMonth: number
        disciplineThisMonth: number
        atRiskCount: number
        entriesToday: number
    }
    atRiskPrefects: any[]
    topPerformers: any[]
    prefectOfTheMonth?: PrefectOfTheMonth | null
}

export function Overview({ stats, atRiskPrefects, topPerformers, prefectOfTheMonth }: OverviewProps) {
    return (
        <Card className="col-span-4 border-none shadow-sm bg-card">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-semibold tracking-tight">Dashboard Overview</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Real-time metrics and prefect standings.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0">
                {prefectOfTheMonth ? (
                    <Card className="mb-6 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl shrink-0">
                                    <CrownIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="space-y-1 text-center sm:text-left flex-1">
                                    <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100 flex items-center justify-center sm:justify-start gap-2">
                                        Prefect of the Month
                                    </h3>
                                    <p className="text-3xl font-bold">{prefectOfTheMonth.name}</p>
                                    <p className="text-muted-foreground">{prefectOfTheMonth.class} <span className="mx-2">•</span> {prefectOfTheMonth.meritCount} Merits this month</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-6">
                                        <Link href={`/prefects/${prefectOfTheMonth.id}`}>View Profile</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mb-6 border-dashed bg-muted/30 relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 opacity-70 grayscale">
                                <div className="p-3 bg-muted rounded-2xl shrink-0">
                                    <CrownIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1 text-center sm:text-left flex-1">
                                    <h3 className="font-semibold text-lg flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                                        Prefect of the Month
                                    </h3>
                                    <p className="text-xl font-medium italic text-muted-foreground">No records for this month yet</p>
                                    <p className="text-xs text-muted-foreground italic">Reward a prefect with merits to crown a winner!</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <Button asChild variant="outline" className="rounded-full px-6 border-dashed">
                                        <Link href="/prefects">Go to Prefects List</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Merits</CardTitle>
                            <AwardIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.meritsThisMonth}</div>
                            <p className="text-xs text-muted-foreground">Merits recorded this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Discipline Entries</CardTitle>
                            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.disciplineThisMonth}</div>
                            <p className="text-xs text-muted-foreground">Discipline records this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.atRiskCount}</div>
                            <p className="text-xs text-muted-foreground">Prefects facing suspension/dismissal</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.entriesToday}</div>
                            <p className="text-xs text-muted-foreground">Total records added today</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="at-risk" className="space-y-4">
                    <TabsList className="bg-muted">
                        <TabsTrigger value="at-risk">Dalam Risiko (At Risk)</TabsTrigger>
                        <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="at-risk" className="space-y-4">
                        <div className="rounded-md border bg-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead className="text-center">Surat Amaran</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {atRiskPrefects.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                                    No prefects currently at risk.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            atRiskPrefects.map((prefect) => (
                                                <TableRow key={prefect.id}>
                                                    <TableCell className="font-medium whitespace-nowrap">{prefect.name}</TableCell>
                                                    <TableCell className="text-muted-foreground whitespace-nowrap">{prefect.class}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="destructive" className="font-bold px-2">
                                                            {prefect.suratAmaranCount}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-4">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-full"
                                                            nativeButton={false}
                                                            render={
                                                                <Link href={`/prefects/${prefect.id}`} />
                                                            }
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="top-performers" className="space-y-4">
                        <div className="rounded-md border bg-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead className="text-center">Merits</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topPerformers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                                    No performance data available.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            topPerformers.map((prefect) => (
                                                <TableRow key={prefect.id}>
                                                    <TableCell className="font-medium whitespace-nowrap">{prefect.name}</TableCell>
                                                    <TableCell className="text-muted-foreground whitespace-nowrap">{prefect.class}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 font-bold px-2">
                                                            {prefect.meritsCount}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-4">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-full"
                                                            nativeButton={false}
                                                            render={
                                                                <Link href={`/prefects/${prefect.id}`} />
                                                            }
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
