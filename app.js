(function () {
    const sendBtn = document.querySelector('#send')
    const messages = document.querySelector('#messages')
    const messageBox = document.querySelector('#messageBox')
    let ws;

    function showMessage(message) {
        messages.textContent += `\n\n${message}`;
        messages.scrollTop = messages.scrollHeight
        messageBox.value = '';
    }
    function init() {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }
        ws = new WebSocket('ws://localhost:6969');
        ws.onopen = () => {
            console.log('connection opened!');
        }
        ws.addEventListener("message", event => {
            if (event.data instanceof Blob) {
                reader = new FileReader();
                reader.onload = () => {
                    showMessage(reader.result)
                };
                reader.readAsText(event.data);
            }
        });

        ws.onclose = function () {
            ws = null;
        }
    }
    sendBtn.onclick = function () {
        if (!ws) {
            showMessage("No WebSocket connection");
            return;
        }
        ws.send(messageBox.value);
        showMessage(messageBox.value);
    }
    init();
})();