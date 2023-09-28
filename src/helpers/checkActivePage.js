export default function checkActivePage(href, segment) {

	// TODO: active page check for nested links in nav & footer

	// // error handling
	// if(!href || typeof href !== "string") {
	// 	console.log("`href` isn't a string in checkActivePage()");
	// 	return null;
	// }
	// if(!segment || typeof segment !== "string") {
	// 	console.log("`segment` isn't a string in checkActivePage()");
	// 	return null;
	// }

	// // remove ./ from href
	// const slug = href.substring(2);
	// const parentDir = slug.split("/").length ? slug.split("/")[0] : null;

	// // simplest case
	// if (slug === segment) return true;
	// // imports-and-exports sub pages
	// else if ((segment === "imports" || segment === "exports") && slug === "imports-and-exports") {
	// 	return true;
	// }
	// // about sub pages
	// else if (segment === "about" && parentDir === segment) return true;

	return false;
}