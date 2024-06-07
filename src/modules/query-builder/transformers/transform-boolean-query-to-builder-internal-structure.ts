import { nanoid } from "nanoid";

import type { QueryRule } from "~/modules/query-builder/schemas/query-rule";

import { type BooleanQuery, booleanQuerySchema } from "~/modules/query-builder/schemas/boolean-query";
import { type BuilderInternalStructure, builderInternalStructureSchema } from "~/modules/query-builder/schemas/builder-internal-structure";
import { getGroupPath, getRulePath } from "~/modules/query-builder/utils/extract-hash-id";
import { isQueryStructure } from "~/modules/query-builder/utils/is-query-structure";

export function transformBooleanQueryToBuilderInternalStructure(data: BooleanQuery): BuilderInternalStructure {
    const rules: Record<string, BuilderInternalStructure["rules"][string]> = {};
    const groups: Record<string, BuilderInternalStructure["groups"][string]> = {};

    const processRule = (rule: QueryRule, groupId: string, primary = false) => {
        const _ruleHash = nanoid();
        const _rule = { ...rule, signature: _ruleHash, group: groupId, primary };
        rules[_ruleHash] = _rule;

        return _ruleHash;
    };

    const processGroup = (group: BooleanQuery, parentGroupId: string | null = null, primary = false): string => {
        const _group = booleanQuerySchema.parse(group);

        const _groupHash = nanoid();

        const _joinHash = isQueryStructure(_group.rule) ? getGroupPath(processGroup(_group.rule, _groupHash, true)) : getRulePath(processRule(_group.rule, _groupHash, true));

        groups[_groupHash] = {
            parent: parentGroupId,
            primary,
            id: _groupHash,
            join: _joinHash,
            op: _group.operator,
            opd: _group.operands.map((item) => {
                if (isQueryStructure(item)) {
                    return getGroupPath(processGroup(item, _groupHash));
                } else {
                    return getRulePath(processRule(item, _groupHash));
                }
            }),
        };

        return _groupHash;
    };

    const query = processGroup(data);

    return builderInternalStructureSchema.parse({ rules, groups, query: getGroupPath(query) });
}
