import {Training01} from "./training01";
import {Training02} from "./training02";

const webGLtraining: any = (<any>window).webGLtraining ? (<any>window).webGLtraining : {};
if (!(<any>window).webGLtraining) {
	(<any>window).webGLtraining = webGLtraining;
}

webGLtraining.init = () => {

	// training01
	Training01.action("canvas01");

	// training02
	Training02.action("canvas02");
};


