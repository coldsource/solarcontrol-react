import {API} from '../websocket/API.js';
import {App} from '../app/App.js';

export class Limits extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			grid: '',
			pv: '',
			battery: '',
			battery_low_temp: ''
		};

		this.change = this.change.bind(this);
		this.save = this.save.bind(this);
	}

	componentDidMount() {
		API.instance.command('storage', 'get', {name: 'limits'}).then(res => {
			if(res!==null)
				this.setState(res);
		});
	}

	checkFloat(f) {
		if(f=='')
			return true;

		if(isNaN(parseFloat(f)))
			return App.error('« ' + f + ' » is not a float');

		if(parseFloat(f)!=f)
			return App.error('« ' + f + ' » is not a float');

		return true;
	}

	change(ev) {
		let name = ev.target.name;
		let value = ev.target.value;

		let state = this.state;
		state[name] = value;
		this.setState(state);
	}

	save() {
		let limits = {};

		for(const name in this.state)
		{
			if(this.state[name]!='' && this.checkFloat(this.state[name]))
				limits[name] = this.state[name];
		}

		if(Object.keys(limits).length==0)
			return;

		API.instance.command('storage', 'set', {name: 'limits', value: limits}).then(res => {
			App.message("Limits saved");
		});
	}

	render() {
		return (
			<div className="sc-pricing">
				<div className="layout-form">
					<dl>
						<dt>Grid maximum power (W)</dt>
						<dd>
							<input type="number" name="grid" value={this.state.grid} onChange={this.change} />
						</dd>
						<dt>PV maximum power (W)</dt>
						<dd>
							<input type="number" name="pv" value={this.state.pv} onChange={this.change} />
						</dd>
						<dt>Battery maximum power (W)</dt>
						<dd>
							<input type="number" name="battery" value={this.state.battery} onChange={this.change} />
						</dd>
						<dt>Battery low temperature (°C)</dt>
						<dd>
							<input type="number" name="battery_low_temp" value={this.state.battery_low_temp} onChange={this.change} />
						</dd>
					</dl>
					<div className="submit" onClick={this.save}>Save</div>
				</div>
			</div>
		);
	}
}
