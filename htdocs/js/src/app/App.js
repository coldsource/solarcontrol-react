import {API} from '../websocket/API.js';
import {DevicesOnOff} from '../device/DevicesOnOff.js';
import {DevicesHT} from '../device/DevicesHT.js';
import {Global} from '../meter/Global.js';

class APP extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			screen: 'meter'
		};

		this.api = new API();
		this.api.connect();
	}

	renderScreen() {
		if(this.state.screen=='meter')
			return (<Global />);
		else if(this.state.screen=='devicesonoff')
			return (<DevicesOnOff />);
		else if(this.state.screen=='devicesht')
			return (<DevicesHT />);
	}

	render() {
		return (
			<div className="sc-app">
				<div className="menu">
					<i className="fa fa-regular fa-gauge-simple-min" onClick={() => this.setState({screen: 'meter'})} />
					<i className="fa fa-plug" onClick={() => this.setState({screen: 'devicesonoff'})} />
					<i className="fa fa-temperature-half" onClick={() => this.setState({screen: 'devicesht'})} />
				</div>
				<div>
					{this.renderScreen()}
				</div>
			</div>
		);
	}
}

let el = document.getElementById('main');
const root = ReactDOM.createRoot(el);
root.render(React.createElement(APP, {}));
