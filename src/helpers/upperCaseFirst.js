// converts the first letter of a string to uppercase
export default function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}