<script>
	export let stats = [];
</script>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	.substat {
		font-size: $font-sm;
		display: inline-block;
		line-height: 1.25;

		&:not(:last-child) {
			padding-right: 1em;
			margin-right: 1em;
			border-right: $border-width-md solid rgba($white, 0.4);
		}
	}

	.substat-label {
		opacity: 0.8;
	}
</style>


<span class="substats">
	{#each stats as stat}
		<span class="substat">
			<span class="u-visually-hidden">; </span>
			<strong class="substat-value">{stat.value || "missing `value` in Substats"}</strong>
			<span class="substat-label"> {stat.label || "missing `label` in Substats"}</span>
		</span>
	{/each}
</span>