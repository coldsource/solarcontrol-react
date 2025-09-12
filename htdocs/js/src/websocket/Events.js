export class Events
{
	constructor(protocol)
	{
		this.protocol = protocol;
	}

	async connect()
	{
		var self = this;

		self.ws = new WebSocket('//' + window.location.hostname + ':7000', this.protocol);

		// Event on connection
		self.ws.onopen = function (event) {
			console.log("Connected (protocol " + self.protocol + ")");
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			console.error("Disconnected (protocol " + self.protocol + ") " + (ev.reason?' : « ' + ev.reason + ' »':''));

			setTimeout(() => {
				console.log("Reconnecting (protocol " + self.protocol + ") ...");
				self.connect();
			}, 10000);
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
