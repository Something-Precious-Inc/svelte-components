import ListView from './ListView.svelte';

window.ListView = function(opt) {
	const listView = new ListView(opt);
	let callback;
	let obj = {};

	const methods = [
		"setItems",
		"getSelectedIndexes",
		"getSelectedItems",
		"add",
		"remove",
		"clear"
	];
	for (let i = 0; i < methods.length; i++) {
		const m = methods[i];
		if (listView[m]) {
			obj[m] = listView[m];
		}
	}
	obj["setCallback"] = (cb) => { callback = cb; };
	listView.setCallback((currSelCount) => {
		if (callback) {
			callback(obj, currSelCount);
		}
	});
	return obj;
}
