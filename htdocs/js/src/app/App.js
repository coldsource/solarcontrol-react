import {API as ProtocolAPI} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {Global} from '../meter/Global.js';
import {DevicesOnOff} from '../device/DevicesOnOff.js';
import {DevicesHT} from '../device/DevicesHT.js';
import {DeviceHWS} from '../device/DeviceHWS.js';
import {Energy} from '../logs/Energy.js';
import {Configs} from '../config/Configs.js';

export class App extends React.Component
{
	constructor(props) {
		super(props);

		let url = new URL(document.location);
		let get = new URLSearchParams(url.search);

		this.state = {
			get: get,
			error: '',
			message: ''
		};

		let self = this;
		window.onpopstate = (e) => {
			self.changeURL(document.location.search);
			return true;
		};

		this.api = new ProtocolAPI();
		this.devices = new ProtocolDevice();
		this.api.connect();

		App.instance = this;
	}

	getPath() {
		return this.state.get.has('loc')?this.state.get.get('loc'):'';
	}

	changeURL(path, data = {})
	{
		let get = new URLSearchParams(path);

		window.history.pushState('','',path);

		this.setState({
			get: get,
			data: data
		});
	}

	renderError() {
		if(this.state.error=='')
			return ;

		setTimeout(() => this.setState({error: ''}), 5000);

		return (
			<div className="error" onClick={() => this.setState({error: ''})}>
				{this.state.error}
			</div>
		);
	}

	renderMessage() {
		if(this.state.message=='')
			return ;

		setTimeout(() => this.setState({message: ''}), 3000);

		return (
			<div className="message" onClick={() => this.setState({message: ''})}>
				{this.state.message}
			</div>
		);
	}

	renderScreen() {
		let path = this.getPath();

		if(path=='' || path=='meter')
			return (<Global />);
		else if(path=='devicesonoff')
			return (<DevicesOnOff />);
		else if(path=='devicesht')
			return (<DevicesHT />);
		else if(path=='devicehws')
			return (<DeviceHWS />);
		else if(path=='energy')
			return (<Energy />);
		else if(path=='config')
			return (<Configs />);
	}

	render() {
		return (
			<div className="sc-app">
				<div className="menu">
					<i className="scf scf-meter" onClick={() => this.changeURL('?loc=meter')} />
					<i className="scf scf-plug" onClick={() => this.changeURL('?loc=devicesonoff')} />
					<i className="scf scf-thermometer" onClick={() => this.changeURL('?loc=devicesht')} />
					<i className="scf scf-droplet" onClick={() => this.changeURL('?loc=devicehws')}></i>
					<i className="scf scf-electricity" onClick={() => this.changeURL('?loc=energy')} />
					<i className="scf scf-menu" onClick={() => this.changeURL('?loc=config')} />
				</div>
				<div>
					{this.renderScreen()}
				</div>

				{this.renderError()}
				{this.renderMessage()}
			</div>
		);
	}
}

App.error = (msg) => {
	App.instance.setState({error: msg});
}

App.message = (msg) => {
	App.instance.setState({message: msg});
}

let el = document.getElementById('main');
const root = ReactDOM.createRoot(el);
root.render(React.createElement(App, {}));
