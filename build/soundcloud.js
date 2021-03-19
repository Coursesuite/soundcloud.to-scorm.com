/*
 *	SoundCloud Scorm Wrapper
 *	Causes a scorm completion after playback passes a given percentage
 *	(c) 2014 tim st.clair (tim.stclair@gmail.com)
 *	Licence: MIT
 */

(function(){
	var widgetIframe = document.getElementById('sc-widget'),
		widget       = SC.Widget(widgetIframe),
		_duration = 0,
		_relaunch = false,
		_complete = false,
		_seconds = 0,
		sReturn = scormGetValue("cmi.core.entry"),
		sPlayed = scormGetValue("cmi.core.lesson_location"),
		_relaunch = (sReturn != "ab-initio");

	widget.bind(SC.Widget.Events.READY, function() {

		widget.bind(SC.Widget.Events.PLAY, function() {
			
			widget.getDuration(function (v) {
				_duration = (v / 1000);
			});

			scormSetValue("cmi.core.exit", "suspend");
			scormSetValue("cmi.core.lesson_status", "incomplete");
			scormCommit();
	    	_timeSessionStart = new Date();
	    	
	
		    if (_relaunch) {
			    var iSeconds = +sPlayed || 0;
			    widget.seekTo(iSeconds * 1000);
			    _relaunch = false;
		    }

		});

		widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(event) {
			_seconds = event.currentPosition / 1000;
			scormSetValue("cmi.core.lesson_location", _seconds+"");
			if (Math.round(_seconds / _duration) * 100 >= _required) {
				if (!_complete) {
					scormSetValue("cmi.core.exit", "");
					scormSetValue("cmi.core.score.min", "0");
					scormSetValue("cmi.core.score.max", "100");
					scormSetValue("cmi.core.score.raw", _required);
					scormSetValue("cmi.core.lesson_status", "completed");
					scormCommit();
					_complete = true;
					// console.log("completed");
				}
			}
		});

		widget.bind(SC.Widget.Events.PAUSE, function() {
			scormSetValue("cmi.core.lesson_location", _seconds+"");
		});

		widget.bind(SC.Widget.Events.FINISH, function() {
			scormSetValue("cmi.core.lesson_location", _seconds+"");
			scormCommit();
		});
		
		widget.play();

	});

}());
