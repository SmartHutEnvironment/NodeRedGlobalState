let base = require("../statePrimitives");

class @env:className {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.availableEvents = ["click", "triggered"];
		this.availableActions = ["on", "off"];
	}
}
