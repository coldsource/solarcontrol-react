import {Events} from './Events.js';

export class Device extends Events
{
	constructor()
	{
		super("device");

		this.devices_onoff = [];
		this.devices_passive = [];
		this.devices_ht = [];
		this.hws = null;

		this.subscriptions = [];

		this.handle_message = this.handle_message.bind(this);

		this.cbk = this.handle_message;
		this.connect();

		Device.instance = this;
	}

	handle_message(devices)
	{
		this.devices_onoff = [];
		this.devices_passive = [];
		this.devices_ht = [];

		for(const device of devices)
		{
			if(['heater', 'cmv', 'timerange'].indexOf(device.device_type)>=0)
				this.devices_onoff.push(device);
			else if(device.device_type=='hws')
				this.hws = device;
			if(['passive'].indexOf(device.device_type)>=0)
				this.devices_passive.push(device);
			else if(['ht', 'htmini'].indexOf(device.device_type)>=0)
				this.devices_ht.push(device);
		}

		this.notify();
	}

	notify(cbk = null)
	{
		for(const sub of this.subscriptions)
		{
			let devices;
			if(sub.type=='onoff')
				devices = this.devices_onoff;
			else if(sub.type=='passive')
				devices = this.devices_passive;
			else if(sub.type=='ht')
				devices = this.devices_ht;

			if(sub.id==0)
				sub.cbk(devices);
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

	GetOnOff(id = 0)
	{
		if(id==0)
			return this.devices_onoff;

		if(this.hws.device_id==id)
			return this.hws; // Special HWS device is also OnOff device

		for(const device of this.devices_onoff)
		{
			if(device.device_id==id)
				return device;
		}

		return null;
	}

	GetPassive(id = 0)
	{
		if(id==0)
			return this.devices_passive;

		for(const device of this.devices_passive)
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
		for(let idx = 0; idx<this.subscriptions.length; i++)
		{
			const sub = this.subscriptions[idx];
			if(sub.type==type && sub.id==id && sub.cbk===cbk)
				return this.subscriptions.splice(idx, 1);
		}
	}
}
