export class Tooltip extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			displayed: false
		};
	}

	renderTooltip() {
		if(!this.state.displayed)
			return;

		return (
			<div className="sc-tooltip">
				<div className="content">
					{this.props.content}
				</div>
			</div>
		);
	}

	render() {
		return (
			<span onClick={() => this.setState({displayed: !this.state.displayed})}>
				{this.renderTooltip()}
				{this.props.children}
			</span>
		);
	}
}
