function prepareStateFields(o, device, control)
{
	source = null;

	device.change(() =>{

		let id = device.val(); 
		let node = RED.nodes.node(id);
		console.log(id, node);
		if (node === null) return;
		updateOptionsFilter(control, node.triggers, null);
	});

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

		updateOptionsFilter(control, node.triggers, null);
	}
	else
	{
		control.empty();
		control.append( $("<option></option>").attr("value", "---").text("LINK INPUT NODE FIRST"));
	}
}


function setupRoomFiltering(rooms, devices)
{
	rooms.change(() => {
		$.each(devices.children(), (key, item) =>{
			$(item).css("display", "block");
		});

		$.each(devices.children(), (key, item) => {
			item = $(item);
			let node = RED.nodes.node(item.val());
			if (node === null) return;

			if (node.room === rooms.val())
			{
				item.css("display", "block");
			}
			else
			{
				item.css("display", "none");
			}
		});
	});
}

function updateOptionsFilter(field, options, selected)
{
	field.empty();
	$.each(options, (key, source) => {
		console.log(source, source.type.label);
		if (source.type.label === "Signal") { console.log("skip"); return; }
		let option = $("<option></option>");
		option.attr("value", key).text(source.label);

		if (selected === key)
		{
			option.attr("selected", "selected");
		}

		field.append( option );
	});
}