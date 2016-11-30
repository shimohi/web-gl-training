const sample_fragment_frag = require("../glsl/sample-fragment.frag");
const sample_vertex_vert = require("../glsl/sample-vertex.vert");
import {ShaderUtils} from "./ShaderUtils";
import {Mat4Utils} from "./Mat4Utils";

const webGLtraining: any = (<any>window).webGLtraining ? (<any>window).webGLtraining : {};
if (!(<any>window).webGLtraining) {
	(<any>window).webGLtraining = webGLtraining;
}

webGLtraining.init = () => {

	// canvasエレメントを取得
	const c = <HTMLCanvasElement>document.getElementById("canvas");
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
	const attLocation = gl.getAttribLocation(prg, "position");

	// attributeの要素数(この場合は xyz の3要素)
	const attStride = 3;

	// モデル(頂点)データ
	const vertex_position = [
		0.0, 1.0, 0.0,
		1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0
	];

	// VBOの生成
	const vbo = ShaderUtils.createVbo(gl, vertex_position);

	// VBOをバインド
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	// attribute属性を有効にする
	gl.enableVertexAttribArray(attLocation);

	// attribute属性を登録
	gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);

	// // minMatrix.js を用いた行列関連処理
	// // matIVオブジェクトを生成
	// var m = new matIV();

	// 各種行列の生成と初期化
	const mMatrix = Mat4Utils.identity(Mat4Utils.create());
	const vMatrix = Mat4Utils.identity(Mat4Utils.create());
	const pMatrix = Mat4Utils.identity(Mat4Utils.create());
	const mvpMatrix = Mat4Utils.identity(Mat4Utils.create());

	// ビュー座標変換行列
	Mat4Utils.lookAt([ 0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

	// プロジェクション座標変換行列
	Mat4Utils.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

	// 各行列を掛け合わせ座標変換行列を完成させる
	Mat4Utils.multiply(pMatrix, vMatrix, mvpMatrix);
	Mat4Utils.multiply(mvpMatrix, mMatrix, mvpMatrix);

	// uniformLocationの取得
	const uniLocation = gl.getUniformLocation(prg, "mvpMatrix");

	// uniformLocationへ座標変換行列を登録
	gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

	// モデルの描画
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	// コンテキストの再描画
	gl.flush();

};
