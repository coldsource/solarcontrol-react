export class SelectDeviceTypeHT extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'ht': 'fa-wifi',
			'htmini': 'fa-bluetooth'
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
