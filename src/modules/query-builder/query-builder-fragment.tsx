import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import type { ComponentPropsWithoutRef } from "react";

import { RuleGroup } from "~/modules/query-builder/components/rule-group";
import { useDebugQuery } from "~/modules/query-builder/hooks/use-debug-query";
import { useExportQuery } from "~/modules/query-builder/hooks/use-export-query";
import { useImportQuery } from "~/modules/query-builder/hooks/use-import-query";
import { useInitialQueryBuilderState } from "~/modules/query-builder/hooks/use-initial-query-builder-state";
import { useUnderlyingBooleanEquation } from "~/modules/query-builder/hooks/use-underlying-boolean-equation";
import { QueryBuilderStoreProvider, useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { cn } from "~/utils/cn";
import { defaultOverlayScrollbarsOptions } from "~/utils/overlayscrollbars";

function SocialButtonLink({ className, children, ...props }: ComponentPropsWithoutRef<"a">) {
    return (
        <a
            target="_blank"
            className={cn("size-7 cursor-pointer flex items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200)", className)}
            {...props}
        >
            {children}
        </a>
    );
}
function QueryBuilderFragmentConsumer() {
    const [storeInitialized, query] = useQueryBuilderStore(s => [s.initialized, s.query, s.loadBooleanQuery]);

    useInitialQueryBuilderState();

    const { logInternalStructure } = useDebugQuery();

    const importQuery = useImportQuery();
    const exportQuery = useExportQuery();
    const booleanEquation = useUnderlyingBooleanEquation();

    return (
        <div className="relative select-none bg-dark-800 text-light-50 h-dvh">
            <OverlayScrollbarsComponent defer options={defaultOverlayScrollbarsOptions} className="h-dvh">
                <div className="m-20 mx-a w-5xl overflow-clip border border-dark-300 rounded-xl bg-dark-600 shadow-lg divide-y divide-dark-300">
                    <div className="gapx-4 flex items-center justify-between bg-dark-400/50 p-3">
                        <div className="flex items-center">
                            <div className="size-8 flex select-none items-center justify-center rounded-lg bg-teal-800 text-sm text-light-50 font-bold leading-none">
                                <div className="i-teenyicons:react-outline size-5" />
                            </div>

                            <div className="ml-3 h-full flex flex-col select-none justify-center gap-y-1 leading-none">
                                <div className="text-sm font-medium leading-none">
                                    Boolean Query Builder - Bitespeed Live Task
                                </div>

                                <a href="https://github.com/denishsharma" className="text-xs text-light-50/60 leading-none transition active:(op-100) hover:(op-80)">
                                    By
                                    {" "}
                                    <span className="underline underline-gray-500 underline-offset-2 underline-dashed">
                                        Denish Sharma
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-x-2">
                            <button
                                type="button"
                                title="Console Log Internal Structure"
                                onClick={logInternalStructure}
                                className="size-8 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm outline-none transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200) light:active:(border-gray-300 bg-light-50) light:hover:(bg-light-50)"
                            >
                                <span className="i-mynaui:terminal size-5 transition" />
                            </button>

                            <div className="h-4 w-px bg-dark-200" />

                            <button
                                type="button"
                                title="Import Query JSON"
                                onClick={importQuery}
                                className="size-8 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm outline-none transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200) light:active:(border-gray-300 bg-light-50) light:hover:(bg-light-50)"
                            >
                                <span className="i-mynaui:upload size-5 transition" />
                            </button>

                            <button
                                type="button"
                                title="Export Query JSON"
                                onClick={exportQuery}
                                className="size-8 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm outline-none transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200) light:active:(border-gray-300 bg-light-50) light:hover:(bg-light-50)"
                            >
                                <span className="i-mynaui:download size-5 transition" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-teal-900/15 p-3 pr-20 text-xs">
                        Below is the boolean query builder, you can add rules and groups to create a boolean query. Below is the boolean equation of the query.
                        <br />
                        <div className="mt-3">
                            <span className="w-fit rounded-md bg-teal-800 px-2.5 py-0.5 text-sm leading-none">
                                {booleanEquation || "No Query"}
                            </span>
                        </div>
                    </div>

                    <div>
                        {storeInitialized && (
                            <RuleGroup id={query} level={0} />
                        )}
                    </div>

                    <div className="flex items-center justify-between py-1 pl-1.5 pr-2.5">
                        <div className="flex items-center">
                            <SocialButtonLink href="https://www.linkedin.com/in/denishsharma/">
                                <div className="i-mynaui:brand-linkedin size-4" />
                            </SocialButtonLink>

                            <SocialButtonLink href="https://github.com/denishsharma/boolean-query-builder-bitespeed-task/">
                                <div className="i-mynaui:brand-github size-4" />
                            </SocialButtonLink>
                        </div>

                        <div className="flex items-center">
                            <span className="h-5 flex items-center rounded bg-dark-300 px-2 text-xs text-light-50/60 font-medium">
                                &copy;
                                {" "}
                                {new Date().getFullYear()}
                                {" "}
                                Denish Sharma
                            </span>
                        </div>
                    </div>
                </div>
            </OverlayScrollbarsComponent>
        </div>
    );
}

export function QueryBuilderFragment() {
    return (
        <QueryBuilderStoreProvider>
            <QueryBuilderFragmentConsumer />
        </QueryBuilderStoreProvider>
    );
}
