# Boolean Query Builder

Boolean Query Builder is a highly-optimized tool built in React/TypeScript for constructing complex boolean queries.

## Key Features

-   **Deep Nesting Support:** Build arbitrarily complex queries with no React re-render nightmares.
-   **Flat In-Memory Data Structure:** Uses nodes + pointers for O(1) lookups/updates—no recursive tree walks.
-   **Server-Friendly Import/Export:** Seamlessly import/export both the user schema and the current query state.
-   **Transformers:** Map nested server responses into the internal flat format and back again.

### Why Flat vs. Nested?

-   **Constant-Time Updates:** Direct pointer lookups allow updating, deleting, or moving any node in constant time—crucial for real-time editing.
-   **Efficient Rendering:** Flattening avoids expensive tree recursion on every render. State changes only re-render components that touch the changed node.
-   **API Compatibility:** Import/export transformations handle converting between the nested JSON expected by APIs and the flat store used internally.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/denishsharma/boolean-query-builder.git
cd boolean-query-builder
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

---

This project can be used in dynamic forms or admin dashboards. Feedback and contributions are welcome.

## Author

-   **Denish Sharma**
    [denishcommon@gmail.com](mailto:denishcommon@gmail.com)
    [LinkedIn](https://www.linkedin.com/in/denishsharma/)
    [GitHub](https://github.com/denishsharma)

---
