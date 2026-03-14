import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePooling(searchParam: string | null, ms: number = 6000) {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("interval running")
            if (!searchParam) {
                console.log("updating table")
                router.refresh();
            }
        }, ms);

        return () => clearInterval(intervalId);
    }, [ms, searchParam]) // eslint-disable-line react-hooks/exhaustive-deps
}