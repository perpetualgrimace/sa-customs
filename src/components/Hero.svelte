<script>
	export let title = "undefined `title` prop in Hero component";

	// Image file name expected, without the extension. 
	// 1x (1440px) & 2x (2880px) files are assumed, with @2x appended to the 2x filename
	export let img = null;
	export let imgFormat = "jpg";

	export let img1x = `hero/${img}.${imgFormat}`;
	export let img2x = `hero/${img}@2x.${imgFormat}`;
</script>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.hero {
		padding: $sp-xl $sp-lg;
		min-height: calc(20vh + #{$sp-xl * 2});
		/* allow inner content to be centered */
		display: flex;
	}

	/* center inner content */
	.hero-inner {
		@include section-inner;
		margin: auto;
		z-index: 1; /* in front of bg */
	}

	/* fudge baseline */
	.hero-heading:only-child {
		margin-top: -0.375em;
	}
	/* space out elements */
	.hero-heading:not(:last-child) {
		margin-bottom: $sp-lg;
	}

	/* fill up all the space */
	.hero-img {
		@include absolute-expand;
		object-fit: cover;
	}
</style>


<header class="hero" role="banner">
	<!-- main hero content -->
	<div class="hero-inner u-left-center">
		<h1 class="hero-heading">{@html title}</h1>

		<slot />
	</div>

	<!-- bg image -->
	{#if img}
		<img 
			class="hero-img" 
			src={img1x} 
			srcset={`${img1x} 1440w, ${img2x} 2880w`}
			sizes="100vw"
			alt=""
			draggable="false"
			loading="lazy"
		/>
	{/if}
</header>