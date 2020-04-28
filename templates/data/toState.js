let RED;
const bridgeByState = module.exports = function(red) {
  RED = red;
  RED.nodes.registerType("bridge-by-state", BridgeByState);
}

class BridgeByState {

  constructor(config) {
    var node = this;
    RED.nodes.createNode(node, config);
    node.config = config;
    node.sharedState = RED.nodes.getNode(node.config.state);
    if (!node.sharedState) {
      node.error('No shared state for: ' + node.name);
      return;
    }

    node.on('input', node.onInput.bind(this));
  }

  onInput(msg) {
    let node = this;

    node.status({fill:"green", shape:"dot", text:'' + node.sharedState.value});

    node.send(msg);
  }
}
