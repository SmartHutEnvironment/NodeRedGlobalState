/* require */
let fk = require("../extractStates");

/* onInit */
node.mqtt = RED.nodes.getNode(node.config.mqtt);
if (!node.mqtt) {
    node.error('No mqtt for: ' + node.name);
    return;
}

node.switchLeftState = RED.nodes.getNode(node.config.switchLeftState);
node.switchRightState = RED.nodes.getNode(node.config.switchRightState);

node.mqtt.subscribe(config.topic, node.processData.bind(this));


/* onEnter */ 
let data = {};
if (msg.payload.hasOwnProperty("state_left"))
{
    data["state_left"] = msg.payload.state_left === true? "ON" : "OFF";
}

if (msg.payload.hasOwnProperty("state_right"))
{
    data["state_right"] = msg.payload.state_right === true? "ON" : "OFF";
}

node.mqtt.publish(node.config.topic + "/set", data);
return null;

/* functions */ class TMP {

processData(data)
{
    let node = this;
    node.send([
            null, //fk.pack(fk.extractLeftClick(data)),
            null, //fk.pack(fk.extractLeftClick(data)),
            null, //fk.pack(fk.extractRightClick(data)),
            null, //fk.pack(fk.extractRightClick(data)),
            fk.pack(fk.updateState(node.switchLeftState, fk.extractLeftState(data))),
            fk.pack(fk.updateState(node.switchRightState, fk.extractRightState(data))),
            fk.pack(fk.extractPower(data)),
            fk.pack(fk.extractConsumption(data)),
            fk.pack(fk.extractBattery(data)),
            fk.pack(fk.extractLinkQuality(data)),
    ]);
}

/* functions */ }