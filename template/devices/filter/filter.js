
class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.device = RED.nodes.getNode(config.device);
		
		this.on('input', function(msg) {
			if (this.device.handler.get(this.config.state))
			{
				this.send(msg);
			}
		});
	}
}
