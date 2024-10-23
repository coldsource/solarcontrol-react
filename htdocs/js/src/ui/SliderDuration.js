export class SliderDuration extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			duration: 0,
			container_width_px: 0,
			cursor_width_px: 0
		}

		this.dragging = false;

		if(props.long===undefined || !props.long)
		{
			this.intervals = [
				{span: 0.25, steps: 6, step: 10},
				{span: 0.25, steps: 9, step: 60},
				{span: 0.25, steps: 10, step: 300},
				{span: 0.25, steps: 23, step: 3600},
			];
		}
		else if(props.type!==undefined && props.type=='days')
		{
			this.intervals = [
				{span: 1, steps: 6, step: 86400},
			];
		}
		else
		{
			this.intervals = [
				{span: 0.25, steps: 10, step: 60},
				{span: 0.25, steps: 5, step: 600},
				{span: 0.25, steps: 23, step: 3600},
				{span: 0.25, steps: 6, step: 86400},
			];
		}

		this.ref_container = React.createRef();
		this.ref_cursor = React.createRef();

		this.startDragging = this.startDragging.bind(this);
		this.stopDragging = this.stopDragging.bind(this);
		this.drag = this.drag.bind(this);
	}

	componentDidMount() {

		this.ref_cursor.current.addEventListener('mousedown', this.startDragging, {passive: false});
		this.ref_cursor.current.addEventListener('touchstart', this.startDragging, {passive: false});

		document.addEventListener('mouseup', this.stopDragging, {passive: false});
		document.addEventListener('touchend', this.stopDragging, {passive: false});

		this.setState({container_width_px: this.ref_container.current.getBoundingClientRect().width, cursor_width_px: this.ref_cursor.current.getBoundingClientRect().width});
	}

	componentWillUnmount() {
		if(this.dragging)
		{
			document.removeEventListener('touchmove', this.drag);
			document.removeEventListener('mousemove', this.drag);
		}

		this.ref_cursor.current.removeEventListener('mousedown', this.startDragging);
		this.ref_cursor.current.removeEventListener('touchstart', this.startDragging);
		document.removeEventListener('mouseup', this.stopDragging);
		document.removeEventListener('touchend', this.stopDragging);
	}

	startDragging(ev) {
		ev.preventDefault();

		this.dragging = true;

		document.addEventListener('touchmove', this.drag);
		document.addEventListener('mousemove', this.drag);
	}

	stopDragging() {
		this.dragging = false;

		document.removeEventListener('touchmove', this.drag);
		document.removeEventListener('mousemove', this.drag);
	}

	drag(ev) {
		let X = ev.touches!==undefined?ev.touches[0].clientX:ev.clientX;
		let new_pos = (X - this.ref_container.current.getBoundingClientRect().left) / this.state.container_width_px;
		if(new_pos < 0)
			new_pos = 0;
		if(new_pos > 1)
			new_pos = 1;

		let new_duration = this.getDuration(new_pos);
		if(new_duration==this.props.value)
			return;

		this.props.onChange({target: {name: this.props.name, value: new_duration}});
	}

	getDurationInterval(position, pos_start, pos_end, start, steps, step) {
		let interval_range = pos_end - pos_start;
		return start + Math.round((position - pos_start) / interval_range * steps) * step;
	}

	getDuration(position) {
		let pos_start = 0;
		let val_start = 0;
		for(const interval of this.intervals)
		{
			let pos_end = pos_start + interval.span;
			if(position>=pos_start && position<pos_end)
				return this.getDurationInterval(position, pos_start, pos_end, val_start, interval.steps, interval.step);

			pos_start += interval.span;
			val_start += interval.step * interval.steps;
		}

		return val_start;
	}

	getPosition(duration) {
		let pos_start = 0;
		let val_start = 0;
		for(const interval of this.intervals)
		{
			let interval_size = interval.steps * interval.step;
			let val_end = val_start + interval_size;
			if(duration>=val_start && duration<val_end)
				return (pos_start + (duration - val_start) / interval_size * interval.span );

			pos_start += interval.span;
			val_start += interval_size;
		}

		return 1;
	}

	renderDuration(d) {
		let days = Math.floor(d/86400);
		let hours = Math.floor((d - days * 86400)/3600);
		let minutes = Math.floor((d - days * 86400 - hours * 3600) / 60);
		let seconds = d - days * 86400 - hours * 3600 - minutes * 60;

		if(d==0)
		{
			if(this.props.type!==undefined && this.props.type=="days")
				return "Today";

			return '0 seconds';
		}

		let ret = '';
		if(days>0)
		{
			ret += days;
			if(days==1)
				ret += ' day ';
			else
				ret += ' days ';
		}
		if(hours>0)
		{
			ret += hours;
			if(hours==1)
				ret += ' hour ';
			else
				ret += ' hours ';
		}
		if(minutes>0)
		{
			ret += minutes;
			if(minutes==1)
				ret += ' minute ';
			else
				ret += ' minutes ';
		}
		if(seconds>0)
		{
			ret += seconds;
			if(seconds==1)
				ret += ' second';
			else
				ret += ' seconds';
		}

		return ret.trim();
	}

	render() {
		let margin = 0;
		if(this.state.container_width_px!=0)
			margin = (this.state.container_width_px - this.state.cursor_width_px) * this.getPosition(this.props.value);

		return (
			<div ref={this.ref_container} className="sc-slider-duration">
				<div className="slider">
					<div className="track"></div>
					<i ref={this.ref_cursor} className="fa fa-circle-dot" style={{marginLeft: margin}} />
				</div>
				<div className="label">{this.renderDuration(this.props.value)}</div>
			</div>
		);
	}
}
