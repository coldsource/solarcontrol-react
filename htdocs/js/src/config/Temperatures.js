import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {API} from '../websocket/API.js';

export class Temperatures extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			outdoor: null,
		};

		this.change = this.change.bind(this);
	}

	componentDidMount() {
		API.instance.command('storage', 'get', {name: 'temperatures'}).then(res => {
			if(res!==null)
				this.setState(res);
		});
	}

	change(ev) {
		let name = ev.target.name;
		let value = ev.target.value;

		let state = this.state;
		state[name] = value;
		this.setState(state);

		API.instance.command('storage', 'set', {name: 'temperatures', value: this.state}).then(res => {
		});
	}

	render() {
		return (
			<div className="sc-temperatures">
				<div className="layout-form">
					<dl>
						<dt>Outdoor</dt>
						<dd>
							<SelectHTDevice name="outdoor" value={this.state.outdoor} onChange={this.change} />
						</dd>
						<dt>Indoor</dt>
						<dd>
							<SelectHTDevice name="indoor" value={this.state.indoor} onChange={this.change} />
						</dd>
					</dl>
				</div>
			</div>
		);
	}
}
