const { src, dest } = require("gulp");
const pug = require("gulp-pug");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const gulp = require("gulp");
const fs = require("fs");
const cheerio = require("cheerio");
const prettier = require("prettier");
const wrapXsltOpen =
	'<?xml version="1.0" encoding="utf-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"><xsl:output method="html" indent="yes"/><xsl:template match="/"><section></section></xsl:template></xsl:stylesheet>';
const listNodeXsltText = [
	{
		"x-title": "Title",
	},
	{
		"x-desc": "Description",
	},
	{
		"x-brief": "BriefContent",
	},
	{
		"x-sub-title": "SubTitle",
	},
	{
		"x-date": "CreatedDate",
	},
	{
		"x-created-date": "CreatedDate",
	},
	{
		"x-end-date": "EndDate",
	},
	{
		"x-module-title": "ModuleTitle",
	},
	{
		"x-full-content": "FullContent",
	},
	{
		"x-content": "Content",
	},
	{
		"x-zoneImg": "ZoneImage",
	},
	{
		"x-zoneTitle": "ZoneTitle",
	},
	{
		"x-zoneDesc": "ZoneDescription",
	},
];
function checkAttr($, ele, attr) {
	if ($(ele).attr(attr) !== undefined) return true;
}
function processElement($) {
	listNodeXsltText.map(item => {
		const key = Object.keys(item);
		const value = Object.values(item);
		$(`*[${key}]`).each((index, element) => {
			const tagName = element.tagName;
			const attrs = $(element).attr();
			delete attrs[`${key}`];
			const newElement = $(`<${tagName}>`).attr(attrs).html(`<xsl:value-of disable-output-escaping="yes" select="${value}"></xsl:value-of>`);
			$(element).replaceWith(newElement);
		});
	});
	$(`*[x-img]`).each((index, element) => {
		const tagName = element.tagName;
		const attrs = $(element).attr();
		const classImg = $(element).attr("class");
		delete attrs["x-img"];
		const newElement = `<img>
		<xsl:attribute name="data-src">
			<xsl:value-of select="ImageUrl"></xsl:value-of>
		</xsl:attribute>
		<xsl:attribute name="class">
		<xsl:text disable-output-escaping="yes">${classImg ? classImg : ""} lozad</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="Title"></xsl:value-of>
		</xsl:attribute>
		</img>`;
		$(element).replaceWith(newElement);
	});
	$(`*[x-src-img]`).each((index, element) => {
		const tagName = element.tagName;
		const attrs = $(element).attr();
		const urlImg = $(element).attr("src");
		const classImg = $(element).attr("class");
		const srcImg = "/Data/Sites/1/skins/default";
		delete attrs["x-src-img"];
		const newElement = `<img>
		<xsl:attribute name="data-src">
			<xsl:text disable-output-escaping="yes">${srcImg}${urlImg.slice(1)}</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="class">
			<xsl:text disable-output-escaping="yes">${classImg ? classImg : ""} lozad</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="Title"></xsl:value-of>
		</xsl:attribute>
		</img>`;
		$(element).replaceWith(newElement);
	});
	$(`*[x-link]`).each((index, element) => {
		const tagName = element.tagName;
		const attrs = $(element).attr();
		delete attrs["x-link"];
		$(element).prepend(`<xsl:attribute name="href">
					<xsl:value-of select="Url"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="Title"></xsl:value-of>
				</xsl:attribute>`);
	});
}
function checkDuplicateElement($, elements) {
	const seen = {};
	$(`.${elements}`).each(function (idx, ele) {
		if (idx > 0) $(ele).remove();
	});
}
export const transformHtml = done => {
	const files = fs.readdirSync("dist").filter(file => file.endsWith(".html"));
	files.forEach(file => {
		const inputHtml = fs.readFileSync(`dist/${file}`, "utf-8");
		const $ = cheerio.load(inputHtml);
		// Process 1: Handle Text
		processElement($);
		const outputFile = "xslt/" + file.replace(".html", ".xslt");
		const $xslt = cheerio.load(wrapXsltOpen, { xmlMode: true, decodeEntities: false });
		const outputXslt = $xslt("section").append($("main").html());
		// Process 2: Handle remove duplicate
		$xslt(`*[x-loop-item]`).each((index, element) => {
			const attrs = $xslt(element).attr("class");
			const attrsFirstElement = attrs.split(" ")[0];
			checkDuplicateElement($xslt, attrsFirstElement);
		});
		// Process 3: Handle Loop Item
		function handleLoopItem($element) {
			const $nestedLoopItem = $element.find("*[x-loop-item]");
			// if ($nestedLoopItem.length > 0) {
			// 	handleLoopItem($nestedLoopItem);
			// }
			// children
			// if ($nestedLoopItem.length > 0) {
			// console.log('2---',$nestedLoopItem.attr())
			// $nestedLoopItem.each(function (i, element) {
			// 	const $nestedEl = $xslt(element);
			// $nestedEl.replaceWith(`ELEMEMT`)
			// console.log("🚀 ~ file: xslt.js:163 ~ $nestedEl:", $nestedEl.html());
			// const nestedLoopAttr = $nestedEl.attr("x-loop-item");
			// const nestedTemplate = `<xsl:template match="${nestedLoopAttr}">${$xslt(element)}</xsl:template>`;
			// const xslNestedTemplate = $.parseHTML(nestedTemplate);
			// const $nestedParent = $nestedEl.parent()
			// console.log("🚀 ~ file: xslt.js:168 ~ nestedParent:", $nestedParent.html())
			// $nestedParent.replaceWith(`<xsl:apply-templates select="Product123123"></xsl:apply-templates>`);
			// $xslt("xsl\\:stylesheet").append(xslNestedTemplate);
			// });
			// }
			const attrs = $element.attr();
			const mode = $element.attr("x-loop-mode");
			const type = $element.attr("x-loop-item");
			//
			// delete attrs[`x-loop-item`];
			// delete attrs[`x-loop-mode`];
			//
			$element.attr(attrs); // Remove attr
			const newElement = `<xsl:template match="${type}" ${mode ? 'mode="' + mode + '"' : ""}>${$element}</xsl:template>`;
			// $xslt("xsl\\:stylesheet").append(newElement);
			$element.replaceWith(`<xsl:apply-templates select="${type}" ${mode ? 'mode="' + mode + '"' : ""}></xsl:apply-templates>`);
			return newElement;
		}
		$xslt(`*[x-loop-item]`).each((index, element) => {
			const $el = $xslt(element);
			const newsTemplate = handleLoopItem($el);
			// console.log("xxxxxxx-----------xxxxxxxx");
			// console.log("🚀 ~ file: xslt.js:176 ~ $xslt ~ newsTemplate:", newsTemplate);
			// console.log("xxxxxxx-----------xxxxxxxx");
			$xslt("xsl\\:stylesheet").append(newsTemplate);
		});
		// Process Final
		fs.writeFileSync(outputFile, $xslt.html());
	});
	done();
};

module.exports = { transformHtml };
