/* require */
let fk = require("../extractStates");

/* onInit */
node.mqtt = RED.nodes.getNode(node.config.mqtt);
if (!node.mqtt) {
    node.error('No mqtt for: ' + node.name);
    return;
}

node.motionState = RED.nodes.getNode(node.config.motionState);

node.mqtt.subscribe(config.topic, node.processData.bind(this));

/* functions */ class TMP {

processData(data)
{
    let node = this;

    node.send(
            fk.pack(fk.updateState(node.motionState, fk.extractMotion(data))),
            fk.pack(fk.extractLux(data)),
            fk.pack(fk.extractBattery(data)),
            fk.pack(fk.extractLinkQuality(data)),
        );
}

/* functions */ }