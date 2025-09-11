export class Events
{
	constructor(protocol)
	{
		this.protocol = protocol;

		this.connected = false;
		this.reconnect_interval = null;
	}

	async connect()
	{
		var self = this;

		self.ws = new WebSocket('//' + window.location.hostname + ':7000', this.protocol);

		// Event on connection
		self.ws.onopen = function (event) {
			self.connected = true;
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			console.error("Disconnected" + (ev.reason?' : « ' + ev.reason + ' »':''));

			self.connected = false;
			self.reconnect_interval = setInterval(() => {
				if(self.connected)
				{
					clearInterval(self.reconnect_interval);
					return;
				}

				console.log("Reconnecting...");
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
