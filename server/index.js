const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

const app = express();
app.use(express.json());
app.use(compression());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));

// app.post("/sign", (req, res) => {
// 	console.log(req.body);
// 	return null;
// });

app.all(
	"*",
	MODE === "production"
		? createRequestHandler({
				build: require("./build"),
				getLoadContext(req) {
					return { signedRequest: req.body?.signed_request };
				},
		  })
		: (req, res, next) => {
				purgeRequireCache();
				const build = require("./build");
				return createRequestHandler({
					build,
					getLoadContext(req) {
						return { signedRequest: req.body?.signed_request };
					},
					mode: MODE,
				})(req, res, next);
		  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, we prefer the DX of this though, so we've included it
	// for you by default
	for (const key in require.cache) {
		if (key.startsWith(BUILD_DIR)) {
			delete require.cache[key];
		}
	}
}
