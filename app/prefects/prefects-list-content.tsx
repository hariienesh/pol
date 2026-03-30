"use client"

import * as React from "react"
import { SearchIcon, ExternalLinkIcon, ChevronDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { RecordEntryDialog, type DisciplineType } from "@/components/record-entry-dialog"

type Prefect = {
    id: string
    name: string
    class: string
    status: string
    merits: number
    tegurans: number
    amaran_lisan: number
    surat_amaran: number
}

function StatusBadge({ count, status }: { count: number; status: string }) {
    if (status === "dipecat") {
        return (
            <Badge variant="destructive" className="font-bold uppercase tracking-wide">
                Dipecat
            </Badge>
        )
    }
    if (count >= 2) {
        return (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950/40 dark:text-orange-400 font-bold border-orange-200">
                Dalam Risiko
            </Badge>
        )
    }
    if (count >= 1) {
        return (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-400 font-bold border-amber-200">
                Amaran
            </Badge>
        )
    }
    return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-400 font-bold border-green-200">
            Good Standing
        </Badge>
    )
}

export function PrefectsListContent({ initialPrefects }: { initialPrefects: Prefect[] }) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [actionType, setActionType] = React.useState<DisciplineType | null>(null)
    const [selectedPrefect, setSelectedPrefect] = React.useState<Prefect | null>(null)

    const filteredPrefects = initialPrefects.filter((prefect) => {
        const query = searchQuery.toLowerCase()
        return (
            prefect.name.toLowerCase().includes(query) ||
            prefect.class.toLowerCase().includes(query)
        )
    })

    const handleActionClick = (prefect: Prefect, type: DisciplineType) => {
        setSelectedPrefect(prefect)
        setActionType(type)
        setDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6 max-w-7xl mx-auto w-full">
            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Prefects</CardTitle>
                        <CardDescription>View performance metrics and manage discipline records.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or class..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Card className="border-none shadow-sm overflow-hidden bg-card">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Prefect Name</TableHead>
                                            <TableHead className="whitespace-nowrap">Class</TableHead>
                                            <TableHead className="text-center whitespace-nowrap">Merits</TableHead>
                                            <TableHead className="text-center whitespace-nowrap">Teguran</TableHead>
                                            <TableHead className="text-center whitespace-nowrap">Amaran Lisan</TableHead>
                                            <TableHead className="text-center whitespace-nowrap">Surat Amaran</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPrefects.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                                    No prefects found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPrefects.map((prefect) => (
                                                <TableRow key={prefect.id} className={cn(prefect.status === "dipecat" && "opacity-60")}>
                                                    <TableCell className="font-medium whitespace-nowrap">
                                                        <Link href={`/prefects/${prefect.id}`} className="hover:underline flex items-center gap-1">
                                                            {prefect.name}
                                                            <ExternalLinkIcon className="size-3 text-muted-foreground" />
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">{prefect.class}</TableCell>

                                                    {/* Merits */}
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60 font-bold">
                                                            {prefect.merits}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Teguran */}
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-400 font-bold">
                                                            {prefect.tegurans}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Amaran Lisan */}
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950/40 dark:text-orange-400 font-bold">
                                                            {prefect.amaran_lisan}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Surat Amaran */}
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={prefect.surat_amaran >= 3 ? "destructive" : "secondary"}
                                                            className={cn(
                                                                "font-bold",
                                                                prefect.surat_amaran < 3 && "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400"
                                                            )}
                                                        >
                                                            {prefect.surat_amaran}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Status */}
                                                    <TableCell>
                                                        <StatusBadge count={prefect.surat_amaran} status={prefect.status} />
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleActionClick(prefect, "merit")}
                                                                className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/50"
                                                                disabled={prefect.status === "dipecat"}
                                                            >
                                                                + Merit
                                                            </Button>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    disabled={prefect.status === "dipecat"}
                                                                    render={
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
                                                                        >
                                                                            Disiplin
                                                                            <ChevronDownIcon className="ml-1 h-3 w-3" />
                                                                        </Button>
                                                                    }
                                                                />
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleActionClick(prefect, "teguran")}>
                                                                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                                                        Teguran
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleActionClick(prefect, "amaran_lisan")}>
                                                                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" />
                                                                        Amaran Lisan
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleActionClick(prefect, "surat_amaran")}>
                                                                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />
                                                                        Surat Amaran
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleActionClick(prefect, "suspension")}>
                                                                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" />
                                                                        Tangguhan (Penampilan)
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </CardContent>
                </Card>
            </div>

            <RecordEntryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                prefect={selectedPrefect}
                type={actionType}
            />
        </div>
    )
}
