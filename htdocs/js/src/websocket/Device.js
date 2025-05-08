import {Events} from './Events.js';

export class Device extends Events
{
	constructor()
	{
		super("device");

		this.devices_electrical = [];
		this.devices_ht = [];

		// Special devices
		this.grid = null;
		this.pv = null;
		this.hws = null;

		this.subscriptions = [];

		this.handle_message = this.handle_message.bind(this);

		this.cbk = this.handle_message;
		this.connect();

		Device.instance = this;
	}

	handle_message(devices)
	{
		this.devices_electrical = [];
		this.devices_ht = [];

		for(const device of devices)
		{
			if(['heater', 'cooler', 'cmv', 'timerange', 'passive'].indexOf(device.device_type)>=0)
				this.devices_electrical.push(device);
			else if(device.device_type=='grid')
				this.grid = device;
			else if(device.device_type=='pv')
				this.pv = device;
			else if(device.device_type=='hws')
				this.hws = device;
			else if(['ht', 'htmini', 'wind'].indexOf(device.device_type)>=0)
				this.devices_ht.push(device);
		}

		this.notify();
	}

	notify(cbk = null)
	{
		for(const sub of this.subscriptions)
		{
			let devices;
			if(sub.type=='electrical')
				devices = this.devices_electrical;
			else if(sub.type=='ht')
				devices = this.devices_ht;

			if(sub.id==0)
				sub.cbk(devices);
			else if(sub.id=='grid')
				sub.cbk(this.grid);
			else if(sub.id=='pv')
				sub.cbk(this.pv);
			else if(sub.id=='hws')
				sub.cbk(this.hws);
			else
			{
				for(const device of devices)
				{
					if(device.device_id==sub.id)
					{
						if(cbk===null || (cbk!==null && sub.cbk===cbk))
							sub.cbk(device);
					}
				}
			}
		}
	}

	GetElectrical(id = 0)
	{
		if(id==0)
			return this.devices_electrical;

		if(this.hws.device_id==id)
			return this.hws; // Special HWS device
		else if(this.grid.device_id==id)
			return this.grid; // Special Grid
		else if(this.pv.device_id==id)
			return this.pv; // Special PV device


		for(const device of this.devices_electrical)
		{
			if(device.device_id==id)
				return device;
		}

		return null;
	}

	GetHT(id = 0)
	{
		if(id==0)
			return this.devices_ht;

		for(const device of this.devices_ht)
		{
			if(device.device_id==id)
				return device;
		}

		return null;
	}

	GetHWS()
	{
		return this.hws;
	}

	Subscribe(type, id, cbk)
	{
		this.subscriptions.push({type: type, id: id, cbk: cbk});

		this.notify(cbk);
	}

	Unsubscribe(type, id, cbk)
	{
		for(let idx = 0; idx<this.subscriptions.length; idx++)
		{
			const sub = this.subscriptions[idx];
			if(sub.type==type && sub.id==id && sub.cbk===cbk)
				return this.subscriptions.splice(idx, 1);
		}
	}
}
