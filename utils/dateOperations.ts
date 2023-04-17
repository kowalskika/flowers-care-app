export const addDaysToDbString = (date: Date, days: number) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy.toISOString().slice(0, 19).replace('T', ' ');
};

export const addDaysToLocaleDateString = (date: Date, days: number) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy.toLocaleDateString('fr-CH');
};

export const dateStringToDBDateString = (dateString: string): string => {
  const date = dateString.split('.');
  return (`${date[2]}-${date[1]}-${date[0]}`);
};

export const dateToLocaleDateString = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-CH');
};
