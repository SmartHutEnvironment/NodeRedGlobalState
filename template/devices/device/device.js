@include("../interface.js")

let base = require("./deviceHandlers");

class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		this.mqtt = RED.nodes.getNode(config.mqtt);
		this.room = RED.nodes.getNode(config.room);
		config.topic = this.room.prefix + config.topic;
		this.handler = null;

		let descriptor = deviceDescriptors[config.deviceType];

		if (!descriptor)
		{
			this.error("Invalid device type: " + config.deviceType);
			return;
		}

		switch (descriptor.Type)
		{
			case "common": this.handler = new base.DeviceHandler(this.mqtt, config.topic, descriptor.Triggers); break;
			case "state": this.handler = new base.StatedDeviceHandler(this.mqtt, config.topic, descriptor.Triggers, config.timeout); break;
			case "double state": this.handler = new base.DoubleStatedDeviceHandler(this.mqtt, config.topic, descriptor.Triggers, config.timeout); break;
			default: this.error("Invalid device class: " + descriptor.Type);
		}

		if (this.handler === null)
		{
			this.error("Failed to initialize device: " + config.deviceType + " - " + config.topic);
		}
	}
}
