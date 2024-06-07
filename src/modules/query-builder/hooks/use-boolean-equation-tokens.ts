import { useMemo } from "react";

export function useBooleanEquationTokens(booleanEquation: string | null) {
    return useMemo(() => {
        if (!booleanEquation) return null;

        return booleanEquation.split(" ")
            .flatMap(token => token.match(/[\w-]+|[()]/g) || [])
            .reduce((acc, token) => {
                if (token === "(" || token === ")") {
                    const newToken = token === "(" ? `(::${++acc.level}` : `)::${acc.level--}`;
                    acc.tokens.push(newToken);
                } else {
                    acc.tokens.push(token);
                }
                return acc;
            }, { tokens: [] as string[], level: 0 }).tokens;
    }, [booleanEquation]);
}
