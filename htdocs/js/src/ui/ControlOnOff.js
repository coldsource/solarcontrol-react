import {API} from '../websocket/API.js';

export class ControlOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.toggleState = this.toggleState.bind(this);
	}

	toggleState() {
		let new_state = !this.props.state;
		API.instance.command('deviceelectrical', 'setstate', {device_id: this.props.device_id, state: new_state?'on':'off'});
	}

	render() {
		let cl = this.props.state?'scf-onoff on':'scf-onoff off';
		if(this.props.type=='controller')
			cl = this.props.state?'scf-electricity':'scf-battery';
		return (
			<i className={'scf ' + cl} onClick={this.toggleState} />
		);
	}
}
