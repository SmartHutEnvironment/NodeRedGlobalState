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

			if (trigger.type.label !== "Signal")
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
		
		console.log(this.Topic, "emit", name, value);
		this.emit(name, value);

		return value;
	}

	do(action, msg)
	{
		if (!this.Actions.hasOwnProperty(action))
		{
			console.log("Failed to execute action: ", action, "on device: ", this.Topic);
		}

		console.log(this.Topic, "do", action, msg);
		this.Actions[action](msg);
	}

	get(state)
	{
		if (this.Properties.hasOwnProperty(state))
		{
			console.log(this.Topic, "get", state);
			return this.Properties[state];
		}

		console.log(this.Topic, "can not get", state);
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
		
		if (!isRunning) { this.on(); this.emit("on", null); }
	}

	Stop(with_callback = false)
	{
		let isRunning = (this.timer !== null);
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;

		if (isRunning) { this.off(); this.emit("off", null); }
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
		this.emit("off", null);
	}

	isRunning()
	{
		return this.timer !== null;
	}

	Abort()
	{
		let isRunning = (this.timer !== null);
		if (this.timer !== null) clearTimeout(this.timer);
		if (isRunning) this.emit("off", null);
	}
}

class VirtualDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, null, triggers);

		this.Timer = new Timeout(timeout,
				() => { console.log(this.Topic, "Turn ON"); this.onMqttReceive({state: "ON"}); }, 
				() => { console.log(this.Topic, "Turn OFF"); this.onMqttReceive({state: "OFF"}); } 
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
		super(mqtt, topic, triggers);

		
		this.Timer = new Timeout(timeout,
				() => { console.log(this.Topic, "publish on"); this.Mqtt.publish(this.Topic + "/set", { state: "ON" })}, 
				() => { console.log(this.Topic, "publish off"); this.Mqtt.publish(this.Topic + "/set", { state: "OFF" })} 
		);

		this.ManualOverride = new Timeout(1800, () => {}, () => {});

		this.Actions = {
			"set": (msg) => { if(this.ManualOverride.isRunning()) return; if (msg.payload) this.Timer.Start(); else this.Timer.Stop(); },
			"on": (msg) => { if(this.ManualOverride.isRunning()) return; this.Timer.Start(); },
			"off": (msg) => { if(this.ManualOverride.isRunning()) return; this.Timer.Stop(); },
			"toggle": (msg) => { if(this.ManualOverride.isRunning()) return; this.Timer.Toggle(); }
		};
		
	}

	onMqttReceive(data)
	{
		/*if (data.hasOwnProperty("click")) {
			this.Timer.Abort();
			this.ManualOverride.Start();
		}*/
		super.onMqttReceive(data);
	}
}


class DoubleStatedDeviceHandler extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, topic, triggers);

		
		this.TimerLeft = new Timeout(timeout,
				() => { console.log(this.Topic, "publish on left"); this.Mqtt.publish(this.Topic + "/set", { state_left: "ON" })}, 
				() => { console.log(this.Topic, "publish off left"); this.Mqtt.publish(this.Topic + "/set", { state_left: "OFF" })} 
		);

		this.TimerRight = new Timeout(timeout,
				() => { console.log(this.Topic, "publish on right"); this.Mqtt.publish(this.Topic + "/set", { state_right: "ON" })}, 
				() => { console.log(this.Topic, "publish off right"); this.Mqtt.publish(this.Topic + "/set", { state_right: "OFF" })} 
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

class CeilingLight extends DeviceHandler
{
	constructor(mqtt, topic, triggers, timeout)
	{
		super(mqtt, topic, triggers);

		
		this.Timer = new Timeout(timeout,
				() => { this.Mqtt.publish(this.Topic + "/set", { state: "ON" })}, 
				() => { this.Mqtt.publish(this.Topic + "/set", { state: "OFF" })} 
		);

		this.Actions = {
			"set": (msg) => {  if (msg.payload) this.Timer.Start(); else this.Timer.Stop(); },
			"on": (msg) => {  this.Timer.Start(); },
			"off": (msg) => {  this.Timer.Stop(); },
			"toggle": (msg) => {  this.Timer.Toggle(); },
			"moonlight": (msg) => { this.Mqtt.publish(this.Topic + "/set", { mode: "Moonlight" }) },
			"normallight": (msg) => { this.Mqtt.publish(this.Topic + "/set", { mode: "Normal" }) },

			"setbrightness": (msg) => { this.Mqtt.publish(this.Topic + "/set", { brightness: msg.payload }) },
			"setcolor": (msg) => { this.Mqtt.publish(this.Topic + "/set", { color: '#' + msg.payload }) },
		};
		
	}

	onMqttReceive(data)
	{
		super.onMqttReceive(data);
	}
}

module.exports = { DeviceHandler, StatedDeviceHandler, DoubleStatedDeviceHandler, VirtualDeviceHandler, CeilingLight };