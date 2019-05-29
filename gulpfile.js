let gulp = require("gulp");
let PluginError = require("plugin-error");
let log = require("fancy-log");
let webpack = require("webpack");

let setProduction = done => {
	process.env.NODE_ENV = "production";
	done();
};

let setDev = done => {
	process.env.NODE_ENV = "development";
	done();
};

function webpackOnBuild(done) {
	let start = Date.now();
	return function(err, stats) {
		if (err) {
			throw new PluginError("webpack", err);
		}
		log(
			"[webpack]",
			stats.toString({
				colors: true
			})
		);
		let end = Date.now();
		log("Build Completed, running for " + (end - start) / 1000) + "s";
		if (done) {
			done(err);
		}
	};
}

let doWebpack = cb => {
	let webpackConfig = require("./webpack.config.js");
	webpack(webpackConfig).run(webpackOnBuild(cb));
};

let watch = () => {
	let webpackConfig = require("./webpack.config.js");
	webpack(webpackConfig).watch(300, webpackOnBuild());
};


const buildDev = gulp.series(setDev, doWebpack);
const devSlow = gulp.series(setDev, doWebpack, watch);

// TODO add step in series to build node_modules/4dn-metadata-tool-react/src to node_modules/4dn-metadata-tool-react/dist maybe
const buildInternal = gulp.series(setProduction, doWebpack);
const build = gulp.series(buildInternal, done => {
	/* todo */
	done();
});

gulp.task("dev", devSlow);
gulp.task("build-internal", buildInternal);
gulp.task("build", build);
gulp.task("build-dev", buildDev);

