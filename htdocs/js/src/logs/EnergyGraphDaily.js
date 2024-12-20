import {API} from '../websocket/API.js';

export class EnergyGraphDaily extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			energy: {},
		};

		this.ref = React.createRef();
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energydetail', {day: this.props.day}).then(energy => {
			this.setState({energy: energy});

			let type = this.props.type;
			let unit = 'Wh';

			let datasets = [];
			let x = [];

			if(type=='detail')
			{
				let devices = {};
				for(const [date, entries] of Object.entries(energy))
				{
					for(const [device_id, entry] of Object.entries(entries))
						devices[device_id] = device_id==0?'HWS':entry.name;
				}

				let y_devices = {};
				for(const device_id in devices)
					y_devices[device_id] = [];

				for(const [date, entries] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push(d);

					for(const device_id in y_devices)
					{
						let v = 0;
						if(device_id==0 && entries[0]!==undefined && entries[0].hws!==undefined)
							v = entries[0].hws;
						if(device_id>0 && entries[device_id]!==undefined)
							v = entries[device_id].device;

						y_devices[device_id].push(v);
					}
				}

				for(const [device_id, device_name] of Object.entries(devices))
				{
					datasets.push({
						type : 'bar',
						data : y_devices[device_id],
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
				for(const [date, entries] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push(d);

					let global = entries[0];
					let grid = 0;
					let pv = 0;
					if(global!==undefined)
					{
						grid = global.grid;
						pv = global.pv - global['grid-excess'];
					}

					y_grid.push(grid);
					y_pv.push(pv);
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

			new Chart(this.ref.current, data);
		});
	}

	render() {
		return (
			<canvas ref={this.ref}></canvas>
		);
	}
}
