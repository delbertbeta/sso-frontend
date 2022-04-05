export function safeGetStorage<T>(key: string) {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return item as null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function safeSetStorage<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.log(e);
  }
}

export function safeDeleteStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
}
