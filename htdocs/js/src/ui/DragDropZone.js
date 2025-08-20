export class DragDropZone extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			selected: false
		};

		this.drag_idx = -1;
	}

	toggleSelected(idx) {
		if(this.state.selected===idx)
			this.setState({selected: false});
		else
			this.setState({selected: idx});
	}

	drop(idx) {
		const selected = this.state.selected;
		if(selected===false)
			return;

		if(idx==selected || idx==selected+1)
			return this.setState({selected: false});

		this.props.onChange({from: selected, to: idx});
		this.setState({selected: false});
	}

	renderDropZone(idx) {
		const selected = this.state.selected;
		if(selected===false)
			return;

		if(idx==selected || idx==selected + 1)
			return;

		return (
			<div className="dropzone" onClick={() => this.drop(idx)}>
				<span className="drophandle"></span>
			</div>
		);
	}

	renderItem(content, idx) {
		return (
			<div className={"item" + (this.state.selected===idx?" selected":"")} onClick={ () => this.toggleSelected(idx) }>
				{content}
			</div>
		);
	}

	renderItems() {
		let itemsdrop = [];
		itemsdrop.push(this.renderDropZone(0));
		for(let i = 0; i<this.props.items.length; i++)
		{
			itemsdrop.push(this.renderItem(this.props.items[i], i));
			itemsdrop.push(this.renderDropZone(i + 1));
		}

		return itemsdrop.map((item, idx) => {
			return (
				<React.Fragment key={idx}>
					{item}
				</React.Fragment>
			);
		});
	}

	render() {
		return (
			<div className="sc-drag-drop-zone">
				{this.renderItems()}
			</div>
		);
	}
}
