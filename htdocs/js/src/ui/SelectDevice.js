import {Device} from '../websocket/Device.js';

export class SelectDevice extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: []
		};
	}

	componentDidMount() {
		if(this.props.type===undefined)
			return console.error("Missing device type");

		let devices = [];
		if(this.props.type=='energy')
			devices = devices.concat(Device.instance.GetElectrical());

		this.setState({devices: devices});
	}

	renderDevices() {
		return this.state.devices.sort().map(device => {
			return (
				<div key={device.device_id} onClick={ () => this.props.onChange({target: {name: this.props.name, value: {id: device.device_id, name: device.device_name}}}) }>{device.device_name}</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-select-device">
				{this.renderDevices()}
			</div>
		);
	}
}
