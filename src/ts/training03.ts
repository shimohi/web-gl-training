const sample_fragment_frag = require("../glsl/sample-fragment.frag");
const sample_vertex_vert = require("../glsl/sample-vertex.vert");
import {ShaderUtils} from "./ShaderUtils";
import {Mat4Utils} from "./Mat4Utils";

export class Training03 {

	static action(canvasId: string): void {

		// canvasエレメントを取得
		const c = <HTMLCanvasElement>document.getElementById(canvasId);
		c.width = 500;
		c.height = 300;

		// webglコンテキストを取得
		const gl = <WebGLRenderingContext>(c.getContext("webgl") || c.getContext("experimental-webgl"));

		// canvasを黒でクリア(初期化)する
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		console.log(sample_fragment_frag);
		console.log(sample_vertex_vert);

		const prg = ShaderUtils.loadShaderProgram(gl, <string>sample_vertex_vert, <string>sample_fragment_frag);

		// attributeLocationの取得
		const attLocations: number[] = [];
		attLocations[0] = gl.getAttribLocation(prg, "position");
		attLocations[1] = gl.getAttribLocation(prg, "color");

		// attributeの要素数(この場合は xyz の3要素)
		const attStrides: number[] = [];
		attStrides[0] = 3;
		attStrides[1] = 4;

		// モデル(頂点)データ
		const position = [
			0.0, 1.0, 0.0,
			1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			0.0, -1.0,  0.0
		];
		const color = [
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		];
		// 頂点のインデックスを格納する配列
		const index = [
			0, 1, 2,
			1, 2, 3
		];

		// VBOの生成
		const position_vbo = ShaderUtils.createVbo(gl, position);
		const color_vbo = ShaderUtils.createVbo(gl, color);

		ShaderUtils.setAttribute(gl, [position_vbo, color_vbo], attLocations, attStrides);

		// IBOの生成
		const ibo = ShaderUtils.createIbo(gl, index);

		// IBOをバインドして登録する
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

		// uniformLocationの取得
		const uniLocation = gl.getUniformLocation(prg, "mvpMatrix")!;

		// 各種行列の生成と初期化
		const mMatrix = Mat4Utils.identity(Mat4Utils.create());
		const vMatrix = Mat4Utils.identity(Mat4Utils.create());
		const pMatrix = Mat4Utils.identity(Mat4Utils.create());
		const tmpMatrix = Mat4Utils.identity(Mat4Utils.create());
		const mvpMatrix = Mat4Utils.identity(Mat4Utils.create());

		// ビュー座標変換行列
		Mat4Utils.lookAt([ 0.0, 0.0, 2.0], [0, 0, 0], [0, 1, 0], vMatrix);

		// プロジェクション座標変換行列
		Mat4Utils.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
		Mat4Utils.multiply(pMatrix, vMatrix, tmpMatrix);

		const training03 = new Training03(
			gl, uniLocation, tmpMatrix, mMatrix, mvpMatrix, index
		);
		training03.render();
	}

	private count: number;

	constructor(
		private gl: WebGLRenderingContext,
		private mvpMatrixLocation: WebGLUniformLocation,
		private baseMatrix: Float32Array,
		private workMatrix1: Float32Array,
		private workMatrix2: Float32Array,
		private index: number[]
	) {
		this.count = 0;
	}

	private render: () => void = () => {

		const gl = this.gl;

		// canvasを初期化
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// カウンタをインクリメントする
		this.count++;

		// カウンタを元にラジアンを算出
		const rad = (this.count % 360) * Math.PI / 180;

		// モデル座標変換行列の生成(Y軸による回転)
		Mat4Utils.identity(this.workMatrix1);
		Mat4Utils.rotate(this.workMatrix1, rad, [0, 1, 0], this.workMatrix1);
		Mat4Utils.multiply(this.baseMatrix, this.workMatrix1, this.workMatrix2);
		gl.uniformMatrix4fv(this.mvpMatrixLocation, false, this.workMatrix2);

		// インデックスを用いた描画命令
		gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0);

		gl.flush();

		// ループのために再帰呼び出し
		setTimeout(this.render, 1000 / 30);
	}
}


