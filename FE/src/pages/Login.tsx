import { Button } from "@/components/ui/button"

export default function Login() {
    return (
        <div className="w-full max-w-sm p-6 bg-card border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input className="w-full px-3 py-2 border rounded-md bg-background" placeholder="admin" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input className="w-full px-3 py-2 border rounded-md bg-background" type="password" />
                </div>
                <Button className="w-full">Sign In</Button>
            </div>
        </div>
    )
}
