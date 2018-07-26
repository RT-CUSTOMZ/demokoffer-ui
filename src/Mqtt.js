import mqtt from 'mqtt';

class Mqtt {
    constructor(host) {
        this.flasherState = {};
        this.callbacks = {};

        let mqttClient = new mqtt.connect(host);
        mqttClient.on('connect', (connack => {
            this.mqttClient.subscribe('pico-flasher/+/temperature');
            this.mqttClient.subscribe('pico-flasher/+/status');
            this.mqttClient.subscribe('palaverlampe/ESP-c1:52:04/status'); // <-- Das ist der Palaverbutton
            if (typeof this.callbacks.connect === "function") {
                this.callbacks.connect();
            }
        }));
        mqttClient.on('message', this.onMessage.bind(this));
        mqttClient.on('reconnect', (() => {
                if (typeof this.callbacks.reconnect === "function") {
                    this.callbacks.reconnect();
                }
            })
        );
        mqttClient.on('close', (() => {
                if (typeof this.callbacks.close === "function") {
                    this.callbacks.close();
                }
            })
        );
        mqttClient.on('error', (() => {
                if (typeof this.callbacks.error === "function") {
                    this.callbacks.error();
                }
            })
        );
        this.mqttClient = mqttClient
    }

    // private functions

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    onMessage (topic, message) {
        try {
            const topicRegExp = new RegExp("^([\\w\\-]+)\\/ESP-([\\dabcdefABCDEF]{2}):([\\dabcdefABCDEF]{2}):([\\dabcdefABCDEF]{2})\\/(\\w+)$", "i");
            const regExResult = topicRegExp.exec(topic);
            if(regExResult !== null) {
                const name = regExResult[2] + regExResult[3] +regExResult[4];
                if(regExResult[1] === "pico-flasher") {
                    if( !(name in this.flasherState))
                        this.flasherState[name] = {
                            state: 'offline',
                            temperature: 0
                        };
                    if( regExResult[5] === "temperature") {
                        const messageObj = JSON.parse(message);
                        this.flasherState[name].temperature = messageObj.temperature;
                        if("picoflasherStatus" in this.callbacks) {
                            this.callbacks.picoflasherStatus(Object.assign({}, this.flasherState));
                        }
                    } else if( regExResult[5] === "status") {
                        this.flasherState[name].state = message.toString();
                        if(this.flasherState[name].state === "offline") {
                            this.flasherState[name].temperature = null;
                        }
                        if("picoflasherStatus" in this.callbacks) {
                            this.callbacks.picoflasherStatus(Object.assign({}, this.flasherState));
                        }
                    }
                }
                else if (regExResult[1] === "palaverlampe") {
                        if( regExResult[5] === "status") {
                            const status = message.toString();
                            if("buttonStatus" in this.callbacks) {
                                this.callbacks.buttonStatus(status);
                            }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

    }



    end() {
        this.mqttClient.end();
    }

    flashOn() {
        const mqttClient = this.mqttClient;
        mqttClient.publish('palaverlampe/ESP-c1:52:04/button/status', '{ "State": "pressed" }');
    }

    flashOff() {
        const mqttClient = this.mqttClient;
        mqttClient.publish('palaverlampe/ESP-c1:52:04/button/status', '{ "State": "released" }');
    }
}

export default Mqtt;