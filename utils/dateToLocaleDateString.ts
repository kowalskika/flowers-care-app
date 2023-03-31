export const dateToLocaleDateString = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-CH');
};
