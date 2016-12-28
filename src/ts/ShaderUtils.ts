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
			gl, shader!, glsl
		);

	}

	static createFragmentShader(
		gl: WebGLRenderingContext,
		glsl: string
	): WebGLShader {

		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		return ShaderUtils.setupShader(
			gl, shader!, glsl
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

		const message = gl.getShaderInfoLog(shader);
		throw new Error(message === null ? "" : message );
	}

	static createShaderProgram(
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram {

		// プログラムオブジェクトの生成
		const program = gl.createProgram()!;

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
		const message = gl.getProgramInfoLog(program);
		throw new Error(message === null ? "" : message );
	}

	static createVbo(
		gl: WebGLRenderingContext,
		data: number[]
	): WebGLBuffer {

		// バッファオブジェクトの生成
		const vbo = gl.createBuffer();

		// バッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

		// バッファにデータをセット
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

		// バッファのバインドを無効化
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// 生成した VBO を返して終了
		return vbo!;
	}

	// VBOをバインドし登録する関数
	static setAttribute(
		gl: WebGLRenderingContext,
		vbo: WebGLBuffer[],
		attL: number[],
		attS: number[]
	): void {

		// 引数として受け取った配列を処理する
		let i = 0 | 0;
		const len = vbo.length;
		while (i < len) {

			// バッファをバインドする
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

			// attributeLocationを有効にする
			gl.enableVertexAttribArray(attL[i]);

			// attributeLocationを通知し登録する
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);

			i = ( i + 1 ) | 0;
		}
	}

	static createIbo(
		gl: WebGLRenderingContext,
		data: number[]
	): WebGLBuffer {

		// バッファオブジェクトの生成
		const ibo = gl.createBuffer()!;

		// バッファをバインドする
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

		// バッファにデータをセット
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

		// バッファのバインドを無効化
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// 生成したIBOを返して終了
		return ibo;
	}
}