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
		const uniLocation = gl.getUniformLocation(prg, "mvpMatrix");

		// 各種行列の生成と初期化
		const mMatrix = Mat4Utils.identity(Mat4Utils.create());
		const vMatrix = Mat4Utils.identity(Mat4Utils.create());
		const pMatrix = Mat4Utils.identity(Mat4Utils.create());
		const tmpMatrix = Mat4Utils.identity(Mat4Utils.create());
		const mvpMatrix = Mat4Utils.identity(Mat4Utils.create());

		// ビュー座標変換行列
		Mat4Utils.lookAt([ 0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

		// プロジェクション座標変換行列
		Mat4Utils.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
		Mat4Utils.multiply(pMatrix, vMatrix, tmpMatrix);

		// カウンタの宣言
		let count = 0;

		(function(){

		})();


		// 一つ目のモデルを移動するためのモデル座標変換行列
		Mat4Utils.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);

		// モデル×ビュー×プロジェクション(一つ目のモデル)
		Mat4Utils.multiply(tmpMatrix, mMatrix, mvpMatrix);

		// uniformLocationへ座標変換行列を登録
		gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

		// モデルの描画
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		// 二つ目のモデルを移動するためのモデル座標変換行列
		Mat4Utils.identity(mMatrix);
		Mat4Utils.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);

		// モデル×ビュー×プロジェクション(二つ目のモデル)
		Mat4Utils.multiply(tmpMatrix, mMatrix, mvpMatrix);

		// uniformLocationへ座標変換行列を登録し描画する(二つ目のモデル)
		gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		// コンテキストの再描画
		gl.flush();
	}
}


