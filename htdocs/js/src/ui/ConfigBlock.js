export class ConfigBlock extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			displayed: false
		}
	}

	renderShowHide() {
		let icon = this.state.displayed?"scf-minus-square":"scf-plus-square";
		return (
			<React.Fragment>
				<i className={"scf " + icon} />
				&#160;
				<span>{this.props.title}</span>
			</React.Fragment>
		);
	}

	renderContent() {
		if(!this.state.displayed)
			return;

		return (
			<dd>
				<div className="layout-form">
					<dl>
						{this.props.children}
					</dl>
				</div>
			</dd>
		);
	}

	render() {
		return (
			<React.Fragment>
				<dt className={this.state.displayed?"block expanded":"block"} onClick={ () => this.setState({displayed: !this.state.displayed}) }>
					{this.renderShowHide()}
				</dt>
				{this.renderContent()}
			</React.Fragment>
		);
	}
}
