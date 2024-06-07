import { useCallback } from "react";
import { toast } from "sonner";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

export function useDebugQuery() {
    const [rules, groups, query] = useQueryBuilderStore(s => [s.rules, s.groups, s.query]);

    const logInternalStructure = useCallback(() => {
        console.log({ rules, groups, query }); // eslint-disable-line no-console
        toast.success("Internal structure logged", { description: "The internal structure of the query has been logged to the console. You can now see the internal structure of the query in the console.", dismissible: true });
    }, [groups, query, rules]);

    return { logInternalStructure };
}
