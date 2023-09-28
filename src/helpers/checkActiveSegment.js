export default function checkActiveSegment(href, segment, locale) {

	// error handling
	if (!href || typeof href !== "string") {
		console.log("`href` isn't a string in checkActiveSegment()");
		return null;
	}
	if (!segment || typeof segment !== "string") {
		// it's probably the home page, probably
		if (typeof segment === "undefined") {
			return null;
		}
		console.log("`segment` isn't a string in checkActiveSegment()");
		return null;
	}
	if (typeof locale === "undefined") {
		console.log("`locale` isn't a string in checkActiveSegment()");
		return null;
	}

	const parentDir = href.split("/").length ? href.split("/")[0] : null;


	// simplest case
	if (href === segment) {
		return true;
	}

	// imports-and-exports sub pages
	else if ((segment === "imports" || segment === "exports") && href === "imports-and-exports") {
		return true;
	}
	else if ((segment === "imports") && parentDir === "imports") {
		return true;
	}
	else if ((segment === "exports") && parentDir === "exports") {
		return true;
	}

	// about sub pages (no listing page in this case)
	else if (segment === "about" && parentDir === segment) {
		return true;
	}

	// no match
	return false;
}