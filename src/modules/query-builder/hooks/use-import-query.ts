import { useCallback } from "react";
import { toast } from "sonner";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

export function useImportQuery() {
    const [loadBooleanQuery] = useQueryBuilderStore(s => [s.loadBooleanQuery]);

    const _import = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const content = await file.text();
                const data = JSON.parse(content);
                try {
                    loadBooleanQuery(data);
                    toast.success("Query loaded successfully", { description: "The query has been loaded successfully. You can now see the changes in the query builder.", dismissible: true });
                } catch (error) {
                    console.error("Failed to load query", error);
                    toast.error("Failed to load query", { description: "Please check the console for more information. If the problem persists, please create an issue on the repository." });
                }
            }
        };
        input.click();
    }, [loadBooleanQuery]);

    return _import;
}
