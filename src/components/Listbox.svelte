<!-- NOTE: This won't work on first render, and I'm not sure why yet -->
<script>
	import truncateString from '../helpers/truncateString.js';
	import slugify from '../helpers/slugify.js';

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

	const labelId = `${slugify(label)}-label`;
</script>


<div class="listbox{ classes ? ` ${classes}` : "" }">
  <span 
  	class="listbox-label-text{ label && labelHidden === true ? " u-visually-hidden" : "" }"
  	id={labelId}
  >
    {@html label}
  </span>

  <ul
  	class="listbox-list u-font-{fontSize}"
    role="listbox"
    aria-labelledby={labelId}
    tabindex="0"
  >
	  {#if typeof(sortedOptions) !== "undefined" && sortedOptions.length}
	  	{#each sortedOptions as option}
	  		<li class="listbox-item">
	  			<button
	  				class="listbox-button"
	  				value={option.id}
	  				aria-selected={option.id === value ? "true" : null}
	  				tabindex="-1"
	  				on:click={onChange}
	  			>
		  			{truncateString(option[nameKey], 70)}
	  			</button>
	  		</li>
	  	{/each}
	  {:else}
	  	<li class="listbox-item">Undefined `options` array</li>
	  {/if}
  </ul>
</div>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.listbox {
		max-height: 8.25em;
		border-radius: $border-radius-sm;
		overflow: auto;
	}

	.listbox-list {
		min-width: min-content;

		* {
			font-size: inherit;
		}
	}

	.listbox-item {
		display: block;
		width: 100%;
	}

	.listbox-button {
		display: block;
		width: 100%;
		padding: 0 0.75em 0.375em 0.75em;
		text-align: left;
		white-space: nowrap;
		line-height: 1.75;
		/* theming */
		color: $white;
		background-color: $navy-light;
		border: none;
	  transition: 
	  	color $timing,
	  	background-color $timing,
	  	box-shadow $timing;

		&:hover, &.is-focused {
			background-color: $emerald-dark;
		}

		&[aria-selected="true"] {
			background-color: $emerald;
		}

		&.is-focused {
			box-shadow: 0 0 0 2px $emerald;
		}
	}
</style>
