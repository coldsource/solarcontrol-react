import {API} from '../websocket/API.js';

export class EnergyGraphMonthly extends React.Component
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
		API.instance.command('logs', 'energy').then(energy => {
			this.setState({energy: energy});

			let unit = 'kWh';

			let datasets = [];
			let x = [];
			let y_grid = [];
			let y_pv = [];
			for(const [date, entry] of Object.entries(energy))
			{
				x.push(date);

				y_grid.push((entry.grid_consumption)/1000);
				y_pv.push((entry.pv_production - entry.grid_excess)/1000);
			}

			datasets = [
				{
					type : 'bar',
					data : y_grid,
					label : "Grid",
					backgroundColor: '#eb4034',
					stack: 'global',
					events: [],
				},
				{
					type : 'bar',
					data : y_pv,
					label : "PV",
					backgroundColor: '#81de78',
					stack: 'global',
				},
			];

			let data = {
				data : {
					labels: x,
					datasets : datasets,
				},
				options : {
					title : {
						display : false,
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
