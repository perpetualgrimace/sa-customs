<script>
	import Arrow from "./icons/Arrow.svelte";

	export let title = "Missing `title` prop in Select component";
	export let description = null;
	export let titleFontSize = "xl";

	// `items` prop expects an array of objects, each object with the following keys:
	// `name` (required)
	// `value` 
	// `trend` ("negative" || "positive")
	export let items = [];
	export let nameKey = "name";
	export let timeframe = null;
	export let positiveDirection = "up"; // by default, bigger numbers are better
	export let limit = 10;
	export let valueAlignment = "left"; // or "right"

	export let classes = null;
	export let fontSize = "lg"; // used by item name
	export let showFlags = false;
	let wrapperClass = `${ classes ? `${classes} ` : "" } value-${ valueAlignment }-toplist toplist u-font-${fontSize}`;

	// remove anything that isn't an alphabetical character, then generate img path
	function getFlagSrc(name) {
		let sanitizedName = name.toLowerCase().replace(/[^a-z]+/g, "");
		// now there's no issue with the flag 😒
		if (sanitizedName === "unitedarabemirate") sanitizedName += "s";

		return `flags/${sanitizedName}.png`;
	}

	// which direction do each arrow be
	function getArrowDirection(positiveDirection, trend) {
		if (positiveDirection === "up") {
			return trend === "positive" ? "is-up" : "is-down";
		}
		else {
			return trend === "positive" ? "is-down" : "is-up";
		}
	}
</script>


<div class={wrapperClass}>
	<h2 class={`toplist-title u-font-${titleFontSize}`}>
		{@html title}
		{#if timeframe}
			<span class="toplist-timeframe u-font-sm">
				<span class="u-visually-hidden">(</span>
					{timeframe}
				<span class="u-visually-hidden">)</span>
			</span>
			{/if}
	</h2>
	{#if description}
		<p class="toplist-description u-font-md">{@html description}</p>
	{/if}

	<ol class="toplist-list u-margin-top-sm">
		{#if items.length && Array.isArray(items)}
			{#each items as item, i}
				{#if i < limit}
					<li class={`toplist-item u-font-${fontSize}`}>
						{#if showFlags}
							<span class="toplist-flag">
								<img
									class="toplist-flag-img"
									src={getFlagSrc(item.name)}
									draggable="false"
									loading="lazy"
									width="48"
									height="48"
									alt=""
								>						
							</span>
						{/if}

						<span class="toplist-name heading">{item[nameKey]}</span>

						{#if item.value && item.trend && (item.trend === "positive" || item.trend === "negative")}
							<span class={`toplist-value heading u-font-sm is-${item.trend}`}> {item.value} 
								<span class={`toplist-trend ${getArrowDirection(positiveDirection, item.trend)}`}>
									<Arrow />
								</span>
							</span>
						{:else if item.value}
							<span class="toplist-value heading u-font-sm"> {item.value}</span>
						{/if}
					</li>
				{/if}
			{/each}
		{:else}
			<li class="toplist-item">Missing `items` array in Toplist component</li>
		{/if}
	</ol>
</div>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.toplist-timeframe {
		opacity: 0.333;
	}

	/* horizontal layout */
	.toplist-item {
		display: flex;
		align-items: baseline;
		margin-bottom: $sp-sm;
		height: 1.75rem; /* enforce baseline with different font sizes */

		.toplist-value {
			flex-shrink: 0;
		}
	}

	/* numbering */
	.toplist {
		counter-reset: toplist;
	}
	.toplist-item:before {
		counter-increment: toplist;
		content: counter(toplist) ". ";
		/* typography */
		@include body-font-bold;
		@include font-md;
		text-align: right;
		/* make room in case of double digits */
		width: 1.5em;
		flex: 0 0 1.5em;
		margin-right: 0.5em;
		position: relative;
		top: -1px; /* baseline fudge */
		/* theming */
		opacity: 0.4;
	}

	.toplist-flag {
		width: 1.15rem;
		height: 0.75rem;
		border-radius: $border-radius-sm;
		margin-right: 0.375em;
		overflow: hidden;
	}
	/* account for baked in image padding 😒 */
	.toplist-flag-img {
		@include absolute-vertical-center;
		width: 1.15rem;
		height: 1.15rem;
	}

	.toplist-name {
		@include overflow-ellipsis;
		margin-right: 0.25em;
		padding-bottom: 0.5em; /* prevent descenders from getting cut off */
		line-height: 1.25;
	}

	.toplist-value {
		color: rgba($white, 0.75);
		&.is-positive { color: $emerald-light; }
		&.is-negative { color: $salmon-light; }
	}

	.toplist-trend {
		top: -1px; /* baseline fudge */

		& svg {
			margin-left: -0.125em;
			width: 1em;
		}
		/* inherit font color */
		path {
			fill: currentColor;
		}
		/* flip the arrow up */
		&.is-up svg {
			transform: rotate(180deg);
		}
	}

	/* right aligned value */
	.value-right-toplist .toplist-value {
		margin-left: auto;
		padding-left: 0.5em;
	}
</style>
