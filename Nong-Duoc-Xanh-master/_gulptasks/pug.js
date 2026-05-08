import { src, dest } from "gulp";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import { readFileSync } from "graceful-fs";
import cached from "gulp-cached";
import remember from "gulp-remember";
import postcss from "gulp-postcss";
export const pugTask = () => {
	let glob = JSON.parse(readFileSync("pages.json"));
	let switchAllFile = glob.all;
	let allPages = glob.pages
		.map(item => {
			if (item.enabled) {
				return `src/pages/${item.src}`;
			}
		})
		.filter(item => item !== undefined);
	return src(switchAllFile || allPages.length == 0 ? ["src/pages/*.pug", "!src/pages/_*.pug"] : allPages, {
		allowEmpty: true,
	})
		.pipe(
			pug({
				pretty: "\t",
			})
		)
		.pipe(plumber())
		.pipe(dest("dist"))
		.pipe(browserSync.stream());
};

module.exports = pugTask;
