import * as _ from 'lodash';

class Tickbar {

	constructor(options){
		this.width = options.width;
		this.height = options.height;
		this.paddingLeft = 5;
		this.sample = 2;
		this._majorTickInterval = options.majorTickInterval;
		this._minorTickInterval = options.minorTickInterval;
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width * this.sample;
		this.canvas.height = this.height * this.sample;
		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;
		this.ctx = this.canvas.getContext('2d');
		this.transform = {pan: {x:0,y:0}, zoom: 1};
	}

	get minorTickInterval() {
		return this._minorTickInterval * this.transform.zoom;
	}

	get majorTickInterval(){
		return this._majorTickInterval * this.transform.zoom;
	}

	get dataWidth() {
		return this.width / this.transform.zoom;
	}

	get dataHeight() {
		return this.height;
	}

	get screenWidth() {
		return this.width;
	}

	get screenHeight() {
		return this.height;
	}

	get canvasWidth() {
		return this.screenWidth * this.sample;
	}

	get canvasHeight() {
		return this.screenHeight * this.sample;
	}

	render(){
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.drawTicks();

		return this.canvas;
	}

	get originX() {
		return this.transform.pan.x * this.transform.zoom;
	}

	get endX() {
		return this.startX + this.canvasWidthl
	}

	drawTicks() {
		this.drawMinorTicks();
		this.drawMajorTicks();
	}

	drawMinorTicks(){
		for(let i = 0; i < this.canvasWidth / this.minorTickInterval; i++){
			const minorTick = Math.round(i - this.originX / (this.minorTickInterval * this.sample));
			this.drawMinorTick(minorTick);
		}
	}

	drawMajorTicks(){
		for(let i = 0; i < this.canvasWidth / this.majorTickInterval; i++){
			const majorTick = Math.round(i - this.originX  / (this.majorTickInterval * this.sample));
			this.drawMajorTick(majorTick);
		}
	}

	drawMajorTick(index) {
		const x = index * (this.majorTickInterval * 2) + this.paddingLeft + this.originX;

		// clear duplicate minor tick
		this.ctx.fillStyle = '#FFF';
		this.ctx.fillRect(x-2,0,4,this.height);

		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.height);
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.fillStyle = "black";
		this.ctx.textAlign = "center";
		this.ctx.font = '16px sans serif';
		this.ctx.fillText(index, x, this.height + 20);
	}

	drawMinorTick(index) {
		const x = index * (this.minorTickInterval * 2) + this.paddingLeft + this.originX;;
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.height / 1.5)
		this.ctx.stroke();
		this.ctx.closePath();
	}

	getMajorTickCount() {
		return this.dataWidth / this.majorTickInterval;
	}

	getMinorTickCount(){
		return this.dataWidth / this.minorTickInterval;
	}

	setTransform(transform) {
		this.transform = _.cloneDeep(transform);
		this.render();
	}
}

const tickbar = new Tickbar({
	width: 600,
	height: 50,
	orientation: 'horizontal',
	majorTickInterval: 50,
	minorTickInterval: 10
});
document.body.appendChild(tickbar.render());
document.body.style.height = '1000px';
document.body.style.overflow = 'hidden';
let dragging = false;
let start = {x:0,y:0};

let transform = {
	pan: {x: 0, y :0},
	zoom: 1
};

document.body.addEventListener('mousedown', (event) => {
	dragging = true;
	start = {x: event.pageX, y: event.pageY};
});

document.body.addEventListener('mouseup', (event) => {
	dragging = false;
	transform = _.cloneDeep(tickbar.transform);
});


document.body.addEventListener('mousemove', (event) => {
	if(dragging) {
		const deltaX = event.pageX - start.x;
		const deltaY = event.pageY - start.y;
		const newTransform = _.cloneDeep(transform);
		newTransform.pan.x += deltaX * tickbar.sample / transform.zoom;
		newTransform.pan.y += deltaY;
		tickbar.setTransform(newTransform);
	}
});

function zoomIn(){
	const newTransform = _.cloneDeep(tickbar.transform);
	newTransform.zoom *= 1.1;
	tickbar.setTransform(newTransform);
	transform = newTransform;
	tickbar.render();
}

function zoomOut(){
	const newTransform = _.cloneDeep(tickbar.transform);
	newTransform.zoom *= 0.9;
	tickbar.setTransform(newTransform);
	transform = newTransform;
	tickbar.render();
}

// document.body.addEventListener('wheel', (event) => {
//   if(event.deltaY < 0) {
//     zoomIn();
//   } else {
//     zoomOut();
//   }
// });