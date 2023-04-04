export function addDaysToDbString(date: Date, days: number) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy.toISOString().slice(0, 19).replace('T', ' ');
}

export function addDaysToLocaleDateString(date: Date, days: number) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy.toLocaleDateString('fr-CH');
}
