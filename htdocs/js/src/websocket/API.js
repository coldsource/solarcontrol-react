import {App} from '../app/App.js';

export class API
{
	constructor()
	{
		API.instance = this;

		this.cnx_promise = new Promise(resolve => this.cnx_resolve = resolve);
		this.api_promises = {};

		this.api_id = 0;
	}

	async connect()
	{
		var self = this;

		self.ws = new WebSocket('//' + window.location.hostname + ':7000', "api");

		// Event on connection
		self.ws.onopen = function (event) {
			console.log("Connected (API)");
			self.cnx_resolve();
		};

		// Event on disconnection
		self.ws.onclose = function(ev) {
			console.error("Disconnected (API)" + (ev.reason?' : « ' + ev.reason + ' »':''));

			setTimeout(() => {
				console.log("Reconnecting (API) ...");
				self.connect();
			}, 10000);
		}

		self.ws.onmessage = function (ev) {
			if(ev.data=="")
				return; // Keepalive answer

			let ret = JSON.parse(ev.data);
			let promise = self.api_promises[ret.id];
			delete self.api_promises[ret.id];

			if(ret!==null && ret.status=='error')
			{
				App.loader(false);
				App.error(ret.message);
				promise.reject(ret.message);
				return;
			}

			App.loader(false);
			promise.resolve(ret.res);
		}
	}

	command(module, cmd, parameters = {})
	{
		let id = ++this.api_id;

		let promise = {};
		promise.object = new Promise((resolve, reject) => { promise.resolve = resolve; promise.reject = reject; });
		this.api_promises[id] = promise;

		App.loader(true);

		this.cnx_promise.then(() => {
			this.ws.send(JSON.stringify({id: id, module: module, cmd: cmd, parameters: parameters}));
		});

		return promise.object;
	}
}
