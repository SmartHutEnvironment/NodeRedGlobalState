function prepareActionFields(o, device, control)
{
	source = null;

	device.change(() =>{

		let id = device.val(); 
		let node = RED.nodes.node(id);
		console.log(id, node);
		if (node === null) return;
		updateOptions(control, node.actions, null);
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

		updateOptions(control, node.actions, null);
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

function updateOptions(field, options, selected)
{
	field.empty();
	$.each(options, (key, source) => {
		let option = $("<option></option>");
		option.attr("value", key).text(source.label);

		if (selected === key)
		{
			option.attr("selected", "selected");
		}

		field.append( option );
	});
}

function saveActionColor(obj, roomInput)
{
	console.log("Save color info");
	let id = roomInput.val(); 
	let room = RED.nodes.node(id);
	obj.color = room.color;
	console.log("set color", obj, room.color);
}