export function NormalizeEnergyLog(energy)
{
	const empty_amount = {energy: 0, peak: 0, offpeak: 0};
	for(const [date, devices] of Object.entries(energy))
	{
		// Set default values for grid
		if(devices.grid===undefined)
			devices.grid = {};

		if(devices.grid.consumption===undefined)
			devices.grid.consumption = empty_amount;

		if(devices.grid.excess===undefined)
			devices.grid.excess = empty_amount;

		// Set default values for pv
		if(devices.pv===undefined)
		{
			devices.pv = {};
			devices.pv.production = empty_amount;
		}

		// Set default values for battery
		if(devices.battery===undefined)
		{
			devices.battery = {};
			devices.battery.production = empty_amount;
		}

		// Set default values for hws
		if(devices.hws===undefined)
			devices.hws = {};

		if(devices.hws.consumption===undefined)
			devices.hws.consumption = empty_amount;

		if(devices.hws.offload===undefined)
			devices.hws.offload = empty_amount;

		// Compute PV consumption (net consummed)
		const pv = devices.pv.production;
		const battery = devices.battery.production;
		const excess = devices.grid.excess;
		devices.pv.consumption = {energy: pv.energy + battery.energy - excess.energy, peak: pv.peak + battery.peak - excess.peak, offpeak: pv.offpeak + battery.offpeak - excess.offpeak};

		// Compute HWS grid energy
		const hws_consumption = devices.hws.consumption;
		const hws_offload = devices.hws.offload;
		devices.hws.grid = {energy: hws_consumption.energy - hws_offload.energy, peak: hws_consumption.peak - hws_offload.peak, offpeak: hws_consumption.offpeak - hws_offload.offpeak}

		for(const [device_name, counters] of Object.entries(devices))
		{
			if(device_name=='grid' || device_name=='pv' || device_name=='battery' || device_name=='hws')
				continue; // Skip special devices

			if(counters.offload===undefined)
				counters.offload = empty_amount;
		}
	}

	return energy;
}

export function ReduceEnergyLog(energy, filter = null)
{
	let total = Object.values(energy).reduce((acc, data) => {
		if(filter!==null && !filter(data))
			return acc;

		for(const [device, counters] of Object.entries(data))
		{
			for(const [counter, amount] of Object.entries(counters))
			{
				if(acc[device]===undefined)
					acc[device] = {};

				if(acc[device][counter]===undefined)
					acc[device][counter] = {energy: 0, peak: 0, offpeak: 0};

				acc[device][counter].energy += amount.energy;
				acc[device][counter].peak += amount.peak;
				acc[device][counter].offpeak += amount.offpeak;
			}
		}
		return acc;
	}, {});

	return total;
}
