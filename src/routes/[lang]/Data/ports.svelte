<script>
	import { _ } from 'svelte-i18n';

	import Hero from '../../../components/Hero.svelte';
	import Section from '../../../components/Section.svelte';

	export const pages = [
		{
			title: $_("ports.seaports.navLink"),
			slug: "sea-ports"
		},
		{
			title: $_("ports.airports.navLink"),
			slug: "air-ports"
		},
		{
			title: $_("ports.landports.navLink"),
			slug: "land-ports"
		}
	];
</script>


<svelte:head>
	<title>{$_("ports.title")} | {$_("_.title")}</title>
</svelte:head>


<Hero title={$_("ports.title")} img="ports/landing-hero" />

<Section>
	<ul>
		{#each pages as page}
			<li>
				<a href={`./{$locale}/Data/ports/${page.slug}`}>
					{page.title}
				</a>
			</li>
		{/each}
	</ul>	
</Section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>
