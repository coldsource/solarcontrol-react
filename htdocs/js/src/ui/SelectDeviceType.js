export class SelectDeviceType extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'timerange': 'scf-plug2',
			'heater': 'scf-heater',
			'cmv': 'scf-fan',
			'passive': 'scf-meter'
		};
	}

	renderTiles() {
		return Object.keys(this.types).map(type => {
			let icon = this.types[type];
			return (
				<i
					key={type}
					className={"scf " + icon + ((this.props.value==type)?' selected':'')}
					onClick={() => this.props.onChange({target: {name: this.props.name, value: type}})}
				></i>
			);
		});
	}

	render() {
		return (
			<div className="sc-select-devicetype">
				{this.renderTiles()}
			</div>
		);
	}
}
