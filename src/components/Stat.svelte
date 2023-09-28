<script>
	import Arrow from "./icons/Arrow.svelte";

	export let label = "Missing `label` prop in Stat component";
	export let timeframe = 2019;
	export let value = "Missing `value` prop in Stat component";
	export let fontSize = "lg";
	export let trend = null; // set to "postive" or "negative" for trend/decline

	const valueTextClass = `stat-value-text heading u-font-${ fontSize }${
		trend === "positive" || trend === "negative" ? ` is-${trend}` : ""
	}`;
</script>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.stat {
		display: inline-block;

		&:not(:last-child) {
			margin-right: $sp-lg;
		}
	}

	.stat-label {
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-label-timeframe {
		opacity: 0.4;
	}

	.stat-value-text {
		display: block;
		line-height: 1;

		/* trend */
		&.is-positive {
			color: $emerald-light;

			.stat-value-arrow {
				transform: rotate(180deg);
			}
		}

		/* decline */
		&.is-negative {
			color: $salmon-light;

			& .stat-value-arrow {
				top: -0.15em;
			}
		}
	}

	.stat-value-arrow {
		display: inline-block; /* needed for transforms */
		vertical-align: middle;
		line-height: 1;
		/* fudge alignment */
		top: -1px;
		/* offset baked in padding */
		margin-left: -0.25em;
		margin-right: -0.25em;

		svg {
			width: 1.125em;
			height: auto;
		}

		path {
			fill: currentColor;
		}
	}
</style>


<dl class="stat">
	<dt class="stat-label u-font-sm">
		{label}

		<b class="stat-label-timeframe">
			<span class="u-visually-hidden">, </span>
			{timeframe}
		</b>
	</dt>

	<dd class="stat-value">
		<span class={valueTextClass}>
			{value}

			{#if trend === "positive" || trend === "negative"}
				<span class="stat-value-arrow">
					<Arrow />
				</span>
			{/if}
		</span>

		<slot />
	</dd>
</dl>