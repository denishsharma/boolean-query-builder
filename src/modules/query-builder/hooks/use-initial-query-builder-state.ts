import { useEffect } from "react";

import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

export function useInitialQueryBuilderState() {
    const [loadBooleanQuery] = useQueryBuilderStore(s => [s.loadBooleanQuery]);

    useEffect(() => {
        loadBooleanQuery({
            rule: {
                where: "text",
                data: {
                    value: "A",
                },
            },
            operator: "and",
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
                    operator: "or",
                    operands: [
                        {
                            rule: {
                                where: "text",
                                data: {
                                    value: "D",
                                },
                            },
                            operator: "and",
                            operands: [
                                {
                                    where: "dropdown",
                                    data: {
                                        condition: "is",
                                        value: "E",
                                    },
                                },
                            ],
                        },
                        {
                            where: "text",
                            data: {
                                value: "F",
                            },
                        },
                    ],
                },
            ],
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
