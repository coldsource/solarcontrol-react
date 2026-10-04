export class Time extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let val = this.props.value;
		const hours = Math.floor(val / 3600);
		const minutes = (Math.floor((val % 3600) / 60)).toString().padStart(2, '0');
		const secs = Math.floor(val % 60).toString().padStart(2, '0');

		return (<span>{`${hours}:${minutes}:${secs}`}</span>);

		return (<React.Fragment>{parseFloat(this.props.value).toFixed(0)}%</React.Fragment>);
	}
}
