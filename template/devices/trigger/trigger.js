
class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.device = RED.nodes.getNode(config.device);

		this.device.handler.on(config.trigger, (value) => { this.send( {'payload': value} ) });
	}
}
