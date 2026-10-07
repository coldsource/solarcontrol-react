export class Time extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		const val = this.props.value;
		const days = Math.floor(val / 86400);
		const hours = Math.floor((val % 86400) / 3600);
		const minutes = (Math.floor((val % 3600) / 60));
		const secs = Math.floor(val % 60);

		if(days > 0)
			return (<span>{`${days}d ${hours}h`}</span>);
		else if(hours > 0)
			return (<span>{`${hours}h ${minutes}m`}</span>);
		else
			return (<span>{`${minutes}m`}</span>);
	}
}
