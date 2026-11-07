import {SliderDuration} from '../../ui/SliderDuration.js';
import {Tooltip} from '../../ui/Tooltip.js';

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
			<div>
				<div>
					<Tooltip content="Once switched on, the device will always be switched off after this amount of time.">
						Maximum on time
					</Tooltip>
				</div>
				<SliderDuration name="max_on" value={value.max_on} onChange={this.props.onChange} />
			</div>
		);
	}

	render() {
		let value = this.props.value;

		return (
			<div className="layout-form">
				<div>
					<div>
						<Tooltip content="Once switched on, the device will never be switched off before this amount of time. Use this to avoid too frequent on/off when offloading.">
							Minimum on time
						</Tooltip>
					</div>
					<SliderDuration name="min_on" value={value.min_on} onChange={this.props.onChange} />
				</div>
				<div>
					<div>
						<Tooltip content="Once switched off, the device will never be switched on before this amount of time. Use this to avoid too frequent on/off when offloading.">
							Minimum off time
						</Tooltip>
					</div>
					<SliderDuration name="min_off" value={value.min_off} onChange={this.props.onChange} />
				</div>
				{this.renderMaxOn()}
			</div>
		);
	}
}
