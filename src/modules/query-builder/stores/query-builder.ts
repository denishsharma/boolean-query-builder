import { nanoid } from "nanoid";
import { immer } from "zustand/middleware/immer";

import type { BooleanQuery } from "~/modules/query-builder/schemas/boolean-query";
import type { BuilderInternalStructure } from "~/modules/query-builder/schemas/builder-internal-structure";

import { createStoreContext } from "~/hooks/create-store-context";
import { transformBooleanQueryToBuilderInternalStructure } from "~/modules/query-builder/transformers/transform-boolean-query-to-builder-internal-structure";
import { extractHashId, getGroupPath, getRulePath, isGroupPath, isRulePath } from "~/modules/query-builder/utils/extract-hash-id";
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
                        group: _groupId,
                        primary: false,
                        where: "dropdown",
                        data: {
                            condition: "is",
                            value: undefined,
                        },
                    };

                    group.opd.push(getRulePath(_ruleHash));

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

                    const createRule = (isPrimary = false) => {
                        const _ruleHash = nanoid();
                        state.rules[_ruleHash] = {
                            signature: _ruleHash,
                            group: _groupHash,
                            primary: isPrimary,
                            where: "dropdown",
                            data: {
                                condition: "is",
                                value: undefined,
                            },
                        };

                        return _ruleHash;
                    };

                    const _ruleFirstHash = createRule(true);
                    const _ruleSecondHash = createRule();

                    state.groups[_groupHash] = {
                        id: _groupHash,
                        join: getRulePath(_ruleFirstHash),
                        parent: _groupId,
                        primary: false,
                        op: "and",
                        opd: [getRulePath(_ruleSecondHash)],
                    };

                    group.opd.push(getGroupPath(_groupHash));

                    groupHash = _groupHash;
                }
            });

            return groupHash ?? "";
        },
        removeRule: id => set((state) => {
            const _id = isRulePath(id) ? extractHashId(id) : id;
            const rule = state.rules[_id];

            if (rule) {
                const group = state.groups[rule.group];

                if (group) {
                    const cleanRule = (trigger: "rule" | "group" = "rule") => {
                        if (group.opd.length !== 0) { return; }

                        const parentGroup = group.parent ? state.groups[group.parent] : undefined;

                        if (trigger === "group") {
                            if (!parentGroup) {
                                state.query = group.join; // Promote the join of the group to the query
                                if (isRulePath(group.join)) {
                                    console.error("Promoted join cannot be a rule");
                                    return;
                                } // if the promoted join is a rule, then throw error
                                state.groups[extractHashId(group.join)].parent = null; // Update the parent of the promoted group
                                state.groups[extractHashId(group.join)].primary = false; // Mark the promoted group as non-primary
                                delete state.groups[group.id]; // Delete the group from the groups
                            } else {
                                state.groups[extractHashId(group.join)].parent = group.parent; // Update the parent of the promoted group

                                if (group.primary) {
                                    parentGroup.join = group.join; // Promote the join of the group to the parent group
                                    state.groups[extractHashId(group.join)].primary = true; // Mark the promoted group as primary
                                } else {
                                    const indexOnParent = parentGroup.opd.findIndex(item => item === getGroupPath(group.id)); // Find the index of the group in the parent group operands
                                    parentGroup.opd[indexOnParent] = group.join; // Replace the group with the promoted join
                                    state.groups[extractHashId(group.join)].primary = false; // Mark the promoted group as primary
                                    delete state.groups[group.id]; // Delete the group from the groups
                                }
                            }
                        } else if (trigger === "rule") {
                            if (parentGroup) {
                                if (isGroupPath(group.join)) {
                                    state.groups[extractHashId(group.join)].parent = parentGroup.id; // Update the parent of the promoted group
                                } else if (isRulePath(group.join)) {
                                    state.rules[extractHashId(group.join)].group = parentGroup.id; // Update the group of the promoted rule
                                    state.rules[extractHashId(group.join)].primary = group.primary; // Mark the promoted rule as non-primary
                                }

                                if (group.primary) {
                                    parentGroup.join = group.join; // Promote the join of the group to the parent group
                                } else {
                                    const indexOnParent = parentGroup.opd.findIndex(item => item === getGroupPath(group.id)); // Find the index of the group in the parent group operands
                                    parentGroup.opd[indexOnParent] = group.join; // Replace the group with the promoted join
                                }

                                delete state.groups[group.id]; // Delete the group from the groups
                            }
                        }
                    };

                    if (!rule.primary) {
                        group.opd = group.opd.filter(item => item !== getRulePath(_id));
                        delete state.rules[_id];

                        cleanRule();
                    } else {
                        // First priority is to find a rule in the group and promote it to primary
                        const firstRuleInGroup = group.opd.find(item => isRulePath(item));
                        if (firstRuleInGroup) {
                            group.join = firstRuleInGroup; // Promote the rule to primary
                            group.opd = group.opd.filter(item => item !== firstRuleInGroup); // Remove the rule from the group operands
                            state.rules[extractHashId(firstRuleInGroup)].primary = true; // Mark the rule as primary
                            delete state.rules[_id]; // Delete the rule from the rules

                            cleanRule();
                            return;
                        }

                        // If there's no rule in the group, we look for first group in the group
                        const firstGroupInGroup = group.opd.find(item => isGroupPath(item));
                        if (firstGroupInGroup) {
                            group.join = firstGroupInGroup; // Promote the group to primary
                            group.opd = group.opd.filter(item => item !== firstGroupInGroup); // Remove the group from the group operands
                            state.groups[extractHashId(firstGroupInGroup)].primary = true; // Mark the group as primary
                            delete state.rules[_id]; // Delete the rule from the rules

                            cleanRule("group");
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
