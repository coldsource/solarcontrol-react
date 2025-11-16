export class SelectSlowFast extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className='sc-select-slowfast'>
				<i className={"scf scf-turtle" + (this.props.value=='slow'?' selected':'')} onClick={() => this.props.onChange({target: {name: this.props.name, value: 'slow'}}) } />
				<i className={"scf scf-hare" + (this.props.value=='fast'?' selected':'')} onClick={() => this.props.onChange({target: {name: this.props.name, value: 'fast'}}) } />
			</span>
		);
	}
}
