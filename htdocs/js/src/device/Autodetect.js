import {API} from '../websocket/API.js';

export class Autodetect extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
		};
	}

	componentDidMount() {
		API.instance.command('shelly', 'autodetect', {}).then(res => {
			this.setState({devices: res});
		});
	}

	sortIP(deva, devb) {
		let ipa = deva.ip;
		let ipb = devb.ip;
		let a = parseInt(ipa.match(/\.[0-9]+$/)[0].substr(1));
		let b = parseInt(ipb.match(/\.[0-9]+$/)[0].substr(1));
		return a<b?-1:1;
	}

	renderIcon(device) {
		if(device.type=="Pro3")
			return (<i className="scf scf-plugs" />);
		if(device.type=="Pro3EM")
			return (<i className="scf scf-meter" />);
		return (<i className="scf scf-plug" />);
	}

	renderDevices() {
		return this.state.devices.sort(this.sortIP).map(device => {
			return (
				<div key={device.ip} onClick={ () => this.props.onSelect(device) }>
					<div className="name">{device.name}</div>
					<div className="icon">{this.renderIcon(device)}</div>
					<div className="type">{device.type}</div>
					<div className="ip">{device.ip}</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-autodetect">
				{this.renderDevices()}
			</div>
		);
	}
}
