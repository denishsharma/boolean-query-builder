import { z } from "zod";

const dropdownRuleScehma = z.object({
    where: z.literal("dropdown"),
    data: z.object({
        condition: z.enum(["is", "is-not", "contains", "does-not-contain"]),
        value: z.string().optional(),
    }),
});

const textRuleSchema = z.object({
    where: z.literal("text"),
    data: z.object({
        value: z.string().optional(),
    }),
});

export const queryRuleSchema = z.union([dropdownRuleScehma, textRuleSchema]);
export type QueryRule = z.infer<typeof queryRuleSchema>;

export const internalQueryRuleSchema = z.union([dropdownRuleScehma.extend({ signature: z.string(), groupId: z.string(), primary: z.boolean().default(false) }), textRuleSchema.extend({ signature: z.string(), groupId: z.string(), primary: z.boolean().default(false) })]);
export type InternalQueryRule = z.infer<typeof internalQueryRuleSchema>;
export type InternalQueryRuleOf<T extends "dropdown" | "text"> = T extends "dropdown" ? z.infer<typeof dropdownRuleScehma> : z.infer<typeof textRuleSchema>;
