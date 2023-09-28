import upperCaseFirst from "./upperCaseFirst.js";

// Takes a kebab-case string and converts it to PascalCase
export default function toPascalCase(str) {
	// make sure this is a valid string and this makes sense
	if (typeof str === "string") {
		// remove dashes
		let fragments = str.split("-");
		// uppercase each fragment
		fragments = fragments.map(s => upperCaseFirst(s));
	  // pull them together
	  return fragments.join("");
	}

  // error handling
  return "invalid string passed to toPascalCase()";
}