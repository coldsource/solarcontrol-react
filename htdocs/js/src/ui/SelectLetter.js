export class SelectLetter extends React.Component
{
	constructor(props) {
		super(props);
	}

	renderTiles() {
		let tiles = [];
		let sum = this.props.sum!==undefined?parseInt(this.props.sum):0;
		for(let i=this.props.from.charCodeAt(); i<=this.props.to.charCodeAt(); i++)
		{
			let letter = String.fromCharCode(i);
			let cl = (letter == this.props.value)?'selected':'';
			tiles.push((
				<li key={letter} className={cl} onClick={ ev => this.props.onChange({target: {name: this.props.name, value: letter}}) }>{letter}</li>
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
