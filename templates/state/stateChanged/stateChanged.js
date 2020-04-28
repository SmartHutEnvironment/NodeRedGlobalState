/* onInit */
node.globalState = RED.nodes.getNode(node.config.state);
if (!node.globalState) {
    node.error('No shared state for: ' + node.name);
    return;
}

node.globalState.on('changed', (value) => { this.update(value); });

/* functions */ 
async update(data) {
    node.send({
        payload: data,
    });
}