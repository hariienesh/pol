"use client"

import * as React from "react"
import { SearchIcon, PlusIcon, ExternalLinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { RecordEntryDialog } from "@/components/record-entry-dialog"

type Prefect = {
    id: string
    name: string
    class: string
    merits: number
    strikes: number
}

export function PrefectsListContent({ initialPrefects }: { initialPrefects: Prefect[] }) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [actionType, setActionType] = React.useState<"merit" | "strike" | null>(null)
    const [selectedPrefect, setSelectedPrefect] = React.useState<Prefect | null>(null)

    const filteredPrefects = initialPrefects.filter((prefect) => {
        const query = searchQuery.toLowerCase()
        return (
            prefect.name.toLowerCase().includes(query) ||
            prefect.class.toLowerCase().includes(query)
        )
    })

    const handleActionClick = (prefect: Prefect, type: "merit" | "strike") => {
        setSelectedPrefect(prefect)
        setActionType(type)
        setDialogOpen(true)
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-4">
                <div className="px-4 lg:px-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prefects</CardTitle>
                            <CardDescription>View performance metrics and manage merits/strikes.</CardDescription>
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

                            <div className="rounded-md border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="whitespace-nowrap">Prefect Name</TableHead>
                                                <TableHead className="whitespace-nowrap">Class</TableHead>
                                                <TableHead className="text-center whitespace-nowrap">Merits</TableHead>
                                                <TableHead className="text-center whitespace-nowrap">Strikes</TableHead>
                                                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPrefects.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                        No prefects found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredPrefects.map((prefect) => (
                                                    <TableRow key={prefect.id}>
                                                        <TableCell className="font-medium whitespace-nowrap">
                                                            <Link href={`/prefects/${prefect.id}`} className="hover:underline flex items-center gap-1">
                                                                {prefect.name}
                                                                <ExternalLinkIcon className="size-3 text-muted-foreground" />
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">{prefect.class}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60 font-bold">
                                                                {prefect.merits}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant={prefect.strikes >= 3 ? "destructive" : "secondary"}
                                                                className={cn(
                                                                    "font-bold",
                                                                    prefect.strikes < 3 && "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
                                                                )}
                                                            >
                                                                {prefect.strikes}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleActionClick(prefect, "merit")}
                                                                    className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/50"
                                                                >
                                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                                    Merit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleActionClick(prefect, "strike")}
                                                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
                                                                >
                                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                                    Strike
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
