import type { InternalQueryRuleOf } from "~/modules/query-builder/schemas/query-rule";

type TextRuleItemProps = Readonly<{
    data: InternalQueryRuleOf<"text">["data"];
    updateData: (data: Partial<InternalQueryRuleOf<"text">["data"]>) => void;
}>;

export function TextRuleItem({ data, updateData }: TextRuleItemProps) {
    return (
        <input
            type="text"
            value={data.value ?? ""}
            onChange={e => updateData({ value: e.target.value })}
            className="h-8 resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-teal-800 bg-dark-500 ring-2 ring-teal-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic) read-only:(text-light-900/80)"
        />

    );
}
