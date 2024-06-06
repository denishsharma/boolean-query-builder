import { z } from "zod";

import type { ZodType } from "zod";

import { type QueryRule, queryRuleSchema } from "~/modules/query-builder/schemas/query-rule";

export interface BooleanQuery {
    rule: QueryRule;
    operator: "and" | "or";
    operands: (BooleanQuery | QueryRule)[];
}

export const booleanQuerySchema: ZodType<BooleanQuery> = z.object({
    rule: queryRuleSchema,
    operator: z.enum(["and", "or"]),
    operands: z.array(z.union([
        z.lazy(() => booleanQuerySchema),
        queryRuleSchema,
    ])),
});
