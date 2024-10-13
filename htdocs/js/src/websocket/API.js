export class API
{
	constructor()
	{
		API.instance = this;

		this.cnx_promise = new Promise(resolve => this.cnx_resolve = resolve);
		this.api_promise = null;
	}

	connect()
	{
		var self = this;

		self.ws = new WebSocket("ws://192.168.16.81:7000", "api");

		// Event on connection
		self.ws.onopen = function (event) {
			console.log("Connected (api)");
			self.cnx_resolve();
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			console.log("Disconnected : " + ev.reason);
		}

		self.ws.onmessage = function (ev) {
			self.api_resolve(JSON.parse(ev.data));
		}
	}

	command(module, cmd, parameters = {})
	{
		this.api_promise = new Promise(resolve => this.api_resolve = resolve);

		this.cnx_promise.then(() => {
			this.ws.send(JSON.stringify({module: module, cmd: cmd, parameters: parameters}));
		});

		return this.api_promise;
	}
}
