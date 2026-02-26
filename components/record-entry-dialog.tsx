"use client"

import * as React from "react"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { format } from "date-fns"
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
import { recordEntry } from "@/app/actions/entries"

interface RecordEntryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    prefect: {
        id: string
        name: string
        class: string
    } | null
    type: "merit" | "strike" | null
}

export function RecordEntryDialog({
    open,
    onOpenChange,
    prefect,
    type
}: RecordEntryDialogProps) {
    const [date, setDate] = React.useState<Date>(new Date())
    const [description, setDescription] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prefect || !type || !date) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append('prefectId', prefect.id)
        formData.append('type', type)
        formData.append('date', format(date, 'yyyy-MM-dd'))
        formData.append('description', description)

        const result = await recordEntry(formData)
        setIsSubmitting(false)

        if (result.success) {
            handleClose()
        } else {
            alert("Error recording entry: " + result.error)
        }
    }

    const handleClose = () => {
        onOpenChange(false)
        setDate(new Date())
        setDescription("")
    }

    if (!prefect || !type) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                            "p-2 rounded-md",
                            type === "merit" ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                        )}>
                            <PlusIcon className="size-5" />
                        </div>
                        <DialogTitle>
                            {type === "merit" ? "Record Merit" : "Record Strike"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Recording a {type === "merit" ? "merit" : "strike"} for
                        <span className="font-medium"> {prefect.name}</span> (Class {prefect.class})
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date of Incident</Label>
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
                                    onSelect={(d) => d && setDate(d)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder={`Provide details for this ${type}...`}
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
                            variant={type === "strike" ? "destructive" : "default"}
                            className={cn(
                                type === "merit" && "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            )}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : `Record ${type === "merit" ? "Merit" : "Strike"}`}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
