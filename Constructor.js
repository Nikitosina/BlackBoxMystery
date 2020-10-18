class TBlackObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = BB_size;
		this.height = BB_size;

		this.selected = false;
	}
	is_inside(x, y) {
		return ((x >= this.x) && (y >= this.y) && (x <= this.x + this.width) && (y <= this.y + this.height))
	}
}


class TBlackBox extends TBlackObject {
	constructor(x, y, color) {
		super(x, y);
		
		this.lines_in = [];
		this.lines_out = [];

		this.color = color;
	}
	Show() {
		Canvas.fillStyle=this.color;
		Canvas.strokeStyle="#000000";
	  	Canvas.beginPath();
	  	Canvas.rect(this.x, this.y, this.width, this.height);
	  	Canvas.fill();
		Canvas.stroke();  		  	
		
		if (this.selected) {
			Canvas.strokeStyle="#919191"
			Canvas.beginPath();
			Canvas.moveTo(this.x, this.y);
			Canvas.lineTo(this.x + this.width, this.y + this.height);
			Canvas.moveTo(this.x, this.y + this.height);
			Canvas.lineTo(this.x + this.width, this.y);
			Canvas.stroke();

			Canvas.fillStyle='#000000';
			Canvas.globalAlpha = 0.2;
			Canvas.beginPath();
			Canvas.rect(this.x + this.width - 20, this.y + this.height - 20, 20, 20);
			Canvas.fill();
			Canvas.globalAlpha = 1;
		}
	}
	move(){
		var arr_lines = []
		if (this.lines_out.length != 0)
			for (var i = 0; i < this.lines_out.length; i++) 
				if (!this.is_inside(this.lines_out[i].points[0][0], this.lines_out[i].points[0][1])) {
					arr_lines.push(this.lines_out[i])
					var x = this.lines_out[i].end_BB.lines_in.indexOf(this.lines_out[i])
					this.lines_out[i].end_BB.lines_in.splice(x, 1)
					this.lines_out.splice(i, 1)
				}
			
		if (this.lines_in.length != 0)
			for (var i = 0; i < this.lines_in.length; i++) {
				var latest = this.lines_in[i].points.length - 1;
				if (!this.is_inside(this.lines_in[i].points[latest][0], this.lines_in[i].points[latest][1])) {
					arr_lines.push(this.lines_in[i])
					var x = this.lines_in[i].start_BB.lines_out.indexOf(this.lines_in[i])
					this.lines_in[i].start_BB.lines_out.splice(x, 1)
					this.lines_in.splice(i, 1)
				}
			}
		return arr_lines
	}
	is_inside(x, y) {
		return ((x >= this.x) && (y >= this.y) && (x <= this.x + this.width) && (y <= this.y + this.height))
	}
	delete_it() {
		this.x = -100;
		this.y = -100;
		return this.move();
	}
}


class TBlackLine {
	constructor(x, y, points) {
		this.start_point = 0;
		this.end_point = 0;

		this.points = points;
		this.finish_line = false;
		this.x = x;
		this.y = y;
		this.start_BB = null;
		this.end_BB = null;
	}
	Show() {
		if (this.points.length == 0) return;
	  	if (this.selected) Canvas.lineWidth = 3; else Canvas.lineWidth = 1
	  	Canvas.strokeStyle="#000000"
		Canvas.beginPath();
		Canvas.moveTo(this.points[0][0] + this.x, this.points[0][1] + this.y);

		for (var i = 1; i < this.points.length; i++) {
			Canvas.lineTo(this.points[i][0] + this.x, this.points[i][1] + this.y);
		}

		Canvas.stroke();
		Canvas.lineWidth = 1;
	}
	is_inside(x, y) {
		return (PointNearPolyline(this.points, [x, y]))
	}
	delete_it() {
		var ind = this.start_BB.lines_out.indexOf(this);
		this.start_BB.lines_out.splice(ind, 1);
		ind = this.end_BB.lines_in.indexOf(this);
		this.end_BB.lines_in.splice(ind, 1);
		return [this];
	}
}

class TEraser {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	Show() {
		Canvas.drawImage(eraserimg, this.x, this.y, BB_size, BB_size);
	}
}


class TConstructorPanel extends TBlackObject {
	constructor() {
		super(0, 0);
		this.height = 68;
		this.objs = [new TBlackBox(0, 0, '#ff9408'), new TBlackBox(0, 0, '#9bf114'), new TBlackBox(0, 0, '#14f1da'), new TBlackLine(0, 0, [[0, 20], [32, 20], [32, 40], [64, 40]]), new TEraser(CanvasElement.width - BB_size, 0)]
		this.selected_obj = null;
		this.BS = 64;
	}
	Show() {
		this.width = CanvasElement.width;
		Canvas.fillStyle="#909090";
	  	Canvas.beginPath();
	  	Canvas.rect(this.x, this.y, this.width, this.height);
	  	Canvas.fill();

		for (var i = 0; i < this.objs.length; i++) {
			this.objs[i].x = i * (this.BS + 2) + 2;
			this.objs[i].y = 2;
			this.objs[i].Show();
		}

		if (this.selected_obj != null) {
			Canvas.strokeStyle="#fd0000";
	  		Canvas.beginPath();
			Canvas.rect(this.selected_obj * this.BS + 2 * (this.selected_obj + 1) - 1, 1, this.BS + 2, this.BS + 2);
			Canvas.stroke();  	
		}
	}
	on_click(e) {
		if (Math.floor(e.x / (this.BS + 2)) < this.objs.length) {
			this.selected_obj = Math.floor(e.x / (this.BS + 2))
		}
		else this.selected_obj = null;
	}
}


class TFormConstructor {
	constructor(Canvas) {
		this.Canvas = Canvas
		this.Panel = new TConstructorPanel()
		this.objects = []

		this.Fmode = ['normal']
		this.BB_selected = false;
		this.line_in_proccess = false;
	}
	Show() {	
		this.Canvas.fillStyle="#e0e0e0";
	  	this.Canvas.beginPath();
	  	this.Canvas.rect(0, 0, CanvasElement.width, CanvasElement.height);
	  	this.Canvas.fill();

	  	if (this.Panel.selected_obj != null) {
	  		this.BB_selected = false
	  	}

	  	for (var i = 0; i < this.objects.length; i++) if (this.objects[i] instanceof TBlackLine) this.objects[i].Show();
	  	for (var i = 0; i < this.objects.length; i++) if (this.objects[i] instanceof TBlackBox) this.objects[i].Show();

	  	this.Panel.Show()
	}
	on_click(e) {}
	on_mousemove(e) {
		if (this.line_in_proccess) {
			var obj = this.objects[this.objects.length - 1]
			var dx = Math.abs(e.x - obj.points[obj.points.length - 2][0]);
			var dy = Math.abs(e.y - obj.points[obj.points.length - 2][1]);

			if (dx > dy) {
				obj.points[obj.points.length - 1][0] = e.x
				obj.points[obj.points.length - 1][1] = obj.points[obj.points.length - 2][1]
			}
			else {
				obj.points[obj.points.length - 1][0] = obj.points[obj.points.length - 2][0]
				obj.points[obj.points.length - 1][1] = e.y
			}	
		}
		
		if (this.mode[0] == 'BB_resize') {
			this.mode[1].width += e.x - (this.mode[1].x + this.mode[1].width)
			this.mode[1].height += e.y - (this.mode[1].y + this.mode[1].height)
			if (this.mode[1].width < BB_size) this.mode[1].width = BB_size;
			if (this.mode[1].height < BB_size) this.mode[1].height = BB_size;
		}
		if (this.mode[0] == 'BB_move') {
			this.mode[1].x = e.x  - this.mode[2]
			this.mode[1].y = e.y  - this.mode[3]

			var arr = this.mode[1].move()
			for (var i = 0; i < arr.length; i++) {
				var ind = this.objects.indexOf(arr[i])
				this.objects.splice(ind, 1)
			}
		}
	}
	on_mousedown(e) {
		if (this.Panel.is_inside(e.x, e.y)) {
			this.Panel.on_click(e);
			this.mode = ['normal'];
		}
		else {
			switch(this.Panel.selected_obj) {
				case null: 
					var flag = false;
					for (var i = 0; i < this.objects.length; i++) {
						this.objects[i].selected = false;
						if (this.objects[i].is_inside(e.x, e.y) && (this.objects[i] instanceof TBlackBox)) {
							this.mode = ['BB_edit', this.objects[i]]
							this.objects[i].selected = true;
							flag = true
						}
						if (this.objects[i].is_inside(e.x, e.y) && (this.objects[i] instanceof TBlackLine)) {
							this.mode = ['BL_edit', this.objects[i]]
							this.objects[i].selected = true;
							flag = true	
						}
					}
					
					if (!flag) this.mode = ['normal']
				break;

				case 0: this.objects.push(new TBlackBox(e.x - BB_size/2, e.y - BB_size/2, this.Panel.objs[0].color)); break;
				case 1: this.objects.push(new TBlackBox(e.x - BB_size/2, e.y - BB_size/2, this.Panel.objs[1].color)); break;
				case 2: this.objects.push(new TBlackBox(e.x - BB_size/2, e.y - BB_size/2, this.Panel.objs[2].color)); break;
				
				case 3:
					if (!this.line_in_proccess) {
						for (var i = 0; i < this.objects.length; i++)
							if ((this.objects[i].is_inside(e.x, e.y)) && (this.objects[i] instanceof TBlackBox)) {
								this.line_in_proccess = true;
								this.objects.push(new TBlackLine(0, 0, [[e.x, e.y], [e.x, e.y]]));
								this.objects[this.objects.length - 1].start_BB = this.objects[i];
								this.objects[i].lines_out.push(this.objects[this.objects.length - 1]);
						}
					}
					else {
						for (var i = this.objects.length - 1; i >= 0; i--) {
							if ((this.objects[i].is_inside(e.x, e.y)) && (this.objects[i] instanceof TBlackBox)) {
								this.line_in_proccess = false;
								this.objects[this.objects.length - 1].end_BB = this.objects[i];
								this.objects[i].lines_in.push(this.objects[this.objects.length - 1]);		
							}
						}
						if (this.line_in_proccess) this.objects[this.objects.length - 1].points.push([e.x, e.y])
					}
				break;

				case 4: this.mode = ['Eraser']; break;
			}
		}

		if (this.mode[0] == 'BB_edit') {
			if (Application.is_button_tapped(e.x, e.y, this.mode[1].x + this.mode[1].width - 20, this.mode[1].y + this.mode[1].height - 20, 20, 20)) {
				this.mode[0] = 'BB_resize'
			}
			else this.mode = ['BB_move', this.mode[1], e.x - this.mode[1].x, e.y - this.mode[1].y];
		}

		if (this.mode[0] == 'Eraser') {
			for (var i = this.objects.length - 1; i >= 0; i--) {
				if (this.objects[i].is_inside(e.x, e.y)) {
					var arr = this.objects[i].delete_it();
					this.objects.splice(i, 1);
					for (var i = 0; i < arr.length; i++) {
						var ind = this.objects.indexOf(arr[i])
						if (ind != -1) this.objects.splice(ind, 1)
					}
				}
			}
		}
	}
	on_mouseup(e) {
		if (this.mode[0] == 'BB_resize') this.mode[0] = 'BB_edit';
		if (this.mode[0] == 'BB_move') this.mode[0] = 'BB_edit';
	}
	on_touchmove(e) {this.on_mousemove(e)}

	get mode() {return this.Fmode}
	set mode(value) {
		this.Fmode = value;
		if (this.Fmode[0] == 'normal') for (var i = 0; i < this.objects.length; i++) this.objects[i].selected = false
	}
}

var BB_size = 64;
var FormConstructor = new TFormConstructor(Canvas)
Application.set_form(FormConstructor)