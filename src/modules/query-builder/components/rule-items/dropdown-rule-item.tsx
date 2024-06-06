import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { listify } from "radash";
import { useMemo } from "react";

import type { InternalQueryRuleOf } from "~/modules/query-builder/schemas/query-rule";

import { cn } from "~/utils/cn";

type DropdownRuleItemProps = Readonly<{
    data: InternalQueryRuleOf<"dropdown">["data"];
    updateData: (data: Partial<InternalQueryRuleOf<"dropdown">["data"]>) => void;
}>;

const MatchCaseDetails: Record<InternalQueryRuleOf<"dropdown">["data"]["condition"], { label: string }> = {
    "is": { label: "is" },
    "is-not": { label: "is not" },
    "contains": { label: "contains" },
    "does-not-contain": { label: "does not contain" },
};

export function DropdownRuleItem({ data, updateData }: DropdownRuleItemProps) {
    const currentMatchCaseDetail = useMemo(() => MatchCaseDetails[data.condition], [data.condition]);

    return (
        <div className="flex gap-x-2">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className="h-8 w-40 flex shrink-0 items-center justify-between border border-dark-200 rounded-md bg-dark-400 px-2.5 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) data-[state=open]:(border-dark-200 bg-dark-500) data-[state=closed]:(hover:bg-dark-300)"
                    >
                        <div className="flex items-center">
                            <div className="text-sm font-medium leading-none">
                                {currentMatchCaseDetail.label}
                            </div>
                        </div>

                        <div className="i-lucide:chevrons-up-down ml-1 size-3 op-50" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={5}
                        align="start"
                        className={cn(
                            "[width:var(--radix-popper-anchor-width)] select-none border border-dark-100 rounded-lg bg-dark-200/90 p-0.5 text-light-50 shadow-xl backdrop-blur-lg transition",
                            "animate-in data-[side=top]:slide-in-bottom-0.5 data-[side=bottom]:slide-in-bottom--0.5 data-[side=bottom]:fade-in-40 data-[side=top]:fade-in-40",
                        )}
                    >
                        {listify(MatchCaseDetails, (k, v) => (
                            <DropdownMenu.Item
                                key={k}
                                className="cursor-pointer border border-transparent rounded-lg p-1.5 outline-none transition active:(border-dark-100 bg-dark-300/60) hover:bg-dark-100"
                                onSelect={() => updateData({ condition: k })}
                            >
                                <div className="flex items-center gap-x-2">
                                    <div className="text-sm font-medium leading-none">
                                        {v.label}
                                    </div>
                                </div>
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <input
                type="text"
                value={data.value ?? ""}
                onChange={e => updateData({ value: e.target.value })}
                className="h-8 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-teal-800 bg-dark-500 ring-2 ring-teal-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic) read-only:(text-light-900/80)"
            />
        </div>
    );
}
