const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Bd0HBb9_.js",app:"_app/immutable/entry/app.CQA1zYdC.js",imports:["_app/immutable/entry/start.Bd0HBb9_.js","_app/immutable/chunks/UlR_BouR.js","_app/immutable/chunks/C8oEvsXm.js","_app/immutable/chunks/g4JUmOY2.js","_app/immutable/entry/app.CQA1zYdC.js","_app/immutable/chunks/C8oEvsXm.js","_app/immutable/chunks/DfMfRLAo.js","_app/immutable/chunks/1_NKFSDZ.js","_app/immutable/chunks/g4JUmOY2.js","_app/immutable/chunks/B4aH6oH-.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-2UzLBR4O.js')),
			__memo(() => import('./chunks/1-DHpLnqKt.js')),
			__memo(() => import('./chunks/2-DuCQMNHb.js')),
			__memo(() => import('./chunks/3-l6yCKXOl.js')),
			__memo(() => import('./chunks/4-CNLP7tIf.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/subscriptions",
				pattern: /^\/api\/subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Bkl3oegR.js'))
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/subscriptions",
				pattern: /^\/subscriptions\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
