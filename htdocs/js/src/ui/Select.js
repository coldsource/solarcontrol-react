export class Select extends React.Component
{
	constructor(props) {
		super(props);
	}

	renderTiles() {
		return this.props.values.map(value => {
			let cl = (value.value == this.props.value)?'selected':'';
			return (
				<li key={value.value} className={cl} onClick={ ev => this.props.onChange({target: {name: this.props.name, value: value.value}}) }>{value.name}</li>
			);
		});
	}

	render() {
		return (
			<ul className="sc-select-integer">
				{this.renderTiles()}
			</ul>
		);
	}
}
