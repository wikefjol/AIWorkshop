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
		client: {start:"_app/immutable/entry/start.B1FnnjHp.js",app:"_app/immutable/entry/app.CXJ_c6cj.js",imports:["_app/immutable/entry/start.B1FnnjHp.js","_app/immutable/chunks/Bwn3sata.js","_app/immutable/chunks/C8oEvsXm.js","_app/immutable/chunks/g4JUmOY2.js","_app/immutable/entry/app.CXJ_c6cj.js","_app/immutable/chunks/C8oEvsXm.js","_app/immutable/chunks/DfMfRLAo.js","_app/immutable/chunks/1_NKFSDZ.js","_app/immutable/chunks/g4JUmOY2.js","_app/immutable/chunks/B4aH6oH-.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CMBzqSWW.js')),
			__memo(() => import('./chunks/1-jvXEf6ek.js')),
			__memo(() => import('./chunks/2-Bzf6wMeC.js')),
			__memo(() => import('./chunks/3-l6yCKXOl.js')),
			__memo(() => import('./chunks/4-CHORytCu.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-BfaRJinS.js'))
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
