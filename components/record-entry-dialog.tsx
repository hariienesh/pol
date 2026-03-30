"use client"

import * as React from "react"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { recordEntry } from "@/app/actions/entries"

export type DisciplineType = "merit" | "teguran" | "amaran_lisan" | "surat_amaran" | "suspension"

const typeConfig: Record<DisciplineType, {
    label: string
    bgLight: string
    bgDark: string
    textLight: string
    textDark: string
    badgeClass: string
}> = {
    merit: {
        label: "Merit",
        bgLight: "bg-green-100",
        bgDark: "dark:bg-green-950/50",
        textLight: "text-green-700",
        textDark: "dark:text-green-400",
        badgeClass: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    },
    teguran: {
        label: "Teguran",
        bgLight: "bg-amber-100",
        bgDark: "dark:bg-amber-950/50",
        textLight: "text-amber-700",
        textDark: "dark:text-amber-400",
        badgeClass: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
    },
    amaran_lisan: {
        label: "Amaran Lisan",
        bgLight: "bg-orange-100",
        bgDark: "dark:bg-orange-950/50",
        textLight: "text-orange-700",
        textDark: "dark:text-orange-400",
        badgeClass: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
    },
    surat_amaran: {
        label: "Surat Amaran",
        bgLight: "bg-red-100",
        bgDark: "dark:bg-red-950/50",
        textLight: "text-red-700",
        textDark: "dark:text-red-400",
        badgeClass: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    },
    suspension: {
        label: "Tangguhan",
        bgLight: "bg-purple-100",
        bgDark: "dark:bg-purple-950/50",
        textLight: "text-purple-700",
        textDark: "dark:text-purple-400",
        badgeClass: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
    },
}

interface RecordEntryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    prefect: {
        id: string
        name: string
        class: string
    } | null
    type: DisciplineType | null
}

export function RecordEntryDialog({
    open,
    onOpenChange,
    prefect,
    type
}: RecordEntryDialogProps) {
    const [date, setDate] = React.useState<Date>(new Date())
    const [endDate, setEndDate] = React.useState<Date>(addDays(new Date(), 3))
    const [description, setDescription] = React.useState("")
    const [severity, setSeverity] = React.useState("ringan")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const config = type ? typeConfig[type] : null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prefect || !type || !date) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("prefectId", prefect.id)
        formData.append("type", type)
        formData.append("date", format(date, "yyyy-MM-dd"))
        formData.append("description", description)

        if (type === "teguran") {
            formData.append("severity", severity)
        }

        if (type === "suspension") {
            formData.append("start_date", format(date, "yyyy-MM-dd"))
            formData.append("end_date", format(endDate, "yyyy-MM-dd"))
        }

        const result = await recordEntry(formData)
        setIsSubmitting(false)

        if (result.success) {
            handleClose()
        } else {
            alert("Error: " + result.error)
        }
    }

    const handleClose = () => {
        onOpenChange(false)
        setDate(new Date())
        setEndDate(addDays(new Date(), 3))
        setDescription("")
        setSeverity("ringan")
    }

    if (!prefect || !type || !config) return null

    const descriptionPlaceholder: Record<DisciplineType, string> = {
        merit: "Describe the merit awarded...",
        teguran: "Describe the misconduct being reprimanded...",
        amaran_lisan: "Describe the reason for this verbal warning...",
        surat_amaran: "Describe the reason for issuing this formal warning letter...",
        suspension: "Describe the appearance violation (e.g., long nails, inappropriate hair, wrong attire)...",
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                            "p-2 rounded-md",
                            config.bgLight, config.bgDark, config.textLight, config.textDark
                        )}>
                            <PlusIcon className="size-5" />
                        </div>
                        <DialogTitle>
                            Record {config.label}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Recording a <span className={cn("font-semibold", config.textLight, config.textDark)}>{config.label}</span> for
                        <span className="font-medium"> {prefect.name}</span> (Class {prefect.class})
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Severity selector for teguran */}
                    {type === "teguran" && (
                        <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select value={severity} onValueChange={(v) => v && setSeverity(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ringan">Ringan (Minor)</SelectItem>
                                    <SelectItem value="sederhana">Sederhana (Moderate)</SelectItem>
                                    <SelectItem value="serius">Serius (Serious)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Date picker */}
                    <div className="space-y-2">
                        <Label htmlFor="date">
                            {type === "suspension" ? "Start Date" : "Date of Incident"}
                        </Label>
                        <Popover>
                            <PopoverTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                }
                            />
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => {
                                        if (d) {
                                            setDate(d)
                                            // Keep end date at least same as start
                                            if (type === "suspension" && endDate < d) {
                                                setEndDate(d)
                                            }
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* End date for suspension */}
                    {type === "suspension" && (
                        <div className="space-y-2">
                            <Label>
                                End Date <span className="text-muted-foreground text-xs">(max 1 week)</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                                        </Button>
                                    }
                                />
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(d) => d && setEndDate(d)}
                                        disabled={(d) => d < date || d > addDays(date, 7)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-xs text-muted-foreground">
                                Duration: {Math.round((endDate.getTime() - date.getTime()) / 86400000) + 1} day(s)
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {type === "suspension" ? "Reason" : "Description"}
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={descriptionPlaceholder[type]}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={cn("text-white", config.badgeClass)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : `Record ${config.label}`}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
