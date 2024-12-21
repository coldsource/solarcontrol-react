export class Subscreen extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {
		return (
			<div className="sc-subscreen">
				<div className="title-bar" onClick={() => this.props.onClose()}>
					{this.props.title}
					<i className="scf scf-cross" />
				</div>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}
