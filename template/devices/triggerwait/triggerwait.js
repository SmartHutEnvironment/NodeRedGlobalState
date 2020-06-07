class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.device = RED.nodes.getNode(config.device);

		this.on('input', (msg) => {
			this.device.handler.on(config.trigger, this.listener.bind(this));
		});
	}

	listener(value)	{
		this.send( {'payload': value} );
		this.device.handler.removeListener(this.config.trigger, this.listener.bind(this));
	}
}
