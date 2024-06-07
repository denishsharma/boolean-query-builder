import { ZodIssueCode, z } from "zod";

import type { ZodType } from "zod";

import { type QueryRule, queryRuleSchema } from "~/modules/query-builder/schemas/query-rule";
import { isQueryStructure } from "~/modules/query-builder/utils/is-query-structure";

export interface BooleanQuery {
    rule: QueryRule | BooleanQuery;
    operator: "and" | "or";
    operands: (BooleanQuery | QueryRule)[];
}

export const booleanQuerySchema: ZodType<BooleanQuery> = z.object({
    rule: z.union([queryRuleSchema, z.lazy(() => booleanQuerySchema)]),
    operator: z.enum(["and", "or"]),
    operands: z.array(z.union([
        z.lazy(() => booleanQuerySchema).refine(data => data.operands.length > 0, { message: "Operands must have at least one item" }),
        queryRuleSchema,
    ])),
}).superRefine((data, ctx) => {
    if (isQueryStructure(data.rule)) {
        if (data.operands.length === 0) {
            ctx.addIssue({
                code: ZodIssueCode.custom,
                message: "Operands must have at least one item",
                path: ctx.path.concat(["operands"]),
            });
        }
    }
});
