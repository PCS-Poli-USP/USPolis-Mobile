// Function that replace all special characters from a string
export function replaceSpecialCharacters(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

}