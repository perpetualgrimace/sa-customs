<script>
	// from https://github.com/Rich-Harris/pancake/blob/master/site/examples/data/3/App.svelte
	import * as Pancake from '@sveltejs/pancake';
	import * as d3 from 'd3-hierarchy';
	import * as yootils from 'yootils';
	import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { locale } from 'svelte-i18n';

	import InnerTreemap from './InnerTreemap.svelte';

	import { abbreviateNumber } from '../../helpers/formatters.js';

	export const minx = null;
	export const miny = null;
	export const maxx = null;
	export const maxy = null;
	export const mapX = null;
	export const mapY = null;

	export let data = [];

	export let nameKey = name;
	export let onNodeClick = null;

	function process_hierarchy(data) {
		hierarchy = d3.hierarchy(data)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value);

		// TODO tune this later, how to deal with "other"
		const cutoff = 25;
		if (hierarchy.children && hierarchy.children.length > 25) {
			let other_sum = hierarchy.children.slice(25, hierarchy.children.length)
				.reduce((acc, d) => acc + d.value, 0);
			hierarchy.children = hierarchy.children.slice(0, 25);
			hierarchy.children.push({ "name": "Other", "value": other_sum });

			hierarchy = hierarchy;
		}

		return hierarchy;
	}

	// group data into appropriate format
	// I only need to group by, d3-hierarchy will do the summing.
	// for now, only group by country

	const treemap = d3.treemap();
	$: hierarchy = process_hierarchy(data);

	$: console.log("Treemap::hierarchy", hierarchy);

	$:  root = treemap(hierarchy);
	$:  selected = root;

	const select = node => {
		while (node.parent && node.parent !== selected) {
			node = node.parent;
		}
		if (node && node.children) selected = node;
	};
	const breadcrumbs = node => {
		const crumbs = [];
		while (node) {
			crumbs.unshift(node.data.name)
			node = node.parent;
		}
		return crumbs.join('/');
	};

	const extents = tweened(undefined, {
		easing: eases.cubicOut,
		duration: 400
	});

	const is_visible = (a, b) => {
			while (b) {
				if (a.parent === b) return true;
				b = b.parent;
			}
			return false;
		};

	$: $extents = {
		x1: selected.x0,
		x2: selected.x1,
		y1: selected.y1,
		y2: selected.y0
	};
</script>


<Pancake.Chart x1={$extents.x1} x2={$extents.x2} y1={$extents.y1} y2={$extents.y2} clip={true}>
	<InnerTreemap {root} let:node>
		{#if is_visible(node, selected)}
			<div
				class="vis-tm-node"
				class:is-leaf={!node.children}
				transition:fade={{duration: 400}}
				on:click={node.children && onNodeClick ? onNodeClick(node.data.name) : null}
			>
				<dl class="vis-tm-list u-font-xs">
					<dt class="vis-tm-label">{node.data[nameKey]}</dt>
					<dd class="vis-tm-value">{abbreviateNumber(node.value, $locale, true)}</dd>
				</dl>
			</div>
		{/if}
	</InnerTreemap>
</Pancake.Chart>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.vis-tm {
		padding-bottom: 0;
	}

	.vis-tm-node {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: all;

		&:not(.is-leaf):hover .vis-tm-list {
			background-color: $emerald-light;
		}
	}

	.vis-tm-list {
		/* sizing */
		width: 100%;
		height: 100%;
		padding: 0.25em 0.875em;
		border: 1px solid $navy;
		background-color: $emerald;
		color: $white;
		border-radius: 4px;
		box-sizing: border-box;
		overflow: hidden;
		transition: background-color $timing;
	}

	.vis-tm-label,
	.vis-tm-value {
		@include overflow-ellipsis;
		font-size: $font-xs;
		display: block;
		white-space: nowrap;
		text-align: left;
	}

	.vis-tm-label {
		@include body-font-bold;
	}
</style>

