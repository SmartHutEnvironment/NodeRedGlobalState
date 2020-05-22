@include("../interface.js")

function updateDeviceCapabilities(o, type)
{
	descriptor = deviceDescriptors[type];
	o.triggers = descriptor.Triggers;
	o.actions = descriptor.Actions;
}

function fillDeviceTypeOptions(field, selected)
{
	field.empty();
	$.each(deviceDescriptors, (key, source) => {
		let option = $("<option></option>");
		option.attr("value", key).text(source.Name);

		if (selected === key)
		{
			option.attr("selected", "selected");
		}

		field.append( option );
	});
}