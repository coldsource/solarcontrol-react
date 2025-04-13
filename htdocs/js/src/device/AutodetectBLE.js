import {API} from '../websocket/API.js';

export class AutodetectBLE extends React.Component
{
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		API.instance.command('shelly', 'autodetectble', {}).then(res => {
			this.props.onSelect(res);
		});
	}

	render() {
		return (
			<div className="sc-autodetect">
			</div>
		);
	}
}
