import Selecteur from "./Selecteur.js";

export default class App {
	static main() {
		this.app = document.getElementById("app");
		Selecteur.main();
	}
	static load() {
		return new Promise(resolve => {
			window.addEventListener("load", e => {
				resolve(e);
			});
		});
	}
//    static init() {
//	}

}
//App.init();
