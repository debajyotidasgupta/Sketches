// ViewDome.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewDome extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(15, 30, false, true);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
		this.shader.uniform("opacity", "uniform1f", 1);
		GL.draw(this.mesh);
	}


}

export default ViewDome;