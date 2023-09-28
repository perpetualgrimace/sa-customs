<script>
	export let title = "Missing `title` prop in Card component";
	export let description = null;
	export let href = null;

	export let img = null;
	export let imgFormat = "jpg";

	export let img1x = `thumbnail/${img}.${imgFormat}`;
	export let img2x = `thumbnail/${img}@2x.${imgFormat}`;
</script>


<!-- 
	NOTE: for some reason postcss-rtl doesn't play nicely with these styles
	So, we add rtl styles manually here with `[dir="rtl"] &`
-->
<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	/* rtl:begin:ignore */
	.card {
		margin-bottom: $sp-lg;
		box-shadow: 0 2px 1rem rgba($navy-dark, 0.5);
		background-color: $navy-light;
		transition:
			transform $timing,
			box-shadow $timing;

		@media (min-width: $bp-md) {
			margin-bottom: $sp-md;
		}

		&:hover, &:focus-within {
			box-shadow: 0 4px 2rem rgba($navy-dark, 0.75);
			transform: translateY(-8px) scale(1.025);
			transition:
				transform $timing-long,
				box-shadow $timing-long;
		}
	}

	.card-cover-link {
		@include absolute-expand;
		z-index: 1;

		/* interactions */
		&:hover + .card-inner,
		&:focus + .card-inner {
			.card-title {
				background-color: $navy;
			}
			.card-title:after {
				transform: none !important;
			}
			.card-title:before, .card-title:after {
				background-color: $emerald-light;
			}
		}
	}

	/* needed to set height via padding based on the correct width */
	.card-inner {
		padding-top: 72.222%;
	}

	.card-caption {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		pointer-events: none; /* prevent from obscuring link click */

		@media (min-width: $bp-xs) and (max-width: $bp-md - 0.001), (min-width: $bp-lg) {
			right: 2.5rem;

			[dir="rtl"] & {
				right: 0;
				left: 2.5rem;
			}
		}
	}

	.card-title {
		@include body-font;
		padding: $sp-sm $sp-md 0.875em $sp-md;
		background-color: rgba($navy, 0.9);
		transition: background-color $timing;

		/* expanding dash */
		&:before,
		&:after {
			@include pseudo;
			position: absolute;
			bottom: 0;
			height: $border-width-lg;
			background-color: $emerald;
			transition: 
				background-color $timing-long,
				transform $timing-long;
		}

		/* fixed width dash */
		&:before {
			width: $border-width-lg * 4.666; /* maintain dash aspect ratio */
		}
		/* transformable full width dash */
		&:after {
			transform: scaleX(0);
		}
	}

	.card-img {
		@include absolute-expand;
		object-fit: cover;
	}

	/* manual rtl */
	[dir="ltr"] .card-title:before, [dir="ltr"] .card-title:after { left: $sp-md; }
	[dir="rtl"] .card-title:before, [dir="rtl"] .card-title:after { right: $sp-md; }
	[dir="ltr"] .card-title:after { right: 0; transform-origin: top left; }
	[dir="rtl"] .card-title:after { left: 0; transform-origin: top right; }

	/* rtl:end:ignore */
</style>


<li class="card">
	<!-- cover link -->
	<a href={href} class="card-cover-link">
		<span class="u-visually-hidden">{@html title}</span>
	</a>

	<div class="card-inner">
		<!-- text -->
		<div class="card-caption">
			<p class="card-title heading u-font-sm" aria-hidden="true">
				{@html title}
			</p>
			<!-- hoverable -->
			{#if description}
				<p class="card-description u-font-sm">{@html description}</p>
			{/if}
		</div>

		<!-- bg image -->
		{#if img}
			<img 
				class="card-img" 
				src={img1x} 
				srcset={`${img1x} 1120w, ${img2x} 560w`}
				sizes="560px"
				alt=""
				draggable="false"
				loading="lazy"
			/>
		{/if}		
	</div>
</li>