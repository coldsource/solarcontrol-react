import {Events} from './Events.js';

class ConfigValues
{
	constructor(config)
	{
		this.config = config;
	}

	GetAll()
	{
		return this.config;
	}

	Get(entry)
	{
		if(this.config[entry]===undefined)
			throw 'Invalid configuration entry ' + entry;

		return this.config[entry];
	}

	GetEnergy(entry)
	{
		let value = this.Get(entry);
		if(value.substr(-3)=='kwh' || value.substr(-3)=='kWh')
			value = value.substr(0, value.length-3) * 1000;
		else if(value.substr(-2)=='wh' || value.substr(-2)=='Wh')
			value = value.substr(0, value.length-2);
		return value;
	}

	GetBool(entry)
	{
		let value = this.Get(entry);
		return (value=='yes' || value=='true' || value==1);
	}
}

export class Config extends Events
{
	constructor()
	{
		super("config");

		this.subscriptions = [];
		this.config = {};
		this.config_master = {};

		this.handle_message = this.handle_message.bind(this);
		this.cbk = this.handle_message;

		this.connect();

		Config.instance = this;
	}

	handle_message(res)
	{
		for(const [module, config] of Object.entries(res.current))
			this.config[module] = new ConfigValues(config);
		for(const [module, config] of Object.entries(res.master))
			this.config_master[module] = new ConfigValues(config);

		this.notify();
	}

	notify(cbk = null)
	{
		if(Object.keys(this.config).length==0)
			return; // Config not yet loaded

		for(const sub of this.subscriptions)
		{
			if(cbk===null || (cbk!==null && sub.cbk===cbk))
				sub.cbk(this.config, this.config_master);
		}
	}

	Subscribe(cbk)
	{
		this.subscriptions.push({cbk: cbk});
		this.notify(cbk);
	}

	Unsubscribe(cbk)
	{
		for(let idx = 0; idx<this.subscriptions.length; idx++)
		{
			const sub = this.subscriptions[idx];
			if(sub.cbk===cbk)
				return this.subscriptions.splice(idx, 1);
		}
	}
}
