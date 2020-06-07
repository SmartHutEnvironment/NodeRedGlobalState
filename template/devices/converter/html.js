function prepareControlFields(o, device, control)
{
	source = null;

	RED.nodes.eachLink(link => {
		if (link.target.id === o.id)
		{
			source = link.source;
		}
	})

	if (source !== null && source.type === "fk-device-trigger")
	{
		let id = device.val(); 
		let node = RED.nodes.node(id);

		if (node === null) return;

		control.empty();
		$.each(node.actions, (key, value) => {
			control.append( $("<option></option>").attr("value", value).text(key));
		});
	}
	else
	{
		control.empty();
		control.append( $("<option></option>").attr("value", "---").text("LINK INPUT NODE FIRST"));
	}
}