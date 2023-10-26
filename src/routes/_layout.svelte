<script context="module">
	import { textDirection } from "../i18n/i18n.js";
</script>


<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment; // current slug
</script>


<div class="layout" dir={$textDirection}>
	<Nav {segment} />

	<main id="main">
		<slot />
	</main>

	<Footer {segment} />
</div>


<style lang="scss" global>
	@import "./styles/main.scss";
</style>
