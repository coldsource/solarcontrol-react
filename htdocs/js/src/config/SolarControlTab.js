import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Config} from '../websocket/Config.js';

export class SolarControlTab extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			config_master: {},
			config: {},
			config_local: {}
		};

		this.changeConfig = this.changeConfig.bind(this);
		this.reloadConfig = this.reloadConfig.bind(this);
	}

	componentDidMount() {
		Config.instance.Subscribe(this.reloadConfig);
	}

	componentWillUnmount() {
		Config.instance.Unsubscribe(this.reloadConfig);
	}

	reloadConfig(current, master) {
		this.setState({
			config_master: master[this.props.module].GetAll(),
			config: Object.assign({}, current[this.props.module].GetAll()),
			config_local: current[this.props.module].GetAll()
		});
	}

	update(name) {
		const value = this.state.config_local[name]
		if(value==this.state.config_master[name])
			return this.reset(name);

		let params = {
			module: this.props.module,
			name: name,
			value: value
		};

		API.instance.command('config', 'set', params).then(res => {
			const config = this.state.config;
			config[name] = this.state.config_local[name];
			this.setState({config: config});
			App.message("Configration updated");
		});
	}

	reset(name) {
		let params = {
			module: this.props.module,
			name: name,
		};

		API.instance.command('config', 'reset', params).then(res => {
			App.message("Configration reseted to default");
		});
	}

	changeConfig(ev) {
		let config_local = this.state.config_local;
		config_local[ev.target.name] = ev.target.value;
		this.setState({config_local: config_local});
	}

	renderConfigAction(name) {
		if(this.state.config[name]!=this.state.config_local[name])
			return (<i className="scf scf-check" onClick={ () => this.update(name) } />);
		else if(this.state.config_master[name]!=this.state.config[name])
			return (<i className="scf scf-back" onClick={ () => this.reset(name) } />);
		return;
	}

	renderItems() {
		return Object.entries(this.state.config_local).map(entry => {
			const [name, value] = entry;
			return (
				<div className="entry" key={name}>
					<div className="name">{name}</div>
					<div className="value">
						<input type="text" name={name} value={value} onChange={this.changeConfig} />
						{this.renderConfigAction(name)}
					</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-solarcontrol-tab">
				{this.renderItems()}
			</div>
		);
	}
}
