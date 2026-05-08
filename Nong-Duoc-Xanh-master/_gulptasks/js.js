import { src, dest } from "gulp";
import sourcemap from "gulp-sourcemaps";
import commonjs from "@rollup/plugin-commonjs";
import concat from 'gulp-concat'
import cached from "gulp-cached";
import remember from "gulp-remember";
var babel = require("rollup-plugin-babel");
const uglify = require("gulp-terser"); //To Minify JS files
var rollup = require("gulp-better-rollup");
var resolve = require("@rollup/plugin-node-resolve");
export const jsTask = () => {
	return src(["src/js/main.js"])
		.pipe(sourcemap.init())
		.pipe(
			rollup(
				{
					// There is no `input` option as rollup integrates into the gulp pipeline
					plugins: [babel(), commonjs(), resolve()],
				},
				{
					// Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
					format: "umd",
				}
			)
		)
		.pipe(concat({ path: "main.min.js" }))
		.pipe(
			uglify({
				toplevel: true,
				keep_fnames: true,
				sourceMap: true,
				keep_classnames: true,
				mangle: false,
			})
		)
		.pipe(sourcemap.write("."))
		.pipe(dest("dist/js"));
};

module.exports = jsTask;
