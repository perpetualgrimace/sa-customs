<script>
	export let classes = null;
	export let label = "Missing `label` prop in ButtonGroup component";
	export let labelHidden = false;
	export let inline = true; // set `false` to show label above buttons

	$: wrapperClasses = `${ classes ? `${classes} ` : "" }button-group`;
</script>


<fieldset class={wrapperClasses}>
	<legend class={`button-group-label u-font-xs${ label && labelHidden === true ? " u-visually-hidden" : "" } ${ inline ? "is-inline" : "is-block" }`}>
			{label}
	</legend><span class="button-group-inner"><slot /></span><!-- crammed together to combat white space -->
</fieldset>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.button-group {
		/* fieldset reset */	
	  border: 0;
	  padding: 0.01em 0 0 0;
	  margin: 0;
	  min-width: 0;

		& .button {
			flex: 1 1 50%;
			box-shadow: none; /* override button */
			padding-left: 0.5em;
			padding-right: 0.5em;

			& + .button {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}

			&:not(:last-of-type) {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			/* inactive state */
		  &[aria-pressed="false"] {
		  	color: $gray;
				background-color: $navy;

				&:hover, &:focus {
					color: $white;
				}
		  }
		}
	}

	.button-group-label {
		color: $gray;
		opacity: 0.75;
		/* fieldset legend reset */
		display: table;
		padding: 0;

		/* left of buttons */
		&.is-inline {
			margin-right: 0.625em;
			/* fieldset legend reset */
			float: left;
		}
	
		/* above buttons */
		&.is-block {
			width: 100%;
			margin-bottom: 0.25em;
		}
	}

	.button-group-inner {
		display: flex;
		align-items: baseline;
	  box-shadow: 0 1px 0.2em rgba($black, 0.2);
	}
</style>
