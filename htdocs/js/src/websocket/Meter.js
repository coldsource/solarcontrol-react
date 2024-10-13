export class Meter
{
	constructor(cbk)
	{
		this.cbk = cbk;

		this.connect();
	}

	connect()
	{
		var self = this;

		self.ws = new WebSocket("ws://192.168.16.81:7000", "meter");

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
