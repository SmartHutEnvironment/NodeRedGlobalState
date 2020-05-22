let events = require('events');

let Events = {
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
	constructor(mqtt, topic, triggers)
	{
		super();
		this.Mqtt = mqtt;
		this.Topic = topic;
		this.Triggers = triggers;
		this.Actions = {};

		this.Mqtt.subscribe(this.Topic, this.onMqttReceive.bind(this));
	}

	onMqttReceive(data)
	{
		for (var key in this.Triggers)
		{
			if (!key || !this.Triggers.hasOwnProperty(key)) continue;

			let trigger = this.Triggers[key];
			
			this.ExtractData(data, trigger.source, key, trigger.map);
		}
	}

	ExtractData(data, key, name = null, map = {"ON": true, "OFF": false})
	{
		if (!data.hasOwnProperty(key)) return;
		let value = data[key];
		if (map !== null)
		{
			if (!map.hasOwnProperty(value)) return;
			value = map[value];
		} 
		
		this.emit(name, value);
	}

	do(action, msg)
	{
		if (!this.Actions.hasOwnProperty(action))
		{
			console.log("Failed to execute action: ", action, "on device: ", this.Topic);
		}

		this.Actions[action](msg);
	}
}

class Timeout extends events.EventEmitter
{
	constructor(timeout, timerTimeout, on, off)
	{
		super();
		
		this.on = on;
		this.off = off;
		this.timeout = timeout;
		this.timerTimeout = timerTimeout;

		this.timer = null;
	}


	Start()
	{
		let isRunning = (this.timer !== null);
		if (this.timer !== null) clearTimeout(this.timer);

		this.timer = setTimeout(this.onTimeout.bind(this), this.timeout * 1000);
		
		if (!isRunning) this.on();
	}

	Stop(with_callback = false)
	{
		let isRunning = (this.timer !== null);
		if (this.timer !== null) clearTimeout(this.timer);

		if (isRunning) this.off();
	}

	Toggle()
	{
		if (this.timer !== null)
			this.Stop();
		else
			this.Start();
	}

	On()
	{

	}

	Off()
	{

	}

	onTimeout()
	{
		this.timer = null;
		this.off();
	}
}


class StatedDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, topic, triggers);

		
		this.Timer = new Timeout(timeout, 0, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state: "ON" })}, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state: "OFF" })} 
		);

		this.Actions = {
			"set": (msg) => { if (msg.payload) this.Timer.Start(); else this.Timer.Stop(); },
			"on": (msg) => { this.Timer.Start(); },
			"off": (msg) => { this.Timer.Stop(); },
			"toggle": (msg) => { this.Timer.Toggle(); }
		};
		
	}
}


class DoubleStatedDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, topic, triggers);

		
		this.TimerLeft = new Timeout(timeout, 0, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state_left: "ON" })}, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state_left: "OFF" })} 
		);

		this.TimerRight = new Timeout(timeout, 0, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state_right: "ON" })}, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state_right: "OFF" })} 
		);

		this.Actions = {
			"leftSet": (msg) => { if (msg.payload) this.TimerLeft.Start(); else this.TimerLeft.Stop(); },
			"leftOn": (msg) => { this.TimerLeft.Start(); },
			"leftOff": (msg) => { this.TimerLeft.Stop(); },
			"leftToggle": (msg) => { this.TimerLeft.Toggle(); },

			"rightSet": (msg) => { if (msg.payload) this.TimerRight.Start(); else this.TimerRight.Stop(); },
			"rightOn": (msg) => { this.TimerRight.Start(); },
			"rightOff": (msg) => { this.TimerRight.Stop(); },
			"rightToggle": (msg) => { this.TimerRight.Toggle(); }
		};
		
	}
}

module.exports = { DeviceHandler, StatedDeviceHandler, DoubleStatedDeviceHandler };