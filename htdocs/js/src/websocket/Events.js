export class Events
{
	constructor(protocol)
	{
		this.protocol = protocol;
	}

	async connect()
	{
		const response = await fetch('/conf/global.json');
		const config = await response.json();

		var self = this;

		self.ws = new WebSocket(config.websocket, this.protocol);

		// Event on connection
		self.ws.onopen = function (event) {
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			if(ev.reason)
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
