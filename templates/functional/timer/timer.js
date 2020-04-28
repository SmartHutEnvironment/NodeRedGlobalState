/* onInit */
node.sharedState = RED.nodes.getNode(node.config.state);
if (!node.sharedState) {
    node.error('No shared state for: ' + node.name);
    return;
}

/* onEnter */ 
node.send({
    topic:node.sharedState.name,
    payload:node.sharedState.value,
});