<script>
	import { locale } from "svelte-i18n";

	import slugify from "../helpers/slugify.js";

	import Hero from "./Hero.svelte"; // inherit styles (not sure if there's a better way)
	import Chevron from "./icons/Chevron.svelte";

	export let title = "undefined `title` prop in Hero component";
	export let subhead = null;

	// The title of the first section is needed here so we can anchor link to it
	export let jumpLink = "Top countries";
	const slugifiedJumpLink = slugify(jumpLink);

	// Image file name expected, without the extension. 
	// 1x (1440px) & 2x (2880px) files are assumed, with @2x appended to the 2x filename
	export let img;
	export let imgFormat = "jpg";

	export let img1x = `hero/${img}.${imgFormat}`;
	export let img2x = `hero/${img}@2x.${imgFormat}`;
</script>


<header class="home-hero hero" role="banner">
	<!-- main hero content -->
	<div class="home-hero-inner hero-inner u-left-center">
		<h1 class="home-hero-heading">{@html title}</h1>

		{#if subhead}
			<p class="home-hero-subhead u-font-lg u-margin-top-md u-margin-bottom-md">
				{subhead}
			</p>
		{/if}
	</div>

	<!-- jump to first section -->
	<a href="./{$locale}/Data/#{slugifiedJumpLink}" class="home-hero-jumper u-hide-below-md" aria-hidden="true">
		<Chevron />
	</a>

	<!-- bg image -->
	{#if img}
		<img 
			class="home-hero-img hero-img" 
			src={img1x} 
			srcset={`${img1x} 1440w, ${img2x} 2880w`}
			size="100vw"
			alt=""
			draggable="false"
			loading="lazy"
		/>
	{/if}
</header>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	/* override .hero min-height */
	.hero.home-hero {
		min-height: calc(60vh + #{$sp-xl * 2});
	}

	.home-hero-subhead {
		@media (min-width: $bp-md) {
			width: 25rem;
			margin-left: auto;
			margin-right: auto;
		}
	}

	/* override .hero-inner max width */
	.hero-inner.home-hero-inner {
		@media (min-width: $bp-md) { width: 34rem; }
		@media (min-width: $bp-lg) { width: 39rem; }
	}

	/* ⌄ */
	.home-hero-jumper {
		/* positioning */
		@include absolute-horizontal-center;
		bottom: $sp-xs;
		z-index: 1;
		/* theming */
		opacity: 0.5;
		transition: opacity $timing;

		/* sizing */
		svg {
			width: 3rem;
			transition: transform $timing;
		}

		/* interactions */
		&:hover, &:focus {
			opacity: 1;

			svg {
				transform: translateY($sp-xs);
			}
		}
		&:focus {
			outline: 1px solid $emerald;
		}
	}
</style>