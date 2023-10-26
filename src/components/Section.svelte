<script>
	import slugify from "../helpers/slugify.js";

	export let layout = null; // col2, col3, or sidebar
	let layoutClass = `section${ layout ? ` section-${layout}` : "" }`;

	export let fullwidth = false;

	// optional title
	export let title = null;
	export let slug = null;
	export let timeframe = null;
	export let headingEl = "h2";

	// NOTE: ternary needed here instead of {#each} in template below
	// Svelte was losing track and moving the heading below the slot when switching locales
	$: heading = title
		? `<${headingEl} class="section-heading${ fullwidth ? " is-fullwidth" : "" }"${ slug ? ` id=${slug}` : ""}>
			${title}
			${timeframe ? `
				<span class="section-heading-timeframe u-font-sm">
					<span class="u-visually-hidden">(</span>
						${timeframe}
					<span class="u-visually-hidden">)</span>
				</span>` : ""
			}
		</${headingEl}>`
		: "";

	// for when we want to supply our own .section-inner element directly in the slot (i.e., for ULs)
	export let customInner = null;

</script>


<section class={layoutClass}>
	{@html heading}

	{#if customInner}
		<slot />
	{:else}
		<div class={`section-inner${ fullwidth ? " is-fullwidth" : "" }`}>
			<slot />
		</div>
	{/if}
</section>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.section {
		padding: $sp-lg;
		/* theming */
		&:nth-of-type(even) {
			background-color: $navy;
		}
	}

	/* limit width & center */
	.section-heading,
	.section-inner {
		@include section-inner;

		&.is-fullwidth {
			width: 100%;
		}
	}

	.section-heading-timeframe {
		opacity: 0.333;
	}

	/* small screens always get single column layout */
	@media (min-width: $bp-md) {
		.section-2col .section-inner,
		.section-3col .section-inner,
		.section-sidebar .section-inner {
			/* layout */
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.section-2col .section-inner,
		.section-3col .section-inner {
			align-items: baseline;
		}

		/* assume stat cards or related cards */
		.section-inner.card-section,
		.section-2col ul.section-inner,
		.section-3col ul.section-inner {
			align-items: stretch;
		}

		.section-2col .section-inner > * {
			width: calc(50% - #{$sp-sm * 2});
		}
		.section-3col .section-inner > * {
			width: calc(33.333% - #{$sp-sm * 2.625});
		}

		/* TODO: troubleshoot position: sticky; */
		.section-sidebar .section-inner > .sidebar {
			position: sticky;
			top: 0;
			width: 13rem;
			margin-right: $sp-lg;

			& + * {
				width: calc(100% - (13rem + #{$sp-lg + $sp-md}));
			}
		}
	}

	.sidebar a {
		opacity: 0.8;
  	transition: opacity $timing;

		&:hover, &:focus,
		&[aria-current="page"] {
			opacity: 1;
		}

		&:hover, &:focus {
			text-decoration: underline;
		}
	}
</style>