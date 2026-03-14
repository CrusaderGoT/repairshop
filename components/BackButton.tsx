"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";

type buttonProps = {
    title: string;
    className?: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
        | null
        | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({
    title,
    variant,
    className,
    ...props
}: buttonProps) {
    const router = useRouter();

    return (
        <Button
            variant={variant}
            className={className}
            onClick={() => router.back()}
            title={title}
            {...props}
        >
            {title}
        </Button>
    );
}
