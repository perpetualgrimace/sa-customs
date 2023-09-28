<script>
	import truncateString from '../helpers/truncateString.js';

	import Chevron from './icons/Chevron.svelte';

	// Always Be Labeling
	export let label = "Missing `label` prop in Select component";
	export let labelHidden = false;

	// interactivity
	export let value = null;
	export let onChange = null;

	// `options` prop expects an array of objects; each object with `id` and `name` keys
	// NOTE: each object id must be unique
	export let options = [];
	export let nameKey = "name";
	export let sortKey = nameKey; // sort by name by default
	export let sortOptions = true;
	export let fallbackText = null;

	// sort options by sortKey
	$: sortedOptions = options;
	$: if (
		typeof(options) !== "undefined" &&
		Array.isArray(options) &&
		options.length &&
		sortOptions == true
	) {
		sortedOptions = options.sort((a, b) => (a[sortKey] > b[sortKey]) ? 1 : -1);
	}

	export let classes = null;
	export let fontSize = "xs";
	export let inline = null; // set `true` to display the label alongside the select element
	let labelClass = `${ classes ? `${classes} ` : "" }select-label${ inline ? " inline-select-label" : "" } u-font-${fontSize}`;
</script>


<label class={labelClass}>
	<span class={`select-label-text ${ label && labelHidden === true ? " u-visually-hidden" : "" }`}>
		{@html label}
	</span>

	<span class="select-inner">
		<select class="select-menu" bind:value={value} on:change={onChange}>
			{#if typeof(sortedOptions) !== "undefined" && sortedOptions.length && sortedOptions[0].id !== null}
				{#each sortedOptions as option}
					<option value={option.id} selected={option.id === value ? true : null}>
						{truncateString(option[nameKey], 70)}
					</option>
				{/each}
			{:else}
				<option>{fallbackText || "Undefined `options` array"}</option>
			{/if}
		</select>

		<Chevron />
	</span>
</label>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.select-label {
		display: block;
	}

	/* inline variant; text to left of menu */
	.inline-select-label {
		display: flex;
		align-items: baseline;
		flex-direction: row;

		/* space out from inline select */
		.select-label-text {
			margin-right: 0.625em;
		}
	}

	.select-label-text {
		/* in stacked layout, space out the label and menu */
		display: block;
		margin-bottom: 0.25em;
		/* theming */
		color: $gray;
		opacity: 0.75;
		transition: opacity $timing;
	}

	/* wrapper around select & chevron icon, so the icon can easily scale up */
	.select-inner {
		display: block;
		width: 100%;
		
		svg {
			@include absolute-vertical-center;
			right: 0.375em;
			pointer-events: none; /* prevent from obscuring select */
		}
	}

	/* the select menu itself */
	.select-menu {
	  /* reset select element browser defaults */
	  display: block;
	  width: 100%;
	  appearance: none;
	  /* sizing */
	  padding: 0.375em 2.5em 0.75em 0.5em;
	  /* theming */
	  background-color: $navy-light;
	  border: 1px solid $navy-dark;
	  border-radius: $border-radius-sm;
	  box-shadow: 0 1px 0.2em rgba($black, 0.2);
	  transition: 
	  	box-shadow $timing,
	  	border-color $timing;

	  /* hide native IE select icon */
	  &::-ms-expand {
	    display: none;
	  }
	}

	/* interactions */
	.select-label:hover, 
	.select-label:focus-within {
		.select-label-text {
			opacity: 1;
		}
		path {
			fill: $white;
		}
	}
	.select-menu:hover {
		border-color: $dark-1;
	}
	/* thick green border on focus */
	.select-menu:focus {
		border-color: $emerald;
		box-shadow: 0 0 0 1px $emerald;
	}
</style>
