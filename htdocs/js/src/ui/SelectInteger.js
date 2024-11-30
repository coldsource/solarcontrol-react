export class SelectInteger extends React.Component
{
	constructor(props) {
		super(props);
	}

	renderTiles() {
		let tiles = [];
		let sum = this.props.sum!==undefined?parseInt(this.props.sum):0;
		for(let i=this.props.min; i<=this.props.max; i++)
		{
			let cl = (i + sum == parseInt(this.props.value))?'selected':'';
			tiles.push((
				<li key={i} className={cl} onClick={ ev => this.props.onChange({target: {name: this.props.name, value: i+sum}}) }>{i}</li>
			));
		}

		return tiles;
	}

	render() {
		return (
			<ul className="sc-select-integer">
				{this.renderTiles()}
			</ul>
		);
	}
}
