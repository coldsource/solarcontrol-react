import {API} from '../websocket/API.js';
import {App} from '../app/App.js';
import {NormalizeEnergyLog} from './EnergyLog.js';

export class EnergyGraphMonthly extends React.Component
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

	async reload() {
		let temperatures_config = await API.instance.command('storage', 'get', {name: 'temperatures'});
		let temperatures = null;
		if(temperatures_config && temperatures_config.outdoor)
			temperatures = await API.instance.command('logs', 'ht', {device_id: temperatures_config.outdoor, mbefore: this.props.mbefore});

		API.instance.command('logs', 'energy', {mbefore: this.props.mbefore}).then(energy => {
			energy = NormalizeEnergyLog(energy);

			let units = {0: 'kWh', 1: 'kWh', 2: '%', 3: '°C'};

			let datasets = [];
			let x = [];
			let y_grid = [];
			let y_pv = [];
			let y_percent = [];
			let y_temperature = [];
			for(const [date, devices] of Object.entries(energy))
			{
				x.push(date);
				let grid = devices.grid.consumption.energy / 1000;
				let pv = devices.pv.consumption.energy / 1000;
				let percent = pv / (grid + pv) * 100;

				y_grid.push(grid);
				y_pv.push(pv);
				y_percent.push(percent);

				if(temperatures!==null && temperatures[date]!==undefined)
					y_temperature.push((temperatures[date].tmin + temperatures[date].tmax) / 2);
				else
					y_temperature.push(0);
			}

			datasets = [
				{
					type : 'bar',
					data : y_grid,
					label : "Grid",
					backgroundColor: '#eb4034',
					stack: 'global',
					yAxisID: 'kwh',
					order: 1,
				},
				{
					type : 'bar',
					data : y_pv,
					label : "PV",
					backgroundColor: '#81de78',
					stack: 'global',
					yAxisID: 'kwh',
					order: 2,
				},
				{
					type : 'line',
					data : y_percent,
					label : "Ratio PV",
					backgroundColor: '#505050',
					yAxisID: 'percent',
					showLine: false,
					order: 0,
				},
			];

			if(temperatures!==null)
			{
				datasets.push({
					type : 'line',
					data : y_temperature,
					label : "Temperature",
					backgroundColor: '#3a85f0',
					borderColor: '#3a85f0',
					yAxisID: 'temperature',
					order: 0,
					lineTension: 0.5,
					pointRadius: 0
				});
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
					interaction: {
						mode: 'index'
					},
					scales: {
						kwh: {
							type: 'linear',
							position: 'left',
							min: 0,
							ticks: {
								callback: function(value, index, ticks) {
									return value + 'kWh';
								}
							}
						},
						percent: {
							type: 'linear',
							position: 'right',
							min: 0,
							max: 100,
							display: false,
							grid: {
								display:false
							},
							 ticks: {
								callback: function(value, index, ticks) {
									return value + '%';
								}
							}
						},
						temperature: {
							type: 'linear',
							position: 'right',
							grid: {
								display:false
							},
							 ticks: {
								callback: function(value, index, ticks) {
									return value + '°C';
								}
							}
						}
					},
					plugins: {
						tooltip: {
							callbacks: {
								label: (point) => {
									return point.raw.toFixed(0) + units[point.datasetIndex];
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
