import {TimeRange} from './TimeRange.js';

export class TimeRanges extends React.Component
{
	constructor(props) {
		super(props);
	}

	normalize_time(t) {
		const parts = /^([0-9]+):([0-9]+)(:([0-9]+))?/.exec(t);
		let nt = parts[1].padStart(2, '0') + ':' + parts[2].padStart(2, '0');
		if(parts.length>=5 && parts[4]!==undefined)
			nt += ':' + parts[4].padStart(2, '0');
		else
			nt += ':00';
		return nt;
	}

	changeTimeRange(idx, value) {
		const name = this.props.name;

		value.from = this.normalize_time(value.from);
		value.to = this.normalize_time(value.to);

		let time_ranges = this.props.value;
		time_ranges[idx] = value;
		this.props.onChange({target: {name: name, value: time_ranges}});
	}

	addTimeRange() {
		const name = this.props.name;

		let time_ranges = this.props.value;
		time_ranges.push({from: "00:00:00", to: "23:59:00"});
		this.props.onChange({target: {name: name, value: time_ranges}});
	}

	removeTimeRange(idx) {
		const name = this.props.name;

		let time_ranges = this.props.value;
		time_ranges.splice(idx, 1);
		this.props.onChange({target: {name: name, value: time_ranges}});
	}

	renderTimeRange(time_range, idx) {
		return (
			<div className="timerange">
				<TimeRange value={time_range} onChange={ev => this.changeTimeRange(idx, ev.target.value)} />
				<i className="scf scf-cross" onClick={ev => this.removeTimeRange(idx)} />
			</div>
		);
	}

	renderTimeRanges() {
		const time_ranges = this.props.value;

		return time_ranges.map((time_range, idx) => {
			return (
				<div key={idx}>
					{this.renderTimeRange(time_range, idx)}
				</div>
			);
		});
	}

	render() {
		return (
			<div>
				{this.renderTimeRanges()}
				<div className="add-timerange" onClick={ev => this.addTimeRange()}>Add time range</div>
			</div>
		);
	}
}
