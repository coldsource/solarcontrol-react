export class SelectIcon extends React.Component
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

	renderTiles() {
		return this.props.values.map(el => {
			return (
				<i
					key={el.value}
					className={"scf " + el.icon + ((this.props.value==el.value)?' selected':'')}
					onClick={() => this.props.onChange({target: {name: this.props.name, value: el.value}})}
				><span>{el.name}</span></i>
			);
		});
	}

	render() {
		return (
			<ul className="sc-select-icon">
				{this.renderTiles()}
			</ul>
		);
	}
}
