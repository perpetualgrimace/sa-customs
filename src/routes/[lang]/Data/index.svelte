<script>
	import { locale, _ } from 'svelte-i18n';

	import {roundDecimal, removeDecimal} from "../../../helpers/formatters.js";

	import HomeHero from '../../../components/HomeHero.svelte';
	import Section from '../../../components/Section.svelte';
	import Select from '../../../components/Select.svelte';
	import Card from '../../../components/Card.svelte';
	import StatCard from '../../../components/StatCard.svelte';
	import Toplist from '../../../components/Toplist.svelte';

	import AdvancedApplication from "../../../components/icons/stat-card/AdvancedApplication.svelte";
	import ClearanceTime from "../../../components/icons/stat-card/ClearanceTime.svelte";
	import CustomsDuty from "../../../components/icons/stat-card/CustomsDuty.svelte";

	import importAvgClearanceTime from "../../../data/import_avg_clearance.json";
	import exportAvgClearanceTime from "../../../data/export_avg_clearance.json";

	import importAvgClearanceTimeByCountry from "../../../data/import_avg_clearance_by_country.json";
	import exportAvgClearanceTimeByCountry from "../../../data/export_avg_clearance_by_country.json";
	import {import_countries_dropdown} from '../../../data/import_countries.svelte';
	import {export_countries_dropdown} from '../../../data/export_countries.svelte';

	$: statCards = [
		{
			statProps: {
				label: $_("_.avgImportClearanceTime"),
				timeframe: "2019",
				value: `${ roundDecimal(importAvgClearanceTime.ALL) } ${ $_("_.hoursAbbreviated") }`,
				fontSize: "xxl"
			},
			// description: "Time between the point when a ship docks until its cargo leaves the port (average)",
			icon: ClearanceTime,
			// tagText: "X% improvement",
			// tagTrend: "positive"
		},
		{
			statProps: {
				label: $_("_.avgExportClearanceTime"),
				timeframe: "2019",
				value: `${ roundDecimal(exportAvgClearanceTime.ALL) } ${ $_("_.hoursAbbreviated") }`,
				fontSize: "xxl"
			},
			// description: "Reduction in clearance time due to advanced applications (average)",
			icon: AdvancedApplication,
			// tagText: "X% improvement",
			// tagTrend: "positive"
		},
		// {
		// 	statProps: {
		// 		label: "Customs duty",
		// 		timeframe: "2019",
		// 		value: "XX hrs",
		// 		fontSize: "xxl"
		// 	},
		// 	// description: "As a percentage of value (average)",
		// 	icon: CustomsDuty,
		// 	tagText: "X% increase",
		// 	tagTrend: "negative"
		// }
	];

	const topListLimit = 10;
	$: nameKey = $locale === "en" ? "name" : "name_ar";

	// create sorted array of import clearance times
	$: topCountriesByImportClearanceTime = import_countries_dropdown
		.map(country => Object.assign({}, {
			name: country.name,
			name_ar: country.name_ar,
			value: `${roundDecimal( importAvgClearanceTimeByCountry[country.id] )} ${ $_("_.hoursAbbreviated") }`
		}))
		.filter(country =>
			country.value !== `0 ${ $_("_.hoursAbbreviated") }` &&
			country.value !== `undefined ${ $_("_.hoursAbbreviated") }` &&
			country.value !== `NaN ${ $_("_.hoursAbbreviated") }`
		)
		.sort((a, b) => (parseFloat(a.value) > parseFloat(b.value)) ? 1 : -1);
	// create sorted array of export clearance times
	$: topCountriesByExportClearanceTime = export_countries_dropdown
		.map(country => Object.assign({}, {
			name: country.name,
			name_ar: country.name_ar,
			value: `${roundDecimal( exportAvgClearanceTimeByCountry[country.id] )} ${ $_("_.hoursAbbreviated") }`
		}))
		.filter(country => 
			country.value !== `0 ${ $_("_.hoursAbbreviated") }` &&
			country.value !== `undefined ${ $_("_.hoursAbbreviated") }` &&
			country.value !== `NaN ${ $_("_.hoursAbbreviated") }`
		)
		.sort((a, b) => (parseFloat(a.value) > parseFloat(b.value)) ? 1 : -1);

	const relatedCards = [
		{
			title: "importsAndExports.navLink",
			href: "imports-and-exports",
			img: "imports-and-exports/all"
		},
		{
			title: "ctc.navLink",
			href: "clearance-time-calculator",
			img: "clearance-time-calculator"
		},
		{
			title: "dataExplorer.navLink",
			href: "data-explorer",
			img: "data-explorer"
		}
	];
</script>


<svelte:head>
	<title>{$_("_.title")}</title>
</svelte:head>


<HomeHero title={$_("home.headline")} subhead={$_("home.subhead")} img="home-hero" jumpLink="top-countries" />


<Section title={$_("home.statsHeading")} slug="top-countries" layout={`${statCards.length}col`} customInner>
	<div class="section-inner u-margin-top-lg card-section">
		{#each statCards as cardProps}
			<StatCard {...cardProps} />	
		{/each}
	</div>
</Section>


<Section title={$_("home.topCountries")} timeframe="2019" layout="2col">
	<div class="section-col">
		<!-- <Select label="By" inline fontSize="sm" options={topCountriesValues} /> -->
		<Toplist
			title={$_("home.topCountriesByAvgImportClearanceTime")}
			titleFontSize="md"
			items={topCountriesByImportClearanceTime}
			nameKey={nameKey}
			classes="u-margin-top-sm"
			showFlags={true}
			positiveDirection="down"
			limit={topListLimit}
		/>
	</div>

	<div class="section-col">
		<Toplist
			title={$_("home.topCountriesByAvgExportClearanceTime")}
			titleFontSize="md"
			classes="u-margin-top-sm"
			items={topCountriesByExportClearanceTime}
			nameKey={nameKey}
			showFlags={true}
			positiveDirection="down"
			limit={topListLimit}
		/>
		<!-- <p class="u-font-sm">Click a country for trade values</p> -->		
	</div>
</Section>


<!-- TODO: related deck -->
<Section title={$_("home.exploreMoreData")} layout="3col" customInner>
	<ul class="section-inner u-margin-top-lg">
		{#each relatedCards as card}
			<Card title={$_(card.title)} href="./{$locale}/Data/{card.href}" img={card.img} />
		{/each}
	</ul>
</Section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>
