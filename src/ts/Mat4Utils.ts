// ------------------------------------------------------------------------------------------------
// minMatrix.js
// version 0.0.1
// Copyright (c) doxas
// ------------------------------------------------------------------------------------------------
export class Mat4Utils {

	/**
	 * 4 x 4 の正方行列を生成します。内部的には 16 の要素を持つ
	 * Float32Array オブジェクトで、全ての要素は 0 で初期化されています。
	 * @returns {Float32Array} 4 * 4 の正方行列を示すサイズ「16」の配列
	 */
	static create() {
		return new Float32Array(16);
	}

	/**
	 * 引数 dest に受け取った行列を初期化(単位行列化)して出力します。
	 * @param dest 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @returns {Float32Array} destの引数で渡した値を返す。
	 */
	static identity(
		dest: Float32Array
	) {
		dest[0]  = 1; dest[1]  = 0; dest[2]  = 0; dest[3]  = 0;
		dest[4]  = 0; dest[5]  = 1; dest[6]  = 0; dest[7]  = 0;
		dest[8]  = 0; dest[9]  = 0; dest[10] = 1; dest[11] = 0;
		dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1;
		return dest;
	};

	/**
	 * mat1 を左項、mat2 を右項として掛け合わせた結果を dest に出力します。
	 * @param mat1 掛け合わせの元となる行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @param mat2 掛け合わせる行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @param dest 演算結果を格納する行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @returns {Float32Array} destの引数で渡した値を返す。
	 */
	static multiply(
		mat1: Float32Array,
		mat2: Float32Array,
		dest: Float32Array
	) {
		const a = mat1[0],  b = mat1[1],  c = mat1[2],  d = mat1[3],
			e = mat1[4],  f = mat1[5],  g = mat1[6],  h = mat1[7],
			i = mat1[8],  j = mat1[9],  k = mat1[10], l = mat1[11],
			m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],
			A = mat2[0],  B = mat2[1],  C = mat2[2],  D = mat2[3],
			E = mat2[4],  F = mat2[5],  G = mat2[6],  H = mat2[7],
			I = mat2[8],  J = mat2[9],  K = mat2[10], L = mat2[11],
			M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];
		dest[0] = A * a + B * e + C * i + D * m;
		dest[1] = A * b + B * f + C * j + D * n;
		dest[2] = A * c + B * g + C * k + D * o;
		dest[3] = A * d + B * h + C * l + D * p;
		dest[4] = E * a + F * e + G * i + H * m;
		dest[5] = E * b + F * f + G * j + H * n;
		dest[6] = E * c + F * g + G * k + H * o;
		dest[7] = E * d + F * h + G * l + H * p;
		dest[8] = I * a + J * e + K * i + L * m;
		dest[9] = I * b + J * f + K * j + L * n;
		dest[10] = I * c + J * g + K * k + L * o;
		dest[11] = I * d + J * h + K * l + L * p;
		dest[12] = M * a + N * e + O * i + P * m;
		dest[13] = M * b + N * f + O * j + P * n;
		dest[14] = M * c + N * g + O * k + P * o;
		dest[15] = M * d + N * h + O * l + P * p;
		return dest;
	}

	/**
	 * モデル変換における拡大縮小(スケーリング)を行ないます。
	 * mat には元となる行列を、vec には X Y Z の各スケーリング値を表すベクトルを渡します。
	 * ベクトルは三つの要素を持つ配列として渡します。演算結果は dest に出力されます。
	 *
	 * @param mat 元となる行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @param vec スケーリングベクトル x, y ,z 方向のベクトル値を示すサイズ「3」の配列
	 * @param dest 演算結果を格納する行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @returns {Float32Array} destの引数で渡した値を返す。
	 */
	static scale(
		mat: Float32Array,
		vec: number[],
		dest: Float32Array
	) {
		dest[0]  = mat[0]  * vec[0];
		dest[1]  = mat[1]  * vec[0];
		dest[2]  = mat[2]  * vec[0];
		dest[3]  = mat[3]  * vec[0];
		dest[4]  = mat[4]  * vec[1];
		dest[5]  = mat[5]  * vec[1];
		dest[6]  = mat[6]  * vec[1];
		dest[7]  = mat[7]  * vec[1];
		dest[8]  = mat[8]  * vec[2];
		dest[9]  = mat[9]  * vec[2];
		dest[10] = mat[10] * vec[2];
		dest[11] = mat[11] * vec[2];
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
		return dest;
	}

	/**
	 * モデル変換における移動(座標位置の変更)を行ないます。
	 * mat には元となる行列を、vec には X Y Z の各方向への移動量を表すベクトルを渡します。
	 * ベクトルは三つの要素を持つ配列として渡します。演算結果は dest に出力されます。
	 * @param mat 元となる行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @param vec 原点からの移動距離を表すベクトル vec x, y ,z 方向のベクトル値を示すサイズ「3」の配列
	 * @param dest 演算結果を格納する行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @returns {Float32Array} destの引数で渡した値を返す。
	 */
	static translate(
		mat: Float32Array,
		vec: number[],
		dest: Float32Array
	) {
		dest[0] = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
		dest[4] = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
		dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
		dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
		dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
		dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
		dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
		return dest;
	}

	/**
	 * モデル変換における回転を行ないます。mat には元となる行列を、
	 * angle には回転させたい量をラジアンで、
	 * axis には回転させる軸を指定するベクトルを三つの要素を持つ配列として渡します。
	 * 演算結果は dest に出力されます。
	 * @param mat 元となる行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @param angle 回転させる量をラジアンで指定
	 * @param axis 回転軸の座標(x, y, z) サイズ「3」の配列
	 * @param dest 演算結果を格納する行列 4 * 4 の正方行列を示すサイズ「16」の配列
	 * @returns {Float32Array} destの引数で渡した値を返す。
	 */
	static rotate(
		mat: Float32Array,
		angle: number,
		axis: number[],
		dest: Float32Array
	) {

		let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
		if ( !sq ) { return null; }

		let a = axis[0], b = axis[1], c = axis[2];
		if (sq !== 1) {
			sq = 1 / sq;
			a *= sq;
			b *= sq;
			c *= sq;
		}

		const d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
			g = mat[0],  h = mat[1], i = mat[2],  j = mat[3],
			k = mat[4],  l = mat[5], m = mat[6],  n = mat[7],
			o = mat[8],  p = mat[9], q = mat[10], r = mat[11],
			s = a * a * f + e,
			t = b * a * f + c * d,
			u = c * a * f - b * d,
			v = a * b * f - c * d,
			w = b * b * f + e,
			x = c * b * f + a * d,
			y = a * c * f + b * d,
			z = b * c * f - a * d,
			A = c * c * f + e;
		if ( angle && mat !== dest) {
			// if(mat != dest){
				dest[12] = mat[12]; dest[13] = mat[13];
				dest[14] = mat[14]; dest[15] = mat[15];
			// }
		} else {
			dest = mat;
		}

		dest[0] = g * s + k * t + o * u;
		dest[1] = h * s + l * t + p * u;
		dest[2] = i * s + m * t + q * u;
		dest[3] = j * s + n * t + r * u;
		dest[4] = g * v + k * w + o * x;
		dest[5] = h * v + l * w + p * x;
		dest[6] = i * v + m * w + q * x;
		dest[7] = j * v + n * w + r * x;
		dest[8] = g * y + k * z + o * A;
		dest[9] = h * y + l * z + p * A;
		dest[10] = i * y + m * z + q * A;
		dest[11] = j * y + n * z + r * A;
		return dest;
	}

	/**
	 * ビュー変換行列を生成します。
	 * eye にカメラの三次元空間上の位置を指定し、center はそのカメラが見つめる注視点を指定します。
	 * up にはカメラの上方向を表すベクトルを与えます。各ベクトルは三つの要素を持つ配列として渡します。
	 * 演算結果は dest に出力されます。
	 *
	 * @param eye カメラの位置を表すベクトル
	 * @param center カメラの注視点を表すベクトル
	 * @param up カメラの上方向を表すベクトル
	 * @param dest 演算結果を格納する行列
	 * @returns {Float32Array}
	 */
	static lookAt(eye: number[], center: number[], up: number[], dest: Float32Array) {

		const eyeX = eye[0];
		const eyeY = eye[1];
		const eyeZ = eye[2];
		const upX = up[0];
		const upY = up[1];
		const upZ = up[2];
		const centerX = center[0];
		const centerY = center[1];
		const centerZ = center[2];

		if ( eyeX === centerX && eyeY === centerY && eyeZ === centerZ ) {
			return Mat4Utils.identity(dest);
		}

		let z0 = eyeX - center[0];
		let z1 = eyeY - center[1];
		let z2 = eyeZ - center[2];

		let l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);

		z0 *= l; z1 *= l; z2 *= l;

		let x0 = upY * z2 - upZ * z1;
		let x1 = upZ * z0 - upX * z2;
		let x2 = upX * z1 - upY * z0;

		l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
		if ( !l ) {
			x0 = 0;
			x1 = 0;
			x2 = 0;
		} else {
			l = 1 / l;
			x0 *= l; x1 *= l; x2 *= l;
		}

		let y0 = z1 * x2 - z2 * x1;
		let y1 = z2 * x0 - z0 * x2;
		let y2 = z0 * x1 - z1 * x0;

		l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
		if ( !l ) {
			y0 = 0; y1 = 0; y2 = 0;
		} else {
			l = 1 / l;
			y0 *= l; y1 *= l; y2 *= l;
		}
		dest[0] = x0; dest[1] = y0; dest[2]  = z0; dest[3]  = 0;
		dest[4] = x1; dest[5] = y1; dest[6]  = z1; dest[7]  = 0;
		dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0;
		dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
		dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
		dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
		dest[15] = 1;
		return dest;
	}

	/**
	 * プロジェクション変換行列を生成します。
	 * 尚、ここで生成されるのは一般的には[ 透視射影 ]と呼ばれる射影変換行列で、
	 * いわゆる遠近法の効果が現れます。
	 * fovy には視野角を度数法で、aspect にはスクリーンのアスペクト比(幅÷高さ)を、
	 * near には前方クリップ位置(必ず 0 より大きな数値を指定)を、
	 * far には後方クリップ位置(任意の数値)を指定します。演算結果は dest に出力されます。
	 * @param fovy 視野角
	 * @param aspect スクリーンのアスペクト比
	 * @param near ニアクリップ
	 * @param far ファークリップ
	 * @param dest 演算結果を格納する行列
	 * @returns {Float32Array}
	 */
	static perspective(fovy: number , aspect: number, near: number, far: number, dest: Float32Array) {
		const t = near * Math.tan(fovy * Math.PI / 360);
		const r = t * aspect;
		const a = r * 2, b = t * 2, c = far - near;
		dest[0] = near * 2 / a;
		dest[1] = 0;
		dest[2] = 0;
		dest[3] = 0;
		dest[4] = 0;
		dest[5] = near * 2 / b;
		dest[6] = 0;
		dest[7] = 0;
		dest[8] = 0;
		dest[9] = 0;
		dest[10] = -(far + near) / c;
		dest[11] = -1;
		dest[12] = 0;
		dest[13] = 0;
		dest[14] = -(far * near * 2) / c;
		dest[15] = 0;
		return dest;
	}

	/**
	 * 行列を転置します。mat に渡された行列を転置し、dest に結果を出力します。
	 * @param mat 元となる行列
	 * @param dest 演算結果を格納する行列
	 * @returns {Float32Array}
	 */
	static transpose(mat: Float32Array, dest: Float32Array) {
		dest[0]  = mat[0];  dest[1]  = mat[4];
		dest[2]  = mat[8];  dest[3]  = mat[12];
		dest[4]  = mat[1];  dest[5]  = mat[5];
		dest[6]  = mat[9];  dest[7]  = mat[13];
		dest[8]  = mat[2];  dest[9]  = mat[6];
		dest[10] = mat[10]; dest[11] = mat[14];
		dest[12] = mat[3];  dest[13] = mat[7];
		dest[14] = mat[11]; dest[15] = mat[15];
		return dest;
	}

	/**
	 * 行列から逆行列を生成します。mat に渡された行列の逆行列を求め dest に結果を出力します。
	 * @param mat 元となる行列
	 * @param dest 演算結果を格納する行列
	 * @returns {Float32Array}
	 */
	static inverse(mat: Float32Array, dest: Float32Array) {
		let a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
			e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
			i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
			m = mat[12], n = mat[13], o = mat[14], p = mat[15],
			q = a * f - b * e, r = a * g - c * e,
			s = a * h - d * e, t = b * g - c * f,
			u = b * h - d * f, v = c * h - d * g,
			w = i * n - j * m, x = i * o - k * m,
			y = i * p - l * m, z = j * o - k * n,
			A = j * p - l * n, B = k * p - l * o,
			ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
		dest[0]  = ( f * B - g * A + h * z) * ivd;
		dest[1]  = (-b * B + c * A - d * z) * ivd;
		dest[2]  = ( n * v - o * u + p * t) * ivd;
		dest[3]  = (-j * v + k * u - l * t) * ivd;
		dest[4]  = (-e * B + g * y - h * x) * ivd;
		dest[5]  = ( a * B - c * y + d * x) * ivd;
		dest[6]  = (-m * v + o * s - p * r) * ivd;
		dest[7]  = ( i * v - k * s + l * r) * ivd;
		dest[8]  = ( e * A - f * y + h * w) * ivd;
		dest[9]  = (-a * A + b * y - d * w) * ivd;
		dest[10] = ( m * u - n * s + p * q) * ivd;
		dest[11] = (-i * u + j * s - l * q) * ivd;
		dest[12] = (-e * z + f * x - g * w) * ivd;
		dest[13] = ( a * z - b * x + c * w) * ivd;
		dest[14] = (-m * t + n * r - o * q) * ivd;
		dest[15] = ( i * t - j * r + k * q) * ivd;
		return dest;
	};
}
export default Mat4Utils;