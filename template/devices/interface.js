if (typeof DataType === "undefined")
{
	var DataType = {
		Signal: 	{ label: "Signal" },
		State: 		{ label: 'State' },
		Percent: 	{ label: 'Percent' },
		Number: 	{ label: 'Number' }
	};	
}

if (typeof Trigger === "undefined")
{
	var Trigger = {
		/* States */
		State: 				{ id: "state",				label: "State", 			source: 'state', 		type: DataType.State, 	map: { "ON": true, "OFF": false} },
		StateOn: 			{ id: "on", 				label: "On", 				source: 'state', 		type: DataType.Signal, 	map: { "ON": true } },
		StateOff: 			{ id: "off", 				label: "Off", 				source: 'state', 		type: DataType.Signal, 	map: { "OFF": false } },

		StateLeft: 			{ id: "left state",			label: "Left state", 		source: 'state_left', 	type: DataType.State, 	map: { "ON": true, "OFF": false} },
		StateLeftOn: 		{ id: "left on", 			label: "Left on", 			source: 'state_left', 	type: DataType.Signal, 	map: { "ON": true } },
		StateLeftOff: 		{ id: "left off", 			label: "Left off", 			source: 'state_left', 	type: DataType.Signal, 	map: { "OFF": false } },

		StateLeft: 			{ id: "right state",		label: "Right state", 		source: 'state_left', 	type: DataType.State, 	map: { "ON": true, "OFF": false} },
		StateLeftOn: 		{ id: "right on", 			label: "Right on", 			source: 'state_left', 	type: DataType.Signal, 	map: { "ON": true } },
		StateLeftOff: 		{ id: "right off",			label: "Right off", 		source: 'state_left', 	type: DataType.Signal, 	map: { "OFF": false } },


		/* Clicks */
		Click: 				{ id: "click", 				label: "Click", 			source: 'click', 		type: DataType.Signal,	map: { "single": true } },
		DoubleClick: 		{ id: "double click", 		label: "Double click", 		source: 'click', 		type: DataType.Signal, 	map: { "double": true } },

		LeftClick: 			{ id: "left click", 		label: "Left click", 		source: 'click_left', 	type: DataType.Signal,	map: { "single": true } },
		LeftDoubleClick: 	{ id: "left double click", 	label: "Left double click", source: 'click_left', 	type: DataType.Signal, 	map: { "double": true } },

		RightClick: 		{ id: "right click", 		label: "Right click", 		source: 'click_right', 	type: DataType.Signal, 	map: { "single": true } },
		RightDoubleClick: 	{ id: "right double click", label: "Right double click",source: 'click_right', 	type: DataType.Signal, 	map: { "double": true } },
	}
}

if(typeof Action === "undefined")
{
	var Action = {
		ToggleState: { label: "Toggle state", id: "stateToggle", type: "signal" },
		TurnStateOn: { label: "Turn on", id: "stateOn", type: "signal" },
		TurnStateOff: { label: "Turn off", id: "stateOff", type: "signal" },
		SetState: { label: "Set state", id: "stateSet", type: "state" },

		ToggleTimer: { label: "Toggle timer", id: "timerToggle", type: "signal" },
		TurnTimerOn: { label: "Turn timer on", id: "timerOn", type: "signal" },
		TurnTimerOff: { label: "Turn timer off", id: "timerOff", type: "signal" },
		SetTimer: { label: "Set timer", id: "timerSet", type: "state" },

		ToggleLeft: { label: "Toggle left", id: "leftToggle", type: "signal" },
		TurnOnLeft: { label: "Turn on left", id: "leftOn", type: "signal" },
		TurnOffLeft: { label: "Turn off left", id: "leftOff", type: "signal" },
		SetLeft: { label: "Set left", id: "leftSet", type: "state" },

		ToggleRight: { label: "Toggle right", id: "rightToggle", type: "signal" },
		TurnOnRight: { label: "Turn on right", id: "rightOn", type: "signal" },
		TurnOffRight: { label: "Turn off right", id: "rightOff", type: "signal" },
		SetRight: { label: "Set right", id: "rightSet", type: "state" },
	};
}

if(typeof deviceDescriptors === "undefined")
{
	var deviceDescriptors = {};
	deviceDescriptors['motion sensor'] = { Name: "Motion sensor", Type: "common", Actions: {},
			Triggers: {
				"state": 	Object.assign({}, Trigger.State, 	{ source: 'occupancy', map: null }),
				"on": 		Object.assign({}, Trigger.StateOn, 	{ source: 'occupancy', map: { true: true } }),
				"off": 		Object.assign({}, Trigger.StateOff, { source: 'occupancy', map: { false: false } }),
			}
	};

	deviceDescriptors['door sensor'] = { Name: "Door-window sensor", Type: "common", Actions: {},
			Triggers: {
				"state": 	Object.assign({}, Trigger.State, 	{ source: 'contact', map: null }),
				"on": 		Object.assign({}, Trigger.StateOn, 	{ source: 'contact', map: { true: true } }),
				"off": 		Object.assign({}, Trigger.StateOff, { source: 'contact', map: { false: false } }),
			}
	};

	deviceDescriptors['button - single'] = { Name: "Button", Type: "common", Actions: {},
			Triggers: { "click": 	Trigger.Click, "double click": Trigger.DoubleClick }
	};

	deviceDescriptors['button - double'] = { Name: "Button (double)", Type: "common", Actions: {},
			Triggers: {
				"left click": Trigger.LeftClick,
				"left double click": Trigger.LeftDoubleClick,

				"right click": Trigger.RightClick,
				"right double click": Trigger.RightDoubleClick,		
			}
	};

	deviceDescriptors['switch - single'] = { Name: "Wall switch (single)", Type: "state", 
			Triggers: Object.assign({}, deviceDescriptors["button - single"].Triggers, {
				"state": 		Trigger.State,
				"on": 			Trigger.StateOn,
				"off": 			Trigger.StateOff,
			}),
			Actions: {
				"on": { label: "On" },
				"off": { label: "Off" },
				"toggle": { label: "Toggle" },
				"set": { label: "Set" },
			}
	};

	deviceDescriptors['switch - double'] = { Name: "Wall switch (double)", Type: "double state", 
			Triggers: Object.assign({}, deviceDescriptors["button - double"].Triggers, {
				"left state": Trigger.StateLeft,
				"left on": Trigger.StateLeftOn,
				"left off": Trigger.StateLeftOff,
				"right state": Trigger.StateRight,
				"right on": Trigger.StateRightOn,
				"right off": Trigger.StateRightOff,	
			}),
			Actions: {
				"leftOn": { label: "Left on" },
				"leftOff": { label: "Left off" },
				"leftToggle": { label: "Left toggle" },
				"leftSet": { label: "Left set" },

				"rightOn": { label: "Right on" },
				"rightOff": { label: "Right off" },
				"rightToggle": { label: "Right toggle" },
				"rightSet": { label: "Right set" },
			}
	};

	deviceDescriptors['virtual'] = { Name: "Virtual device", Type: "virtual",
			Triggers: {
				"state": 		Trigger.State,
				"on": 			Trigger.StateOn,
				"off": 			Trigger.StateOff,
			},
			Actions: deviceDescriptors["switch - single"].Actions
	};

}
