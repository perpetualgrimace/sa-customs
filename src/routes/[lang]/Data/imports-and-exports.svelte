<script context="module">
	export const importPages = [
		{
			title: "importsAndExports.imports.all",
			slug: "all-imports"
		}
	];

	export const exportPages = [
		{
			title: "importsAndExports.exports.all",
			slug: "all-exports"
		}
	];
</script>


<script>
	import { locale, _ } from 'svelte-i18n';

	import Hero from '../../../components/Hero.svelte';
	import Section from '../../../components/Section.svelte';
	import Card from '../../../components/Card.svelte';
</script>


<svelte:head>
	<title>{$_("importsAndExports.title")} | {$_("_.title")}</title>
</svelte:head>


<Hero title={$_("importsAndExports.title")} img="imports-and-exports/all-hero" />

<Section layout="2col">
	<div class="section-col">
		<h2 class="u-margin-bottom-md u-font-xl">{$_("_.imports")}</h2>
		<ul>
			{#each importPages as page}
				<Card
					title={$_(page.title)}
					href="./{$locale}/Data/imports-and-exports/imports/{page.slug}"
					img="imports-and-exports/all"
				/>
			{/each}
		</ul>
	</div>

	<div class="section-col">
		<h2 class="u-margin-bottom-md u-font-xl">{$_("_.exports")}</h2>
		<ul>
			{#each exportPages as page}
				<Card
					title={$_(page.title)}
					href="./{$locale}/Data/imports-and-exports/exports/{page.slug}"
					img="imports-and-exports/all"
				/>
			{/each}
		</ul>
	</div>
</Section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>
