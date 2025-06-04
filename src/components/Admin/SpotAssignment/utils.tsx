export function remapMap(input: Map<string, string[]>): Map<string, string[]> {
  const result = new Map<string, string[]>();

  for (const [key, values] of input.entries()) {
    for (const val of values) {
      if (!result.has(val)) {
        result.set(val, []);
      }
      result.get(val)!.push(key);
    }
  }

  return result;
}