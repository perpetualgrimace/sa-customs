export function group_hierarchical_data(data, group_by, not_group_by) {
	let res = {
		"name": "Total",
		"children": []
	};
	for (let row of data) {
		// create a leaf node with name of product
		let node = {
			name: row[not_group_by],
			value: row.value,
		};
		//console.log("Treemap::res.children", res.children)
		// now add the node to the country node (which is attached to the root)
		let country_node = res.children.find(d => d.name == row[group_by]);
		// there must be a better to do `get_or_default`
		if (country_node == null) {
			res.children.push(
				{
					name: row[group_by],
					children: [node]
				}
			);
		} else {
			country_node.children.push(node);
		}
	}

	// if there's only one country, then flatten
	if (res.children.length == 1) {
		res = res.children[0];
	}
	return res;
}

