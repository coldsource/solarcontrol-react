import {API} from '../websocket/API.js';

export class ControlOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.toggleState = this.toggleState.bind(this);
	}

	toggleState() {
		let new_state = !this.props.state;
		API.instance.command('deviceonoff', 'setstate', {device_id: this.props.device_id, state: new_state?'on':'off'});
	}

	render() {
		let cl = this.props.state?' on':' off';
		return (
			<i className={'fa fa-power-off' + cl} onClick={this.toggleState} />
		);
	}
}