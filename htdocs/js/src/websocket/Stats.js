import {Events} from './Events.js';

export class Stats extends Events
{
	constructor(cbk)
	{
		super("stats");

		this.cbk = cbk;
		this.connect();
	}
}
