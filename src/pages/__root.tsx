import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { isProduction } from "std-env";

import { useColorMode } from "~/hooks/use-color-mode";

const TanStackRouterDevtools = import.meta.env.PROD ? () => null : lazy(() => import("@tanstack/router-devtools").then(res => ({ default: res.TanStackRouterDevtools })));

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    useColorMode();

    return (
        <>
            <Outlet />

            <Toaster
                richColors
                position="bottom-center"
                theme="dark"
                gap={12}
                closeButton
                toastOptions={{
                    classNames: {
                        toast: "rounded-xl w-full shadow-xl items-start gap-x-2",
                        title: "text-sm font-medium leading-none",
                        description: "op-80 leading-snug mt-1",
                        icon: "shrink-0",
                        success: "[--success-border:theme(colors.teal.900)] [--success-bg:theme(colors.dark.700)]",
                        error: "[--error-border:theme(colors.red.900)] [--error-bg:theme(colors.dark.800)]",
                    },
                }}
            />

            {!isProduction && (
                <>
                    <Suspense>
                        <TanStackRouterDevtools />
                    </Suspense>
                    <ReactQueryDevtools />
                </>
            )}
        </>
    );
}
