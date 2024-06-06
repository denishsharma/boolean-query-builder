import { nanoid } from "nanoid";
import { immer } from "zustand/middleware/immer";

import type { BooleanQuery } from "~/modules/query-builder/schemas/boolean-query";
import type { BuilderInternalStructure } from "~/modules/query-builder/schemas/builder-internal-structure";

import { createStoreContext } from "~/hooks/create-store-context";
import { transformBooleanQueryToBuilderInternalStructure } from "~/modules/query-builder/transformers/transform-boolean-query-to-builder-internal-structure";
import { extractHashId, isGroupPath, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";
import { defineStoreInstance } from "~/utils/store";

interface State {
    initialized: boolean;
    rules: BuilderInternalStructure["rules"];
    groups: BuilderInternalStructure["groups"];
    query: string;
}

interface Actions {
    setInitialized: (initialized: State["initialized"]) => void;
    setRules: (rules: State["rules"]) => void;
    setGroups: (groups: State["groups"]) => void;
    setQuery: (query: State["query"]) => void;
    updateRuleData: (id: string, data: Partial<Pick<BuilderInternalStructure["rules"][string], "where" | "data">>) => void;
    updateGroupData: (id: string, data: Partial<Pick<BuilderInternalStructure["groups"][string], "op">>) => void;
    addRule: (groupId: string) => string;
    addGroup: (groupId: string) => string;
    removeRule: (id: string) => void;
    loadBooleanQuery: (query: BooleanQuery) => void;
}

const queryBuilderStoreInstance = defineStoreInstance<State, Actions>((init) => {
    return immer(set => ({
        ...init,
        setInitialized: initialized => set((state) => {
            state.initialized = initialized;
        }),
        setRules: rules => set((state) => { state.rules = rules; }),
        setGroups: groups => set((state) => { state.groups = groups; }),
        setQuery: query => set((state) => { state.query = query; }),
        updateRuleData: (id, data) => set((state) => {
            const _id = isRulePath(id) ? extractHashId(id) : id;
            const rule = state.rules[_id];
            state.rules[_id].where = data.where ?? rule.where;
            state.rules[_id].data = { ...rule.data, ...data.data };
        }),
        updateGroupData: (id, data) => set((state) => {
            const _id = isGroupPath(id) ? extractHashId(id) : id;
            const group = state.groups[_id];
            state.groups[_id].op = data.op ?? group.op;
        }),
        addRule: (groupId) => {
            const _groupId = isGroupPath(groupId) ? extractHashId(groupId) : groupId;
            let ruleHash: string | undefined;

            set((state) => {
                const group = state.groups[_groupId];

                if (group) {
                    if (!group.opd) {
                        group.opd = [];
                    }

                    const _ruleHash = nanoid();
                    state.rules[_ruleHash] = {
                        signature: _ruleHash,
                        groupId: _groupId,
                        primary: false,
                        where: "dropdown",
                        data: {
                            condition: "is",
                            value: undefined,
                        },
                    };

                    group.opd.push(`rule::${_ruleHash}`);

                    ruleHash = _ruleHash;
                }
            });

            return ruleHash ?? "";
        },
        addGroup: (groupId) => {
            const _groupId = isGroupPath(groupId) ? extractHashId(groupId) : groupId;
            let groupHash: string | undefined;

            set((state) => {
                const group = state.groups[_groupId];

                if (group) {
                    if (!group.opd) {
                        group.opd = [];
                    }

                    const _groupHash = nanoid();

                    const _ruleHash = nanoid();
                    state.rules[_ruleHash] = {
                        signature: _ruleHash,
                        groupId: _groupHash,
                        primary: true,
                        where: "dropdown",
                        data: {
                            condition: "is",
                            value: undefined,
                        },
                    };

                    state.groups[_groupHash] = {
                        id: _groupHash,
                        rule: _ruleHash,
                        parentGroupId: _groupId,
                        op: "and",
                        opd: [],
                    };

                    group.opd.push(`group::${_groupHash}`);

                    groupHash = _groupHash;
                }
            });

            return groupHash ?? "";
        },
        removeRule: id => set((state) => {
            const _id = isRulePath(id) ? extractHashId(id) : id;
            const rule = state.rules[_id];

            if (rule) {
                const group = state.groups[rule.groupId];

                if (group) {
                    group.opd = group.opd.filter(item => item !== id);

                    if (!rule.primary) {
                        delete state.rules[_id];
                    } else {
                        const firstRuleInGroup = group.opd.length > 0 ? group.opd.find(item => isRulePath(item)) : undefined;
                        if (firstRuleInGroup) {
                            group.rule = extractHashId(firstRuleInGroup);
                            group.opd = group.opd.filter(item => item !== firstRuleInGroup);
                            state.rules[extractHashId(firstRuleInGroup)].primary = true;
                            delete state.rules[_id];

                            return;
                        }

                        const firstGroupInGroup = group.opd.length > 0 ? group.opd.find(item => isGroupPath(item)) : undefined;
                        const numbersOfGroupsInGroup = group.opd.filter(item => isGroupPath(item)).length;
                        if (firstGroupInGroup) {
                            state.groups[extractHashId(firstGroupInGroup)].parentGroupId = group.parentGroupId;

                            if (numbersOfGroupsInGroup === 1) {
                                if (group.parentGroupId) {
                                    const parentGroup = state.groups[group.parentGroupId];
                                    const _groupPosition = parentGroup.opd.findIndex(item => item === `group::${group.id}`);
                                    parentGroup.opd[_groupPosition] = firstGroupInGroup;

                                    delete state.rules[_id];
                                    delete state.groups[rule.groupId];
                                } else {
                                    state.query = firstGroupInGroup;

                                    delete state.rules[_id];
                                    delete state.groups[rule.groupId];
                                }
                            }

                            return;
                        }

                        delete state.rules[_id];
                        delete state.groups[rule.groupId];

                        if (group.parentGroupId) {
                            const parentGroup = state.groups[group.parentGroupId];
                            parentGroup.opd = parentGroup.opd.filter(item => item !== `group::${rule.groupId}`);
                        }
                    }
                }
            }
        }),
        loadBooleanQuery: query => set((state) => {
            const transformed = transformBooleanQueryToBuilderInternalStructure(query);
            state.rules = transformed.rules;
            state.groups = transformed.groups;
            state.query = transformed.query;
            state.initialized = true;
        }),
    }));
}, { initialized: false, rules: {}, groups: {}, query: "" });

export const [QueryBuilderStoreProvider, useQueryBuilderStore] = createStoreContext<State, Actions>(queryBuilderStoreInstance);
