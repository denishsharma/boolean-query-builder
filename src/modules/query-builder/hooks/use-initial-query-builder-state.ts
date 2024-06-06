import { useEffect } from "react";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

export function useInitialQueryBuilderState() {
    const [loadBooleanQuery] = useQueryBuilderStore(s => [s.loadBooleanQuery]);

    useEffect(() => {
        loadBooleanQuery({
            rule: {
                rule: {
                    where: "text",
                    data: {
                        value: "A",
                    },
                },
                operator: "or",
                operands: [
                    {
                        where: "dropdown",
                        data: {
                            condition: "is",
                            value: "B",
                        },
                    },
                    {
                        rule: {
                            where: "text",
                            data: {
                                value: "C",
                            },
                        },
                        operator: "and",
                        operands: [
                            {
                                where: "dropdown",
                                data: {
                                    condition: "is",
                                    value: "D",
                                },
                            },
                        ],
                    },
                ],
            },
            operator: "and",
            operands: [
                {
                    where: "text",
                    data: {
                        value: "E",
                    },
                },
                {
                    rule: {
                        where: "text",
                        data: {
                            value: "F",
                        },
                    },
                    operator: "or",
                    operands: [
                        {
                            rule: {
                                where: "text",
                                data: {
                                    value: "G",
                                },
                            },
                            operator: "and",
                            operands: [
                                {
                                    where: "dropdown",
                                    data: {
                                        condition: "is",
                                        value: "H",
                                    },
                                },
                            ],
                        },
                        {
                            where: "text",
                            data: {
                                value: "I",
                            },
                        },
                    ],
                },
            ],
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
