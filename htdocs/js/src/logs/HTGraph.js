import {API} from '../websocket/API.js';
import {App} from '../app/App.js';

export class HTGraph extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			ht: {},
		};

		this.ref = React.createRef();
	}

	componentDidMount() {
		App.loader(true);

		this.reload();
	}

	reload() {
		API.instance.command('logs', 'ht', {device_id: parseInt(this.props.id), day: this.props.day}).then(ht => {
			this.setState({ht: ht});

			let type = this.props.type;
			let unit = (type=='t')?'°C':'%';

			let points = [];
			let x = [];
			let y = [];
			let spacer = [];
			let delta_neg = [];
			let delta_pos = [];
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
				y.push(v);

				if(data_min>=0)
				{
					delta_neg.push(null);
					delta_pos.push(data_max - data_min);
					spacer.push(data_min);
				}
				else if(data_min<0 && data_max>=0)
				{
					delta_neg.push(data_min);
					delta_pos.push(data_max);
					spacer.push(null);
				}
				else if(data_max<0)
				{
					delta_neg.push(data_min - data_max);
					delta_pos.push(null);
					spacer.push(data_max);
				}

				if(data_min<axis_min)
					axis_min = data_min;
				if(data_max>axis_max)
					axis_max = data_max;

				points.push({date: d, min: data_min, max: data_max});

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
							data : spacer,
							label : "",
							backgroundColor: 'rgba(255, 255, 255, 0)',
							stack: 'minmax',
							events: [],
						},
						{
							type : 'bar',
							data : delta_neg,
							label : "Interval",
							backgroundColor: '#e38a8a',
							stack: 'minmax',
							barThickness: 2
						},
						{
							type : 'bar',
							data : delta_pos,
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
					responsive: true,
					maintainAspectRatio: false,
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
								title: (point) => { return points[point[0].dataIndex].date; },
								label: (point) => {
									let t = y[point.dataIndex];
									let t_min = (points[point.dataIndex]).min.toFixed(1);
									let t_max = (points[point.dataIndex]).max.toFixed(1);
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
