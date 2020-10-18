class TApplication {
	constructor() {
		this.curForm = null;
	}
	set_form(form) {
		//this.Show = form.Show;
		//this.keydown = form.keydown;
		this.curForm = form;
	}
	Show() {
		if ((CanvasElement.width != window.innerWidth) || (CanvasElement.height != window.innerHeight)) {
			CanvasElement.width = window.innerWidth;
			CanvasElement.height = window.innerHeight;
			Canvas.imageSmoothingEnabled = false;
		}
		window.scale = CanvasElement.width / CanvasElement.height;
		if (this.curForm != null) this.curForm.Show();
	}
	on_action(name, e) {
		if (this.curForm != null) if (name in this.curForm) this.curForm[name](e);
	}
	on_key_down(e) {
		this.on_action('on_key_down', e);
	}
	on_click(e) {
		this.on_action('on_click', e);
	}
	on_mousemove(e) {
		this.on_action('on_mousemove', e);
	}
	on_mousedown(e) {
		this.on_action('on_mousedown', e)
	}
	on_mouseup(e) {
		this.on_action('on_mouseup', e)
	}
	on_touch_end(e) {
		alert('a');
	}
	is_button_tapped(touchX, touchY, buttonX, buttonY, button_width, button_height){
		if ((touchX > buttonX) && (touchY > buttonY) && (touchX < buttonX + button_width) && (touchY < buttonY + button_height)) {
			return true
		}
		else return false		
	}
}

window.Application = new TApplication;

window.CanvasElement = document.getElementById("canvas");
window.Canvas = CanvasElement.getContext('2d');

window.isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i);},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
}

window.addEventListener("keydown", function(e) {Application.on_key_down(e);}, false);
window.addEventListener("click", function(e) {Application.on_click(e);}, false);
window.addEventListener("mousemove", function(e) {Application.on_mousemove(e);}, false);
window.addEventListener("mousedown", function(e) {Application.on_mousedown(e);}, false);
window.addEventListener("mouseup", function(e) {Application.on_mouseup(e);}, false);
window.addEventListener("touchstart", function(e) {
	e.x = e.pageX;
	e.y = e.pageY;
	Application.on_mousedown(e);
}, false);
window.addEventListener("touchmove", function(e) {
	e.x = e.pageX;
	e.y = e.pageY;
	Application.on_mousemove(e);
}, false);
CanvasElement.addEventListener("touchstart", function(e) {e.preventDefault()}, false);

var timer = setInterval(function() {
	Application.Show();
}, 50);