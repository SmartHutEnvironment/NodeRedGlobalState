if (typeof DataType === "undefined")
{
	var DataType = {
		Signal: { label: "signal" },
		State: { label: 'state' },
		Percent: { label: 'percent' },
		Number: { label: 'number' }
	};	
}

if (typeof Trigger === "undefined")
{
	var Trigger = {
		Click: { label: "Click", id: "click", type: "signal" },
		DoubleClick: { label: "Double click", id: "doubleClick", type: "signal" },
		LeftClick: { label: "Left click", id: "leftClick", type: "signal" },
		LeftDoubleClick: { label: "Left double click", id: "leftDoubleClick", type: "signal" },
		RightClick: { label: "Right click", id: "rightClick", type: "signal" },
		RightDoubleClick: { label: "Right double click", id: "rightDoubleClick", type: "signal" },

		State: { label: "State", id: "state", type: "state" },
		StateOn: { label: "On", id: "on", type: "signal" },
		StateOff: { label: "Off", id: "off", type: "signal" },

		LeftState: { label: "Left state", id: "leftState", type: "state" },
		LeftStateOn: { label: "Left state on", id: "leftOn", type: "signal" },
		LeftStateOff: { label: "Left state off", id: "leftOff", type: "signal" },

		RightState: { label: "Right state", id: "rightState", type: "state" },
		RightStateOn: { label: "Right state on", id: "rightOn", type: "signal" },
		RightStateOff: { label: "Right state off", id: "rightOff", type: "signal" },
	};
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
	console.log("create device descriptors");
	var deviceDescriptors = {
		'motion sensor': {
			Name: "Motion sensor",
			Type: "common",
			Triggers: {
				"state": { label: "State", source: 'occupancy', map: null },
				"on": { label: "On", source: 'occupancy', map: { true: true } },
				"off": { label: "Off", source: 'occupancy', map: { false: false } },
			},
			Actions: {},
		},
		'door sensor': {
			Name: "Door-window sensor",
			Type: "common",
			Triggers: {
				"state": { label: "State", source: 'contact', map: null },
				"on": { label: "On", source: 'contact', map: { true: true } },
				"off": { label: "Off", source: 'contact', map: { false: false } },
			},
			Actions: {},
		},
		'button - single': {
			Name: "Button",
			Type: "common",
			Triggers: {
				"click": { label: "Click", source: 'click', map: { "single": true } },
				"double click": { label: "Double click", source: 'click', map: { "double": true } },
			},
			Actions: {},
		},
		'button - double': {
			Name: "Button (double)",
			Type: "common",
			Triggers: {
				"left click": { label: "Left click", source: 'click_left', map: { "single": true } },
				"left double click": { label: "Left double click", source: 'click_left', map: { "double": true } },

				"right click": { label: "Right click", source: 'click_right', map: { "single": true } },
				"right double click": { label: "Right double click", source: 'click_right', map: { "double": true } },		
			},
			Actions: {},
		},
		'switch - single': {
			Name: "Wall switch (single)",
			Type: "state",
			Triggers: {
				"click": { label: "Click", source: 'click', map: { "single": true } },
				"double click": { label: "Double click", source: 'click', map: { "double": true } },
			},
			Actions: {
				"on": { label: "On" },
				"off": { label: "Off" },
				"toggle": { label: "Toggle" },
				"set": { label: "Set" },
			}
		},
		'switch - double': {
			Name: "Wall switch (double)",
			Type: "double state",
			Triggers: {
				"left click": { label: "Left click", source: 'click_left', map: { "single": true } },
				"left double click": { label: "Left double click", source: 'click_left', map: { "double": true } },

				"right click": { label: "Right click", source: 'click_right', map: { "single": true } },
				"right double click": { label: "Right double click", source: 'click_right', map: { "double": true } },		
			},
			Actions: {
				"leftOn": { label: "Left on" },
				"leftOff": { label: "Left off" },
				"leftToggle": { label: "Left toggle" },
				"leftSet": { label: "Left set" },

				"rightOn": { label: "Right on" },
				"rightOff": { label: "Right off" },
				"rightToggle": { label: "Right toggle" },
				"rightSet": { label: "Right set" },
			},
		},
	};
}