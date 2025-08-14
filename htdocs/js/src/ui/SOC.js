export class SOC extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.value<=100)
			return (<React.Fragment>{parseFloat(this.props.value).toFixed(0)}%</React.Fragment>);
		return (<i className="scf scf-bolt" />);
	}
}
