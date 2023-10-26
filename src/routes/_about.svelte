<script context="module">
	import stripExtension from '../helpers/stripExtension.js';

	import enPages from '../i18n/about/en/*.md';
	import arPages from '../i18n/about/ar/*.md';

	export const pages = {
		en: enPages.map(page => page = {
			title: page.metadata.title,
			slug: stripExtension(page.filename),
			content: page.html
		}),
		ar: arPages.map(page => page = {
			title: page.metadata.title,
			slug: stripExtension(page.filename),
			content: page.html
		})
	}
</script>
