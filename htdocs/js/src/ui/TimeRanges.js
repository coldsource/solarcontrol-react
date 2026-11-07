import {TimeRange} from './TimeRange.js';

export class TimeRanges extends React.Component
{
	constructor(props) {
		super(props);
	}

	changeTimeRange(idx, value) {
		const name = this.props.name;

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

	renderTimeRanges() {
		const time_ranges = this.props.value;

		return time_ranges.map((time_range, idx) => {
			return (
				<React.Fragment key={idx}>
					<TimeRange value={time_range} onChange={ev => this.changeTimeRange(idx, ev.target.value)} onRemove={ ev => this.removeTimeRange(idx) } options={this.props.options} />
					<div className="spacer"></div>
				</React.Fragment>
			);
		});
	}

	render() {
		return (
			<div className="sc-timeranges">
				{this.renderTimeRanges()}
				<div className="add-timerange" onClick={ev => this.addTimeRange()}>Add time range</div>
			</div>
		);
	}
}
