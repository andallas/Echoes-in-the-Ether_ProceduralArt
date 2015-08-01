seed = Math.round(Math.random() * 9007199254740991);

if (getQueryParams(document.location.search).scene !== undefined) {
	seed = getQueryParams(document.location.search).scene;
}

document.getElementById('permalink').href = '/Echoes-in-the-Ether_ProceduralArt/?scene=' + seed;

noise.seed(seed % 10000);

var scene = {};
var context;
var canvas;
var width;
var height;

var imageData;
var pixels

var cameraX;
var cameraY;
var moved = true;

run();

function setupCanvas() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.fillStyle = 'black';

	width = canvas.width;
	height = canvas.height;

	cameraX = width / 2;
	cameraY = height / 2;

	context.fillRect(0, 0, width, height);
}

function setupImageData() {
	imageData = context.getImageData(0,0, width, height);
	pixels = imageData.data;
}

function setPixel(x, y, color, alpha) {
	setPixelRGB(x, y, color.r, color.g, color.b, alpha);
}

function setPixelRGB(x, y, r, g, b, alpha) {
	if (x >= width || y >= height || x < 0 || y < 0)
		return;
	x = Math.floor(x);
	y = Math.floor(y);
	if (alpha === undefined)
		alpha = 1;
	if (alpha <= 0)
		return;
	if (alpha > 1)
		alpha = 1;

	
	if (alpha == 1) {
		pixels[(y * width + x) * 4 + 0] = r;
		pixels[(y * width + x) * 4 + 1] = g;
		pixels[(y * width + x) * 4 + 2] = b;
	} else {
		pixels[(y * width + x) * 4 + 0] = Math.floor((1 - alpha) * pixels[(y * width + x) * 4 + 0] + alpha * r);
		pixels[(y * width + x) * 4 + 1] = Math.floor((1 - alpha) * pixels[(y * width + x) * 4 + 1] + alpha * g);
		pixels[(y * width + x) * 4 + 2] = Math.floor((1 - alpha) * pixels[(y * width + x) * 4 + 2] + alpha * b);
	}
}

function drawOnCanvas()
{
	var compositor = document.createElement('canvas');
	var compContext = compositor.getContext('2d');
	compositor.width = width;
	compositor.height = height;
	compContext.putImageData(imageData, 0, 0);

	context.drawImage(compositor, 0, 0);
}

function drawStars() {
	context.save();
	context.globalCompositeOperation = "screen";
	
	for (var i = 0; i < scene.starCount; i++) {
		var x = getRGB(scene.starHue, 0.2, 0.8);
		setPixel(getInt(width, 10000 + i), getInt(height, 10000 + i + scene.starCount), getRGB(scene.starHue, 0.2, 0.8));
	}
	scene.brightstars = Math.max(0, getInt(20, getPivot('brightstars')) - 8);
	scene.starsize = 5 + getInt(15, getPivot('starsize'));

	drawOnCanvas();
	context.restore();

	for (var i = 0; i < scene.brightstars; i++) {
		drawBrightStar(getInt(width, 20000 + i), getInt(height, 30000 + i), scene.starsize);
	}
}

function drawBrightStar(x, y, size) {
	context.save();

	context.fillStyle = "rgba(255,255,255,0.03)";	
	context.beginPath();
	context.arc(x,y,size,0,2*Math.PI);
	context.fill();
	
	context.fillStyle = "rgba(255,255,255,0.1)";	
	context.beginPath();	
	context.arc(x,y,size * 0.4,0,2*Math.PI);
	context.fill();
	
	context.fillStyle = "rgba(255,255,255,1.0)";
	setupImageData();
		
	setPixelRGB(x,y, 255,255,255,1);
	setPixelRGB(x-1,y+1, 255,255,255,0.8);
	setPixelRGB(x+1,y+1, 255,255,255,0.8);
	setPixelRGB(x+1,y-1, 255,255,255,0.8);
	setPixelRGB(x-1,y-1, 255,255,255,0.8);
	
	p = 0;
	for (var i = -1; i <= 1; i += 0.05) {
		new_p = Math.floor(size * 0.6 * i);
		if (new_p == p)
			continue;
		p = new_p;
		setPixelRGB(x, y + p, 255,255,255,1.001 - Math.abs(i));
		setPixelRGB(x + p, y, 255,255,255,1.001 - Math.abs(i));
	}

	drawOnCanvas();
	context.restore();
}

function drawNebula()
{
	context.save();

	var radius = 250;
	var centerX = (width / 2);
	var centerY = (height / 2);

	var offset1 = 213;
	var offset2 = -321;
	var scale1 = 775;
	var scale2 = 365;

	for (var x = cameraX - centerX, bufferX = 0; x < cameraX + centerX; x++, bufferX++) {
		for (var y = cameraY - centerY, bufferY = 0; y < cameraY + centerY; y++, bufferY++) {

			var distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));

			var cloud1 = noise.fbm((x + offset1) / scale1, ((y + offset1) / scale1));
			cloud1 = Math.abs(cloud1);

			var cloud2 = noise.fbm((x + offset2) / scale2, ((y + offset2) / scale2));
			var cloudCombo = Math.abs(cloud1 - cloud2);
			
			cloudCombo -= distance / 800;
			if (cloudCombo === undefined || cloudCombo > 1)
			{
				cloudCombo = 1;
			}
			if (cloudCombo == 0)
			{
				cloudCombo = 0;
			}

			if (cloudCombo > 0.0625)
			{
				var nebula1 = noise.perlin2(x / 55, (y / 55));
				var nebula2 = noise.perlin2(x / 162, (y / 162));

				var nebulaCombo = Math.abs(nebula1 - nebula2);

				var alpha = ((-(nebulaCombo * 7)) + 1.0);
				if (alpha === undefined || alpha > 1)
				{
					alpha = 1;
				}
				if (alpha == 0)
				{
					alpha = 0;
				}

				var distanceAlpha = alpha * ((radius - (cloudCombo * radius)) / radius);

				var r = 196 + (64 * Math.abs(distanceAlpha - 1.0));
				var g = 64 + (196 * distanceAlpha);
				var b = 0;

				var finalAlpha = cloudCombo * (distanceAlpha);
				setPixelRGB(bufferX, bufferY, r, g, b, finalAlpha);
			}
		}
	}

	context.globalCompositeOperation = 'screen';
	drawOnCanvas();
	context.globalCompositeOperation = 'source-over';
	context.restore();
}

function drawGasCloud()
{
	context.save();

	var centerX = (width / 2);
	var centerY = (height / 2);

	var offset1 = 213;
	var offset2 = -321;
	var scale1 = 775;
	var scale2 = 365;

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));

			var perlin1 = noise.fbm((x + offset1) / scale1, ((y + offset1) / scale1));
			perlin1 = Math.abs(perlin1);

			var perlin2 = noise.fbm((x + offset2) / scale2, ((y + offset2) / scale2));
			var combo = Math.abs(perlin1 - perlin2);
			
			combo -= distance / 800;

			var alpha = combo;
			if (alpha === undefined || alpha > 1)
			{
				alpha = 1;
			}
			if (alpha == 0)
			{
				alpha = 0;
			}

			var rRange = Math.abs(noise.fbm((x + offset1) / 450, ((y + offset1) / 450)));
			var gRange = Math.abs(noise.fbm((x + offset1) / 600, ((y + offset1) / 600)));
			var bRange = Math.abs(noise.fbm((x + offset1) / 750, ((y + offset1) / 750)));

			var r = 64 + (196 * Math.abs(rRange));
			var g = 128 + (128 * Math.abs(gRange));
			var b = 64 + (196 * Math.abs(bRange));

			setPixelRGB(x, y, r, g, b, alpha);
		}
	}

	drawOnCanvas();
	context.restore();
}

function draw() {
	
	if (moved)
	{
		scene.starHue = getFloat(getPivot('starHue'));
		scene.starCount = 100 + getInt(getPivot('starCount'),300);
		
		drawStars();
		drawGasCloud();
		drawNebula();
	}
	moved = false;

	requestAnimationFrame(draw);
}

function update() {
	//console.log("X: " + cameraX + " Y: " + cameraY);
}

function run() {
	setupCanvas();
	setupImageData();

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	setInterval(function() {
		update();
	}, 16.6667);

	draw();
}

function keyDownHandler(event)
{
	var keyPressed = String.fromCharCode(event.keyCode);

	if (keyPressed == "W")
	{
		cameraY += 1;
	}
	else if (keyPressed == "S")
	{
		cameraY -= 1;
	}

	if (keyPressed == "A")
	{
		cameraX -= 1;
	}
	else if (keyPressed == "D")
	{
		cameraX += 1;
	}

	moved = true;
}

function keyUpHandler(event)
{
	//var keyReleased = String.fromCharCode(event.keyCode);
}