import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { i18n } from "./utils/helpers"
import "./styles/index.sass";

// import Vue plugin
import VueSvgInlinePlugin from "vue-svg-inline-plugin";

// use Vue plugin without options
Vue.use(VueSvgInlinePlugin);

// use Vue plugin with options
VueSvgInlinePlugin.install(Vue, {
	attributes: {
		data: ["src"],
		remove: ["alt"]
	}
});

new Vue({
	el: "#app",
	router,
	i18n,
	render: h => h(App)
});
