import {Events} from './Events.js';

export class Meter extends Events
{
	constructor(cbk)
	{
		super("meter");

		this.cbk = cbk;
		this.connect();
	}
}
