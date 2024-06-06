import { z } from "zod";

import type { ZodType } from "zod";

import { type QueryRule, queryRuleSchema } from "~/modules/query-builder/schemas/query-rule";

export interface BooleanQuery {
    rule: QueryRule | BooleanQuery;
    operator: "and" | "or";
    operands: (BooleanQuery | QueryRule)[];
}

export const booleanQuerySchema: ZodType<BooleanQuery> = z.object({
    rule: z.union([queryRuleSchema, z.lazy(() => booleanQuerySchema)]),
    operator: z.enum(["and", "or"]),
    operands: z.array(z.union([
        z.lazy(() => booleanQuerySchema),
        queryRuleSchema,
    ])),
});
