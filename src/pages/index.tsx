import { createFileRoute } from "@tanstack/react-router";

import { QueryBuilderFragment } from "~/modules/query-builder/query-builder-fragment";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <QueryBuilderFragment />
    );
}
