<script>
	import {stores} from '@sapper/app';
	import { _ } from 'svelte-i18n';

	import Hero from '../../components/Hero.svelte';
	import Section from '../../components/Section.svelte';
	import Stat from '../../components/Stat.svelte';
	import Substats from '../../components/Substats.svelte';

	// retrieve slug from store
	const {page} = stores();
	const {slug} = $page.params;

	const title = $_(`ports.${slug.replace("-", "")}`);

	// hero stats
	let statProps = {
		label: "Busiest port",
		timeframe: "2019",
		value: "Jeddah Islamic Port",
	};
	let substatArray = [
		{value: "X", label: "vessel arrivals"},
		{value: "Rank X", label: "worldwide"}
	];
</script>


<svelte:head>
	<title>{title} | {$_("_.title")}</title>
</svelte:head>


<Hero title={title} img={`ports/${slug}-hero`}>
	<Stat {...statProps}>
		<Substats stats={substatArray} />
	</Stat>
</Hero>


<Section title="{title.slice(0, -1)} breakdown">
	<!-- TODO: table -->
	<table>
		<thead>
			<tr>
				<th>col 1</th>
				<th>col 2</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>col 1</td>
				<td>col 2</td>
			</tr>
		</tbody>
	</table>
</Section>


<!-- <Section>
	TODO: costs & regulations
</Section> -->


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>