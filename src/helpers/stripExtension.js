// https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript#answer-47956767
export default function stripExtension(str) {
  return str.substring(0, str.lastIndexOf('.')) || str
}