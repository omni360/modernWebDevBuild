"use strict";

import utils from "./utils";
import path from "path";

let extensions = {
    javascript: ".js",
    typescript: ".{ts,tsx}",
    css: ".css",
    sass: ".scss",
    html: ".html",
    sourcemap: ".map",
    png: ".png",
    jpg: ".jpg",
    jpeg: ".jpeg",
    gif: ".gif",
    svg: ".svg"
};

let folders = {
    root: ".",
    dist: "./dist",
    temp: "./.tmp",
    app: "./app",
    styles: "./styles",
    scripts: "./scripts",
    images: "./images",
    typings: "./typings",
    nodeModules: "./node_modules",
    jspmPackages: "./jspm_packages"
};

let globs = {
    any: "/**/*",
    scripts: {
        javascript: "/**/*" + extensions.javascript,
        typescript: "/**/*" + extensions.typescript
    },
    styles: {
        css: "/**/*" + extensions.css,
        sass: "/**/*" + extensions.sass,
        vendor: path.join(folders.styles, "/vendor" + "{" + extensions.sass + "," + extensions.css + "}")
    },
    images: path.join(folders.images, "/**/*" + "{" + extensions.png + "," + extensions.jpg + "," + extensions.jpeg + "," + extensions.gif + "," + extensions.svg + "}"),
    html: "/**/*" + extensions.html,
    sourcemaps: "/**/*" + extensions.sourcemap
};

let ignore = {
    scripts: {
        javascript: ["/node_modules/**/*" + extensions.javascript,
                    "/jspm_packages/**/*" + extensions.javascript],
        typescript: ["node_modules/**/*" + extensions.typescript,
                    "jspm_packages/**/*" + extensions.typescript]
    },
    styles: {
        css: ["/node_modules/**/*" + extensions.css,
            "/jspm_packages/**/*" + extensions.css],
        sass: ["node_modules/**/*" + extensions.sass,
            "jspm_packages/**/*" + extensions.sass]
    },
    images: {
        png: ["/node_modules/**/*" + extensions.png,
            "/jspm_packages/**/*" + extensions.png],
        jpg: ["node_modules/**/*" + extensions.jpg,
            "jspm_packages/**/*" + extensions.jpg],
        jpeg: ["node_modules/**/*" + extensions.jpeg,
            "jspm_packages/**/*" + extensions.jpeg],
        svg: ["node_modules/**/*" + extensions.svg,
            "jspm_packages/**/*" + extensions.svg],
        gif: ["node_modules/**/*" + extensions.gif,
            "jspm_packages/**/*" + extensions.gif]
        },
    html: {
        html: ["/node_modules/**/*" + extensions.html,
            "/jspm_packages/**/*" + extensions.html]
    },
    sourcemaps: {
        css: ["/node_modules/**/*" + extensions.sourcemap,
            "/jspm_packages/**/*" + extensions.sourcemap]
    } 
};

let files = {
    any: "*",
    packageJSON: path.join(folders.root, "/package.json"),
    typeScriptDefinitions: path.join(folders.typings, globs.scripts.typescript),
    systemjsConfigDefault: "jspm.conf.js"
};

let webServerFolders = {
    dev: [
        // the order IS important. Folders above have precedence
        folders.root, // necessary to have jspm_packages & jspm config file without needing a copy step
        folders.temp, // before app so that ES5 code emitted by TypeScript/Babel takes precedence over ES2015 code that might be written in the app folder
        folders.app
    ],
    dist: [
        folders.dist
    ]
};

let webServerNames = {
    dev: "MDW_DEV",
    dist: "MDW_DIST"
};

let finalJsBundleName = "bundle.min.js";

let javascript = {
    src: [
        path.join(folders.app, globs.scripts.javascript)
    ],
    srcDist: path.join(folders.temp, "/core/boot.js"),
    dest: folders.temp,
    destDist: path.join(folders.dist, "/" + finalJsBundleName),
    finalJsBundlePath: finalJsBundleName
};

let typescript = {
    srcAppOnly: [
        path.join(folders.app, globs.scripts.typescript)
    ],
    dest: folders.temp // JavaScript code is emitted in the temp folder
};

let finalCSSBundleName = "bundle.min.css";
let finalCSSVendorBundleName = "vendor.min.css";

let styles = {
    src: [
        path.join(folders.app, globs.styles.css),
        path.join(folders.app, globs.styles.sass)
    ],
    srcVendorOnly: [
        path.join(folders.app, globs.styles.vendor)
    ],
    srcWithoutVendor: [
        path.join(folders.app, globs.styles.css),
        path.join(folders.app, globs.styles.sass),
        utils.exclude(path.join(folders.app, globs.styles.vendor))
    ],
    dest: folders.temp, // for DEV
    destFiles: path.join(folders.temp, globs.styles.css), // for DEV
    destDist: folders.dist, // for PROD
    finalCssBundleFilename: finalCSSBundleName,
    finalCssBundlePath: finalCSSBundleName,
    finalVendorCssBundleFilename: finalCSSVendorBundleName,
    finalVendorCssBundlePath: finalCSSVendorBundleName
};

let images = {
    src: [
        path.join(folders.app, globs.images)
    ],
    dest: path.join(folders.dist, folders.images)
};

let html = {
    src: [
        path.join(folders.app, globs.html)
    ],
    dest: folders.dist
};

let copy = {
    src: [
        path.join(folders.app, globs.any),

        // ignore stuff handled by the other tasks
        utils.exclude(path.join(folders.app, globs.html)),
        utils.exclude(path.join(folders.app, globs.styles.css)),
        utils.exclude(path.join(folders.app, globs.styles.sass)),
        utils.exclude(path.join(folders.app, globs.scripts.javascript)),
        utils.exclude(path.join(folders.app, globs.scripts.typescript))
    ],
    dest: folders.dist
};

let autoprefixerBrowsers = [
    "ie >= 10",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.4",
    "bb >= 10"
];

let minifyCss = { // https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
    keepBreaks: false, // no problem here
    keepSpecialComments: true, // necessary for licensing
    compatibility: false, // no problem here
    aggressiveMerging: false // necessary because it breaks PureCSS
};

export default {
    extensions,
    folders,
    globs,
    ignore,
    files,
    javascript,
    typescript,
    styles,
    images,
    html,
    copy,
    autoprefixerBrowsers,
    minifyCss,
    webServerFolders,
    webServerNames
};
