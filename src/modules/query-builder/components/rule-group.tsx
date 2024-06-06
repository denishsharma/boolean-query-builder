import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCallback, useMemo } from "react";

import { RuleItem } from "~/modules/query-builder/components/rule-item";
import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { extractHashId, isGroupPath, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";
import { cn } from "~/utils/cn";

type RuleGroupProps = Readonly<{
    id: string;
    nested?: boolean;
    level?: number;
}>;

export function RuleGroup({ id, nested, level }: RuleGroupProps) {
    const [groups, updateGroupData, addRule, addGroup] = useQueryBuilderStore(s => [s.groups, s.updateGroupData, s.addRule, s.addGroup]);

    const data = useMemo(() => groups[isGroupPath(id) ? extractHashId(id) : id], [groups, id]);

    const handleOperatorChange = useCallback((op: "and" | "or") => {
        if (op === data.op) return;
        updateGroupData(id, { op });
    }, [data.op, id, updateGroupData]);

    const operands = useMemo(() => data.opd.map((item, index) => {
        let Component = null;

        if (isGroupPath(item)) {
            Component = (
                <RuleGroup
                    key={item}
                    id={item}
                    nested
                    level={(level ?? 0) + 1}
                />
            );
        } else if (isRulePath(item)) {
            Component = <RuleItem key={item} id={item} />;
        }

        return (
            <div key={item} className="flex py-4 pr-3">
                <div className="w-24 flex shrink-0 flex-col px-4">
                    {index > 0
                        ? (
                            <div className={cn(
                                "h-8 flex items-center justify-end text-sm font-semibold uppercase",
                                data.op === "and" ? "text-blue-600" : "text-amber-600",
                            )}
                            >
                                {data.op === "and" ? "And" : "Or"}
                            </div>
                            )
                        : (
                            <div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            type="button"
                                            className="h-8 w-full flex shrink-0 items-center justify-between border border-dark-200 rounded-md bg-dark-400 px-2.5 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) data-[state=open]:(border-dark-200 bg-dark-500) data-[state=closed]:(hover:bg-dark-300)"
                                        >
                                            <div className="i-lucide:chevrons-up-down mr-1 size-3 op-50" />

                                            <div className="flex items-center">
                                                <div className="text-sm font-medium leading-none">
                                                    {data.op === "and" ? "And" : "Or"}
                                                </div>
                                            </div>

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
                                            {(["and", "or"] as const).map(k => (
                                                <DropdownMenu.Item
                                                    key={k}
                                                    className="cursor-pointer border border-transparent rounded-lg p-1.5 outline-none transition active:(border-dark-100 bg-dark-300/60) hover:bg-dark-100"
                                                    onSelect={() => handleOperatorChange(k)}
                                                >
                                                    <div className="flex items-center gap-x-2">
                                                        <div className="text-sm font-medium leading-none">
                                                            {k === "and" ? "And" : "Or"}
                                                        </div>
                                                    </div>
                                                </DropdownMenu.Item>
                                            ))}
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                            )}
                </div>

                {Component}
            </div>
        );
    }), [data.op, data.opd, handleOperatorChange, level]);

    return (
        <div
            className={cn(
                "flex flex-col divide-y divide-dark-300",
                nested && "border rounded-xl grow border-dark-300 bg-dark-300/20 backdrop-blur-xl",
            )}
        >
            <div className="flex py-4">
                <div className="w-24 flex shrink-0 flex-col px-4">
                    <div className="h-8 flex items-center justify-end text-sm text-teal-600 font-semibold uppercase">
                        Where
                    </div>
                </div>

                <div className="flex grow flex-col pr-3">
                    <RuleItem id={data.rule} canDelete={(data.opd.filter(item => isRulePath(item)).length > 0 || level !== 0) && !(data.opd.filter(item => isGroupPath(item)).length > 1 && data.opd.filter(item => isGroupPath(item)).length === data.opd.length)} />
                </div>
            </div>

            <div className="flex flex-col divide-y divide-dark-300">
                {operands}
            </div>

            <div className="flex items-center gap-x-2 px-1 py-1">
                <button
                    onClick={() => addRule(id)}
                    type="button"
                    className="h-8 flex select-none items-center border border-transparent rounded-lg bg-transparent px-2 text-sm text-light-50/60 transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-300)"
                >
                    <span className="i-lucide:plus mr-1.5 size-4" />
                    <span className="pr-1">Add Rule</span>
                </button>

                {(typeof level !== "undefined" && level < 2) && (
                    <>
                        <div className="h-4 w-px bg-dark-200" />

                        <button
                            onClick={() => addGroup(id)}
                            type="button"
                            className="h-8 flex select-none items-center border border-transparent rounded-lg bg-transparent px-2 text-sm text-light-50/60 transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-300)"
                        >
                            <span className="i-lucide:plus mr-1.5 size-4" />
                            <span className="pr-1">Add Group</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
