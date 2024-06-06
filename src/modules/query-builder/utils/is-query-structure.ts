import { produce } from "immer";
import { hash } from "ohash";

import type { BooleanQuery } from "~/modules/query-builder/schemas/boolean-query";
import type { QueryRule } from "~/modules/query-builder/schemas/query-rule";

const andQueryStructureHash = hash({ operator: "and", operands: [], rule: undefined });
const orQueryStructureHash = hash({ operator: "or", operands: [], rule: undefined });

export function isQueryStructure(query: BooleanQuery | QueryRule): query is BooleanQuery {
    if ("operator" in query && "operands" in query && "rule" in query) {
        const cloned = produce(query, (draft) => {
            draft.rule = undefined as any;
            draft.operands = [];
        });

        const queryHash = hash(cloned);

        if (queryHash === andQueryStructureHash || queryHash === orQueryStructureHash) {
            return true;
        }
    }

    return false;
}
