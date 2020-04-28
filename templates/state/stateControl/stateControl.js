/* onInit */
node.globalState = RED.nodes.getNode(node.config.state1);
node.globalState2 = RED.nodes.getNode(node.config.state2);
if (!node.globalState) {
    node.error('No shared state for: ' + node.name);
    return;
}

node.globalState.on('change', (value) => { this.update(value); });

/* functions */ 
update(data) {
    this.globalState2.Set(data);
}