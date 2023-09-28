<script>
	import { stores } from '@sapper/app';

	import { locale, locales, _ } from "svelte-i18n";

	import routes from '../routes/_routes.json';

	import NavItem from './NavItem.svelte';
	import Button from './Button.svelte';

	const temporaryRoutes = [
		{ title: "importsAndExports.navLink", href: `imports-and-exports`, children: [
			routes[1].children[0].children[0], // imports
			routes[1].children[1].children[0], // exports
		] },
		routes[2], // clearance time calculator
		routes[3], // data explorer
		{
			title: "about.navLink",
			href: routes[4].children[3].href, // default to definitions
			children: [
				routes[4].children[3], // definitions
				routes[4].children[4], // disclaimer
			]
		}
	];

	export let segment;

	$: navOpen = false;

	const localeLabels = {
		en: 'English',
		ar: 'العربية'
	}

	// open/close the menu
	function toggleNav() {
		navOpen = !navOpen;
	}
	// make sure menu closes when clicking nav links
	function closeNav() {
		navOpen = false;
	}

	const {page} = stores();
	$: currPage = $page.path;

	function setLocaleLink(href, locale) {
		let slug = href.split("/Data/")[1]; // get everything after /Data/

		// assume home page
		if (typeof slug === "undefined") {
			return `./${locale}/Data/`;
		}

		return `./${locale}/Data/${slug}`;
	}
</script>


<nav class="main-nav" aria-label={$_("_.nav.mainNavLabel")}>

	<a href="./{$locale}/Data/"
		class="main-nav-logo"
		aria-label={$_("_.nav.backToHomePage")}
		aria-current={segment ? null : "page"}
		tabindex={segment ? null : "-1"}
	>
		<img
			class="main-nav-logo-img"
			src="logo.png"
			srcset="logo.png 1x, logo@2x.png 2x"
			alt={$_("_.title")}
		>
	</a>

	<ul class="main-nav-locale-list">
		{#each $locales as loc}
			<li class="main-nav-locale-item">
				{#if loc !== $locale}
					<a 
						href={setLocaleLink(currPage, loc)}
						class="main-nav-locale-link"
						on:click={locale.set(loc)}
					>
						{localeLabels[loc]}
					</a>
				{:else}
					<span class="main-nav-locale-link is-active">
						{localeLabels[loc]}
					</span>
				{/if}
			</li>
		{/each}
	</ul>

	<Button classes="main-nav-toggle u-hide-above-nav" on:click={toggleNav} pressed={navOpen}>
		{$_("_.nav.menuButtonLabel")} <span class="main-nav-toggle-icon">{navOpen ? "╳" : "☰"}</span>
	</Button>

	<ul class="main-nav-list">
		<NavItem data={{title: "home.navLink", href: `./${$locale}/Data`}} segment={segment} classes="u-hide-above-nav" on:click={closeNav} />
		{#each temporaryRoutes as data}
			<NavItem data={data} segment={segment} on:click={closeNav} />
		{/each}
	</ul>
</nav>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.main-nav {
		padding: 0 $sp-lg;
		min-height: $nav-height;
		display: flex;
		background-color: $navy;

		@media (min-width: $bp-nav) {
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 2;
			box-shadow: 0 2px 1rem rgba($navy-dark, 0.5);	

			/* offset nav height so content isn't cut off */
			& + * {
				margin-top: $nav-height;
			}
		}
	}

	.main-nav-logo {
		/* sizing */
		height: $nav-height;
		padding-left: $sp-md;
		padding-right: $sp-md;
		/* positioning */
		margin-left: -$sp-md;
		margin-right: auto;
		/* vertically center img */
		display: flex;
		align-items: center;
		/* reset link */
		text-decoration: none;
		color: $white;
	
		/* beta */
		&:after {
			display: block;
			content: "beta";
			/* positioning */
			position: absolute;
			right: -1.75em;
			top: 0.625em;
			/* typography */
			@include body-font-bold;
			@include font-xs;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			/* theming */
			color: $emerald-light;
		}
	}
	.main-nav-logo-img {
		width: $logo-width;
		height: auto;
	}

	.main-nav-list {
		display: flex;

		/* stacked list on small screens */
		@media (max-width: $bp-nav - 0.001) {
			/* take up the whole screen */
			@include absolute-expand;
			position: fixed;
			/* layout */
			flex-direction: column;
			justify-content: center;
			padding-top: $sp-md;
			padding-bottom: $sp-md;
			/* theming */
			background-color: rgba($navy-dark, 0.95);

			.nav-item .nav-link {
				display: block;
				padding: $sp-md $sp-lg;
				font-size: $font-lg !important;
			}

			.nav-icon, .nav-link:after, .nav-dropdown {
				display: none !important;
			}
		}

		/* horizontal list on big screens */
		@media (min-width: $bp-nav) {
			min-height: $nav-height;
			align-items: center;
			/*margin-right: -1em;*/
			margin-right: -0.625rem; /* when the last item in the nav isn't a dropdown */
		}

		/* align last dropdown to right edge so content isn't cut off */
		/*.nav-item:last-child .nav-dropdown {
			left: auto;
			right: -0.5em;
		}*/
	}

	/* toggle button */
	.main-nav-toggle {
		text-transform: uppercase;
		align-self: center;
		white-space: nowrap; /* keep icon & text together */

		.main-nav-toggle-icon {
			display: inline-block;
			font-size: 1.25em;
			width: 1.25em;
			margin-left: -0.125em;
			margin-right: -0.125em;
		}

		&[aria-pressed="true"] {
			z-index: 11; /* above overlay */

			.main-nav-toggle-icon {
				top: 0.125em;
			}
		}
	}

	/* mobile nav open & closed states */
	@media (max-width: $bp-nav - 0.001) {
		.main-nav-toggle[aria-pressed="true"] + .main-nav-list {
			z-index: 10;
			transition:
				opacity $timing-long,
				transform $timing-long;
		}
		.main-nav-toggle[aria-pressed="false"] + .main-nav-list {
			z-index: -1;
			opacity: 0;
			transform: translateY(-10%) scale(1.1);
		}
	}

	/* locale toggles */
	.main-nav-locale-list {
		display: flex;
		margin-right: $sp-md;

		@media (min-width: $bp-nav) {
			order: 1;
			top: -0.15em; /* fudged */
			margin-right: -$sp-sm;
			margin-left: $sp-md;
		}
	}
	.main-nav-locale-item:first-child:after {
		@include pseudo;
		@include absolute-vertical-center;
		height: $font-lg;
		width: 2px;
		right: -1px;
		background-color: $navy-light;
	}
	.main-nav-locale-link {
		@include body-font-bold;
		font-size: $font-xs;
		background: none;
		border: none;
		color: $gray;
		padding: 0 $sp-sm;
		line-height: $nav-height;

		&:hover, &:focus {
			color: $emerald-light;
		}

		&.is-active {
			color: $white;
		}
	}
</style>