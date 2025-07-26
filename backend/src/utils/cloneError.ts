export default function cloneError(error: any) {
  const clone = new Error(error.message);
  clone.name = error.name;
  clone.stack = error.stack;

  // Manually copy custom props
  Object.getOwnPropertyNames(error).forEach((key) => {
    if (!(key in clone)) {
      (clone as any)[key] = error[key];
    }
  });

  return clone;
}
