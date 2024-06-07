import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { produce } from "immer";
import { type ComponentType, useCallback, useMemo } from "react";

import { DropdownRuleItem } from "~/modules/query-builder/components/rule-items/dropdown-rule-item";
import { TextRuleItem } from "~/modules/query-builder/components/rule-items/text-rule-item";
import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { extractHashId, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";
import { cn } from "~/utils/cn";

const RuleItemComponentMap: Record<"dropdown" | "text", ComponentType<{ data: any; updateData: (data: Partial<any>) => void }>> = {
    dropdown: DropdownRuleItem,
    text: TextRuleItem,
};

type RuleItemProps = Readonly<{
    id: string;
    canDelete?: boolean;
}>;

export function RuleItem({ id, canDelete }: RuleItemProps) {
    const [rules, updateRuleData, removeRule] = useQueryBuilderStore(s => [s.rules, s.updateRuleData, s.removeRule]);
    const data = useMemo(() => rules[isRulePath(id) ? extractHashId(id) : id], [rules, id]);

    const RuleItemComponent = RuleItemComponentMap[data.where];

    const ruleData = produce(data.data, () => {});

    const updateData = useCallback((newData?: Partial<any>) => {
        updateRuleData(id, { data: newData as any, where: data.where });
    }, [data.where, id, updateRuleData]);

    const handleWhereChange = useCallback((where: "dropdown" | "text") => {
        if (where === data.where) return;

        updateRuleData(id, { where, data: (where === "dropdown" ? { condition: "is", value: null } : { value: null }) });
    }, [data.where, id, updateRuleData]);

    return (
        <div className="flex grow gap-x-3">
            <div className="flex grow flex-col select-none gap-y-2">
                <div className="h-5 w-fit flex items-center border border-purple-700 rounded bg-purple-900/20 px-2 text-xs font-medium leading-none op-60">
                    {extractHashId(id)}
                </div>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            className="h-8 max-w-50 w-full flex items-center justify-between border border-dark-200 rounded-md bg-dark-400 px-2.5 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) data-[state=open]:(border-dark-200 bg-dark-500) data-[state=closed]:(hover:bg-dark-300)"
                        >
                            <div className="flex items-center">
                                <div className="text-sm font-medium leading-none">
                                    {data.where === "dropdown" ? "Dropdown" : "Text"}
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
                            {(["dropdown", "text"] as const).map(where => (
                                <DropdownMenu.Item
                                    key={where}
                                    className="cursor-pointer border border-transparent rounded-lg p-1.5 outline-none transition active:(border-dark-100 bg-dark-300/60) hover:bg-dark-100"
                                    onSelect={() => handleWhereChange(where)}
                                >
                                    <div className="flex items-center gap-x-2">
                                        <div className="text-sm font-medium leading-none">
                                            {where === "dropdown" ? "Dropdown" : "Text"}
                                        </div>
                                    </div>
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <div className="flex">
                    <RuleItemComponent data={ruleData} updateData={updateData} />
                </div>
            </div>

            <div className="flex shrink-0">
                <button
                    onClick={() => removeRule(id)}
                    type="button"
                    disabled={canDelete === false}
                    className={cn(
                        "h-8 w-8 flex items-center justify-center border border-red-800 rounded-md bg-red-400/10 text-red-200 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) hover:bg-dark-300",
                        "disabled:(pointer-events-none opacity-50 grayscale)",
                    )}
                >
                    <div className="i-mynaui:trash size-5 op-50" />
                </button>
            </div>
        </div>
    );
}
