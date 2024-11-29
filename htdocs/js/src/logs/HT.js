import {API} from '../websocket/API.js';

export class HT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			ht: {},
		};

		this.ref = React.createRef();
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'ht', {device_id: parseInt(this.props.id)}).then(ht => {
			this.setState({ht: ht});

			let type = this.props.type;
			let unit = (type=='t')?'°C':'%';

			let x = [];
			let x_full = [];
			let y = [];
			let min = [];
			let delta = [];
			let max = [];
			let axis_min = 999;
			let axis_max = 0;
			let n = 0;
			for(const [date, data] of Object.entries(ht))
			{
				let data_min = data[type + 'min'];
				let data_max = data[type + 'max'];

				let d = date.substr(11, 5);
				let v = ((data_min+data_max)/2).toFixed(1);
				x.push((n%4==0)?d:'');
				x_full.push(d);
				y.push(v);
				min.push(data_min);
				max.push(data_max);
				delta.push(data_max - data_min);

				if(data_min<axis_min)
					axis_min = data_min;
				if(data_max>axis_max)
					axis_max = data_max;

				n++;
			}

			let data = {
				data : {
					labels: x,
					datasets : [
						{
							type : 'line',
							data : y,
							label : "Temperature",
							borderColor : "#3cba9f",
							fill : false,
						},
						{
							type : 'bar',
							data : min,
							label : "",
							backgroundColor: 'rgba(255, 255, 255, 0)',
							stack: 'minmax',
							events: [],
						},
						{
							type : 'bar',
							data : delta,
							label : "Interval",
							backgroundColor: '#e38a8a',
							stack: 'minmax',
							barThickness: 2
						},
					]
				},
				options : {
					title : {
						display : false,
					},
					scales: {
						y: {
							min: Math.floor(axis_min - 1),
							max: Math.ceil(axis_max + 1),
						}
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							usePointStyle: true,
							callbacks: {
								title: (point) => { return x_full[point[0].dataIndex]; },
								label: (point) => {
									let t = y[point.dataIndex];
									let t_min = (min[point.dataIndex]).toFixed(1);
									let t_max = (max[point.dataIndex]).toFixed(1);
									let lines = [t + unit];
									if(t_min!=t)
										lines.push('Min: ' + t_min + unit);
									if(t_max!=t)
										lines.push('Max: ' + t_max + unit);
									return lines;
								},
								labelPointStyle: () => { return {pointStyle: false}; }
							}
						}
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
