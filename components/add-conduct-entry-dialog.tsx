"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, AlertTriangleIcon, InfoIcon } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

// ─── Mock Data ────────────────────────────────────────────────────────────────

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
    { id: "10", name: "Aisyah Bt Othman", class: "5 Arts 1" },
    { id: "11", name: "Marcus Tan", class: "4 Science 2" },
    { id: "12", name: "Preethi Ramasamy", class: "3 Gamma" },
]

type ConductType = "teguran" | "amaran_lisan" | "surat_amaran" | "appearance"

const CONDUCT_TYPES: { value: ConductType; label: string }[] = [
    { value: "teguran", label: "Teguran" },
    { value: "amaran_lisan", label: "Amaran Lisan" },
    { value: "surat_amaran", label: "Surat Amaran" },
    { value: "appearance", label: "Appearance Issue" },
]

const SUSPENSION_DAYS = [1, 2, 3, 4, 5, 6, 7] as const

// ─── Escalation callout config ────────────────────────────────────────────────

interface CalloutConfig {
    variant: "info" | "warning" | "danger"
    text: string
}

const ESCALATION_CALLOUTS: Record<ConductType, CalloutConfig> = {
    teguran: {
        variant: "info",
        text: "2–3 Teguran (depending on severity or repetition) → Amaran Lisan.",
    },
    amaran_lisan: {
        variant: "info",
        text: "3 Amaran Lisan → 1 Surat Amaran.",
    },
    surat_amaran: {
        variant: "warning",
        text: "Once a Surat Amaran has been issued, all future misconducts escalate directly to another Surat Amaran — no Teguran. 3 Surat Amaran total = terminated as prefect.",
    },
    appearance: {
        variant: "danger",
        text: "Appearance issues (long nails, hair, wrong attire) result in a temporary suspension — maximum 1 week.",
    },
}

const calloutStyles: Record<CalloutConfig["variant"], string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300",
    warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300",
    danger: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300",
}

function EscalationCallout({ type }: { type: ConductType }) {
    const config = ESCALATION_CALLOUTS[type]
    const styles = calloutStyles[config.variant]
    const Icon = config.variant === "info" ? InfoIcon : AlertTriangleIcon
    return (
        <div className={cn("flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px] leading-snug", styles)}>
            <Icon className="mt-px size-3.5 shrink-0 opacity-80" />
            <span>{config.text}</span>
        </div>
    )
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

export function AddConductEntryDialog() {
    const [open, setOpen] = React.useState(false)

    const [prefect, setPrefect] = React.useState<string | null>(null)
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [type, setType] = React.useState<ConductType | null>(null)
    const [suspDays, setSuspDays] = React.useState<string | null>(null)
    const [description, setDescription] = React.useState("")
    const [submitting, setSubmitting] = React.useState(false)

    const isAppearance = type === "appearance"

    const resetForm = () => {
        setPrefect(null)
        setDate(new Date())
        setType(null)
        setSuspDays(null)
        setDescription("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!prefect || !date || !type || !description.trim()) {
            toast.error("Please fill in all required fields.")
            return
        }
        if (isAppearance && !suspDays) {
            toast.error("Please specify the suspension duration.")
            return
        }

        setSubmitting(true)
        await new Promise((res) => setTimeout(res, 700))
        setSubmitting(false)

        toast.success("Entry recorded")
        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
            <DialogTrigger render={<Button />}>
                Add Conduct Entry
            </DialogTrigger>

            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Add Conduct Entry</DialogTitle>
                    <DialogDescription>
                        Record a disciplinary entry for a prefect.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup className="py-1">

                        {/* Prefect */}
                        <Field>
                            <FieldLabel htmlFor="conduct-prefect">Prefect *</FieldLabel>
                            <Combobox
                                items={MOCK_PREFECTS}
                                value={prefect}
                                onValueChange={(val: string | null) => setPrefect(val)}
                            >
                                <ComboboxInput
                                    id="conduct-prefect"
                                    placeholder="Search prefect name or class…"
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No prefect found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: typeof MOCK_PREFECTS[number]) => (
                                            <ComboboxItem key={item.id} value={item.name}>
                                                {item.name}
                                                <span className="text-muted-foreground ml-1 text-xs">
                                                    {item.class}
                                                </span>
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </Field>

                        {/* Date */}
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
                                    <CalendarIcon className="mr-2 size-4" />
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

                        {/* Entry type */}
                        <Field>
                            <FieldLabel htmlFor="conduct-type">Type of Entry *</FieldLabel>
                            <Select
                                items={CONDUCT_TYPES}
                                value={type}
                                onValueChange={(val: string | null) => {
                                    setType(val as ConductType | null)
                                    setSuspDays(null)
                                }}
                            >
                                <SelectTrigger id="conduct-type" className="w-full">
                                    <SelectValue placeholder="Select entry type" />
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

                            {/* Dynamic escalation callout */}
                            {type && <EscalationCallout type={type} />}
                        </Field>

                        {/* Suspension duration — only for Appearance Issue */}
                        {isAppearance && (
                            <Field>
                                <FieldLabel htmlFor="conduct-susp-days">
                                    Suspension Duration *
                                </FieldLabel>
                                <Select
                                    items={SUSPENSION_DAYS.map((d) => ({
                                        value: String(d),
                                        label: `${d} day${d > 1 ? "s" : ""}`,
                                    }))}
                                    value={suspDays}
                                    onValueChange={(val: string | null) => setSuspDays(val)}
                                >
                                    <SelectTrigger id="conduct-susp-days" className="w-full">
                                        <SelectValue placeholder="Select duration (max 1 week)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {SUSPENSION_DAYS.map((d) => (
                                                <SelectItem key={d} value={String(d)}>
                                                    {d} day{d > 1 ? "s" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}

                        {/* Description */}
                        <Field>
                            <FieldLabel htmlFor="conduct-desc">Description *</FieldLabel>
                            <Textarea
                                id="conduct-desc"
                                placeholder="Describe the misconduct or circumstances…"
                                className="min-h-[90px] resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>

                    </FieldGroup>

                    <DialogFooter className="mt-5">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Submitting…" : "Submit Entry"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
