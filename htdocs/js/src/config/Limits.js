import {API} from '../websocket/API.js';
import {App} from '../app/App.js';

export class Limits extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			grid: '',
			pv: '',
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
		if(!this.checkFloat(this.state.grid) || !this.checkFloat(this.state.pv))
			return;

		API.instance.command('storage', 'set', {name: 'limits', value: this.state}).then(res => {
			App.message("Limits saved");
		});
	}

	render() {
		return (
			<div className="sc-pricing">
				<div className="layout-form">
					<dl>
						<dt>Grid maximum power (Wh)</dt>
						<dd>
							<input type="number" name="grid" value={this.state.grid} onChange={this.change} />
						</dd>
						<dt>PV maximum power (Wh)</dt>
						<dd>
							<input type="number" name="pv" value={this.state.pv} onChange={this.change} />
						</dd>
					</dl>
					<div className="submit" onClick={this.save}>Save</div>
				</div>
			</div>
		);
	}
}
