@include("../interface.js");

function prepareTriggerFields(o, device, trigger)
{

	device.change(() => {
		let originalValue = trigger.val();
		let id = device.val(); 
		let node = RED.nodes.node(id);
		
		if (node !== null) updateOptions(trigger, node.triggers, originalValue);
	});

	let originalValue = o.trigger;
	let id = device.val(); 
	let node = RED.nodes.node(id);
	
	if (node !== null) updateOptions(trigger, node.triggers, originalValue);
}

function setupRoomFiltering(rooms, devices)
{
	rooms.change(() => {
		console.log("setup");
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
	console.log(options);
	field.empty();
	$.each(options, (key, source) => {
		console.log(key, source);
		let option = $("<option></option>");
		option.attr("value", key).text(source.label);

		if (selected === key)
		{
			option.attr("selected", "selected");
		}

		field.append( option );
	});
}

function saveTriggerColor(obj, roomInput)
{
	console.log("Save color info");
	let id = roomInput.val(); 
	let room = RED.nodes.node(id);
	obj.color = room.color;
	console.log("set color", obj, room.color);
}