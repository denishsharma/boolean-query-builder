import type { ComponentPropsWithoutRef } from "react";

import { cn } from "~/utils/cn";

export function BooleanOperationItem({ children, className, ...props }: ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={cn("inline-block rounded-md px-1 h-5.5 flex items-center text-xs leading-none", className)}
        >
            {children}
        </span>
    );
}
