import {SliderDuration} from '../../ui/SliderDuration.js';
import {Tooltip} from '../../ui/Tooltip.js';
import {ConfigBlock} from '../../ui/ConfigBlock.js';

export class MinOnOff extends React.Component
{
	constructor(props) {
		super(props);
	}

	renderMaxOn() {
		if(this.props.options===undefined || !this.props.options.max_on)
			return;

		let value = this.props.value;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Once switched on, the device will always be switched off after this amount of time.">
						Maximum on time
					</Tooltip>
				</dt>
				<dd><SliderDuration name="max_on" value={value.max_on} onChange={this.props.onChange} /></dd>
			</React.Fragment>
		);
	}

	render() {
		let value = this.props.value;

		return (
			<ConfigBlock title="Device protection">
				<dt>
					<Tooltip content="Once switched on, the device will never be switched off before this amount of time. Use this to avoid too frequent on/off when offloading.">
						Minimum on time
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on" value={value.min_on} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content="Once switched off, the device will never be switched on before this amount of time. Use this to avoid too frequent on/off when offloading.">
						Minimum off time
					</Tooltip>
				</dt>
				<dd>
					<SliderDuration name="min_off" value={value.min_off} onChange={this.props.onChange} />
				</dd>
				{this.renderMaxOn()}
			</ConfigBlock>
		);
	}
}
