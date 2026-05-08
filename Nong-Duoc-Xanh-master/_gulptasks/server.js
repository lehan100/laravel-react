import { watch, series, parallel } from "gulp";
import browserSync from "browser-sync";
// import jsTask from "./script"
import pugTask from "./pug";
import { sassTask, tailwindTask } from "./sass";
import { copyImage } from "./copy";
import { cleanImage } from "./clean";
import boxen from "boxen";
import logSymbols from "log-symbols";
import jsTask from "./js";
export const outputText = (title = "123", desc = "123") => {
	const boxedMessage = boxen(`\n${desc}\n`, {
		padding: { top: 1, left: 4, right: 4, bottom: 1 },
		title: title,
		margin: 1,
		titleAlignment: "center",
		borderStyle: "double",
		borderColor: "#ffc107",
	});
	console.log(boxedMessage);
};
export const buildFinish = () => {
	const message = "Infomation Build";
	const boxedMessage = boxen(`\n${message}\n`, {
		padding: { top: 1, left: 4, right: 4, bottom: 1 },
		title: "Building",
		margin: 1,
		titleAlignment: "center",
		borderStyle: "double",
		borderColor: "#ffc107",
	});
	console.log(boxedMessage);
};
function previewReload(done) {
	browserSync.reload();
	done();
}
export const server = () => {
	browserSync.init({
		notify: true,
		server: {
			baseDir: "dist",
		},
		port: 7979,
	});

	watch(["src/js/*.js"], series(jsTask));

	watch(["src/**/**.pug"], series(pugTask, sassTask, previewReload));

	watch(["src/components/**/*.sass"], series(sassTask));

	watch(["src/assets/img/**/**.{svg,png,jpg,speg,gif,jpge,PNG,JPGE,JPG,SVG,GIF,SPEG}"], series(cleanImage, copyImage));

	watch(["dist"]).on("change", browserSync.reload);
	buildFinish();
};

module.exports = { server, buildFinish, outputText };
