import type { BuilderInternalStructure } from "~/modules/query-builder/schemas/builder-internal-structure";

import { booleanQuerySchema } from "~/modules/query-builder/schemas/boolean-query";
import { queryRuleSchema } from "~/modules/query-builder/schemas/query-rule";
import { extractHashId, isGroupPath, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";

export function transformBuilderInternalStructureToBooleanQuery(transformed: BuilderInternalStructure): any {
    const { rules, groups, query } = transformed;

    const resolveRule = (hash: string) => {
        const { signature, ...rule } = rules[isRulePath(hash) ? extractHashId(hash) : hash];
        return queryRuleSchema.parse(rule);
    };

    const resolveGroup = (hash: string) => {
        const group = groups[isGroupPath(hash) ? extractHashId(hash) : hash];
        const rule = resolveRule(group.rule);

        const operands: any = group.opd.map((opd) => {
            if (isRulePath(opd)) {
                return resolveRule(opd);
            } else if (isGroupPath(opd)) {
                return resolveGroup(opd);
            }

            throw new Error(`Invalid path: ${opd}`);
        });

        return booleanQuerySchema.parse({ rule, operator: group.op, operands });
    };

    if (isGroupPath(query)) {
        return resolveGroup(query);
    } else {
        throw new Error(`Invalid path: ${query}`);
    }
}
