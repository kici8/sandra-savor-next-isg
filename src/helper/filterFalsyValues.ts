export const filterFalsyValues = <T>(arr: readonly T[]) =>
  arr.filter(Boolean) as NonNullable<T>[];
