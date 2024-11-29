import {API} from '../websocket/API.js';

export class EnergyGraph extends React.Component
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
		API.instance.command('logs', 'energydetail').then(energy => {
			this.setState({energy: energy});

			let type = this.props.type;
			let unit = 'Wh';

			let datasets = [];
			let x = [];
			let x_full = [];

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

				let n = 0;
				for(const [date, entries] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push((n%4==0)?d:'');
					x_full.push(d);

					for(const device_id in y_devices)
					{
						let v = 0;
						if(device_id==0 && entries[0].hws!==undefined)
							v = entries[0].hws;
						if(device_id>0 && entries[device_id]!==undefined)
							v = entries[device_id].device;

						y_devices[device_id].push(v);
					}

					n++;
				}

				for(const [device_id, device_name] of Object.entries(devices))
				{
					datasets.push({
						type : 'bar',
						data : y_devices[device_id],
						label : device_name,
						stack: 'device',
					});
				}
			}

			if(type=='global')
			{
				let y_grid = [];
				let y_pv = [];
				let n = 0;
				for(const [date, entries] of Object.entries(energy))
				{
					let d = date.substr(11, 5);
					x.push((n%4==0)?d:'');
					x_full.push(d);

					let global = entries[0];
					let grid = global.grid;
					let pv = global.pv - global['grid-excess'];

					y_grid.push(grid);
					y_pv.push(pv);

					n++;
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
			}

			let data = {
				data : {
					labels: x,
					datasets : datasets,
				},
				options : {
					title : {
						display : false,
					}
				}
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
