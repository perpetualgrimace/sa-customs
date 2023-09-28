<script>
	export let classes = null;
	export let fontSize = "xs";
	export let block = null; // set `true` to fill the horizontal space

	export let pressed = false;

	export let value = null;

	export let href = null;
	export let download = null;

	let buttonClasses = `${ classes ? `${classes} ` : "" }button u-font-${fontSize}${block ? " is-block" : ""}`;
</script>


{#if href}
	<a href={href} class={buttonClasses} download={download}>
		<slot />
	</a>
{:else}
	<button
		on:click|preventDefault
		class={buttonClasses}
		value={value}
		role="button"
		aria-pressed={pressed}
	>
		<slot />
	</button>
{/if}


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.button {
		/* sizing */
		display: inline-block;
		line-height: 1;
	  padding: 0.5em 1.5em 0.875em 1.5em;
	  /* typography */
	  @include body-font-bold;
	  white-space: nowrap;
	  /* theming */
	  color: $white;
	  background-color: $emerald;
	  border-radius: $border-radius-sm;
	  border: none;
	  box-shadow: 0 1px 0.2em rgba($black, 0.2);
	  /* override link styles */
	  text-decoration: none;
	  text-align: center;
	  transition: 
	  	color $timing-long,
	  	background-color $timing-long,
	  	box-shadow $timing-long;

		/* interactions */
	  &:hover, &:focus {
	  	background-color: $emerald-dark;
	  }
	  &:focus {
	  	box-shadow: 0 0 0 2px $emerald;
	  }

		/* fill up all the space */
		&.is-block {
			display: block;
			width: 100%;
		}

		/* make icons respect theming */
		& path {
			fill: currentColor;
			transition: fill $timing;
		}
	}
</style>
