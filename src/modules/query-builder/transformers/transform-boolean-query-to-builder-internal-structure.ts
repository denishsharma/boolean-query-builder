import { nanoid } from "nanoid";

import type { BooleanQuery } from "~/modules/query-builder/schemas/boolean-query";
import type { QueryRule } from "~/modules/query-builder/schemas/query-rule";

import { type BuilderInternalStructure, builderInternalStructureSchema } from "~/modules/query-builder/schemas/builder-internal-structure";
import { isQueryStructure } from "~/modules/query-builder/utils/is-query-structure";

export function transformBooleanQueryToBuilderInternalStructure(data: BooleanQuery): BuilderInternalStructure {
    const rules: Record<string, BuilderInternalStructure["rules"][string]> = {};
    const groups: Record<string, BuilderInternalStructure["groups"][string]> = {};

    const processRule = (rule: QueryRule, groupId: string, primary = false) => {
        const _ruleHash = nanoid();
        const _rule = { ...rule, signature: _ruleHash, groupId, primary };
        rules[_ruleHash] = _rule;

        return _ruleHash;
    };

    const processGroup = (group: BooleanQuery, parentGroupId: string | null = null): string => {
        const _groupHash = nanoid();

        const _ruleHash = processRule(group.rule, _groupHash, true);

        groups[_groupHash] = {
            parentGroupId,
            id: _groupHash,
            rule: _ruleHash,
            op: group.operator,
            opd: group.operands.map((item) => {
                if (isQueryStructure(item)) {
                    return `group::${processGroup(item, _groupHash)}`;
                } else {
                    return `rule::${processRule(item, _groupHash)}`;
                }
            }),
        };

        return _groupHash;
    };

    const query = processGroup(data);

    return builderInternalStructureSchema.parse({ rules, groups, query: `group::${query}` });
}
