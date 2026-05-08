import { series, parallel } from "gulp";

// Import tasks
import { server, buildFinish } from "./_gulptasks/server";
import pugTask from "./_gulptasks/pug";
import { sassTask } from "./_gulptasks/sass";
import jsCore from "./_gulptasks/core-js";
import cssCore from "./_gulptasks/core-css";
import { copyFonts, copyImage, copyFavicon } from "./_gulptasks/copy";
import { cleanDist } from "./_gulptasks/clean";
import updatePagesTask from "./_gulptasks/build-pages";
import jsTask from "./_gulptasks/js";
import {  transformHtml } from "./_gulptasks/xslt";

exports.core = series(cleanDist, parallel(jsCore, cssCore, copyImage, copyFonts, copyFavicon), buildFinish);

exports.pages = series(updatePagesTask);
exports.transformHtml = series(transformHtml);
exports.build = series(cleanDist, parallel(jsCore, cssCore, copyImage, copyFonts, copyFavicon), pugTask, sassTask, jsTask);
exports.default = series(cleanDist, parallel(jsCore, cssCore, copyImage, copyFonts, copyFavicon), pugTask, sassTask, jsTask, server);
