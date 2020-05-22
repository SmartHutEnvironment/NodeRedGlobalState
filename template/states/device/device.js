let base = require("./deviceHandlers");

class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		this.handler = null;

		switch (config.deviceType)
		{
			case "Button - single": this.handler = new base.ButtonSingle(this.mqtt, config.topic); break;
			case "Button - double": this.handler = new base.ButtonSingle(this.mqtt, config.topic); break;
			case "Switch - single": this.handler = new base.ButtonSingle(this.mqtt, config.topic); break;
			case "Switch - double": this.handler = new base.ButtonSingle(this.mqtt, config.topic); break;
			case "Motion sensor": this.handler = new base.ButtonSingle(this.mqtt, config.topic); break;
		}

		if (this.handler === null)
		{
			this.error("Failed to initialize device: " + config.deviceType + " - " + config.topic);
		}
	}
}
