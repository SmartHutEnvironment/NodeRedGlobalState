let base = require("../statePrimitives");

class @env:className {

	constructor(config) {
		RED.nodes.createNode(node, config);
		this.config = config;
		
		this.availableEvents = ["click", "triggered"];
		this.availableActions = ["on", "off"];
	}
}
