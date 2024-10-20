export class Meter
{
	constructor(cbk)
	{
		this.cbk = cbk;

		this.connect();
	}

	connect()
	{
		const response = await fetch('/conf/global.json');
		const config = await response.json();

		var self = this;

		self.ws = new WebSocket(config.websocket, "meter");

		// Event on connection
		self.ws.onopen = function (event) {
			console.log("Connected (meter)");
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			console.log("Disconnected : " + ev.reason);
		}

		self.ws.onmessage = function (ev) {
			self.cbk(JSON.parse(ev.data));
		}
	}

	disconnect()
	{
		this.ws.close();
	}
}
