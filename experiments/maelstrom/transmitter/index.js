// index.js
'use strict';
const PORT_SOCKET = 9876;
let app    = require('express')();
let server = app.listen(PORT_SOCKET);
let io     = require('socket.io')(server);

const glm = require('gl-matrix');

var random = function(min, max) { return min + Math.random() * (max - min);	}

const {vec3, mat4} = glm;


//	OSC EMITTER

const PORT_EMIT_OSC = 8917;
const OscEmitter = require("osc-emitter");

let emitter = new OscEmitter();
emitter.add('localhost', PORT_EMIT_OSC);
emitter.add('localhost', PORT_EMIT_OSC+1);


//	WEB SOCKETS

io.on('connection', (socket)=>_onConnected(socket));

function _onConnected(socket) {
	console.log('A user is connected : ', socket.id);

	socket.on('disconnect', ()=>_onDisconnected() );
	socket.on('test', (o)=>_onTest(o) );
	socket.on('particlePosition', (positions, frame)=>_onParticlePositions(positions, frame));
}


function _onDisconnected() {
	console.log('User disconnected');
}


function _onTest(o) {
	console.log('on Test : ', o);
}

let _frame = 0;


function _onParticlePositions(positions, frame) {
	
	let time = new Date().getTime();
	// emitter.emit('/positions', positions[0], positions[1], positions[2], positions[3]);
	let num = positions.length /3;
	// console.log('On Position:', num);
	for(let i=0; i<num; i++) {
		emitter.emit('/positions', positions[i*3], positions[i*3+1], positions[i*3+2], i);
	}

	let elapsed = new Date().getTime() - time;
	console.log('Elapsed : ', elapsed, ", Frame : ", frame, "/", _frame);
	emitter.emit('/update', 'update');
	_frame ++;
}


setInterval(loop, 1000);

function loop() {
	

	let m = mat4.create();
	const scale = 100;
	const r = 2;

	let x = Math.round(random(-r, r) * scale);
	let y = Math.round(random(-r, r) * scale);
	let z = Math.round(random(-r, r) * scale);

	mat4.translate(m, m, vec3.fromValues(x, y, z));
	mat4.rotateY(m, m, Math.random() * Math.PI * 2.0);

	const off = [m[12], m[13], m[14]];
	const v1 = [m[0], m[1], m[2]];
	const v2 = [m[4], m[5], m[6]];
	const v3 = [m[8], m[9], m[10]];

	let mtx = off.concat(v1).concat(v2).concat(v3);
	mtx.push(0);

	let str = mtx.toString();
	str = str.replace('[', '')
	str = str.replace(']', '')
	str = str.replace(/\,/g, ' ')

	// emitter.emit('/positions', mtx[0], mtx[1], mtx[2], mtx[3], mtx[4], mtx[5], mtx[6], mtx[7], mtx[8], mtx[9], mtx[10], mtx[11], mtx[12]);
	emitter.emit('/positions', str);
}



/*
//	OSC RECEIVER

const PORT_OSC = 7110;
const OscReceiver = require("osc-receiver");

let receiver = new OscReceiver();
receiver.bind(PORT_OSC);


//	OSC MESSAGES HANDLING

receiver.on('/cameraPos', function(x, y, z) {
	console.log('Camera Position : ', x, y, z);
	io.emit('cameraPosition', {x:-x, y:y, z:z})
});

receiver.on('/lightPos', function(x, y, z) {
	console.log('Light Position : ', x, y, z);
	io.emit('lightPosition', {x:-x, y:y, z:z})
});

*/
