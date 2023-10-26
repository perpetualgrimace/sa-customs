<script>
	import { locale, _ } from 'svelte-i18n';

	import Chevron from './icons/Chevron.svelte';

	import checkActiveSegment from '../helpers/checkActiveSegment.js';
	import checkActivePage from '../helpers/checkActivePage.js';
	import clickOutside from '../helpers/clickOutside.js';

	export let segment;

	export let data = {title: "Missing `data` prop in NavLink"};
	export let classes = null;

	const navItemClasses = `nav-item${ classes ? ` ${classes}` : "" }`;

	$: menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleClickOutside(e) {
		menuOpen = false;
	}
</script>


<li class={navItemClasses} use:clickOutside on:click_outside={handleClickOutside}>
	<!-- main link -->
	<a href={`./${data.href}` || null}
		class="nav-link"
		aria-current={checkActiveSegment(data.href, segment, $locale) ? "page" : null}
		on:click
	>
		{@html $_(data.title)}
	</a>

	<!-- we have dropdown -->
	{#if data.children}
		<button class="nav-icon" on:click={toggleMenu} aria-pressed={menuOpen}>
			<Chevron />
		</button>

		<ul class="nav-dropdown">
			{#each data.children as child}

				<!-- subgroups -->
				{#if child.children}
					{#each child.children as groupedChild, i}

						{#if child.grouping && i === 0}
							<li class="nav-dropdown-heading heading u-font-md">
								{@html $_(child.grouping)}
							</li>
						{/if}

						<li class="nav-dropdown-item">
							<a href={`./${groupedChild.href}` || null}
								class="nav-dropdown-link"
								aria-current={checkActivePage(groupedChild.href, segment) ? "page" : null}
							>
								{@html $_(groupedChild.title)}
							</a>
						</li>
					{/each}

				<!-- linear list -->
				{:else}
					<li class="nav-dropdown-item">
						<a href={`./${child.href}` || null}
							class="nav-dropdown-link"
							aria-current={checkActivePage(child.href, segment) ? "page" : null}
						>
							{@html $_(child.title)}
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</li>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	/* main link (& wrapper for button & nested list) */
	.nav-link {
		@include nav-link-theme;
		/* layout */
		display: inline-block;
		height: $nav-height;
		padding: 1.5em 1em 0 1em; /* fudged */

		/* "border" */
		&:after {
			@include pseudo;
			/* sizing */
			height: $border-width-lg;
			/* positioning */
			position: absolute;
			bottom: 0;
			left: 1em;
			right: 1em;
			/* prevent from obscuring content */
			pointer-events: none;
			z-index: -1;
			/* theming */
			background-color: $emerald;
			opacity: 0;
			transform: translateY(100%);
			transition:
				opacity $timing,
				transform $timing;
		}

		/* adjust bottom "border" to account for chevron */
		&[aria-current]:not(:last-child):after {
			right: -0.25em;
		}

		/* interactions */
		&:hover, &:focus {
			opacity: 1;
		}
		/* current page */
		&[aria-current], &[aria-current]:after {
			opacity: 1;
		}
		&[aria-current]:after {
			transform: none;
			z-index: auto;
		}
	}

	/* dropdown icon */
	.nav-icon {
		/* reset button */
		background: none;
		border: none;
		color: $gray;
		/* sizing */
		font-size: $font-xs;
		/* alignment */
		margin: 0 0 0 -1.75em;
		padding: 1em 0.5em 1.5em 0.5em;
		top: -0.1em;

		&:hover, &:focus {
			color: $white;
		}

		&:active, &[aria-pressed="true"] {
			color: $emerald-light;
		}

		path {
			fill: currentColor;
		}
	}

	/* nested menu */
	.nav-dropdown {
		/* sizing */
		width: calc(100% + #{$sp-md});
		min-width: max-content;
		max-width: 50vw;
		padding-top: $sp-sm;
		padding-bottom: $sp-sm;
		/* positioning */
		position: absolute;
		left: -0.875em; /* offset link padding */
		/* theming */
		background-color: $navy-light;
		box-shadow: 0 2px 1rem rgba($navy-dark, 0.75);
		/* initially hidden */
		@include dropdown-hidden;
		transition:
			opacity $timing-fast 0.2s,
			transform $timing-fast 0.2s;
	}

	.nav-dropdown-heading {
		padding: $sp-sm 1.5rem 0.5rem 1.5rem;
	}

	.nav-dropdown-link {
		@include nav-link-theme;
		display: block;
		padding: 0.325em 1.5rem 0.625em 1.5rem;
		min-width: max-content;
		width: 100%;

		/* "border" */
		&:after {
			@include pseudo;
			/* sizing */
			width: $border-width-lg;
			height: 100%;
			/* positioning */
			position: absolute;
			top: 0;
			left: 0;
			/* prevent from obscuring content */
			pointer-events: none;
			z-index: -1;
			/* theming */
			background-color: $emerald;
			opacity: 0;
			transition:
				opacity $timing,
				transform $timing;
		}
	}

	/* menu open state */
	.nav-link:hover ~ .nav-dropdown,
	.nav-link:focus ~ .nav-dropdown,
	.nav-icon:hover ~ .nav-dropdown,
	.nav-icon:focus ~ .nav-dropdown,
	.nav-icon:active ~ .nav-dropdown,
	.nav-icon[aria-pressed="true"] ~ .nav-dropdown,
	.nav-dropdown:hover {
		@include dropdown-visible;
	}
	.nav-dropdown:focus-within {
		@include dropdown-visible; /* keep on separate line for IE */
	}
</style>
