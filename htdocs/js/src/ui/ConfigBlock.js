export class ConfigBlock extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			displayed: false
		}

		this.toggleEnable = this.toggleEnable.bind(this);
		this.toggleDisplayed = this.toggleDisplayed.bind(this);
	}

	toggleEnable() {
		if(this.props.enabled)
		{
			this.props.onDisable();
			this.setState({displayed: false});
		}
		else
		{
			this.props.onEnable();
			this.setState({displayed: true});
		}
	}

	toggleDisplayed() {
		if(this.props.enabled===false)
			return;

		this.setState({displayed: !this.state.displayed});
	}

	renderEnable() {
		if(this.props.enabled===null)
			return; // Config block is mandatory

		return (<span className="toggle" onClick={this.toggleEnable}>{this.props.enabled?"enabled":"disabled"}</span>);
	}

	renderShowHide() {
		let icon = this.state.displayed?"scf-minus-square":"scf-plus-square";
		return (
			<React.Fragment>
				<span onClick={this.toggleDisplayed}>
					<i className={"scf " + icon} />
					&#160;
					<span>{this.props.title}</span>
				</span>
				{this.renderEnable()}
			</React.Fragment>
		);
	}

	renderContent() {
		if(!this.state.displayed || this.props.enabled===false)
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
		let cl = "block";
		cl += (this.props.enabled===null || this.props.enabled)?" enabled":" disabled";
		cl + this.state.displayed?" expanded":"";

		return (
			<React.Fragment>
				<dt className={cl}>
					{this.renderShowHide()}
				</dt>
				{this.renderContent()}
			</React.Fragment>
		);
	}
}
