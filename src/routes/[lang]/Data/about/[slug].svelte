<script context="module">
	import { locale, _ } from 'svelte-i18n';
	
	import findPage from '../../../../helpers/findPage.js';
	import { pages } from '../_about.svelte';

	import Hero from '../../../../components/Hero.svelte';
	import Section from '../../../../components/Section.svelte';

	// use slug to find current page in list of pages
	export function preload(page) {

		let p = findPage(page.params.slug, pages[page.params.lang]);

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
		<!-- <li><a href="{$locale}/Data/about/background">{$_("about.background.navLink")}</a></li>
		<li><a href="{$locale}/Data/about/calculations">{$_("about.calculations.navLink")}</a></li>
		<li><a href="{$locale}/Data/about/faq">{$_("about.faq.navLink")}</a></li> -->
		<li><a href="{$locale}/Data/about/definitions">{$_("about.definitions.navLink")}</a></li>
		<li><a href="{$locale}/Data/about/disclaimer">{$_("about.disclaimer.navLink")}</a></li>
	</ul>

	<!-- TODO: content -->
	<article class="content">
		{@html p.content}
	</article>

</Section>


<style lang="scss">
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>
