/**
 * A general-purpose method for checking sorting
 * @param array - an array of data from the page
 * @param order - ‘asc’ (ascending) or ‘desc’ (descending)
 */
export function validateSort(
  array: (string | number)[],
  order: 'asc' | 'desc',
): boolean {
  if (array.length === 0) return false;

  const actualJson = JSON.stringify(array);

  const isNumeric = typeof array[0] === 'number';

  const expectedSorted = [...array].sort((a, b) => {
    if (isNumeric) {
      return order === 'asc'
        ? (a as number) - (b as number)
        : (b as number) - (a as number);
    } else {
      const res = String(a).localeCompare(String(b));
      return order === 'asc' ? res : -res;
    }
  });

  const expectedJson = JSON.stringify(expectedSorted);

  return actualJson === expectedJson;
}

/**
 * A general-purpose method for checking filtering for string values. Can be modified later to fit more criterias.
 * @param array - an array of data from the page
 * @param criteria - string to check is an array elements sutisfy filtering
 */
export function validateFiltering(array: string[], criteria: string): boolean {
  if (array.length === 0) return false;
  else {
    return array.every((s) => s.toLowerCase().includes(criteria.toLowerCase()));
  }
}
