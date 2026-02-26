"use client"

import * as React from "react"
import { AwardIcon, AlertTriangleIcon, GraduationCapIcon, CalendarIcon, PlusIcon, InfoIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RecordEntryDialog } from "@/components/record-entry-dialog"

interface PrefectDetailContentProps {
    prefect: {
        id: string
        name: string
        class: string
    }
    allEntries: any[]
    meritsCount: number
    strikesCount: number
}

export function PrefectDetailContent({
    prefect,
    allEntries,
    meritsCount,
    strikesCount
}: PrefectDetailContentProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [actionType, setActionType] = React.useState<"merit" | "strike" | null>(null)

    const handleActionClick = (type: "merit" | "strike") => {
        setActionType(type)
        setDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-6xl mx-auto w-full">
            {/* Header Profile Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-card border rounded-xl p-6 shadow-sm">
                <div className="shrink-0">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <GraduationCapIcon className="size-12 text-primary" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {prefect.name}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center text-sm">
                        <Badge variant="outline" className="font-semibold px-2.5 py-0.5">
                            Class {prefect.class}
                        </Badge>
                        <Badge variant={strikesCount >= 3 ? "destructive" : "secondary"} className="font-semibold">
                            {strikesCount >= 3 ? "At Risk" : "Good Standing"}
                        </Badge>
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <CalendarIcon className="size-3.5" />
                            Last Entry: {allEntries.length > 0 ? new Date(allEntries[0].date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No Record'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-lg px-4 py-3 text-center min-w-[100px]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-green-700/70 dark:text-green-400/70 mb-1">Merits</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">{meritsCount}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-lg px-4 py-3 text-center min-w-[100px]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-700/70 dark:text-red-400/70 mb-1">Strikes</div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">{strikesCount}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Actions Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>Record new merit or strike</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => handleActionClick("merit")}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Record Merit
                            </Button>
                            <Button
                                onClick={() => handleActionClick("strike")}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Record Strike
                            </Button>

                            <div className="pt-2">
                                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                                    <InfoIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <p>
                                        Prefects with 3 or more strikes are automatically flagged for review.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main History Table */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                            <CardDescription>Historical ledger for this prefect</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 border-t">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] font-bold px-4 border-b whitespace-nowrap">Type</TableHead>
                                            <TableHead className="font-bold border-b whitespace-nowrap">Date</TableHead>
                                            <TableHead className="font-bold border-b whitespace-nowrap">Recorder</TableHead>
                                            <TableHead className="font-bold px-4 border-b whitespace-nowrap">Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allEntries.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                                    No activity found for this prefect.
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
                                                    <TableCell className="text-sm py-4">
                                                        {new Date(entry.date).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                {entry.recorded_by?.full_name?.charAt(0) || "U"}
                                                            </div>
                                                            <span className="text-xs font-medium">
                                                                {entry.recorded_by?.full_name || "Unknown"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 text-sm text-muted-foreground py-4">
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
            </div>

            <RecordEntryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                prefect={prefect}
                type={actionType}
            />
        </div>
    )
}
