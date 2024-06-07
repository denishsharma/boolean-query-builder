import ColorHash from "color-hash";
import { Fragment, type ReactNode, useMemo } from "react";

import { BooleanOperationItem } from "~/modules/query-builder/components/boolean-operation-item";
import { useBooleanEquationTokens } from "~/modules/query-builder/hooks/use-boolean-equation-tokens";
import { cn } from "~/utils/cn";

const booleanBrakcetColorHash = new ColorHash({
    hue: [
        { min: 0, max: 20 }, // Red range
        { min: 20, max: 40 }, // Orange range
        { min: 40, max: 80 }, // Bright yellow-green range
        { min: 160, max: 220 }, // Bright green-blue range
        { min: 200, max: 240 }, // Bright blue range
        { min: 300, max: 340 }, // Pink range
    ],
    saturation: [0.7, 1], // Higher saturation for more vibrant colors
    lightness: [0.5, 0.7], // Adjust lightness to ensure readability on dark backgrounds
});

export function useBooleanEquationElements(booleanEquation: string | null) {
    const tokens = useBooleanEquationTokens(booleanEquation);

    return useMemo(() => {
        if (!tokens) return null;

        const elementCache: { [key: string]: ReactNode } = {};

        const elements = tokens.map((token, index) => {
            const [baseToken, level] = token.split("::");
            const _key = `${token}-${index}`;

            if (level !== undefined) {
                if (!elementCache[_key]) {
                    elementCache[_key] = (
                        <BooleanOperationItem className="border border-dark-50 bg-dark-200" style={{ color: booleanBrakcetColorHash.hex(level) }}>
                            {baseToken}
                        </BooleanOperationItem>
                    );
                }
                return (
                    <Fragment key={_key}>
                        {elementCache[_key]}
                    </Fragment>
                );
            } else {
                if (!elementCache[token]) {
                    const classNames = cn(
                        "border",
                        token === "or" ? "bg-amber-900/20 border-amber-800" : token === "and" ? "bg-blue-900/20 border-blue-800" : "font-medium border-purple-800 bg-purple-900/20",
                    );
                    elementCache[token] = (
                        <BooleanOperationItem className={classNames}>
                            {token}
                        </BooleanOperationItem>
                    );
                }
                return (
                    <Fragment key={_key}>
                        {elementCache[token]}
                    </Fragment>
                );
            }
        });

        return elements;
    }, [tokens]);
}
