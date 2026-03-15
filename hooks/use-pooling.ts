import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function usePooling(searchParam: string | null, ms: number = 6000) {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!searchParam) {
                router.refresh();
            }
        }, ms);

        return () => clearInterval(intervalId);
    }, [ms, searchParam]); // eslint-disable-line react-hooks/exhaustive-deps
}
