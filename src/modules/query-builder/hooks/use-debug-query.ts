import { useCallback } from "react";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

export function useDebugQuery() {
    const [rules, groups, query] = useQueryBuilderStore(s => [s.rules, s.groups, s.query]);

    const logInternalStructure = useCallback(() => {
        console.log({ rules, groups, query }); // eslint-disable-line no-console
    }, [groups, query, rules]);

    return { logInternalStructure };
}
