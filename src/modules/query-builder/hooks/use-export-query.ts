import { useCallback } from "react";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { transformBuilderInternalStructureToBooleanQuery } from "~/modules/query-builder/transformers/transform-builder-internal-structure-to-boolean-query";

export function useExportQuery() {
    const [rules, groups, query] = useQueryBuilderStore(s => [s.rules, s.groups, s.query]);

    const _export = useCallback(() => {
        const exported = transformBuilderInternalStructureToBooleanQuery({ rules, groups, query });
        const data = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "query.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [groups, query, rules]);

    return _export;
}
