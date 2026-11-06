export class Modal extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let cl = 'inner';
		if(this.props.small!==undefined && this.props.small)
			cl += ' small';

		return (
			<div className="sc-modal">
				<div className={cl}>
					<div className="title">
						{this.props.title}
						<span className="close"><i className="scf scf-cross" onClick={this.props.onClose} /></span>
					</div>
					<div className="content">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
