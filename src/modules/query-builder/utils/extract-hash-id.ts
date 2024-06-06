export function extractHashId(path: string): string {
    const match = path.match(/^(group|rule)::(.*)$/);
    if (!match) {
        throw new Error(`Invalid path: ${path}`);
    }

    return match[2];
}

export function isRulePath(path: string): boolean {
    return path.startsWith("rule::");
}

export function isGroupPath(path: string): boolean {
    return path.startsWith("group::");
}
