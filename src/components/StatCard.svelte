<script>
	import Stat from "./Stat.svelte";

	export let statProps = {}; // see props exported by Stat.svelte
	// export let description = "missing `description` prop in StatCard component";
	export let description = null;
	export let icon = null;
	// export let tagText = null;
	export let tagTrend = null; // set to "positive" or "negative" for good/bad

	let tagClasses = `stat-card-tag u-font-sm${ 
		tagTrend === "positive" || tagTrend === "negative" ? ` is-${tagTrend}` : ""
	}`;
	let iconClasses = `stat-card-icon${ 
		tagTrend === "positive" || tagTrend === "negative" ? ` is-${tagTrend}` : ""
	}`;
</script>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.stat-card {
		padding: $sp-xl $sp-md $sp-md $sp-md;
		margin-bottom: $sp-lg;
		background-color: $navy-light;

		@media (min-width: $bp-md) {
			margin-bottom: $sp-md;
		}

		.stat[class] {
			margin-right: 0; /* override default */
		}
	}

	.stat-card-description {
		font-size: $font-sm;
		line-height: 1rem;
		margin-top: 0.375em;
	}

	.stat-card-icon {
		/* sizing */
		width: 3rem;
		height: 3rem;
		/* positioning */
		position: absolute;
		top: $sp-sm;
		left: $sp-sm;
		/* theming */
		background-color: $navy;
		border-radius: 50%;

		svg {
			width: 100%;
		}

		path {
			fill: currentColor;
		}
	}

	.stat-card-tag {
		/* sizing */
		padding: 0.5em 1.25em 0.875em 1.25em;
		/* positioning */
		position: absolute;
		top: -0.625em;
		right: -0.625em;
		/* theming */
		@include body-font-bold;
		background-color: $navy;
	}

	.stat-card-tag.is-positive,
	.stat-card-icon.is-positive {
		color: $emerald-light;
	}
	.stat-card-tag.is-negative,
	.stat-card-icon.is-negative {
		color: $salmon-light;
	}

</style>


<article class="stat-card">

	<Stat {...statProps} />
	{#if description}
		<p class="stat-card-description">
			{description}
		</p>
	{/if}

	<div class={iconClasses}>
		<svelte:component this={icon} />
	</div>

	<!-- {#if tagText}
		<p class={tagClasses}>
			{tagText}
		</p>
	{/if} -->
</article>