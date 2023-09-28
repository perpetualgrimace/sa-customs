<script>
	import * as Pancake from '@sveltejs/pancake';

	export let minx = null;
	export let miny = null;
	export let maxx = null;
	export let maxy = null;

	export let data = [];
	export let mapX = null;
	export let mapY = null;
</script>


<div class="vis-bar-wrapper">
	<Pancake.Chart x1={minx - 0.5} x2={maxx + 0.5} y1={miny} y2={maxy}>
		<slot />

		<Pancake.Columns data={data} x={mapX} y={mapY} width={0.5}>
			<div class="vis-bar-column" />
		</Pancake.Columns>
	</Pancake.Chart>
</div>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.vis-bar-column {
		/* sizing & positioning */
		position: absolute; 
		left: 0;
		width: 100%;
		height: 100%;
		/* theming */
		border: $border-width-sm solid rgba($white, 0.333);
		border-bottom: none;
		border-radius: $border-radius-sm $border-radius-sm 0 0;
		background-color: $emerald;
	}

	.vis-bar-wrapper {
		@include absolute-expand;
	}

	/* 
	hack non-number bars into place
	TODO: investigate
	*/
	.pancake-box[style*="NaN"] {
		bottom: 0% !important;
		height: 0% !important;
	}
</style>
