export class SOC extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		return (<React.Fragment>{parseFloat(this.props.value).toFixed(0)}%</React.Fragment>);
	}
}
