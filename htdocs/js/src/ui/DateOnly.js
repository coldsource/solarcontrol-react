export class DateOnly extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let d = new Date(this.props.value);

		const day = d.getDate();
		const month = d.toLocaleString('default', { month: 'short' });

		return (
			<span>{day} {month}</span>
		);
	}
}
