import {App} from '../app/App.js';

export class API
{
	constructor()
	{
		API.instance = this;

		this.cnx_promise = new Promise(resolve => this.cnx_resolve = resolve);
		this.api_promise = null;
	}

	async connect()
	{
		const response = await fetch('/conf/global.json');
		const config = await response.json();

		var self = this;

		self.ws = new WebSocket(config.websocket, "api");

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
			let ret = JSON.parse(ev.data);
			if(ret!==null && ret.status!==undefined && ret.status=='error')
			{
				App.error(ret.message);
				self.api_reject(ret.message);
			}

			self.api_resolve(ret);
		}
	}

	command(module, cmd, parameters = {})
	{
		this.api_promise = new Promise((resolve, reject) => { this.api_resolve = resolve; this.api_reject = reject; });

		this.cnx_promise.then(() => {
			this.ws.send(JSON.stringify({module: module, cmd: cmd, parameters: parameters}));
		});

		return this.api_promise;
	}
}
