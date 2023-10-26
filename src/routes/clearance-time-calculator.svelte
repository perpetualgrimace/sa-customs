<script>
	import { locale, _ } from 'svelte-i18n';

	const dev = process.env.NODE_ENV === 'development';

	import Button from '../components/Button.svelte';
	import ButtonGroup from '../components/ButtonGroup.svelte';
	import Listbox from '../components/Listbox.svelte';
	import Section from '../components/Section.svelte';
	import Select from '../components/Select.svelte';
	import StatCard from '../components/StatCard.svelte';

	import ClearanceTime from '../components/icons/stat-card/ClearanceTime.svelte';
	import Chevron from '../components/icons/Chevron.svelte';

	import {export_countries_dropdown} from '../data/export_countries.svelte';
	import {import_countries_dropdown} from '../data/import_countries.svelte';
	import {export_ports_dropdown} from '../data/export_ports.svelte';
	import {import_ports_dropdown} from '../data/import_ports.svelte';
	import {export_hs4_dropdown} from '../data/export_hs4.svelte';
	import {import_hs4_dropdown} from '../data/import_hs4.svelte';
	import {export_data} from '../data/export_data.svelte';
	import {import_data} from '../data/import_data.svelte';

	// Delay shipping this
	import {export_hs4_dyn_filter} from '../data/export_hs4_dyn_filter.svelte';
	import {import_hs4_dyn_filter} from '../data/import_hs4_dyn_filter.svelte';

	let importData = {
		ports: import_ports_dropdown,
		countries: import_countries_dropdown,
		hs4: [],
		dyn_hs4: import_hs4_dyn_filter,
		clearanceTime: import_data,
	};
	let exportData = {
		ports: export_ports_dropdown,
		countries: export_countries_dropdown,
		hs4: [],
		dyn_hs4: export_hs4_dyn_filter,
		clearanceTime: export_data,
	};
	let data = importData;

	/////////////////////////////////
	// defaults
	/////////////////////////////////

	let debug = false; // set `dev` or `true` to enable

	let defaultImport = {
		country : "3",   // Japan
		port    : "0",   // Riyadh dry port
		product : "8708" // Motor vehicles
	};
	let defaultExport = {
		country : "3",   // Singapore
		port    : "0",   // Jeddah
		product : "3901" // polymers of ethylene
	};
	// save last import/export state
	let lastSelected = new Map([
		["import", defaultImport],
		["export", defaultExport],
	]);
	let selected = defaultImport;

	let showProductNames = true;

	// default to imports
	let mode = "import"; // or "export"

	/////////////////////////////////
	// logic
	/////////////////////////////////

	$: hs4Key = selected.port + "-" + selected.country;
	$: data.hs4 = data.dyn_hs4.get(hs4Key);
	$: nameKey = $locale === "en" ? "name" : "name_ar";

	$: clearanceKey = selected.port + "-" + selected.country + "-" +  selected.product;
	$: clearanceTime = data.clearanceTime.get(clearanceKey);

	// switch between imports & exports
	function toggleMode(value) {
		// first save the current state
		lastSelected.set(mode, selected);

		// switch to new mode
		mode = value;
		data = mode === "import" ? importData : exportData;

		// get the selected for the new mode
		selected = lastSelected.get(mode);

		if (debug) {
			console.log("mode", mode);
		}
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
			console.log(data);
		}
	}

	// toggle display of product name vs. HS4 code
	function toggleProductFormat(value) {
		showProductNames = value === "name";
	}

	// card X → Y description
	$: arrowChar = $locale === "en" ? "→" : "←";
	$: description = !clearanceTime
		? $_("ctc.InadequateTradeActivityInstructions")
		: mode === "import"
			? `${ data.countries.find(c => c.id === selected.country)[nameKey] } ${ arrowChar } ${ data.ports.find(p => p.id === selected.port)[nameKey] }`
			: `${ data.ports.find(p => p.id === selected.port)[nameKey] } ${ arrowChar } ${ data.countries.find(c => c.id === selected.country)[nameKey] }`;
</script>


<svelte:head>
	<title>{$_("ctc.title")} | {$_("_.title")}</title>
</svelte:head>


<h1 class="ctc-headline u-font-xl u-left-center">{$_("ctc.title")}</h1>

<Section>
	<!-- dataset, product, product format -->
	<div class="ctc-controls">
		<h2 class="u-visually-hidden">{$_("ctc.controlsLabel")}</h2>

		<!-- import/export select -->
		<ButtonGroup label={$_("_.importExportControlLabel")} classes="u-margin-bottom-md">
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

		<!-- product select -->
		<Select
			classes="ctc-product-select u-margin-bottom-md"
			label={$_("ctc.productSelectLabel")}
			inline
			options={data.hs4}
			nameKey={showProductNames ? nameKey : "id"}
			onChange={e => updateSelected("product", e.target.value)}
			value={selected.product}
			fallbackText={$_("ctc.InadequateTradeActivityInstructions")}
		/>

		<!-- product display format -->
		<ButtonGroup label={$_("ctc.productFormatLabel")} classes="u-margin-bottom-md" labelHidden={true}>
			<Button
				on:click={() => toggleProductFormat("name")}
				pressed={showProductNames}
			>
				{$_("ctc.productName")}
			</Button>
			<Button
				on:click={() => toggleProductFormat("code")}
				pressed={!showProductNames}
			>
				{$_("ctc.productCode")}
			</Button>
		</ButtonGroup>
	</div>


	<div class="ctc-lower-wrapper u-margin-bottom-lg">
		<!-- from ➡ to -->
		<div class="ctc-location-list">
			<div class="ctc-location-col">
				<p class="ctc-location-heading heading u-margin-bottom-sm" aria-hidden={true}>
					{mode === "import" ? $_("_.countryOfOrigin") : $_("_.portOfExit")}
				</p>

				{#if mode === "import"}
					<Listbox
						label={$_("_.countryOfOrigin")}
						labelHidden
						options={data.countries}
						nameKey={nameKey}
						onChange={e => updateSelected("country", e.target.value)}
						value={selected.country}
					/>
				{:else}
					<Listbox
						label={$_("_.portOfEntry")}
						labelHidden
						options={data.ports}
						nameKey={nameKey}
						onChange={e => updateSelected("port", e.target.value)}
						value={selected.port}
					/>
				{/if}
			</div>

			<div class="ctc-location-col">
				<p class="ctc-location-heading heading u-margin-bottom-sm" aria-hidden={true}>
					{mode === "import" ? $_("_.portOfEntry") : $_("_.destinationCountry")}
				</p>

				{#if mode === "import"}
					<Listbox
						label={$_("_.portOfEntry")}
						labelHidden
						options={data.ports}
						nameKey={nameKey}
						onChange={e => updateSelected("port", e.target.value)}
						value={selected.port}
						sortKey={showProductNames ? nameKey : "id" }
					/>
				{:else}
					<Listbox
						label={$_("_.destinationCountry")}
						labelHidden
						options={data.countries}
						nameKey={nameKey}
						onChange={e => updateSelected("country", e.target.value)}
						value={selected.country}
						sortKey={showProductNames ? "name" : "id" }
					/>
				{/if}
			</div>
		</div>


		<!-- display clearance time -->
		<StatCard
			statProps={{
				label: $_("_.clearanceTime"),
				timeframe: "2019",
				value: clearanceTime ? `${clearanceTime} ${$_("_.hoursAbbreviated")}` : $_("ctc.InadequateTradeActivity"),
				fontSize: clearanceTime ? "xxl" : "lg"
			}}
			icon={ClearanceTime}
			description={description}
		/>

		<!-- statProps={{
			...
			tagText={`${clearanceTimeImprovement}% improvement`}
			tagTrend={clearanceTimeTrend}
		}} -->
	</div>

	<!-- set `debug` prop to `true` to view console logging -->
	{#if debug === true}
		<div class="debug u-margin-bottom-lg" aria-hidden={true}>
			<h3>🐛 Debug mode engaged, {mode == "import" ? "Imports" : "Exports"} 🐛</h3>
				<ul>
					<li><b>Selected country:</b> {selected.country}</li>
					<li><b>Selected port:</b> {selected.port}</li>
					<li><b>Selected product:</b> {selected.product}</li>
					<li><b>HS4 Key:</b> {hs4Key}</li>
					<li><b>Show product name:</b> {showProductNames}</li>
					<li><b>HS4 dropdown:</b>
						{#if typeof data.hs4 !== "undefined"}
							<ul style="list-style-type: disc; padding-left: 1rem;">
								{#each data.hs4 as product}
									<li><b>{product.id}</b>: {product.name}</li>
								{/each}
							</ul>
						{:else}
							<code>data.hs4</code> is <code>undefined</code>
						{/if}
					</li>
				</ul>
		</div>
	{/if}
</Section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.ctc-headline {
		padding: 1.5em $sp-lg 0 $sp-lg;
	}

	/* top level dropdowns */
	.ctc-controls {
		margin-bottom: $sp-lg;

		/* three columns */
		@media (min-width: $bp-md) {
			/* layout */
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			margin-bottom: $sp-md;

			& > * {
				width: calc(33.333% - #{$sp-sm * 2.625});
			}
		}
	}

	/* layout for locations & stat card */
	.ctc-lower-wrapper {
		@media (max-width: $bp-md - 0.001) {
			.stat-card {
				margin-top: $sp-lg;
				text-align: center;
			}
			.stat-card-icon {
				@include absolute-horizontal-center;
			}
		}
		/* clearance time right */
		@media (min-width: $bp-md) {
			display: flex;
			justify-content: space-between;

			.ctc-location-list {
				width: calc(66.666% - #{$sp-sm * 1.5});
			}

			.stat-card {
				width: calc(33.333% - #{$sp-sm * 2.625});
			}
		}
	}

	.ctc-location-list {
		/* stacked location layout on small screens */
		@media (max-width: $bp-xs - 0.001) {
			.ctc-location-col:first-child {
				margin-bottom: $sp-md;
			}
		}

		/* 2 column location layout */
		@media (min-width: $bp-xs) {
			/* layout */
			display: flex;
			justify-content: space-between;
			/* theming */
			border-top: $border-width-md solid $navy;

			& > * {
				width: calc(50% - #{$sp-sm * 4});

				&:first-child:after {
					@include pseudo;
					position: absolute;
					top: 0;
					right: calc(-#{$sp-lg} - 1px);
					width: $border-width-md;
					height: 100%;
					background-color: $navy;
				}
			}

			.ctc-location-heading {
				margin-top: $sp-sm;
			}

			& + .stat-card {
				margin-bottom: 0; /* override default */
			}
		}
	}

</style>
