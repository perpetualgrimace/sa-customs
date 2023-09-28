<script>
	import { stores } from '@sapper/app';

	import { locale, _ } from 'svelte-i18n';

	import routes from '../routes/_routes.json';

	import NavItem from './NavItem.svelte';

	export let segment;

	let col1 = {
		title: "_.title",
		children: [
			{ title: "home.navLink", href: "" },
			routes[2], // clearance time calculator
			routes[3], // data explorer
		]
	};

	let col2 = {
		title: "importsAndExports.navLink",
		children: [
			routes[1].children[0].children[0], // imports
			routes[1].children[1].children[0]  // exports
		]
	};

	let col3 = {
		title: "about.navLink",
		children: [
			routes[4].children[3], // definitions
			routes[4].children[4], // disclaimer
		]
	};

	let col5 = routes[3]; // about

	let columns = [col1, col2, col3];

	const {page} = stores();
	$: currPage = $page.path;
</script>


<nav class="footer-nav" aria-hidden="true">
	<ul class="footer-nav-list">
		{#each columns as col}
			<li class="footer-nav-group">

				<h2 class="footer-nav-group-heading u-font-md">
					{@html $_(col.title)}
				</h2>
				
				<ul class="footer-nav-group-list">
					{#each col.children as child}
						<li class="footer-nav-group-item">
							<a href="./{$locale}/Data/{child.href}" class="footer-nav-group-link" aria-current={segment === child.href ? "page" : null}>
								{@html $_(child.title)}
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div class="footer-footer">

		<p class="footer-copyright u-font-sm">
			{$_("_.footer.copyright")}
		</p>

		<ul class="footer-logo-list">
			<!-- vision -->
			<li class="footer-logo-item">
				<a class="footer-logo-link" href={`https://vision2030.gov.sa/${$locale}/`}>
					<img class="footer-logo-img" src="vision-logo.png" srcset="vision-logo.png 1x, vision-logo@2x.png 2x" alt={$_("_.footer.visionLogoAltText")}>
				</a>
			</li>
			<!-- customs -->
			<li class="footer-logo-item">
				<a class="footer-logo-link" href={`https://www.customs.gov.sa/${$locale}`}>
					<img class="footer-logo-img" src="og-logo.png" srcset="og-logo.png 1x, og-logo@2x.png 2x" alt={$_("_.footer.saudiCustomsLogoAltText")}>
				</a>
			</li>
		</ul>
	</div>
</nav>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.footer-nav {
		background-color: $navy;
		padding: $sp-lg $sp-lg 0 $sp-lg;
	}

	/* list of lists */
	.footer-nav-list {
		@include section-inner;

		/* column layout on big screens */
		@media (min-width: $bp-sm) {
			display: flex;
			flex-wrap: wrap;
			align-items: space-between;
		}
	}

	/* single column */
	.footer-nav-group {
		padding-bottom: $sp-lg;
		display: block;

		/* column layout on big screens */
		@media (min-width: $bp-sm) {
			flex: 1 0 auto;

			&:not(:last-child) {
				margin-right: $sp-xl;
			}
		}
	}

	.footer-nav-group-heading {
		padding-bottom: 1.625rem;

		/* "border" */
		&:after {
			@include pseudo;
			/* positioning */
			position: absolute;
			bottom: 0.625rem;
			/* sizing */
			width: 0.95rem;
			height: 0.2rem;
			/* theming */
			background-color: $emerald;
		}
	}

	.footer-nav-group-link {
		/* sizing */
		display: block;
		padding-top: 0.25em;
		padding-bottom: 0.25em;
		font-size: $font-sm;
		/* theming */
		background-color: transparent;
		opacity: 0.75;
		transition: 
			opacity $timing,
			background-color $timing;

		/* stacked layout adjustments */
		@media (max-width: $bp-sm - 0.001) {
			padding-bottom: 0.625em;
			font-size: $font-md;
		}

		/* interactions */
		&:hover, &:focus {
			opacity: 1;

			@media (max-width: $bp-sm - 0.001) {
				background-color: rgba($navy-light, 0.5);
			}
		}
	}

	/* small screen adjustments */
	@media (max-width: $bp-sm - 0.001) {
		.footer-nav-group-item:not(:last-child) .footer-nav-group-link {
			border-bottom: 2px solid $navy-light;
		}
		.footer-nav-group-item:last-child .footer-nav-group-link {
			margin-bottom: -0.625em; /* offset padding */
		}
	}

	/* needs more logos */
	.footer-footer {
		@include section-inner;
		display: flex;
		flex-wrap: wrap;
		border-top: $border-width-sm solid $navy-light;

		& > * {
			margin-top: $sp-sm;
			margin-bottom: $sp-sm;
		}
	}
	.footer-copyright {
		margin-right: auto;
		top: 0.15em; /* alignment fudge */

		/* prevent logos from crowding text */
		@media (min-width: $bp-xs) {
			padding-right: $sp-md;
		}
	}
	.footer-logo-list {
		display: flex;
	}
	.footer-logo-item:not(:last-child) {
		margin-right: $sp-md;
		padding-right: $sp-md;
		border-right: $border-width-sm solid $navy-light;
	}
	.footer-logo-link {
		opacity: 0.8;
		transition: opacity $timing;

		&:hover, &:focus {
			opacity: 1;
		}
	}
</style>
