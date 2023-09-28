<script>
	import { locale } from 'svelte-i18n';
	import * as Pancake from '@sveltejs/pancake';

	import toPascalCase from '../../helpers/toPascalCase.js';
	import { abbreviateNumber } from '../../helpers/formatters.js';

	import Bar from './Bar.svelte';
	import Line from './Line.svelte';
	import Treemap from './Treemap.svelte';

	export let visType = 'bar';

	const visComponents = { Bar, Line, Treemap };
	$: compName = toPascalCase(visType);

	$: showGridLinesX = true;
	$: showGridLinesY = visType === 'line';

	export let minx = null;
	export let miny = null;
	export let maxx = null;
	export let maxy = null;

	export let gridLineHorizontalCount = null;
	export let gridLineVerticalCount = null;

	export let data = [];
	export let mapX = null;
	export let mapY = null;

	export let nameKey = "name";
	export let onNodeClick = null; // treemap only

	const debug = false;
	if (debug) console.log("Vis::data", data);
</script>


<section class="vis vis-{visType.replace("treemap", "tm")}">
	<svelte:component 
		this={visComponents[compName]}
		minx={minx}
		miny={miny}
		maxx={maxx}
		maxy={maxy}
		data={data}
		mapX={mapX}
		mapY={mapY}
		nameKey={nameKey}
		onNodeClick={onNodeClick}
	>
		<Pancake.Grid horizontal count={gridLineHorizontalCount} let:value let:last>
			{#if showGridLinesX}
				<div class="vis-grid-line is-horizontal" />
			{/if}
			<span class="vis-label vis-y-label">
				{value === 0 ? "0" : abbreviateNumber(value, $locale, true, false)}
			</span>
		</Pancake.Grid>

		<Pancake.Grid vertical count={gridLineVerticalCount} let:value>
			{#if showGridLinesY}
				<div class="vis-grid-line is-vertical" />
			{/if}
			<span class="vis-label vis-x-label">{value}</span>
		</Pancake.Grid>
	</svelte:component>
</section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	$padding-offset: 4.5rem;
	$padding-offset-ar: 5.25rem;

	/* rtl:begin:ignore */

	/* chart wrapper */
	.vis {
		min-height: 18rem;
		height: 60vh;
		margin-bottom: auto;

		/* space out from title */
		&, & .vis-bar-wrapper {
			padding: $sp-md 0;
		}

		/* fullscreen mode; take up more space */
		.explorer-vis-wrapper.is-fullscreen & {
			height: 70vh;
		}

		/* make room for labels */
		&.vis-line,
		.vis-bar-wrapper {
			padding-left: $padding-offset;

			[dir="rtl"] & {
				padding-left: $padding-offset-ar;
			}
		}

		/* RTL vis */
		[dir="rtl"] & {
			transform: scaleX(-1);

			.vis-label,
			.vis-tm-list {
				transform: scaleX(-1);
			}
		}
	}

	/* Fix chart alignment visal bugs */
	.pancake-chart > svg,
	pancake-treemap {
		@include absolute-horizontal-center;
	}
	.pancake-grid {
		position: static;
	}

	/* outer grid container */
	.vis-bar .pancake-chart,
	.vis-line .pancake-chart {
		border: 2px solid #64727E;
		border-radius: $border-radius-sm;
	}

	/* grid lines */
	.vis-grid-line {
		position: relative;
		display: block;
	}
	.vis-grid-line.is-horizontal {
		width: 100%;

		.pancake-grid-item:not(:first-child) > & {
			border-top: 1px solid $navy-dark;
			border-bottom: 1px solid $navy-dark;
		}
	}
	.vis-grid-line.is-vertical {
		height: 100%;

		.pancake-grid-item:not(:first-child):not(:last-child) > & {
			border-left: 1px solid $navy-dark;
			border-right: 1px solid $navy-dark;
		}
	}

	/* labels */
	.vis-label {
		position: absolute;
		font-size: $font-xs;
		color: $white;
	}
	.vis-x-label {
		width: 4em;
		left: -2em;
		bottom: -30px;
		text-align: center;
	}
	.vis-y-label {
		bottom: -0.5em;
		line-height: 1;
		left: -$padding-offset;
		
		[dir="rtl"] & {
			left: -$padding-offset-ar;
		}
	}
	/* rtl:end:ignore */
</style>
