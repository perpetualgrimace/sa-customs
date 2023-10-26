<script context="module">
	import { locale, _ } from 'svelte-i18n';

	import findPage from '../../helpers/findPage.js';
	import { pages } from '../_about.svelte';

	import Hero from '../../components/Hero.svelte';
	import Section from '../../components/Section.svelte';

	// use slug to find current page in list of pages
	export function preload(page) {

		// let p = findPage(page.params.slug, pages[page.params.lang]);
		let p = findPage(page.params.slug, pages["en"]);

		return { p };
	}
</script>


<script>
	export let p = { title: "title", slug: "slug", content: "content" };
</script>


<svelte:head>
	<title>{p.title} | {$_("_.title")}</title>
</svelte:head>


<!-- TODO: more hero images -->
<Hero title={p.title} img={`about/${p.slug}-hero`} />


<Section layout="sidebar">

	<!-- TODO: sidebar component -->
	<ul class="sidebar">
		<li><a href="about/definitions" aria-current={p.slug === "definitions" ? "page" : null}>
			{$_("about.definitions.navLink")}
		</a></li>
		<li><a href="about/disclaimer" aria-current={p.slug === "disclaimer" ? "page" : null}>
			{$_("about.disclaimer.navLink")}
		</a></li>
	</ul>

	<article class="content">
		{@html p.content}
	</article>

</Section>


<style lang="scss">
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>
