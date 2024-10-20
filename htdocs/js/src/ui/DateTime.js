export class DateTime extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let d = new Date(this.props.value);

		const day = d.getDate();
		const month = d.toLocaleString('default', { month: 'short' });
		const hours = ('' + d.getHours()).padStart(2, '0');
		const minutes = ('' + d.getMinutes()).padStart(2, '0');
		const seconds = ('' + d.getSeconds()).padStart(2, '0');

		return (
			<span>{day} {month} {hours}:{minutes}:{seconds}</span>
		);
	}
}
