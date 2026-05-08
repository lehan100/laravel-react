import { src, dest } from "gulp";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { outputText } from "./server";

export const updatePagesTask = (done) => {
	const pagesPath = "src/pages";
	const pagesJsonPath = join("pages.json");

	const pagesJson = JSON.parse(readFileSync(pagesJsonPath, "utf-8"));
	const pages = pagesJson.pages || [];

	const files = readdirSync(pagesPath);

	for (const file of files) {
		if (file.endsWith(".pug") && file !== "_layout.pug") {
			const existingPage = pages.find(page => page.src === file);
			if (!existingPage) {
				pages.push({ enabled: false, src: file });
			}
		}
	}
	pagesJson.pages = pages;
	writeFileSync(pagesJsonPath, JSON.stringify(pagesJson, null, 2));
	outputText('Add File to Pages.json', `Added ${pages.length + 1 - pagesJson.pages.length} new pages to pages.json`)
	done()
};

module.exports = updatePagesTask;
