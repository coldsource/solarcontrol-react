export class Modal extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sc-modal">
				<div className="title">
					{this.props.title}
					<span className="close"><i className="fa fa-close" onClick={this.props.onClose} /></span>
				</div>
				{this.props.children}
			</div>
		);
	}
}
