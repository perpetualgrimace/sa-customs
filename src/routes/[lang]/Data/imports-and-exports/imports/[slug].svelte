<script>
	import {stores} from '@sapper/app';
	import { locale, _ } from 'svelte-i18n';

	import findPage from '../../../../../helpers/findPage.js';
	import truncateProduct from '../../../../../helpers/truncateProduct.js';
	import {abbreviateNumber, addCommas, growth, removeTrailingZeroes, removeDecimal, isPositive} from '../../../../../helpers/formatters.js';

	import {importPages} from '../../imports-and-exports.svelte';

	import Hero from '../../../../../components/Hero.svelte';
	import Section from '../../../../../components/Section.svelte';
	import Stat from '../../../../../components/Stat.svelte';
	import Substats from '../../../../../components/Substats.svelte';
	import Toplist from '../../../../../components/Toplist.svelte';

	// data
	import {customs_imports_2019_total as importsTotal} from "../../../../../data/customs_imports_2019_total.svelte";
	import {customs_imports_growth_total as importsGrowth} from "../../../../../data/customs_imports_growth_total.svelte";
	import {customs_imports_2019_hs4_top_10 as importsTopProducts} from "../../../../../data/customs_imports_2019_hs4_top_10.svelte";
	import {customs_imports_2019_countries_top_10 as importsTopCountries} from "../../../../../data/customs_imports_2019_countries_top_10.svelte";

	// retrieve slug from store
	const {page} = stores();
	const {slug} = $page.params;

	// use slug to find current page in list of pages
	export let p = findPage(slug, importPages);
	$: pageTitle = $_(`importsAndExports.imports.${p.slug.split("-")[0]}`);

	export let imgPath = `imports-and-exports/${
		slug.replace("-imports", "").replace("-product", "")
	}-hero`;

	// hero stats
	$: heroStats = [
		{
			label: $_("importsAndExports.imports.totalSeaportImports"),
			timeframe: "2019",
			value: abbreviateNumber(importsTotal.get("2019") * 1000000, $locale, true),
			fontSize: "xl"
		},
		{
			label: $_("_.growth"),
			timeframe: "2018–2019",
			value: growth(importsGrowth.get("2019")),
			trend: isPositive(importsGrowth.get("2019")) ? "positive" : "negative",
			fontSize: "xl"
		}
	];

	// top lists
	$: nameKey = $locale === "en" ? "name" : "name_ar";

	$: topProducts = importsTopProducts.map(product => Object.assign({}, {
		name: product.name,
		name_ar: product.name_ar,
		value: abbreviateNumber(product.value * 1000000, $locale, true)
	}));

	$: topExporters = importsTopCountries.map(country => Object.assign({}, {
    name: country.name,
    name_ar: country.name_ar,
    value: abbreviateNumber(country.value * 1000000, $locale, true)
	}));
</script>


<svelte:head>
	<title>{pageTitle} | {$_("_.title")}</title>
</svelte:head>


<Hero title={pageTitle} img={imgPath}>
	{#each heroStats as statProps}
		<Stat {...statProps} />
	{/each}
</Hero>


<!-- <Section layout="2col">
	<div class="section-col u-left-center">
		<h2>{p.title.slice(0, -1)} share over time</h2>
		<p>[stacked area]</p>
	</div>

	<div class="section-col u-left-center">
		<h2>{p.title.slice(0, -1)} value over time</h2>
		<p>[line chart]</p>
	</div>

	<p class="legend u-left-center">[legend]</p>
</Section> -->


<Section layout="2col">
	<div class="section-col u-margin-bottom-md">
		<Toplist
			title={$_("importsAndExports.topProductsByValue")}
			timeframe="2019"
			items={topProducts}
			nameKey={nameKey}
			classes="u-margin-top-sm"
			fontSize="md"
			valueAlignment="right"
		/>
	</div>

	<div class="section-col u-margin-bottom-md">
		<Toplist
			title={$_("importsAndExports.topExportersByValue")}
			timeframe="2019"
			classes="u-margin-top-sm"
			items={topExporters}
			nameKey={nameKey}
			showFlags={true}
			valueAlignment="right"
		/>
	</div>
</Section>


<style lang="scss">
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	/*.legend {
		flex: 1 0 100%;
		flex-wrap: wrap;
	}*/
</style>
