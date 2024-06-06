import { useCallback } from "react";

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
                loadBooleanQuery(data);
            }
        };
        input.click();
    }, [loadBooleanQuery]);

    return _import;
}
