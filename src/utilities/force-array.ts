export function forceArray<T = unknown>(item: T | T[]): T[] {
    if (!Array.isArray(item)) {
        return [item];
    }
    return item;
}
