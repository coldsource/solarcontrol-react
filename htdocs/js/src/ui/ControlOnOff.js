import {API} from '../websocket/API.js';
import {Modal} from './Modal.js';
import {SliderDuration} from './SliderDuration.js';

export class ControlOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			opened: false,
			duration: 0
		};
	}

	setDeviceState(state) {
		this.setState({opened: false});
		API.instance.command('deviceelectrical', 'setstate', {device_id: this.props.device_id, state: state, timeout: this.state.duration});
	}

	render() {
		if(this.state.opened)
		{
			return (
				<Modal title="Manual state" small={true} onClose={ () => this.setState({opened: false}) }>
					<div className="sc-control-onoff">
						<div className="description">
							Set manual state for this device. It will no longer be controlled by SolarControl and stay in the state you choose until you switch it back to auto (« sun ») or after the specified timeout.
						</div>
						<div className="states">
							<div onClick={ () => this.setDeviceState('auto') }>
								<i className="scf scf-sun" />
								<div>Set back to auto mode</div>
							</div>
							<div onClick={ () => this.setDeviceState('on') }>
								<i className="scf scf-onoff on" />
								<div>Set device manually ON</div>
							</div>
							<div onClick={ () => this.setDeviceState('off') }>
								<i className="scf scf-onoff off" />
								<div>Set device manually OFF</div>
							</div>
						</div>
						<br />
						<SliderDuration name="duration" value={this.state.duration} type="forever" onChange={ (ev) => this.setState({duration: ev.target.value}) } />
					</div>
				</Modal>
			);
		}

		let cl = this.props.state?'scf-onoff on':'scf-onoff off';
		if(this.props.type=='controller')
			cl = this.props.state?'scf-electricity':'scf-battery';
		return (
			<i className={'scf ' + cl} onClick={ () => this.setState({opened: true}) } />
		);
	}
}
