
class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.device = RED.nodes.getNode(config.device);

		console.log("Subscribe trigger to ", config.trigger);
		this.device.handler.on(config.trigger, (value) => { this.send( {'payload': value} ) });
	}
}
