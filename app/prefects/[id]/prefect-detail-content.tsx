"use client"

import * as React from "react"
import {
    AwardIcon, AlertTriangleIcon, GraduationCapIcon, CalendarIcon,
    PlusIcon, InfoIcon, VolumeXIcon, MailWarningIcon, BanIcon,
    ChevronDownIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { RecordEntryDialog, type DisciplineType } from "@/components/record-entry-dialog"

interface PrefectDetailContentProps {
    prefect: {
        id: string
        name: string
        class: string
        status: string
    }
    allEntries: any[]
    meritsCount: number
    teguransCount: number
    amaranLisanCount: number
    suratAmaranCount: number
    activeSuspension: any | null
}

type EntryType = "merit" | "teguran" | "amaran_lisan" | "surat_amaran" | "suspension"

function getEntryBadge(type: EntryType, severity?: string) {
    switch (type) {
        case "merit":
            return (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 border-none font-bold">
                    MERIT
                </Badge>
            )
        case "teguran":
            return (
                <Badge variant="secondary" className={cn(
                    "border-none font-bold",
                    severity === "serius"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                        : severity === "sederhana"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                )}>
                    TEGURAN {severity ? `(${severity.toUpperCase()})` : ""}
                </Badge>
            )
        case "amaran_lisan":
            return (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 border-none font-bold">
                    AMARAN LISAN
                </Badge>
            )
        case "surat_amaran":
            return (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 border-none font-bold">
                    SURAT AMARAN
                </Badge>
            )
        case "suspension":
            return (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 border-none font-bold">
                    TANGGUHAN
                </Badge>
            )
    }
}

function getStandingBadge(suratAmaranCount: number, status: string) {
    if (status === "dipecat") {
        return <Badge variant="destructive" className="font-bold">Dipecat</Badge>
    }
    if (suratAmaranCount >= 2) {
        return <Badge className="bg-orange-500 text-white font-bold hover:bg-orange-600">Dalam Risiko</Badge>
    }
    if (suratAmaranCount >= 1) {
        return <Badge className="bg-amber-500 text-white font-bold hover:bg-amber-600">Amaran</Badge>
    }
    return <Badge className="bg-green-500 text-white font-bold hover:bg-green-600">Good Standing</Badge>
}

export function PrefectDetailContent({
    prefect,
    allEntries,
    meritsCount,
    teguransCount,
    amaranLisanCount,
    suratAmaranCount,
    activeSuspension,
}: PrefectDetailContentProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [actionType, setActionType] = React.useState<DisciplineType | null>(null)

    const isDipecat = prefect.status === "dipecat"

    const handleActionClick = (type: DisciplineType) => {
        setActionType(type)
        setDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto w-full">
            {/* Header Profile Section */}
            <Card className="flex flex-col md:flex-row gap-6 items-center border-none shadow-sm bg-card rounded-xl p-6 mb-6">
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
                        {getStandingBadge(suratAmaranCount, prefect.status)}
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <CalendarIcon className="size-3.5" />
                            Last Entry: {allEntries.length > 0
                                ? new Date(allEntries[0].date || allEntries[0].start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                : 'No Record'}
                        </span>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-lg px-3 py-2 text-center min-w-[72px]">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-green-700/70 dark:text-green-400/70 mb-1">Merits</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">{meritsCount}</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-lg px-3 py-2 text-center min-w-[72px]">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70 mb-1">Teguran</div>
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{teguransCount}</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-lg px-3 py-2 text-center min-w-[72px]">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-orange-700/70 dark:text-orange-400/70 mb-1">A. Lisan</div>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{amaranLisanCount}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-lg px-3 py-2 text-center min-w-[72px]">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-red-700/70 dark:text-red-400/70 mb-1">S. Amaran</div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">{suratAmaranCount}</div>
                    </div>
                </div>
                {activeSuspension && (
                    <p className="text-sm text-purple-700 dark:text-purple-400 mt-4">
                        <span className="font-semibold">Tangguhan Aktif:</span> {new Date(activeSuspension.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {" → "}
                        {new Date(activeSuspension.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {" — "}{activeSuspension.reason}
                    </p>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Actions Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>Record a merit or disciplinary action</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => handleActionClick("merit")}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                                disabled={isDipecat}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Record Merit
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    disabled={isDipecat}
                                    render={
                                        <Button
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                                        >
                                            <AlertTriangleIcon className="mr-2 h-4 w-4" />
                                            Tindakan Disiplin
                                            <ChevronDownIcon className="ml-auto h-4 w-4" />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent className="w-52">
                                    <DropdownMenuItem onClick={() => handleActionClick("teguran")}>
                                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                        Teguran
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick("amaran_lisan")}>
                                        <VolumeXIcon className="mr-2 h-4 w-4 text-orange-500" />
                                        Amaran Lisan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick("surat_amaran")}>
                                        <MailWarningIcon className="mr-2 h-4 w-4 text-red-500" />
                                        Surat Amaran
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleActionClick("suspension")}>
                                        <BanIcon className="mr-2 h-4 w-4 text-purple-500" />
                                        Tangguhan (Penampilan)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="pt-2">
                                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                                    <InfoIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p><span className="font-semibold text-amber-600 dark:text-amber-400">Teguran:</span> 2–3 tegurans → Amaran Lisan</p>
                                        <p><span className="font-semibold text-orange-600 dark:text-orange-400">Amaran Lisan:</span> 3× → Surat Amaran</p>
                                        <p><span className="font-semibold text-red-600 dark:text-red-400">Surat Amaran:</span> 3× → Dipecat</p>
                                        <p><span className="font-semibold text-purple-600 dark:text-purple-400">Tangguhan:</span> Max 1 minggu</p>
                                    </div>
                                </div>
                            </div>

                            {isDipecat && (
                                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-xs text-destructive font-medium">
                                    <BanIcon className="size-4 shrink-0" />
                                    Prefect ini telah dipecat. Tiada tindakan lanjut.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main History Table */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                            <CardDescription>Historical discipline and merit ledger</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 border-t">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[180px] font-bold px-4 border-b whitespace-nowrap">Type</TableHead>
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
                                                        {getEntryBadge(entry.type, entry.severity)}
                                                    </TableCell>
                                                    <TableCell className="text-sm py-4 whitespace-nowrap">
                                                        {entry.type === "suspension"
                                                            ? `${new Date(entry.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(entry.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                                                            : new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        }
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
                                                        {entry.description || entry.reason}
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
        </div >
    )
}
