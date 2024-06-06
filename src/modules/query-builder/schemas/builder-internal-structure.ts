import { z } from "zod";

import { internalQueryRuleSchema } from "~/modules/query-builder/schemas/query-rule";

const queryGroupSchema = z.object({
    id: z.string(),
    rule: z.string(),
    parentGroupId: z.string().nullable(),
    op: z.enum(["and", "or"]),
    opd: z.array(z.string().regex(/^(rule|group)::(.*$)/)),
});

export const builderInternalStructureSchema = z.object({
    rules: z.record(z.string(), internalQueryRuleSchema),
    groups: z.record(z.string(), queryGroupSchema),
    query: z.string().regex(/^(group)::(.*$)/),
});

export type BuilderInternalStructure = z.infer<typeof builderInternalStructureSchema>;
