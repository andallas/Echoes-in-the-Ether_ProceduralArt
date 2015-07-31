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

draw();

function getHue(pivot) {
	return (getBool(pivot + 1) ? scene.skyhue : scene.terrainhue) + 0.1 * (getInt(3, pivot) - 1);
}

function setupCanvas() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.fillStyle = 'black';

	width = canvas.width;
	height = canvas.height;

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

/*function drawStarships(x, y) {
	var dx = getInt(3, getPivot('starshipdir')) - 1;
	var dy = dx == 0 ? 1 : 0;
	var dx2 = dy;
	var dy2 = 1 - dy;
	var size = getInt(8, getPivot('starshipsize')) + 5;
	if (size % 2 == 0) size++;
	var count = Math.floor(Math.pow(getFloat(getPivot('starshipcount')), 3) * 4) + 1;
	var spread = getFloat(getPivot('starshipspread')) * 2;
	
	for (var i = 0; i < count; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < j; k++) {
				setPixelRGB(x + dx2 * i * size * 1.5 + dx * i * spread * size + j * dx + (k - j / 2) * dx2,
				            y + dy2 * i * size * 1.5 + dy * i * spread * size + j * dy + (k - j / 2) * dy2, 255, 255, 255, 1);
				setPixelRGB(x - dx2 * i * size * 1.5 + dx * i * spread * size + j * dx + (k - j / 2) * dx2,
				            y - dy2 * i * size * 1.5 + dy * i * spread * size + j * dy + (k - j / 2) * dy2, 255, 255, 255, 1);
			}
		}
	}
	
	var exhausthue = scene.skyhue + 0.5;
	if (exhausthue > 1)
		exhausthue -= 1;
	var exhaustlength = (3 + getInt(9, getPivot('exhaustlength'))) * size;
	
	for (var i = 0; i < count; i++) {
		for (var j = 0; j < exhaustlength; j++) {
			setPixel(x + dx2 * i * size * 1.5 + dx * i * spread * size + dx * (size + j) + dx2 * (size / 2 - 2),
						y + dy2 * i * size * 1.5 + dy * i * spread * size + dy * (size + j) + dy2 * (size / 2 - 2), getRGB(exhausthue, 1, 1), Math.pow(1.0 - (j / exhaustlength), 2.0));
			setPixel(x - dx2 * i * size * 1.5 + dx * i * spread * size + dx * (size + j) + dx2 * (size / 2 - 2),
						y - dy2 * i * size * 1.5 + dy * i * spread * size + dy * (size + j) + dy2 * (size / 2 - 2), getRGB(exhausthue, 1, 1), Math.pow(1.0 - (j / exhaustlength), 2.0));
			setPixel(x + dx2 * i * size * 1.5 + dx * i * spread * size + dx * (size + j) + dx2 * (-size / 2 + 2),
						y + dy2 * i * size * 1.5 + dy * i * spread * size + dy * (size + j) + dy2 * (-size / 2 + 2), getRGB(exhausthue, 1, 1), Math.pow(1.0 - (j / exhaustlength), 2.0));
			setPixel(x - dx2 * i * size * 1.5 + dx * i * spread * size + dx * (size + j) + dx2 * (-size / 2 + 2),
						y - dy2 * i * size * 1.5 + dy * i * spread * size + dy * (size + j) + dy2 * (-size / 2 + 2), getRGB(exhausthue, 1, 1), Math.pow(1.0 - (j / exhaustlength), 2.0));
		}
	}	
}*/

function drawStars() {
	context.save();
	context.globalCompositeOperation = "screen";
	
	for (var i = 0; i < scene.starcount; i++) {
		var x = getRGB(scene.skyhue, 0.2, 0.8);
		setPixel(getInt(width, 10000 + i), getInt(height, 10000 + i + scene.starcount), getRGB(scene.skyhue, 0.2, 0.8));
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

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {

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
				setPixelRGB(x, y, r, g, b, finalAlpha);
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

function drawScene() {
	scene.skyhue = getFloat(getPivot('skyhue'));
	scene.skyhue2 = getFloat(getPivot('skyhue')) * 0.16;
	scene.noiseseed = getFloat(getPivot('noiseSeed')) * 100;
	scene.starcount = 100 + getInt(getPivot('starcount'),300);
	
	drawStars();
	drawGasCloud();
	drawNebula();
}

function draw() {
	setupCanvas();
	setupImageData();

	drawScene();
}