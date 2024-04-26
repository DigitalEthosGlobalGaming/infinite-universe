export function parseNumber(val: any) {
    try {
        val = parseFloat(val);
        if (isNaN(val)) {
            return null;
        }
        return val;
    } catch (e) {
        return null;
    }
}
