export class Loader extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sc-loader">
				<i className="scf scf-spinner" />
			</div>
		);
	}
}
