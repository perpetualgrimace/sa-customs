export default function findPage(slug, pagesArr) {

	// error handling
	if(!Array.isArray(pagesArr)) {
		console.log("`pagesArr` isn't an array in findPage()");
		return null;
	}
	if(!slug || typeof slug !== "string") {
		console.log("`slug` isn't a string in findPage()");
		return null;
	}

	// find the slug in the pagesArray & return it
	return pagesArr.find(page => page.slug === slug);
}