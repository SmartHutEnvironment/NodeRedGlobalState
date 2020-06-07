
class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.device = RED.nodes.getNode(config.device);
		
		this.on('input', function(msg) {
			this.device.handler.do(this.config.action, msg);
			this.send({payload: true});
		});
	}
}
