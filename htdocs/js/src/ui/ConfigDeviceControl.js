import {SelectInteger} from './SelectInteger.js';

export class ConfigDeviceControl extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'plug': {icon: 'scf-plug', name: 'Plug S'},
			'pro': {icon: 'scf-plugs', name: 'Pro'}
		};

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		if(name=='outlet')
			value = parseInt(value);

		config[name] = value;

		if(name=='type')
		{
			if(value=='plug')
				delete config.outlet;

			if(value=='pro')
				config.outlet = 0;
		}

		if(name=='mqtt_id' && value=='')
			delete config.mqtt_id;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	renderTiles() {
		return Object.keys(this.types).map(type => {
			let icon = this.types[type].icon;
			let name = this.types[type].name;
			return (
				<i
					key={type}
					className={"scf " + icon + ((this.props.value.type==type)?' selected':'')}
					onClick={() => this.change({target: {name: "type", value: type}})}
				><span>{name}</span></i>
			);
		});
	}

	renderOutlet() {
		const value = this.props.value;
		if(value.type!='pro')
			return;

		return (
			<React.Fragment>
				<dt>Outlet number</dt>
				<dd><SelectInteger min={1} max={3} sum={-1} name="outlet" value={value.outlet} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	renderMQTTID() {
		const value = this.props.value;
		let mqtt_id = value.mqtt_id!==undefined?value.mqtt_id:'';

		return (
			<React.Fragment>
				<dt>MQTT ID</dt>
				<dd><input type="text" name="mqtt_id" value={mqtt_id} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>Device controller type</dt>
				<dd>
					<div className="sc-select-controltype">
						{this.renderTiles()}
					</div>
				</dd>
				<dt>IP address</dt>
				<dd><input type="text" name="ip" value={value.ip} onChange={this.change} /></dd>
				{this.renderOutlet()}
				{this.renderMQTTID()}
			</React.Fragment>
		);
	}
}
