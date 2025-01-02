import {API} from '../websocket/API.js';
import {App} from '../app/App.js';

export class Pricing extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			global: '',
			offpeak: '',
			peak: '',
		};

		this.change = this.change.bind(this);
		this.save = this.save.bind(this);
	}

	componentDidMount() {
		API.instance.command('storage', 'get', {name: 'pricing'}).then(res => {
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
		if(!this.checkFloat(this.state.global) || !this.checkFloat(this.state.offpeak) || !this.checkFloat(this.state.peak))
			return;

		if(this.state.global && (this.state.peak || this.state.offpeak))
			return App.error("Please provide only global or peak / offpeak pricing");

		if((this.state.peak && !this.state.offpeak) || (!this.state.peak && this.state.offpeak))
			return App.error("For using offpeak pricing you must provide peak and offpeak pricing");

		API.instance.command('storage', 'set', {name: 'pricing', value: this.state}).then(res => {
			App.message("Pricing saved");
		});
	}

	render() {
		return (
			<div className="sc-pricing">
				<div className="layout-form">
					<dl>
						<dt>Global price (€)</dt>
						<dd>
							<input type="number" name="global" value={this.state.global} onChange={this.change} />
						</dd>
						<dt>Offpeak price (€)</dt>
						<dd>
							<input type="number" name="offpeak" value={this.state.offpeak} onChange={this.change} />
						</dd>
						<dt>Peak price (€)</dt>
						<dd>
							<input type="number" name="peak" value={this.state.peak} onChange={this.change} />
						</dd>
					</dl>
					<div className="submit" onClick={this.save}>Save</div>
				</div>
			</div>
		);
	}
}
