"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

const MOCK_PREFECTS = [
    { id: "1", name: "Ahmad Ali", class: "5 Science 1" },
    { id: "2", name: "Sarah Chong", class: "5 Science 2" },
    { id: "3", name: "Muhammad Syahmi", class: "4 Arts 1" },
    { id: "4", name: "Chloe Tan", class: "4 Science 1" },
    { id: "5", name: "Joshua Lim", class: "5 Arts 2" },
    { id: "6", name: "Nurul Huda", class: "3 Alpha" },
    { id: "7", name: "Kevin Raj", class: "5 Science 1" },
    { id: "8", name: "Siti Nurhaliza", class: "4 Arts 2" },
    { id: "9", name: "Daniel Wong", class: "3 Beta" },
    { id: "10", name: "Aisyah Binti Othman", class: "5 Arts 1" },
]

const CONDUCT_TYPES = [
    { value: "teguran", label: "Teguran (minor/repeated)" },
    { value: "amaran_lisan", label: "Amaran Lisan" },
    { value: "surat_amaran", label: "Surat Amaran" },
    { value: "appearance", label: "Appearance Issue (leads to suspension)" },
]

export function AddConductEntryDialog() {
    const [open, setOpen] = React.useState(false)

    // Form state
    const [prefect, setPrefect] = React.useState<string | null>(null)
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [type, setType] = React.useState<string | null>(null)
    const [description, setDescription] = React.useState("")

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!prefect || !date || !type || !description.trim()) {
            toast.error("Please fill in all required fields.")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        setIsSubmitting(false)
        toast.success("Entry recorded successfully")

        // Reset form and close
        setPrefect(null)
        setDate(new Date())
        setType(null)
        setDescription("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>
                Add Conduct Entry
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Conduct Entry</DialogTitle>
                    <DialogDescription>
                        Record a new disciplinary or conduct entry for a prefect.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup className="py-2">
                        <Field>
                            <FieldLabel htmlFor="prefect">Prefect *</FieldLabel>
                            <Combobox
                                items={MOCK_PREFECTS}
                                value={prefect}
                                onValueChange={(val: string | null) => setPrefect(val)}
                            >
                                <ComboboxInput
                                    id="prefect"
                                    placeholder="Search and select prefect..."
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No prefect found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: typeof MOCK_PREFECTS[number]) => (
                                            <ComboboxItem key={item.id} value={item.name}>
                                                {item.name} <span className="text-muted-foreground ml-1">({item.class})</span>
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </Field>

                        <Field>
                            <FieldLabel>Date *</FieldLabel>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        />
                                    }
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="type">Type of entry *</FieldLabel>
                            <Select
                                items={CONDUCT_TYPES}
                                value={type}
                                onValueChange={(val: string | null) => setType(val)}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CONDUCT_TYPES.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description *</FieldLabel>
                            <Textarea
                                id="description"
                                placeholder="Describe the misconduct or entry details..."
                                className="min-h-[100px] resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>

                        <p className="text-muted-foreground mt-2 text-[13px] leading-tight max-w-[95%]">
                            <span className="font-medium text-foreground">Severity note:</span> After 1 Surat Amaran, new misconducts go straight to another Surat Amaran.
                        </p>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Entry"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
