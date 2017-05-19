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
		this.dataStart = 0;
		this.dataWidth = this.width;
	}

	get minorTickInterval() {
		return this._minorTickInterval * (this.screenWidth / this.dataWidth);
	}

	get majorTickInterval(){
		return this._majorTickInterval * (this.screenWidth / this.dataWidth);
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
		return this.dataStart;
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
		this.ctx.fillText(index * this._majorTickInterval, x, this.height + 20);
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
}

const tickbar = new Tickbar({
	width: 600,
	height: 50,
	orientation: 'horizontal',
	majorTickInterval: 100,
	minorTickInterval: 20
});
document.body.appendChild(tickbar.render());
document.body.style.height = '1000px';
document.body.style.overflow = 'hidden';

window.onDataChanged = (type, event) => {
	const newValue = parseInt(event.target.value, 10);
	if(type === 'start'){
		tickbar.dataStart = newValue;
	} else {
		tickbar.dataWidth = newValue;
	}
	if(tickbar.dataWidth > 8000) {
		tickbar._minorTickInterval = 160;
		tickbar._majorTickInterval = 800;
	} else if(tickbar.dataWidth > 4000){
		tickbar._minorTickInterval = 80;
		tickbar._majorTickInterval = 400;
	} else if(tickbar.dataWidth > 2000) {
		tickbar._minorTickInterval = 40;
		tickbar._majorTickInterval = 200;
	} else {
		tickbar._minorTickInterval = 20;
		tickbar._majorTickInterval = 100;
	}
	tickbar.render();
};
