function prepareTriggerFields(o, device, trigger)
{
	let originalValue = o.trigger;

	device.change(() => {
		let originalValue = trigger.val();

		let id = device.val(); 
		let node = RED.nodes.node(id);
	
		if (node === null) return;

		trigger.empty();
		$.each(node.triggers, (key, value) => {
			let option = $("<option></option>");
			option.attr("value", value).text(key);

			if (originalValue === value)
			{
				option.attr("selected", "selected");
			}
			trigger.append( option );
		});
	});

	let id = device.val(); 
	let node = RED.nodes.node(id);
	if (node === null) return;

	trigger.empty();
	$.each(node.triggers, (key, value) => {
		let option = $("<option></option>");
		option.attr("value", value).text(key);

		if (originalValue === value)
		{
			option.attr("selected", "selected");
		}
		trigger.append( option );
	});
}