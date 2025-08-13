import {API} from '../websocket/API.js';
import {NormalizeEnergyLog} from './EnergyLog.js';
import {App} from '../app/App.js';

export class EnergyGraphDaily extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
		};

		this.ref = React.createRef();
	}

	componentDidMount() {
		App.loader(true);
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energydetail', {day: this.props.day}).then(energy => {
			energy = NormalizeEnergyLog(energy);

			let type = this.props.type;
			let unit = 'Wh';

			let datasets = [];
			let x = [];

			if(type=='detail')
			{
				let devices = {};
				for(const [date, entries] of Object.entries(energy))
				{
					for(let [device_name, entry] of Object.entries(entries))
					{
						if(device_name=='grid' || device_name=='pv'|| device_name=='battery')
							continue;

						devices[device_name] = true;;
					}
				}

				devices = Object.keys(devices);

				let y_devices = {};
				for(const device_name of devices)
					y_devices[device_name] = [];

				for(const [date, entries] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push(d);

					for(const device_name in y_devices)
						y_devices[device_name].push(entries[device_name]!==undefined?entries[device_name].consumption.energy:0);
				}

				for(const device_name of devices)
				{
					datasets.push({
						type : 'bar',
						data : y_devices[device_name],
						label : device_name,
						stack: 'device',
						yAxisID: 'wh',
					});
				}
			}

			if(type=='global')
			{
				let y_grid = [];
				let y_pv = [];
				for(const [date, devices] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push(d);

					y_grid.push(devices.grid.consumption.energy);
					y_pv.push(devices.pv.consumption.energy);
				}

				datasets = [
					{
						type : 'bar',
						data : y_grid,
						label : "Grid",
						backgroundColor: '#eb4034',
						stack: 'global',
						events: [],
						yAxisID: 'wh',
					},
					{
						type : 'bar',
						data : y_pv,
						label : "PV",
						backgroundColor: '#81de78',
						stack: 'global',
						yAxisID: 'wh',
					},
				];
			}

			let data = {
				data : {
					labels: x,
					datasets : datasets,
				},
				options : {
					title : {
						display : false,
					},
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						wh: {
							type: 'linear',
							position: 'left',
							ticks: {
								callback: function(value, index, ticks) {
									return value + 'Wh';
								}
							}
						}
					},
					plugins: {
						tooltip: {
							callbacks: {
								label: (point) => {
									return point.raw.toFixed(0) + unit;
								},
							}
						}
					}
				},
			};

			App.loader(false);

			new Chart(this.ref.current, data);
		});
	}

	render() {
		return (
			<canvas ref={this.ref}></canvas>
		);
	}
}
