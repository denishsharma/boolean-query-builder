import { useCallback } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { transformBuilderInternalStructureToBooleanQuery } from "~/modules/query-builder/transformers/transform-builder-internal-structure-to-boolean-query";

export function useExportQuery() {
    const [rules, groups, query] = useQueryBuilderStore(s => [s.rules, s.groups, s.query]);

    const _export = useCallback(() => {
        try {
            const exported = transformBuilderInternalStructureToBooleanQuery({ rules, groups, query });
            const data = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "query.json";
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Query exported successfully", { description: "The query has been exported successfully. You can now find the query in your downloads folder.", dismissible: true });
        } catch (error) {
            console.error("Failed to export query", error instanceof ZodError ? error.errors : error);
            toast.error("Failed to export query", { description: "Please check the console for more information. If the problem persists, please create an issue on the repository." });
        }
    }, [groups, query, rules]);

    return _export;
}
