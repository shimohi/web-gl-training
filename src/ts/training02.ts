const sample_fragment_frag = require("../glsl/sample-fragment.frag");
const sample_vertex_vert = require("../glsl/sample-vertex.vert");
import {ShaderUtils} from "./ShaderUtils";
import {Mat4Utils} from "./Mat4Utils";

export class Training02 {

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
		const vertex_position = [
			0.0, 1.0, 0.0,
			1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0
		];

		const vertex_color = [
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0
		];

		// VBOの生成
		const position_vbo = ShaderUtils.createVbo(gl, vertex_position);
		const color_vbo = ShaderUtils.createVbo(gl, vertex_color);

		ShaderUtils.setAttribute(gl, [position_vbo, color_vbo], attLocations, attStrides);

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

		const training02 = new Training02(
			gl, uniLocation, tmpMatrix, mMatrix, mvpMatrix
		);
		training02.render();
	}

	private count: number;

	constructor(
		private gl: WebGLRenderingContext,
		private mvpMatrixLocation: WebGLUniformLocation,
		private baseMatrix: Float32Array,
		private workMatrix1: Float32Array,
		private workMatrix2: Float32Array
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

		this.setModel1(rad);
		this.setModel2(rad);
		this.setModel3(rad);

		gl.flush();

		// ループのために再帰呼び出し
		setTimeout(this.render, 1000 / 30);
	}

	private setModel1(
		rad: number
	): void {

		// モデル1は円の軌道を描き移動する
		const x = Math.cos(rad);
		const y = Math.sin(rad);
		const mMatrix = this.workMatrix1;
		const mvpMatrix = this.workMatrix2;
		const gl = this.gl;

		Mat4Utils.identity(mMatrix);
		Mat4Utils.translate(mMatrix, [x, y + 1.0, 0.0], mMatrix);

		// モデル1の座標変換行列を完成させレンダリングする
		Mat4Utils.multiply(this.baseMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(this.mvpMatrixLocation, false, mvpMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

	}

	private setModel2(
		rad: number
	): void {

		const mMatrix = this.workMatrix1;
		const mvpMatrix = this.workMatrix2;
		const gl = this.gl;

		// モデル2はY軸を中心に回転する
		Mat4Utils.identity(mMatrix);
		Mat4Utils.translate(mMatrix, [1.0, -1.0, 0.0], mMatrix);
		Mat4Utils.rotate(mMatrix, rad, [0, 1, 0], mMatrix);

		// モデル2の座標変換行列を完成させレンダリングする
		Mat4Utils.multiply(this.baseMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(this.mvpMatrixLocation, false, mvpMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

	}

	private setModel3(
		rad: number
	): void {

		const mMatrix = this.workMatrix1;
		const mvpMatrix = this.workMatrix2;
		const gl = this.gl;

		// モデル3は拡大縮小する
		const s = Math.sin(rad) + 1.0;
		Mat4Utils.identity(mMatrix);
		Mat4Utils.translate(mMatrix, [-1.0, -1.0, 0.0], mMatrix);
		Mat4Utils.scale(mMatrix, [s, s, 0.0], mMatrix);

		// モデル3の座標変換行列を完成させレンダリングする
		Mat4Utils.multiply(this.baseMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(this.mvpMatrixLocation, false, mvpMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

}


