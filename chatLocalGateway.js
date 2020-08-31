function onMessageReceived(channel, message, sender, localOnly) {
    if (channel != "Chat") {
        return;
    }
    messageData = JSON.parse(message);
    if (myId == messageData.myId) {
        return;
    } else {
        var messageJson = {
            uuid: "",
            message: messageData.message,
            displayName: messageData.displayName,
            channel: messageData.channel,
            myId: myId
        };
        doSend(messageJson);
    }
}

Messages.messageReceived.connect(onMessageReceived);

function sendMessageInWorld(messageJson) {
    Messages.sendMessage("Chat", JSON.stringify({
        type: "TransmitChatMessage",
        position: MyAvatar.position,
        channel: messageJson.channel,
        colour: {
            blue: 255,
            green: 255,
            red: 255
        },
        message: messageJson.message,
        displayName: MyAvatar.displayName,
        myId: myId
    }));
}

var myId = Date.now();
var wsUri = "ws://localhost:8090/";
var messages = [];
var output;
var connected = false;
openTestWebSocket();
function openTestWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
    connected = true;
}

function onClose(evt) {
    connected = false;
    Script.setTimeout(function() {
        openTestWebSocket();
    }, 1000);
}

function onMessage(evt) {
    var messageJson = JSON.parse(evt.data);
    if (messageJson.myId == myId) {
        return;
    }
    sendMessageInWorld(messageJson);
}

function onError(evt) {
}

function doSend(message) {
    websocket.send(JSON.stringify(message));
}

function closeIt() {
    websocket.close();
}
