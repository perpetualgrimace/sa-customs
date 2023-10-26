<script>
	import { locale, _ } from 'svelte-i18n';

	import convertArrayOfObjectsToCSV from '../helpers/convertArrayOfObjectsToCSV.js';
	import slugify from '../helpers/slugify.js';

	import Button from '../components/Button.svelte';
	import ButtonGroup from '../components/ButtonGroup.svelte';
	import Section from '../components/Section.svelte';
	import Select from '../components/Select.svelte';
	import StatCard from '../components/StatCard.svelte';

	import Expand from '../components/icons/Expand.svelte';
	import Contract from '../components/icons/Contract.svelte';

	import Vis from '../components/vis/Vis.svelte';
	import Table from '../components/vis/Table.svelte';

	import Bar from '../components/icons/vis/Bar.svelte';
	import Line from '../components/icons/vis/Line.svelte';
	// import StackedArea from '../components/icons/vis/StackedArea.svelte';
	// import Donut from '../components/icons/vis/Donut.svelte';
	import Treemap from '../components/icons/vis/Treemap.svelte';

	import {group_hierarchical_data} from '../helpers/data.js'


	// data
	import {explorer_imports_year_country_product} from '../data/explorer_imports_year_country_product.svelte';
	import {explorer_imports_year_country} from '../data/explorer_imports_year_country.svelte';
	import {explorer_imports_year_product} from '../data/explorer_imports_year_product.svelte';
	import {explorer_imports_year} from '../data/explorer_imports_year.svelte';
	import {explorer_exports_year_country_product} from '../data/explorer_exports_year_country_product.svelte';
	import {explorer_exports_year_country} from '../data/explorer_exports_year_country.svelte';
	import {explorer_exports_year_product} from '../data/explorer_exports_year_product.svelte';
	import {explorer_exports_year} from '../data/explorer_exports_year.svelte';

	// dims
	import {explorer_countries} from '../data/explorer_countries.svelte';
	import {explorer_hs2} from '../data/explorer_hs2.svelte';

	/////////////////////////////////
	// data
	/////////////////////////////////

	const importData = {
		year_country_product: explorer_imports_year_country_product,
		year_country: explorer_imports_year_country,
		year_product: explorer_imports_year_product,
		year: explorer_imports_year,
	};
	const exportData = {
		year_country_product: explorer_exports_year_country_product,
		year_country: explorer_exports_year_country,
		year_product: explorer_exports_year_product,
		year: explorer_exports_year,
	};

	// for joining with hierarchical data
	const explorer_countries_map = new Map(explorer_countries.map(d => { return [d.id, d.name] } ));
	const explorer_hs2_map = new Map(explorer_hs2.map(d => { return [d.id, d.name] } ));

	if (debug) {
		console.log("Explorer::explorer_countries", explorer_countries);
		console.log("Explorer::explorer_countries_map", explorer_countries_map);
	}

	/////////////////////////////////
	// defaults
	/////////////////////////////////

	const debug = false;

	// initial state
	let mode = "import";   // or "export"
	let showVis = true;    // or `false` to show data table instead
	let visType = "bar";   // "bar", "line", "stacked-area", "donut", "treemap"
	let data = importData;

	let fullscreen = false;

	// space before ensures All will be at top of list even after sorting
	const countriesList = [
		{ id: "all-countries", name: " All countries", name_ar: " جميع الدول" },
	];
	const productsList = [
		{ id: "all-products", name: " All products", name_ar: " جميع المنتجات" },
	];

	countriesList.push(...explorer_countries);
	productsList.push(...explorer_hs2);

	// NOTE: only one year option will be rendered
	// see date & data range Selects below
	const yearsList = [
		{ id: "2015", name: "2015" },
		{ id: "2016", name: "2016" },
		{ id: "2017", name: "2017" },
		{ id: "2018", name: "2018" },
		{ id: "2019", name: "2019" }
	];

	let selected = {
		country: "11" || countriesList[0].id,
		product: productsList[0].id,
		fromYear: yearsList[0].id,
		toYear: yearsList[4].id
	};

	/////////////////////////////////
	// logic
	/////////////////////////////////

	$: nameKey = $locale === "en" ? "name" : "name_ar";

	const visTypes = [
		{ type: "bar", icon: Bar },
		{ type: "line", icon: Line },
		// { type: "stacked-area", icon: StackedArea },
		// { type: "donut", icon: Donut },
		{ type: "treemap", icon: Treemap }
	];

	// switch between imports & exports
	function toggleMode(value) {
		mode = value;
		data = (mode == "import") ? importData : exportData;
		console.log("mode changed:", mode);
		console.log("mode changed: data:", data);
	}

	// show either a visualization or a table
	function toggleShowVis(boolean) {
		showVis = boolean;
	}

	// choose a visualization type
	function setVisType(value) {
		visType = value;
		console.log("visType changed:", visType)
	}

	// minimize or maximize the visualization
	function toggleFullscreen() {
		fullscreen = !fullscreen;
	}

	// update selected dropdown value
	function updateSelected(field, value) {
		// error handling
		if ((!field || !value) && debug) {
			console.log("missing `field` or `value` argument in importChangeValue()");
			return null;
		}

		selected[field] = value;

		if (debug) {
			console.log(`selected.${field} changed to ${selected[field]}`);
		}
	}

	// takes in a visType, returns bool
	// used to determine if all_dim should return just the sum or all individual rows
	function isTimeSeries(vis) {
		return (vis == "bar") || (vis == "line") || (vis == "stacked-area")
	}

	// internal logic for fetching time series data only
	// country is a string (which may be "all-countries")
	// product is a string (which may be "all-products")
	// returns selected data.
	function _fetchDataAsTimeSeries(datasets, years, country, product) {
		let dataset; // must be used below, matching should be exhaustive
		let cp_key = null;

		if (country == "all-countries" && product == "all-products") {
			dataset = datasets.year;
		} else if (country == "all-countries") {
			dataset = datasets.year_product;
			cp_key = product;
		} else if (product == "all-products") {
			dataset = datasets.year_country;
			cp_key = country;
		} else {
			dataset = datasets.year_country_product;
			cp_key = country + "-" + product;
		}
		if (debug) {
			console.log("dataset", dataset);
			console.log("country", country);
			console.log("product", product);
		}

		// now map the years to data.
		return years.map(year => {
			let key = year;
			if (cp_key != null) {
				key = key + "-" + cp_key;
			}

			let res = { year: parseInt(year), value: dataset.get(key) };

			if (debug) {
				console.log("key", key);
				console.log("res", res);
			}

			return res;
		})
	}

	// for non-time-series, "hierarchical" data where selecting all-x will
	// show each item, instead of a total. Internal logic for fetchData.
	//
	// Part of the process is joining the labels for countries and products.
	//
	// This differs from fetching in _fetchDataAsTimeSeries, which generates
	// the exact key and then maps those keys to data. Here, since all-x
	// will get all related rows, we'll filter.
	//
	// country is a string (which may be "all-countries")
	// product is a string (which may be "all-products")
	// returns selected data.
	function _fetchDataAsHierarchical(datasets, years, country, product) {
		let dataset = datasets.year_country_product;
		// toYear should be the last year in the range, and hierarchical graphs
		// use toYear as the year selector
		let year = years[years.length - 1];

		let selected_country = null;
		let selected_product = null;

		if (country == "all-countries" && product == "all-products") {
			// do nothing
		} else if (country == "all-countries") {
			selected_product = product;
		} else if (product == "all-products") {
			selected_country = country;
		} else {
			selected_product = product;
			selected_country = country;
		}

		if (debug) {
			console.log("dataset", dataset);
			console.log("country", country);
			console.log("product", product);
			console.log("hier: year", year);
			console.log("hier: selected_country", selected_country);
			console.log("hier: selected_product", selected_product);
			console.log("hier: selected dataset", dataset);
		}

		// now filter rows by year, country, and product
		// reduce does filter/map in one shot
		// do group by in treemap, just return country and product here
		// slow but whatever, this code is not final.
		let selected_data = [];
		for (let [k, v] of dataset) {
			//console.log("hier::filter::hit");
			// process key
			let [ year_key, country_key, product_key ] = k.split("-");

			// default is to select row, when there is no selected product or country, then
			// we want all rows.
			let is_selected = true;
			if (selected_country && selected_product) {
				is_selected = (year == year_key) && (selected_country == country_key) && (selected_product == product_key);
			} else if (selected_country) {
				is_selected = (year == year_key) && (selected_country == country_key);
			} else if (selected_product) {
				is_selected = (year == year_key) && (selected_product == product_key);
			};

			if (is_selected) {
				// map labels to key
				// pull in dropdowns from outer scope
				let country_label = explorer_countries_map.get(country_key);
				let product_label = explorer_hs2_map.get(product_key);
				let res = { country: country_label, product: product_label, value: v };
				selected_data.push(res);
			}
		}

		console.log("hier::selected_data", selected_data);

		// country is the default grouping, so only group by product if product == "all-products"
		let grouped_data = product == "all-products"
			? group_hierarchical_data(selected_data, "country", "product")
			: group_hierarchical_data(selected_data, "product", "country")

		console.log("hier::grouped_data", grouped_data);

		return grouped_data;
	}

	// data is importData or exportData, depending on whether mode is import or export (set reactively)
	// years is a list
	// country is a string (which may be "all-countries")
	// product is a string (which may be "all-products")
	// returns an array of objects { year, value }
	function fetchData(vis, datasets, years, country, product) {

		if (debug) console.log("isTimeSeries:", isTimeSeries(vis));

		return isTimeSeries(vis)
			? _fetchDataAsTimeSeries(datasets, years, country, product)
			: _fetchDataAsHierarchical(datasets, years, country, product);
	}

	function calc_min_max(data) {
		let miny = +Infinity;
		let maxy = -Infinity;

		for (let i = 0; i < data.length; i += 1) {
			const point = data[i];

			if (point.value < miny) {
				miny = point.value;
			}

			if (point.value > maxy) {
				maxy = point.value;
			}
		}

		return [miny, maxy];
	}

	// reset controls to parent node
	// TODO: make more efficient (need to add id to nodes to avoid this find)
	function onNodeClick(node) {
		const countryId = countriesList.find(c => c.name === node).id;

		updateSelected("country", countryId);
	}

	// Main logic and reactivity

	// These are parsed into integers to make range easy, then turned back into strings
	$: minx = parseInt(selected.fromYear);
	$: maxx = parseInt(selected.toYear);
	$: if (maxx < minx) {
		maxx = minx;
	}
	$: yearRange = Array(maxx - minx + 1).fill(minx).map((el, idx) => el + idx).map(n => String(n));

	// generate a subset of yearsList for from/to year selects
	$: fromYears = yearsList.filter(y => parseInt(y.id) < maxx);
	$: toYears = yearsList.filter(y => parseInt(y.id) > minx);

	if (debug) {
		console.log("minx", minx);
		console.log("maxx", maxx);
		console.log("yearRange", yearRange);
	}

	// Time series data
	$: selectedData = fetchData(visType, data, yearRange, selected["country"], selected["product"]);

	let mapX = d => d.year;
	let mapY = d => d.value;

	// TODO add padding?
	$: minmaxy = calc_min_max(selectedData);
	// always use miny at 0 for this app.
	$: miny = 0;
	$: maxy = minmaxy[1];

	let gridLineHorizontalCount = 10;
	$: gridLineVerticalCount = maxx - minx + 1;

	// download selected data
	$: downloadData = "data:text/csv;charset=utf-8," + encodeURI(convertArrayOfObjectsToCSV(selectedData));
	$: downloadFilename = slugify(`${
			$_("_.title")
		 }-${
		 	$_("dataExplorer.vis")
		 }-${
		 	$_(`_.${mode}s`)
		 }-${
		 	selected.product
		 }-${
		 	selected.country
		 }`) + '.csv';

</script>


<svelte:head>
	<title>{$_("dataExplorer.navLink")} | {$_("_.title")}</title>
</svelte:head>


<h1 class="u-visually-hidden">{$_("dataExplorer.navLink")}</h1>

<Section layout="sidebar" fullwidth={true}>
	<!-- sidebar controls -->
	<form class="explorer-controls sidebar" aria-controls="vis-display">
		<h2 class="u-visually-hidden">{$_("dataExplorer.controlsLabel")}</h2>

		<!-- import/export select -->
		<ButtonGroup label={$_("_.importExportControlLabel")} classes="u-margin-bottom-sm" inline={false}>
			<Button
				on:click={() => toggleMode("import")}
				pressed={mode === "import"}
			>
				{$_("_.imports")}
			</Button>
			<Button
				on:click={() => toggleMode("export")}
				pressed={mode === "export"}
			>
				{$_("_.exports")}
			</Button>
		</ButtonGroup>

		<!--
			NOTE: a select for measure could go here,
			or it could replace the import/export select
		-->

		<!-- visualization or table -->
		{#if visType !== "treemap"}
			<ButtonGroup label={$_("dataExplorer.displayLabel")} classes="u-margin-top-lg u-margin-bottom-sm" inline={false}>
				<Button
					on:click={() => toggleShowVis(true)}
					pressed={showVis === true}
				>
					{$_("dataExplorer.vis")}
				</Button>
				<Button
					on:click={() => toggleShowVis(false)}
					pressed={showVis === false}
				>
					{$_("dataExplorer.visTypes.table")}
				</Button>
			</ButtonGroup>
		{/if}

		<!-- visualization type -->
		{#if showVis}
			<ButtonGroup label={$_("dataExplorer.vis")} classes="u-margin-top-{ visType === "treemap" ? "lg" : "sm" }" inline={false}>
				{#each visTypes as vis}
					<Button
						on:click={() => setVisType(vis.type)}
						pressed={visType === vis.type}
						classes="explorer-controls-button"
					>
						<span class="u-visually-hidden">{$_(`dataExplorer.visTypes.${vis.type}`)}</span>
						<svelte:component this={vis.icon} />
					</Button>
				{/each}
			</ButtonGroup>
		{/if}

		<!-- destination country / country of origin -->
		<Select
			label={mode === "import" ? $_("_.countryOfOrigin") : $_("_.destinationCountry")}
			classes="u-margin-top-lg u-margin-bottom-sm"
			options={countriesList}
			nameKey={nameKey}
			onChange={e => updateSelected("country", e.target.value)}
			value={selected.country}
		/>

		<!-- product -->
		<Select
			label={mode === "import" ? $_("_.productImported") : $_("_.productExported")}
			classes="u-margin-bottom-sm"
			value={selected.product}
			options={productsList}
			onChange={e => updateSelected("product", e.target.value)}
		/>

		<!-- date -->
		{#if showVis && (visType === "donut" || visType === "treemap")}
			<Select
				label={$_("_.year")}
				classes="u-margin-bottom-md"
				value={selected.toYear}
				options={yearsList}
				onChange={e => updateSelected("toYear", e.target.value)}
			/>
		<!-- date range -->
		{:else}
			<div class="explorer-year-select-wrapper">
				<Select
					label={$_("_.yearFrom")}
					value={selected.fromYear}
					options={fromYears}
					onChange={e => updateSelected("fromYear", e.target.value)}
				/>
				<Select
					label={$_("_.yearTo")}
					value={selected.toYear}
					options={toYears}
					onChange={e => updateSelected("toYear", e.target.value)}
				/>
			</div>
		{/if}

		{#if visType !== "treemap"}
			<Button href={downloadData} download={downloadFilename} classes="u-margin-top-lg" block={true}>
				{$_("dataExplorer.downloadButton")}
			</Button>
		{/if}
	</form>


	<!-- visualization -->
	<figure
		class={`explorer-vis-wrapper u-center${ fullscreen ? " is-fullscreen" : "" }`}
		id="vis-display"
		aria-live="polite"
	>
		<!-- title -->
		<figcaption class="explorer-vis-heading heading u-font-xl u-margin-bottom-md">
			{$_(showVis ? `dataExplorer.visTypes.${visType}` : "dataExplorer.visTypes.table")}
		</figcaption>

		<!-- fullscreen toggle button -->
		<Button classes="explorer-vis-button" fontSize="md" on:click={toggleFullscreen}>
			{#if !fullscreen}
				<span class="u-visually-hidden">{$_("dataExplorer.enlargeVisualization")}</span>
				<Expand />
			{:else}
				<span class="u-visually-hidden">{$_("dataExplorer.minimizeVisualization")}</span>
				<Contract />
			{/if}
		</Button>

		<!-- the vis itself -->
		{#if showVis}
			<Vis
				visType={visType}
				minx={minx}
				miny={miny}
				maxx={maxx}
				maxy={maxy}
				gridLineHorizontalCount={gridLineHorizontalCount}
				gridLineVerticalCount={gridLineVerticalCount}
				data={selectedData}
				mapX={mapX}
				mapY={mapY}
				nameKey="name"
				onNodeClick={onNodeClick}
			/>
			<!-- TODO: change "name" above to `nameKey` once Arabic explorer products are in -->
		{:else}
			<Table data={selectedData} />
		{/if}
	</figure>
</Section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.explorer-vis-wrapper {
		/* center content */
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* positioning */
		margin-top: $sp-md;
		margin-bottom: $sp-md;
		padding: $sp-lg;
		/* theming */
		background-color: $navy;

		/* offset x height */
		.explorer-vis-heading {
			margin-top: -0.5em;
		}

		/* take up all the space */
		&.is-fullscreen {
			@include absolute-expand;
			position: fixed;
			top: $nav-height;
			margin-top: 0;
			height: calc(100% - #{$nav-height});
			width: 100% !important; /* override sidebar layout */
			z-index: 999;
			border-top: 1px solid $navy-dark;

			/* keep content centered */
			.explorer-vis-heading {
				margin-top: auto;
			}

			/* keep button in the same place */
			.explorer-vis-button {
				top: calc(1.5rem + #{$sp-md});
				right: 1.55rem; /* fudged */
			}
		}

		/* fullscreen toggle */
		.explorer-vis-button {
			/* positioning */
			position: absolute;
			top: -0.5em;
			right: -0.5em;
			/* Button overrides */
			padding: 0.5em;
			border-radius: 50%;
			background-color: $navy-light;
		}
	}

	.explorer-controls {

		/* line up with vis */
		@media (min-width: $bp-sm) {
			margin-top: -$sp-xs;
			margin-bottom: $sp-md;
		}

		.explorer-controls-button {
			padding: 0.75em 0.25em;
		}

		.explorer-year-select-wrapper {
			display: flex;
			justify-content: space-between;

			& > * {
				width: calc(50% - #{$sp-sm});
			}
		}
	}
</style>
