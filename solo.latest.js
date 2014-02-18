/*
  SOLO web app utils MIT License
  github.com/al128/SOLO | therook.co.uk | belowthestorm.co.uk  
*/

/* Update request frame */
if (!window.requestAnimationFrame) { window.requestAnimationFrame = (function() { return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) { window.setTimeout( callback, 1000 / 60 ); }; })(); } window.safeTimer = function(callback) { window.setTimeout( function(){ callback();}, 1000 / 60 ); };

/* Get elements */
String.prototype.get = function() {
  return document.querySelectorAll(this);
}

/* Create image from string path */
String.prototype.createImage = function(callback) {
  var img = document.createElement("img");
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = this;
  if (callback) img.onload = function() { callback(this); };
  return img;
};

/* Create sound from string path */
String.prototype.createSound = function(callback) {
  var audio = new Audio(this);
  if (callback) audio.addEventListener('canplaythrough', callback, false);
  return audio;
};

/* Go to url, default is new tab/window */
String.prototype.goTo = function(tab) {
  if (tab === false) {
	window.location = this;
  } else {
	window.open(this, '_blank');
  }
};

/* Will fire event if specified key is pressed */
String.prototype.monitor = function() {
  var that = this;
  document.addEventListener("keydown", function(e) {
	("io.keydown." + that).fireEvent();
  });
  document.addEventListener("keyup", function(e) {
	("io.keyup." + that).fireEvent();
  });
};

/* Fire event */
String.prototype.fireEvent = function(e) {  
  if (window.CustomEvent) {
    var event = new CustomEvent(this, {detail: arguments});
  } else {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(this, true, true, {detail: arguments});
  }  
  "body".get()[0].dispatchEvent(event);  
};

/* Register event */
String.prototype.registerEvent = function(callback) {  
  var a = arguments;
  "body".get()[0].addEventListener(this, function(e, a) {
	callback(e, a);
  });  
};

/* Retrive a value from page url */
String.prototype.queryString = function() {
  var key = this.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
  var match = window.location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

/* Windows or mac */
String.prototype.isPlatform = function() {
  switch (this.toLowerCase()) {
	case 'touch':
	  return 'ontouchstart' in window || 'onmsgesturechange' in window;
	case 'windows':
	  if (navigator.platform.indexOf("win") > -1) return true; return false;
	case 'osx':
	case 'mac':
	  if (navigator.platform.indexOf("mac") > -1) return true; return false;
  }
};

/* Browser detection */
String.prototype.isBrowser = function() {
  switch (this.toLowerCase()) {
	case 'opera':
	  return !!window.opera || navigator.userAgent.indexOf('Opera') >= 0;
	case 'ie':
	  return /*@cc_on!@*/false;
	case 'ie9':
	  return navigator.appName === 'Microsoft Internet Explorer';
	case 'firefox':
	  return typeof InstallTrigger !== 'undefined';
	case 'safari':
	  return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	case 'chrome':
	  return !!window.chrome;
  }
};

/* Log by key */
String.prototype.lastmessage = "";
String.prototype.log = function(e) {
  if (this === String.prototype.lastmessage) return;
  console.log(new Date());
  console.log("Log: " + this);
  if (e) {
	if (typeof(e) == "string") console.warn(e);
	if (typeof(e.message) == "string") console.warn(e.message);
	if (typeof(e.stack) !== "undefined") console.error(e.stack);
  }
  String.prototype.lastmessage = this;
};

/* Random number */
Math._random = function(max, min) { if (!min) min = 1; return Math.floor(Math.random()*(max-min+1)+min); };

/* Calculate an angle between two points */
Math.calcAngle = function(endx, endy) {
  var destx = endx; var desty = -endy;
  var deltaX = destx - 370; var deltaY = desty - (150 * -1);
  var angle = deltaY / deltaX;
  return desty - (angle * destx);
};

/* Distance between two points */
Math.lineDistance = function(x1, y1, x2, y2) {
  var xs = x2 - x1; xs = xs * xs;
  var ys = y2 - y1; ys = ys * ys;
  return Math.sqrt(xs + ys);
};

/* Has box collision occured */
Math.collides = function(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

/* Return x,y points on a three point curve */
Math.getCurvePoints = function(x1, y1, x2, y2, x3, y3, dir) {
  var a = ((y2-y1)*(x1-x3) + (y3-y1)*(x2-x1))/((x1-x3)*(x2*x2-x1*x1) + (x2-x1)*(x3*x3-x1*x1));
  var b = ((y2 - y1) - a*(x2*x2 - x1*x1)) / (x2-x1);
  var c = y1 - a*x1*x1 - b*x1;
  var points = [];
  if (x3 > x1) {
	for (var i = x1; i <= Math.abs(x3); i++) {
	  points.push({"x":i, "y": (a * (i * i) + (b * i) + c)});
	}
  } else {
	for (var i = x1; i >= x3; i--) {
	  points.push({"x":i, "y": (a * (i * i) + (b * i) + c)});
	}
  }
  return points;
};

/* Cleanup an array of objects with .destroy active */
Object.prototype.cleanupArray = function() {
  var deleting = [];
  for (var i = 0; i < this.length; i++) {
	if (this[i].destroy === true)
	  deleting.push(i - deleting.length);
  }
  for (var i = 0; i < deleting.length; i++) {
	this.removeFromArray(this, deleting[i]);
  }
};

/* Shuffle array */
Object.prototype.shuffleArray = function() {
  var i = this.length, j, tempi, tempj;
  if (i === 0) return this;
  while (--i) {
	j = Math.floor(Math.random() * ( i + 1 ));
	tempi = this[i];
	tempj = this[j];
	this[i] = tempj;
	this[j] = tempi;
  }
  return this;
};

/* Copy */
Object.prototype.clone = function() {
  function deepExtend(out) {
	out = out || {};

	for (var i = 1; i < arguments.length; i++) {
	  var obj = arguments[i];
	  if (!obj) continue;

	  for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
		  if (typeof obj[key] === 'object')
			deepExtend(out[key], obj[key]);
		  else
			out[key] = obj[key];
		}
	  }
	}

	return out;
  };

  return deepExtend(this, {}, null);
};

/* File handler */
Element.prototype.getFile = function(options) {
  var reader = new FileReader();
  var file = this.files[0];
  reader.file = file;

  if (options.onload) {
	reader.onload = function(event) {
	  if (options.onloadend)
		options.onloadend(this.file.name);
	  if (options.type === "img")
		event.target.result.createImage(options.onload);
	};
  }

  reader.readAsDataURL(file);
  return reader;
}

/* Setup mouse and touch */
var mx, my;
function MousePad(el) {
  var start;
  var left = 0, down = 0, right = 0, middle = 0;
  var moved = false;
  var difference = 0, distance = 0;

  function getCursorPosition(e, finger) {
    var el = (e.target).get();
	var rect = {left: el.offsetLeft, top: el.offsetTop};
	if (!finger) finger = 0;
	if (typeof(e.originalEvent) !== "undefined" && typeof(e.originalEvent.touches) !== "undefined") e = e.originalEvent.touches[finger];
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	return {"x":x,"y":y};
  }

  function getMousePosition(e) {
	var results = getCursorPosition(e);
	mx = results.x;
	my = results.y;
	return results;
  }

  el.on("mousedown", function(e) {
	var xy = getMousePosition(e);
	e.preventDefault();
	switch(e.button) {
	  case 0:
		left = 1;
		start = xy;
		difference = 0;
		distance = 0;
		moved = false;
		"io.left.down".fireEvent(e);
		break;
	  case 1:
		middle = 1;
		"io.middle.down".fireEvent(e);
		break;
	  case 2:
		right = 1;
		"io.right.down".fireEvent(e);
		break;
	}
  });
  el.on("mousemove", function(e) {
	getMousePosition(e);
	if (start) {
	  moved = true;
	  "io.left.move".fireEvent(e);
	}
  });
  el.on("mouseup", function(e) {
	getMousePosition(e);
	e.preventDefault();
	switch(e.button) {
	  case 0:
		left = -1;
		start = null;
		"io.left.up".fireEvent(e);
		break;
	  case 1:
		middle= -1;
		"io.middle.up".fireEvent(e);
		break;
	  case 2:
		right = -1;
		"io.right.up".fireEvent(e);
		break;
	}
  });

  el.on("touchstart", function(e) {
	start = getMousePosition(e);
	down = 1;
	difference = 0;
	distance = 0;
	"io.touch.down".fireEvent(e);
  });
  el.on("touchmove", function(e) {
	var fingerOne = getMousePosition(e);
	if (start) {
	  if (e.originalEvent.touches.length > 1) {
		var fingerTwo = getCursorPosition(e, 1);
		var d = Math.lineDistance(fingerOne.x, fingerOne.y, fingerTwo.x, fingerTwo.y);
		if (d !== 0) difference = distance - d;
		distance = d;
	  }
	  moved = true;
	  "io.touch.move".fireEvent(e);
	}
  });
  el.on("touchend", function(e) {
	start = null;
	down = -1;
	difference = 0;
	distance = 0;
	"io.touch.up".fireEvent(e);
  });

  function getOffset() { return el.get(0).getBoundingClientRect(); }

  function getMouse() {

  }

  function update() {
	if (left === -1) left = 0;
	if (middle === -1) middle = 0;
	if (right === -1) right = 0;
	if (down === -1) down = 0;
  }
  window.requestAnimationFrame(update);

  return {
	getMouse : getMouse
  };
}

function Keyboard(el) {
  var left = 0;
  var right = 0;
  var down = 0;
  var up = 0;
  var space = 0;
  var action1 = 0;
  var action2 = 0;
  
  document.addEventListener("keydown", function(e) {
	getKey(e, true); 
  });
  document.addEventListener("keyup", function(e) {
	getKey(e, false);
  });  

  function getKey(e, down) {
	var val = 1; if (!down) val = -1;
	var key = String.fromCharCode(e.keyCode).toUpperCase().trim();
	switch (key) {
	  case "W": up = val; break;
	  case "D": right = val; break;
	  case "A": left = val; break;
	  case "S": down = val; break;
	  case "E": action1 = val; break;
	  case "Q": action2 = val; break;
	  default:
		if (e.keyCode === 37) { left = val; e.preventDefault(); }
		if (e.keyCode === 39) { right = val; e.preventDefault(); }
		if (e.keyCode === 38) { up = val; e.preventDefault(); }
		if (e.keyCode === 32) { space = val; e.preventDefault(); }
		if (e.keyCode === 17) { action1 = val; }
		if (e.keyCode === 18) { action2 = val; }
		break;
	}
	return key;
  }

  function getKeyboard() {

  }

  function update() {
	if (left === -1) left = 0;
	if (right === -1) right = 0;
	if (down === -1) down = 0;
	if (up === -1) up = 0;
	if (space === -1) space = 0;
	if (action1 === -1) action1 = 0;
	if (action2 === -1) action2 = 0;
  }
  window.requestAnimationFrame(update);

  return {
	getKeyboard : getKeyboard
  };
}

if (typeof(CanvasRenderingContext2D) !== "undefined") {
  CanvasRenderingContext2D.prototype.clear = function() {
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  CanvasRenderingContext2D.prototype.drawText = function(options) {
	if (!options.text) return false;

	function wrapText(context, text, x, y, maxWidth, lineHeight) {
	  text = String(text);
	  var words = text.split(' ');
	  var line = '';

	  for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = maxWidth;
		var testWidth = maxWidth;
		if (context.measureText) {
		  metrics = context.measureText(testLine);
		  testWidth = metrics.width;
		}
		if (testWidth > maxWidth && n > 0) {
		  context.fillText(line, x, y);
		  line = words[n] + ' ';
		  y += lineHeight;
		} else {
		  line = testLine;
		}
	  }
	  context.fillText(line, x, y);
	}

	if (options.base) this.textBaseline = options.baseline;
	if (options.alignment) this.textAlign = options.alignment;
	if (options.color) this.fillStyle = options.color;
	if (!options.font) options.font = "18px Arial";
	this.font = options.font;

	if (options.maxWidth && options.lineHeight) {
	  wrapText(this, options.text, options.x, options.y, options.maxWidth, options.lineHeight);
	} else {
	  this.fillText(options.text, options.x, options.y);
	}
  };

  CanvasRenderingContext2D.prototype.drawLine = function(options) {
	if (!options) return;
	this.beginPath();
	this.moveTo(options.x1, options.y1);
	this.lineTo(options.x2, options.y2);
	if (options.strokewidth) this.lineWidth = options.strokewidth;
	if (options.color) this.strokeStyle = options.color;
	this.stroke();
  };

  CanvasRenderingContext2D.prototype.drawCircle = function(options) {
	this.beginPath();
	this.arc(options.x, options.y, options.radius, 0, 2 * Math.PI, false);

	if (!options.color) options.color = "#000000";
	this.fillStyle = options.color;
	this.fill();

	if (!options.linewidth && !options.linecolor) return;
	if (!options.linewidth) options.linewidth = 0;
	if (!options.linecolor) options.linecolor = "#000000";
	this.lineWidth = options.linewidth;
	this.strokeStyle = options.linecolor;
	this.stroke();
  };

  CanvasRenderingContext2D.prototype.clearCircle = function(options) {
	this.save();
	this.beginPath();
	this.arc(options.x, options.y, options.radius, 0, 2 * Math.PI, true);
	this.clip();
	this.clearRect(options.x - options.radius, options.y - options.radius, options.radius * 2, options.radius * 2);
	this.restore();
  };

  CanvasRenderingContext2D.prototype.drawRect = function(options) {
	this.fillStyle = options.color;
	this.fillRect(options.x,options.y,options.width,options.height);
  };

  CanvasRenderingContext2D.prototype.draw = function(options) {
	this.save();
	this.translate(options.x + (options.width / 2), options.y + (options.height / 2));
	this.rotate(options.rotation * (Math.PI/180));

	var image = options.image;
	if (options.effect) {
	  var canvas = document.createElement("canvas");
	  canvas.width = options.width; canvas.height = options.height;
	  var context = canvas.getContext("2d");
	  context.drawImage(options.image, 0, 0, options.width, options.height);

	  var imgData;
	  switch (options.effect) {
		case "grayscale" :
		  imgData = context.toGrayScale();
		  break;
	  }
	  if (imgData) {
		context.putImageData(imgData, 0, 0);
		image = context.createImage();
	  }
	}

	this.drawImage(image, -(options.width/2), -(options.height/2), options.width, options.height);
	this.restore();
  };

  CanvasRenderingContext2D.prototype.createImage = function(callback) {
	return this.canvas.toDataURL("image/png").createImage(callback);
  };

  CanvasRenderingContext2D.prototype.getCanvasImageData = function(options) {
	if (!options) options = {};
	if (!options.x) options.x = 0; if (!options.y) options.y = 0;
	if (!options.width) options.width = this.canvas.width; if (!options.height) options.height = this.canvas.height;
	if (options.width === 0 || options.height === 0) return false;
	return this.getImageData(options.x, options.y, options.width, options.height);
  };

  CanvasRenderingContext2D.prototype.toGrayScale = function() {
	return this.changeSaturation(-1);
  };

  CanvasRenderingContext2D.prototype.changeSaturation = function(val) {
	var imgData = this.getCanvasImageData();
	for (var i = 0; i < imgData.data.length; i += 4) {
	  var r = imgData.data[i];
	  var g = imgData.data[i + 1];
	  var b = imgData.data[i + 2];

	  var luminace = (r * 0.299) + (g * 0.587) + (b * 0.114);
	  var alpha = -val;

	  r = ((1 - alpha) * r) + (alpha * luminace);
	  g = ((1 - alpha) * g) + (alpha * luminace);
	  b = ((1 - alpha) * b) + (alpha * luminace);

	  imgData.data[i] = r;
	  imgData.data[i + 1] = g;
	  imgData.data[i + 2] = b;
	}
	return imgData;
  };

  CanvasRenderingContext2D.prototype.changeBrightness = function() {
	var imgData = this.getCanvasImageData();
	for (var i = 0; i < imgData.data.length; i += 4) {
	  imgData.data[i] += val;
	  imgData.data[i + 1] += val;
	  imgData.data[i + 2] += val;
	}
	this.putImageData(imgData, 0, 0);
  };

  CanvasRenderingContext2D.prototype.changeContrast = function(v) {
	var imgData = this.getCanvasImageData();
	v = (100 + v) / 100;
	v *= v;

	for (var i = 0; i < imgData.data.length; i += 4) {
	  var r = imgData.data[i];
	  var g = imgData.data[i + 1];
	  var b = imgData.data[i + 2];
	  r /= 255;
	  g /= 255;
	  b /= 255;
	  r = (((r - 0.5) * v) + 0.5) * 255;
	  g = (((g - 0.5) * v) + 0.5) * 255;
	  b = (((b - 0.5) * v) + 0.5) * 255;
	  if (r > 255) {
		r = 255;
	  } else if (r < 0) {
		r = 0;
	  }
	  if (g > 255) {
		g = 255;
	  } else if (g < 0) {
		g = 0;
	  }
	  if (b > 255) {
		b = 255;
	  } else if (b < 0) {
		b = 0;
	  }
	  imgData.data[i] = r;
	  imgData.data[i + 1] = g;
	  imgData.data[i + 2] = b;
	}
	this.putImageData(imgData, x, y);
  };

  CanvasRenderingContext2D.prototype.autoLevel = function() {
	var imgData = this.getCanvasImageData();
	var histogram = {};
	for (var i = 0; i < 256; i++) {
	  histogram[i] = 0;
	}
	for (var i = 0; i < imgData.data.length; i += 4) {
	  var r = imgData.data[i];
	  var g = imgData.data[i + 1];
	  var b = imgData.data[i + 2];
	  var brightest = (r * 0.299) + (g * 0.587) + (b * 0.114);
	  brightest = Math.round(brightest);
	  if (brightest > 255) { brightest = 255; }
	  histogram[brightest]++;
	}
	var white = 255;
	var counter = 0;
	while ((counter < 200) && (white > 0)) {
	  counter += histogram[white];
	  white--;
	}
	var brightest = 1 + ((255 - white) / 256.0);
	for (var i = 0; i < imgData.data.length; i += 4) {
	  var r = imgData.data[i];
	  var g = imgData.data[i + 1];
	  var b = imgData.data[i + 2];
	  var alpha = -0.2;
	  r = ((1 - alpha) * r) + (alpha * brightest);
	  g = ((1 - alpha) * g) + (alpha * brightest);
	  b = ((1 - alpha) * b) + (alpha * brightest);
	  imgData.data[i] = r;
	  imgData.data[i + 1] = g;
	  imgData.data[i + 2] = b;
	}
	this.putImageData(imgData, 0, 0);
  };

  CanvasRenderingContext2D.prototype.hasBlending = function() {
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.globalCompositeOperation = 'color';
	if (ctx.globalCompositeOperation == 'color' && !"safari".isBrowser())
	  return true;
	return false;
  }
  CanvasRenderingContext2D.prototype.applyBlend = function(blend) {
	/* normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light |
	soft-light | difference | exclusion | hue | saturation | color | luminosity */
	if (!blend) blend = 'source-over';
	this.globalCompositeOperation = blend;
  };

  CanvasRenderingContext2D.prototype.clearBlend = function() {
	this.globalCompositeOperation = 'source-over';
  };

  CanvasRenderingContext2D.prototype.invertPixels = function() {
	var imageData = this.getCanvasImageData();
	var p = imageData.data;
	for (var i = 0, n = p.length; i < n; i += 4) {
	  p[i] = 255 - p[i];
	  p[i +1] = 255 - p[i+1];
	  p[i+2] = 255 - p[i+2];
	}
	imageData.data = p;
	this.putImageData(imageData, 0, 0);
  };
}