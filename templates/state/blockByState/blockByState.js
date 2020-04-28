/* onInit */
node.sharedState = RED.nodes.getNode(node.config.state);
if (!node.sharedState) {
    node.error('No shared state for: ' + node.name);
    return;
}

/* onEnter */ 
let valid = node.sharedState.isValid();
if (node.config.invert) valid = !valid;
let response = valid ? 
{
    topic:node.sharedState.name,
    payload:  msg.payload
}
: null;
node.send(response);