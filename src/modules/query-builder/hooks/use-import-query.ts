import Ajv from "ajv";
import { useCallback } from "react";
import { toast } from "sonner";

import booleanQueryJsonSchema from "~/../.resources/boolean-query-schema.json";
import { useQueryBuilderStore } from "~/modules/query-builder/stores/query-builder";

const ajv = new Ajv();

export function useImportQuery() {
    const [loadBooleanQuery] = useQueryBuilderStore(s => [s.loadBooleanQuery]);

    const _import = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const content = await file.text();
                const data: any = JSON.parse(content);

                const schemaValidator = ajv.compile(booleanQueryJsonSchema);
                const valid = schemaValidator(data);

                if (!valid) {
                    toast.error("Invalid boolean query schema", { description: "The schema of the query is invalid. Please check the console for more information." });
                    console.info("Schema reference: https://github.com/denishsharma/boolean-query-builder/tree/main/.resources/boolean-query-schema.json"); // eslint-disable-line no-console
                    console.error("Invalid schema", schemaValidator.errors);
                    return;
                }

                delete data.$schema;

                try {
                    loadBooleanQuery(data as any);
                    toast.success("Query loaded successfully", { description: "The query has been loaded successfully. You can now see the changes in the query builder.", dismissible: true });
                } catch (error) {
                    console.error("Failed to load query", error);
                    toast.error("Failed to load query", { description: "Please check the console for more information. If the problem persists, please create an issue on the repository." });
                }
            }
        };
        input.click();
    }, [loadBooleanQuery]);

    return _import;
}
