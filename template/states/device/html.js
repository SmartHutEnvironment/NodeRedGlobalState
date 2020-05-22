function updateCapabilities(o, type)
{
	switch(type)
	{
		case 'Button - single':
			o.triggers = [ {label: "Click", id: "click", type: "signal"} ] {"Click": "click", "Double click": "doubleClick"};
			o.actions = [];
			break;
		case 'Button - double':
			o.triggers = {"Left click": "leftClick", "Left double click": "leftDoubleClick"};
			o.events = ['click', 'doubleClick'];
			o.actions = [];
			break;
		case 'Switch - single':
			o.triggers = {"Click": "click", "Double click": "doubleClick"};
			o.events = ['click', 'doubleClick'];
			o.actions = [ 
				{ type: 'switch', id: 'single', label: 'Switch', actions: ['on', 'off', 'toggle']}  
			];
			break;
		case 'Switch - double':
			o.triggers = {"Left click": "leftClick", "Left double click": "leftDoubleClick"};
			o.events = ['click', 'doubleClick'];
			o.actions = [ 
				{ type: 'switch', id: 'left', label: 'Left switch', actions: ['on', 'off', 'toggle']},
				{ type: 'switch', id: 'right', label: 'Right switch', actions: ['on', 'off', 'toggle']}  
			];
			break;
		case 'Motion sensor':
			o.triggers = {};
			o.events = ['motion'];
			o.actions = [];
			break;
	}
}

/*
	Motion: 1,			state		
	Motion_on
	Motion_off
	Click: 2,
	DoubleClick: 3,
	LongClick: 4,
	LeftClick: 5, 
	LeftDoubleClick: 6,
	LeftLongClick: 7,
	RightClick: 8,
	RightDoubleClick: 9,
	RightLongClick: 10,
	State: 11,
	LeftState: 12,
	RightState: 13

TriggerConverter
    - 

SignalConverter:
  - Toggle     - > [signal / state / number]
  


	
[ Device ]                             [ Device ]
   |                                        |
[ trigger: motion_on ]  ----[converter]--->  [ Action: light_on ]
[ trigger: motion_off ] ---> [ sleep ] ---> [ Action: light_off ]


[ Smart light ] 



trigger:
 - bool
 - true (signal)


action:
 - signal  -> bool

 { compatible_sources: ['signal', 'bool']}

*/