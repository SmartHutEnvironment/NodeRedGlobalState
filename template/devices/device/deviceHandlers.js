let events = require('events');

class DeviceHandler extends events.EventEmitter
{
	constructor(mqtt, topic, triggers)
	{
		super();
		this.Mqtt = mqtt;
		this.Topic = topic;
		this.Triggers = triggers;
		this.Actions = {};
		this.Properties = {};

		if (this.Topic !== null)
			this.Mqtt.subscribe(this.Topic, this.onMqttReceive.bind(this));
	}

	onMqttReceive(data)
	{
		for (var key in this.Triggers)
		{
			if (!key || !this.Triggers.hasOwnProperty(key)) continue;

			let trigger = this.Triggers[key];
			
			let value = this.ExtractData(data, trigger.source, key, trigger.map);

			if (trigger.type !== DataType.Signal)
			{
				this.Properties[trigger.id] = value;
			}
		}
	}

	ExtractData(data, key, name = null, map)
	{
		if (!data.hasOwnProperty(key)) return;
		let value = data[key];
		if (map !== null)
		{
			if (!map.hasOwnProperty(value)) return;
			value = map[value];
		} 
		
		this.emit(name, value);

		return value;
	}

	do(action, msg)
	{
		if (!this.Actions.hasOwnProperty(action))
		{
			console.log("Failed to execute action: ", action, "on device: ", this.Topic);
		}

		this.Actions[action](msg);
	}

	get(state)
	{
		if (this.Properties.hasOwnProperty(state))
		{
			return this.Properties[state];
		}

		return null;
	}
}

class Timeout extends events.EventEmitter
{
	constructor(timeout, on, off)
	{
		super();
		
		this.on = on;
		this.off = off;
		this.timeout = timeout;

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

	onTimeout()
	{
		this.timer = null;
		this.off();
	}
}

class VirtualDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, topic, triggers);

		this.Timer = new Timeout(timeout,
				() => { this.onMqttReceive({state: "ON"}); }, 
				() => { this.onMqttReceive({state: "OFF"}); } 
		);

		this.Actions = {
			"set": (msg) => { if (msg.payload) this.Timer.Start(); else this.Timer.Stop(); },
			"on": (msg) => { this.Timer.Start(); },
			"off": (msg) => { this.Timer.Stop(); },
			"toggle": (msg) => { this.Timer.Toggle(); }
		};
		
	}
}

class StatedDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, null, triggers);

		
		this.Timer = new Timeout(timeout,
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

		
		this.TimerLeft = new Timeout(timeout,
				() => { this.Mqtt.publish(this.Topic + "/set", { state_left: "ON" })}, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state_left: "OFF" })} 
		);

		this.TimerRight = new Timeout(timeout,
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

module.exports = { DeviceHandler, StatedDeviceHandler, DoubleStatedDeviceHandler, VirtualDeviceHandler };