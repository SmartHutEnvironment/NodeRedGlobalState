let events = require('events');

let Eventes = {
	Motion: 1,
	Click: 2,
	DoubleClick: 3,
	LongClick: 4,
	LeftClick: 5, 
	LeftDoubleClick: 6,
	LeftLongClick: 7,
	RightClick: 8,
	RightDoubleClick: 9,
	RightLongClick: 10,
	State: 11,
	LeftState: 12,
	RightState: 13
}

class DeviceHandler extends events.EventEmitter
{
	constructor(mqtt, topic)
	{
		this.Actions = [];
		this.Events = [];
		this.Properties = {};

		this.mqtt = mqtt;
		mqtt.subscribe(topic, this.onMqttReceive.bind(this));
	}

	onMqttReceive(data)
	{
		this.Events.each(event => {
			if (event === Events.Motion) 			this.ExtractData(data, "occupancy", 	"motion");
			if (event === Events.Click) 			this.ExtractData(data, "click", 		"click", 			{"single": true});
			if (event === Events.DoubleClick) 		this.ExtractData(data, "click", 		"doubleClick", 		{"double": true});
			if (event === Events.LeftClick) 		this.ExtractData(data, "button_left", 	"leftClick", 		{"single": true});
			if (event === Events.LeftDoubleClick) 	this.ExtractData(data, "button_left", 	"leftDoubleClick", 	{"double": true});
			if (event === Events.RightClick) 		this.ExtractData(data, "button_right", 	"rightClick", 		{"single": true});
			if (event === Events.RightDoubleClick) 	this.ExtractData(data, "button_right", 	"rightDoubleClick", {"double": true});
			if (event === Events.State) 			this.ExtractData(data, "state", 		"state");
			if (event === Events.LeftState) 		this.ExtractData(data, "state_left", 	"leftState");
			if (event === Events.RightState) 		this.ExtractData(data, "state_right", 	"rightState");
		});
	}

	ExtractData(data, key, name = null, map = {"ON": true, "OFF": false})
	{
		if (!data.hasOwnProperty(key)) return;

		value = data[key];
		if (map !== null)
		{
			if (!map.hasOwnProperty(value)) return;
			value = map[value];
		} 
		
		old = null;
		if (this.Properties.hasOwnProperty(name)) old = this.Properties[name];

		this.emit(name, value);
		if (old !== value) this.emit(name + "Changed", value);
	}
}

class SingleButton extends DeviceHandler
{
	constructor(mqtt, topic)
	{
		super(mqtt, topic);
		this.Events.concat([
			Events.Click,
			Events.DoubleClick,
			Events.LongClick
		]);
	}
}

class DoubleButton extends DeviceHandler
{
	constructor(mqtt, topic)
	{
		super(mqtt, topic);
		this.Events.concat([
			Events.LeftClick,
			Events.LeftDoubleClick,
			Events.LeftLongClick,
			Events.RightClick,
			Events.RightDoubleClick,
			Events.RightLongClick
		]);
	}
}

class SingleSwitch extends SingleButton
{
	constructor(mqtt, topic)
	{
		super(mqtt, topic);
		this.Events.concat([
			Events.State
		]);
	}
}

class DoubleSwitch extends DoubleButton
{
	constructor(mqtt, topic)
	{
		super(mqtt, topic);
		this.Events.concat([
			Events.LeftState,
			Events.RightState
		]);
	}
}


class MotionSensor extends DeviceHandler
{
	constructor(mqtt, topic)
	{
		super(mqtt, topic);
		this.Events.concat([
			Events.Motion
		]);
	}
}

module.exports = { SingleButton, DoubleButton, SingleSwitch, DoubleSwitch, MotionSensor };