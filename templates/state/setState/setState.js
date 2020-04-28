/* onInit */
node.globalState = RED.nodes.getNode(node.config.state);
if (!node.globalState) {
    node.error('No shared state for: ' + node.name);
    return;
}

/* onEnter */ 
let result = node.globalState.Set(msg.payload);
node.send({payload: result});