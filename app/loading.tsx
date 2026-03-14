import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 bg-background/80">
            <div className="w-full h-dvh grid place-content-center">
                <LoaderCircle className="animate-spin h-48 w-48 text-foreground/20" />
            </div>
        </div>
    )
}