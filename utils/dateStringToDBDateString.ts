export const dateStringToDBDateString = (dateString: string): string => {
  const date = dateString.split('.');
  const dateObj = new Date(`${date[2]}-${date[1]}-${date[0]}`);
  return dateObj.toISOString().slice(0, 19).replace('T', ' ');
};
