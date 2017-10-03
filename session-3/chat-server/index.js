const PORT = 3200;

let express = require('express');
let expressWs = require('express-ws');
let EventBus = require('./eventbus');

const app = express();
expressWs(app);

const bus = new EventBus();

app.get('/ping', (req, res) => {
	res.sendStatus(200);
});

app.ws('/chat', (ws, res) => {
	let subscriptions = [];

	ws.on('message', msg => {
		try {
			msg = JSON.parse(msg);
		} catch (e) {
			ws.terminate();
			return;
		}
		if (msg.action === 'join' && msg.channel) {
			let sub = bus.subscribe(msg.channel, event => ws.send(JSON.stringify(event)));
			subscriptions.push(sub);
		} else if (msg.action === 'send') {
			let { action: undefined, ...copy } = msg;
			bus.emit(msg.channel, copy);
		}
	});

	ws.on('close', () => {
		subscriptions.forEach(sub => sub.release());
	});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));