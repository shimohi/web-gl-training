export class ShaderUtils {

	static loadShaderProgram(
		gl: WebGLRenderingContext,
		vert: string,
		frag: string
	): WebGLProgram {
		return ShaderUtils.createShaderProgram(
			gl,
			ShaderUtils.createVertexShader(gl, vert),
			ShaderUtils.createFragmentShader(gl, frag)
		);
	}

	static createVertexShader(
		gl: WebGLRenderingContext,
		glsl: string
	): WebGLShader {

		const shader = gl.createShader(gl.VERTEX_SHADER);
		return ShaderUtils.setupShader(
			gl, shader, glsl
		);

	}

	static createFragmentShader(
		gl: WebGLRenderingContext,
		glsl: string
	): WebGLShader {

		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		return ShaderUtils.setupShader(
			gl, shader, glsl
		);

	}

	static setupShader(
		gl: WebGLRenderingContext,
		shader: WebGLShader,
		glsl: string
	): WebGLShader {

		// 生成されたシェーダにソースを割り当てる
		gl.shaderSource(shader, glsl);

		// シェーダをコンパイルする
		gl.compileShader(shader);

		// シェーダが正しくコンパイルされたかチェック
		if ( gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

			// 成功していたらシェーダを返して終了
			return shader;
		}
		throw new Error(gl.getShaderInfoLog(shader));
	}

	static createShaderProgram(
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram {

		// プログラムオブジェクトの生成
		const program = gl.createProgram();

		// プログラムオブジェクトにシェーダを割り当てる
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		// シェーダをリンク
		gl.linkProgram(program);

		// シェーダのリンクが正しく行なわれたかチェック
		if ( gl.getProgramParameter(program, gl.LINK_STATUS )) {

			// 成功していたらプログラムオブジェクトを有効にする
			gl.useProgram(program);

			// プログラムオブジェクトを返して終了
			return program;

		}

		// 失敗していたらエラーログをアラートする
		throw new Error(gl.getProgramInfoLog(program));
	}

	static createVbo(
		gl: WebGLRenderingContext,
		data: number[]
	) {

		// バッファオブジェクトの生成
		const vbo = gl.createBuffer();

		// バッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

		// バッファにデータをセット
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

		// バッファのバインドを無効化
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// 生成した VBO を返して終了
		return vbo;
	}
}