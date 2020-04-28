/* require */
let fk = require("../extractStates");

/* onInit */
node.mqtt = RED.nodes.getNode(node.config.mqtt);
if (!node.mqtt) {
    node.error('No mqtt for: ' + node.name);
    return;
}

node.switchState = RED.nodes.getNode(node.config.switchState);

node.mqtt.subscribe(config.topic, node.processData.bind(this));


/* onEnter */ 
let data = msg.payload === true ? "ON" : "OFF";
node.mqtt.publish(node.config.topic + "/set", {state: data});
return null;

/* functions */ class TMP {

processData(data)
{
    let node = this;
    node.send(
            fk.pack(fk.updateState(node.switchState, fk.extractState(data))),
            fk.pack(fk.extractPower(data)),
            fk.pack(fk.extractConsumption(data)),
            fk.pack(fk.extractBattery(data)),
            fk.pack(fk.extractLinkQuality(data)),
        );
}

/* functions */ }