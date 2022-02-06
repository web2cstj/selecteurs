import Selecteur from "./Selecteur.js";

export default class App {
	static main() {
		this.app = document.getElementById("app");
		Selecteur.main();
		affichage.classList.add("cacher-smiley");
		App.changerEmo();
		setInterval(() => {
			App.changerEmo();
		}, 5000);
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
	static async changerEmo(emo) {
		var smileys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%'#&_(),.;:?!\\<>[]`^";
		if (!emo) {
			var idx = Math.floor(Math.random() * smileys.length);
			var emo = smileys[idx];
		} else if (typeof emo === "number") {
			var emo = smileys[emo];
		}
		const affichage = document.getElementById("affichage");
		if (!affichage.classList.contains("cacher-smiley")) {
			affichage.classList.add("cacher-smiley");
			await new Promise(resolve => {
				affichage.addEventListener("transitionend", async e => {
					resolve();
				}, { once: true });
			});
		}
		console.log();
		document.documentElement.style.setProperty("--smiley", `"${emo}"`);
		affichage.classList.remove("cacher-smiley");
	}
}
//App.init();
