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


<Pancake.Chart x1={minx} x2={maxx} y1={miny} y2={maxy}>
	<slot />

	<Pancake.Svg>
		<Pancake.SvgLine data={data} x={mapX} y={mapY} let:d>
			<path class="vis-line-path" {d}/>
		</Pancake.SvgLine>
	</Pancake.Svg>
</Pancake.Chart>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	/* theming */
	.vis-line-path {
		stroke: $emerald;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: $border-width-lg;
		fill: none;
	}
</style>
