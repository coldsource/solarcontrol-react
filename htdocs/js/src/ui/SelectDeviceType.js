export class SelectDeviceType extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'timerange': 'fa-plug',
			'heater': 'fa-temperature-arrow-up',
			'cmv': 'fa-fan fa-regular'
		};
	}

	renderTiles() {
		return Object.keys(this.types).map(type => {
			let icon = this.types[type];
			return (
				<i
					key={type}
					className={"fa " + icon + ((this.props.value==type)?' selected':'')}
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
