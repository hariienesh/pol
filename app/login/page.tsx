import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CommandIcon } from 'lucide-react'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const error = params.error

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-card/50 backdrop-blur-sm">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground transform transition-transform hover:scale-105">
                                    <CommandIcon className="size-7" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Prefect Ledger</CardTitle>
                            <CardDescription>
                                Authenticate to access the team ledger
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <form action={login}>
                                <div className="flex flex-col gap-5">
                                    {error && (
                                        <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive text-center border border-destructive/20 animate-in fade-in zoom-in duration-200">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium ml-1">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            autoComplete="email"
                                            className="h-11 rounded-xl bg-background/50 border-muted-foreground/20 focus:bg-background transition-all"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            className="h-11 rounded-xl bg-background/50 border-muted-foreground/20 focus:bg-background transition-all"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <div className="text-center text-xs text-muted-foreground select-none">
                        Restricted access for authorized personnel only.
                    </div>
                </div>
            </div>
        </div>
    )
}
