<script>
	import { _ } from 'svelte-i18n';
	
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";
</style>


<svelte:head>
	<title>{status} | {$_("_.title")}</title>
</svelte:head>


<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
