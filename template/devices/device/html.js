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

function prepareEditableList(list)
{
	list.editableList({
		addButton: false,
		addItem: function(row, index, data) {
			$(row).html("Item "+ data.key + "<input type=text value='"+data.value+"'/>");
		}
	});

	list.editableList('addItems', [{key: "key", value: "value"}, {key: "key2", value: "value2"}]);
}