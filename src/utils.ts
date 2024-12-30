export const memoizeWeakMap = <V extends object, R>(fn: (v: V) => R) => {
    const weakMap = new WeakMap<V, R>();
    return (v: V): R => {
        if (weakMap.has(v)) return weakMap.get(v)!;
        const r = fn(v);
        weakMap.set(v, r);
        return r;
    };
};

export function generateIdSync(length: number, charset: string): string {
    let result = "";
    const charsetLength = charset.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      result += charset[randomIndex];
    }
  
    return result;
  }