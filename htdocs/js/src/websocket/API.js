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
		var self = this;

		self.ws = new WebSocket('//' + window.location.hostname + ':7000', "api");

		// Event on connection
		self.ws.onopen = function (event) {
			self.cnx_resolve();
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			if(ev.reason)
				console.log("Disconnected : " + ev.reason);
		}

		self.ws.onmessage = function (ev) {
			if(ev.data=="")
				return; // Keepalive answer

			let ret = JSON.parse(ev.data);
			if(ret!==null && ret.status!==undefined && ret.status=='error')
			{
				App.loader(false);
				App.error(ret.message);
				self.api_reject(ret.message);
				return;
			}

			App.loader(false);
			self.api_resolve(ret);
		}
	}

	command(module, cmd, parameters = {})
	{
		this.api_promise = new Promise((resolve, reject) => { this.api_resolve = resolve; this.api_reject = reject; });
		App.loader(true);

		this.cnx_promise.then(() => {
			this.ws.send(JSON.stringify({module: module, cmd: cmd, parameters: parameters}));
		});

		return this.api_promise;
	}
}
