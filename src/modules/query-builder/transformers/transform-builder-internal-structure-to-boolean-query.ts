import type { BuilderInternalStructure } from "~/modules/query-builder/schemas/builder-internal-structure";

import { type BooleanQuery, booleanQuerySchema } from "~/modules/query-builder/schemas/boolean-query";
import { type QueryRule, queryRuleSchema } from "~/modules/query-builder/schemas/query-rule";
import { extractHashId, isGroupPath, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";

export function transformBuilderInternalStructureToBooleanQuery(transformed: BuilderInternalStructure): any {
    const { rules, groups, query } = transformed;

    const resolveRule = (hash: string) => {
        const { signature, ...rule } = rules[isRulePath(hash) ? extractHashId(hash) : hash];
        return queryRuleSchema.parse(rule);
    };

    const resolveGroup = (hash: string): BooleanQuery => {
        const group = groups[isGroupPath(hash) ? extractHashId(hash) : hash];
        const rule: QueryRule | BooleanQuery = isRulePath(group.join) ? resolveRule(group.join) : resolveGroup(group.join);

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
