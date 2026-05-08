import { src, dest } from "gulp";
import concat from "gulp-concat";
import sourcemap from "gulp-sourcemaps";
import cssnano from "cssnano";
import postcss from "gulp-postcss";
import cssSort from "css-declaration-sorter";
import browserSync from "browser-sync";
import autoprefixer from "autoprefixer";
import cached from "gulp-cached";
import remember from "gulp-remember";
const sass = require("gulp-sass")(require("sass"));
const tailwindcss = require("tailwindcss");

export const tailwindTask = () => {
	return src(["src/components/_tailwind/*.sass"])
		.pipe(sourcemap.init())
		.pipe(concat("main.min.sass"))
		.pipe(sass().on("error", sass.logError))
		.pipe(
			postcss([
				require("postcss-import"),
				tailwindcss("./tailwind.config.js"),
				require("autoprefixer"),
				cssnano(),
				cssSort({
					order: "concentric-css",
				}),
			])
		)
		.pipe(sourcemap.write("."))
		.pipe(dest("dist/css"))
		.pipe(browserSync.stream());
};
export const sassTask = () => {
	return src(["src/components/_core/_**.sass", "src/components/_tailwind/*.sass" , "src/components/_core/**.sass", "src/components/_global/**.sass", "src/components/**/**.sass"])
		.pipe(sourcemap.init())
		.pipe(concat("main.min.sass"))
		.pipe(sass().on("error", sass.logError))
		.pipe(
			postcss([
				tailwindcss("./tailwind.config.js"),
				require("autoprefixer"),
				require("cssnano"),
				require("postcss-import"),
				cssSort({
					order: "concentric-css",
				}),
			])
		)
		.pipe(concat({ path: "main.min.css" }))
		.pipe(sourcemap.write("."))
		.pipe(dest("dist/css"))
		.pipe(browserSync.stream());
};

module.exports = { sassTask, tailwindTask };
