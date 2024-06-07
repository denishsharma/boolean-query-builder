import { produce } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";
import { extractHashId, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";

interface StructuredGroup {
    op: string;
    opd: (StructuredGroup | string)[];
};

export function useUnderlyingBooleanEquation() {
    const [groups, query, initialized] = useQueryBuilderStore(s => [s.groups, s.query, s.initialized]);

    const [equation, setEquation] = useState<string | null>(null);

    const sturcuted = useMemo(() => {
        if (!initialized) { return undefined; }

        const processGroup = (hash: string): StructuredGroup => {
            const group = groups[extractHashId(hash)];

            const _op = group.op;
            const _opd = produce(group.opd, (draft) => { draft.unshift(group.join); });

            return {
                op: _op,
                opd: _opd.map((opd) => {
                    if (isRulePath(opd)) {
                        return extractHashId(opd);
                    }

                    return processGroup(opd);
                }),
            };
        };

        return processGroup(query);
    }, [groups, initialized, query]);

    const processEquation = useCallback((_struct: StructuredGroup): string => {
        const { op, opd } = _struct;

        return `(${opd.map((opd) => {
            if (typeof opd === "string") {
                return opd.substring(0, 4);
            }

            return processEquation(opd);
        }).join(` ${op} `)})`;
    }, []);

    useEffect(() => {
        if (!sturcuted) { return; }

        const eq = processEquation(sturcuted);
        setEquation(eq.substring(1, eq.length - 1));
    }, [sturcuted, processEquation]);

    return equation;
}
