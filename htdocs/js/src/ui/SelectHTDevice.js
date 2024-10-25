import {API} from '../websocket/API.js';

export class SelectHTDevice extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			ht_devices: []
		}

		this.types = {
			'timerange-plug': 'fa-plug',
			'heater': 'fa-temperature-arrow-up'
		};
	}

	componentDidMount() {
		API.instance.command('deviceht', 'list').then(ht_devices => {
			if(ht_devices.length>0 && this.props.value==0)
				this.props.onChange({target: {name: this.props.name, value: ht_devices[0].device_id}});

			this.setState({ht_devices: ht_devices});
		});
	}

	renderTiles() {
		return this.state.ht_devices.map(ht_device => {
			return (
				<div
					key={ht_device.device_id}
					className={(this.props.value==ht_device.device_id)?'selected':''}
					onClick={() => this.props.onChange({target: {name: this.props.name, value: ht_device.device_id}})}
				>
					<span className="temperature">{ht_device.temperature} °C</span>
					<span className="name">{ht_device.device_name}</span>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-select-htdevice">
				{this.renderTiles()}
			</div>
		);
	}
}
