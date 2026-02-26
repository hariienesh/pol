"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeIcon, AwardIcon, AlertTriangleIcon, ActivityIcon, UsersIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface OverviewProps {
    stats: {
        meritsThisMonth: number
        strikesThisMonth: number
        atRiskCount: number
        entriesToday: number
    }
    atRiskPrefects: any[]
    topPerformers: any[]
}

export function Overview({ stats, atRiskPrefects, topPerformers }: OverviewProps) {
    return (
        <Card className="col-span-4 overflow-hidden border-none shadow-xl bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Dashboard Overview</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Real-time performance metrics and team status.
                        </CardDescription>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            +5
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
                {/* Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total Merits",
                            value: stats.meritsThisMonth,
                            icon: AwardIcon,
                            color: "text-green-600 dark:text-green-400",
                            bg: "bg-green-50 dark:bg-green-950/30",
                            border: "border-green-100 dark:border-green-900/30"
                        },
                        {
                            label: "Total Strikes",
                            value: stats.strikesThisMonth,
                            icon: AlertTriangleIcon,
                            color: "text-red-600 dark:text-red-400",
                            bg: "bg-red-50 dark:bg-red-950/30",
                            border: "border-red-100 dark:border-red-900/30"
                        },
                        {
                            label: "At Risk",
                            value: stats.atRiskCount,
                            icon: UsersIcon,
                            color: "text-amber-600 dark:text-amber-400",
                            bg: "bg-amber-50 dark:bg-amber-950/30",
                            border: "border-amber-100 dark:border-amber-900/30"
                        },
                        {
                            label: "Today's Activity",
                            value: stats.entriesToday,
                            icon: ActivityIcon,
                            color: "text-blue-600 dark:text-blue-400",
                            bg: "bg-blue-50 dark:bg-blue-950/30",
                            border: "border-blue-100 dark:border-blue-900/30"
                        },
                    ].map((metric, i) => (
                        <div key={i} className={cn(
                            "flex flex-col gap-1 p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                            metric.bg,
                            metric.border
                        )}>
                            <div className="flex items-center justify-between">
                                <metric.icon className={cn("size-5", metric.color)} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Metric</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-bold tracking-tight">{metric.value}</span>
                                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{metric.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Tabs defaultValue="at-risk" className="space-y-4">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="at-risk">At Risk</TabsTrigger>
                        <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="at-risk" className="space-y-4">
                        <div className="rounded-md border bg-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-bold">Name</TableHead>
                                            <TableHead className="font-bold">Class</TableHead>
                                            <TableHead className="text-center font-bold">Strikes</TableHead>
                                            <TableHead className="text-right font-bold">Action</TableHead>
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
                                                        <Badge variant="destructive" className="font-bold px-3">
                                                            {prefect.strikes}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right px-4">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 rounded-full"
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
                                            <TableHead className="font-bold">Name</TableHead>
                                            <TableHead className="font-bold">Class</TableHead>
                                            <TableHead className="text-center font-bold">Merits</TableHead>
                                            <TableHead className="text-right font-bold">Action</TableHead>
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
                                                        <Badge className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 font-bold px-3">
                                                            {prefect.merits}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right px-4">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 rounded-full"
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
