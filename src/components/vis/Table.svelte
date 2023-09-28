<script>
	import { locale, _ } from 'svelte-i18n';

	import { abbreviateNumber } from '../../helpers/formatters.js';

	export let data = [];

	export let columns = ["malformed columns data in Table"];

	if (Array.isArray(data) && data.length) {
		columns = Object.keys(data[0]);
	}

	export let fontSize = "sm";

	// console.log("Table: data", data);
</script>


<table class="u-font-{fontSize}">
	<thead>
		<tr>
			{#each columns as header}
				<th>
					<span>
						{$_(`_.${header}`)}
					</span>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data as row}
			<tr>
				{#each columns as col}
					<td>
						<span>
							{typeof row[col] === "undefined" 
								? " " 
								: col === "value"
									? abbreviateNumber(row[col], $locale, true)
									: row[col]
							}
						</span>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>


<style lang="scss" global>
	@import "./styles/utils/_variables.scss";
	@import "./styles/utils/_mixins.scss";

	table {
		/* table reset */
		table-layout: fixed;
		border-collapse: collapse;
		border-sapcing: 0;
		/* sizing & positioning */
		width: 100%;
		margin-bottom: auto;
	}

	th, td {
		border: 2px solid $navy-dark;
	}

	th span {
		display: block;
		padding: 0.25em 1em 0.5em 1em;
		background-color: $navy-light;
	}

	td {
		padding: 0.25em 1em 0.5em 1em;
	}
</style>