export default class Selecteur {
	constructor(niveau) {
		niveau = parseInt(niveau) || (this.alea(3) + 1);
		this.niveau = niveau;
		this.contenu = this.composer(niveau);
	}
	static main() {
		this.domaine = document.querySelector("#app > .body");
		this.domaine.appendChild(this.creerForm());
	}
	static creerForm() {
		var resultat = document.createElement("form");
		resultat.addEventListener("submit", e => {
			e.preventDefault();
			e.stopImmediatePropagation();
			return false;
		});
		resultat.appendChild(this.options());
		resultat.appendChild(this.html_affichage());
		return resultat;
	}
	static html_affichage() {
		var resultat = document.createElement("div");
		resultat.setAttribute("id", "affichage");
		return resultat;
	}
	static options() {
		var resultat = document.createElement("div");
		resultat.classList.add("options");
		resultat.appendChild(this.fieldset_modes());
		resultat.appendChild(this.fieldset_actions());
		return resultat;
	}
	static fieldset_actions() {
		var fieldset = document.createElement("fieldset");
		fieldset.classList.add("actions");
		var legend = fieldset.appendChild(document.createElement("legend"));
		legend.appendChild(document.createTextNode("Niveau de difficulté"));
		var div = fieldset.appendChild(document.createElement("div"));
		for (let k in this.actions) {
			div.appendChild(this.dom_action(k, this.actions[k]));
		}
		return fieldset;
	}

	static fieldset_modes() {
		var fieldset = document.createElement("fieldset");
		fieldset.classList.add("modes");
		var legend = fieldset.appendChild(document.createElement("legend"));
		legend.appendChild(document.createTextNode("Type de recherche"));
		var div = fieldset.appendChild(document.createElement("div"));
		for (let k in this.modes) {
			div.appendChild(this.dom_radio("mode", k, this.modes[k]));
		}
		div.querySelector("input[value=alea]").checked = true;
		return fieldset;
	}

	static dom_radio(name, value, etiquette) {
		var resultat = document.createElement("span");
		resultat.classList.add("bouton");
		var input = resultat.appendChild(document.createElement("input"));
		const id = name + "_" + value;
		input.setAttribute("type", "radio");
		input.setAttribute("name", name);
		input.setAttribute("value", value);
		input.setAttribute("id", id);
		var label = resultat.appendChild(document.createElement("label"));
		label.setAttribute("for", id);
		label.appendChild(document.createTextNode(etiquette));
		return resultat;
	}
	static dom_action(id, action) {
		var resultat = document.createElement("span");
		var label = resultat.appendChild(document.createElement("label"));
		resultat.classList.add("bouton");
		resultat.setAttribute("id", "action_"+id)
		label.appendChild(document.createTextNode(action.label));
		resultat.addEventListener("click", action.handler);
		window.addEventListener("keydown", e => {
			// console.log(e);
			if (e.key === action.accesskey) {
				action.handler(e);
			}
		});
		return resultat;
	}
    composer(niveau) {
        var resultat;
		var ops = ["  ", " > ", ", ", " + ", " ~ "];
        resultat = "";
        if (niveau === 1) {
			return this.composerBalise();
		} else if (niveau === 2) {
			resultat += this.composer(1);
			while (Selecteur.calculerComplexite(resultat) < (this.alea(3) + 2)) {
				let op = this.alea(ops);
				resultat += op + this.composer(1);
			}
			return resultat;
		} else if (niveau === 3) {
			resultat += this.composer(1);
			while (Selecteur.calculerComplexite(resultat) < (this.alea(6) + 10)) {
				let op = this.alea(ops);
				resultat += op + this.composer(1);
			}
        	return resultat;
		}
    }
    composerBalise() {
        var resultat, chances;
        resultat = "";
        if (this.alea(4) > 0) {	// On met une balise
            resultat += this.alea(this.balises).nom;
        }
        if (this.alea(6) > 0) {	// On choisit entre une balise et un id
            chances = 3;
            while (this.alea(chances) === 0) {
                resultat += "." + this.alea(this.classes).nom;
                chances *= 2;
            }
        } else {
            resultat += "#" + this.alea(this.ids).nom;
        }
        if (resultat === "") {
            return this.composerBalise();
        }
        return resultat;
    }
    get signification() {
        var resultat;
		resultat = Selecteur.traduire(this.contenu);
        return resultat;
    }
    static traduire(selecteur) {
        var selecteur2, resultat, i, n;
        selecteur = selecteur.replace(/, +/g, ",");
        selecteur2 = selecteur.split(",");
        resultat = [];
        for (i = 0, n = selecteur2.length; i < n; i += 1) {
            resultat.push(this.traduireImbrique(selecteur2[i]));
        }
        resultat = resultat.join(' <span class="separateur ainsi">ainsi que</span> ');
        return resultat.slice(0, 1).toUpperCase() + resultat.slice(1);
    }
    static traduireImbrique(selecteur) {
        var selecteur2, resultat, i, separateurs;
        selecteur = selecteur.replace(/ +/g, " ");
        selecteur2 = selecteur.split(/ *\> *| *\+ *| *\~ *| +/g);
        separateurs = selecteur.match(/ *\> *| *\+ *| *\~ *| +/g);
        resultat = [];
        for (i = selecteur2.length - 1; i > 0; i -= 1) {
            resultat.push(this.traduireSimple(selecteur2[i]));
			if (separateurs[i - 1].match(/^ *> *$/)) {
				resultat.push(' <span class="separateur parent">dont le parent est</span> ');
			} else if (separateurs[i - 1].match(/^ *\+ *$/)) {
				resultat.push(' <span class="separateur suivant">précédée immédiatement par</span> ');
			} else if (separateurs[i - 1].match(/^ *\~ *$/)) {
				resultat.push(' <span class="separateur frere">se trouvant après</span> ');
			} else {
				resultat.push(' <span class="separateur imbrique">se trouvant dans</span> ');
			}
        }
        resultat.push(this.traduireSimple(selecteur2[i]));
        return resultat.join("");
    }
    static traduireSimple(selecteur) {
        var resultat, selecteur2, nom, dernier;
        resultat = "";
        selecteur2 = selecteur.split("#");
        if (selecteur2.length > 1) {
            resultat = "n'importe quelle balise";
            if (selecteur2[0] !== "" && selecteur2[0] !== "*") {
                resultat = 'la balise <span class="balise">&lt;' + selecteur2[0] + '&gt;</span>';
            }
            resultat += " ayant le id «" + selecteur2[1] + "»";
        } else {
            selecteur2 = selecteur2[0].split(".");
            nom = selecteur2.shift();
            if (nom === "" || nom === "*") {
                resultat = "une balise";
            } else {
//                resultat = "une balise &lt;" + nom + "&gt;";
                resultat = 'une balise <span class="balise">&lt;' + nom + '&gt;</span>';
            }
            if (selecteur2.length > 0) {
                if (selecteur2.length === 1) {
                    resultat += " ayant la classe «" + selecteur2[0] + "»";
                } else {
                    dernier = selecteur2.pop();
                    resultat += " ayant les classes «" + selecteur2.join("», «") + "» et «" + dernier + "»";
                }
            }
        }
        return resultat;
    }
	get specificite() {
        return Selecteur.calculerSpecificite(this.contenu);
    }
	get complexite() {
        return Selecteur.calculerComplexite(this.contenu);
    }
	static compter(txt, x) {
		var resultat;
		resultat = txt.match(x);
		if (resultat) {
			return resultat.length;
		} else {
			return 0;
		}
    }
	static calculerSpecificite(selecteur) {
		var resultat = 0, x;
		// traiter les :not
		x = /\:not\(([^\)]*)\)/gi;
		selecteur = selecteur.replace(x, " $1");

		// traiter les ()
		x = /\(([^\)]*)\)/gi;
		selecteur = selecteur.replace(x, "");

		// Les attributs
		x = /\[[^\]]+\]/gi;
		resultat += this.compter(selecteur, x) * 10;
		selecteur = selecteur.replace(x, "");

		// Les id
		x = /\#[a-z0-9\-\_]+/gi;
		resultat += this.compter(selecteur, x) * 100;
		selecteur = selecteur.replace(x, "");

		// Les classes
		x = /\.[a-z0-9\-\_]+/gi;
		resultat += this.compter(selecteur, x) * 10;
		selecteur = selecteur.replace(x, "");

		// Les pseudo-elements
		x = /\:\:?(?:after|before|cue|first\-letter|first\-line|selection)/gi;
		resultat += this.compter(selecteur, x) * 1;
		selecteur = selecteur.replace(x, "");

		// Les pseudo-classes
		x = /\:[a-z0-9\-]+/gi;
		resultat += this.compter(selecteur, x) * 10;
		selecteur = selecteur.replace(x, "");

		// Les types
		x = /[a-z0-9\-]+/gi;
		resultat += this.compter(selecteur, x) * 1;
		selecteur = selecteur.replace(x, "");

		return resultat;
    }
	static calculerComplexite(selecteur) {
		var resultat = 0, x;
		// traiter les :not
		x = /\:not\(([^\)]*)\)/gi;
		selecteur = selecteur.replace(x, ":not $1 ");

		// traiter les ()
		x = /\(([^\)]*)\)/gi;
		selecteur = selecteur.replace(x, "");

		// Les attributs
		x = /\[[^\]]+\]/gi;
		resultat += this.compter(selecteur, x);
		selecteur = selecteur.replace(x, "");

		// Les id, les classes, les pseudo-classes, les pseudo-elements
		x = /[\#\.\:]+[a-z0-9\-\_]+/gi;
		resultat += this.compter(selecteur, x);
		selecteur = selecteur.replace(x, "");

		// Les types
		x = /[a-z0-9\-\_]+/gi;
		resultat += this.compter(selecteur, x);
		selecteur = selecteur.replace(x, "");

		return resultat;
    }
	static init() {
		this.modes = {
			selecteur: "Trouver le sélecteur",
			signification: "Trouver la signification",
			alea: "Surprise",
		};
		this.actions = {
			facile: {label: "Facile", accesskey: "1", handler: () => {
				return Selecteur.afficherQuestion(1);
			}},
			moyen: {label: "Moyen", accesskey: "2", handler: () => {
				return Selecteur.afficherQuestion(2);
			}},
			difficile: {label: "Difficile", accesskey: "3", handler: () => {
				return Selecteur.afficherQuestion(3);
			}},
			surprise: {label: "Surprise", accesskey: "0", handler: () => {
				return Selecteur.afficherQuestion(0);
			}},
		};
		this.prototype.balises = [
			{nom: "*"}, {nom: "td"}, {nom: "div"}, {nom: "span"}, {nom: "strong"},
			{nom: "em"}, {nom: "p"}, {nom: "li"}, {nom: "ol"}, {nom: "table"}, {nom: "h1"},
			{nom: "h2"}, {nom: "h3"}, {nom: "header"}, {nom: "footer"}, {nom: "section"},
			{nom: "article"}, {nom: "nav"}, {nom: "aside"}
		];
		this.prototype.classes = [
			{nom: "important"}, {nom: "gauche"}, {nom: "publicite"}, {nom: "contenu"},
			{nom: "droite"}, {nom: "haut"}, {nom: "bas"}, {nom: "entete"}, {nom: "pied"},
			{nom: "portrait"}, {nom: "section"}
		];
		this.prototype.ids = [
			{nom: "courant"}, {nom: "interface"}, {nom: "menu"}, {nom: "a208g32"},
			{nom: "nom"}, {nom: "prenom"}, {nom: "formulaire"}, {nom: "recherche"},
			{nom: "gauche"}, {nom: "droite"}, {nom: "entete"}, {nom: "pied"}, {nom: "principal"}
		];
		this.prototype.pseudoclasses = [
			{nom: "first-child"}, {nom: "last-child"}, {nom: "hover"}, {nom: "link"},
			{nom: "active"}, {nom: "visited"}, {nom: "empty"}, {nom: "enabled"}, {nom: "disabled"},
			{nom: "checked"}, {nom: "first-of-type"}, {nom: "last-of-type"}, {nom: "focus"},
			{nom: "in-range"}, {nom: "out-of-range"}, {nom: "valid"}, {nom: "invalid"},
			{nom: "lang(language)"}, {nom: "not(selector)"}, {nom: "nth-child(n)"},
			{nom: "nth-last-child(n)"}, {nom: "nth-last-of-type(n)"}, {nom: "nth-of-type(n)"},
			{nom: "only-of-type"}, {nom: "only-child"}, {nom: "optional"}, {nom: "out-of-range"},
			{nom: "read-only"}, {nom: "read-write"}, {nom: "required"}, {nom: "root"},
			{nom: "target"}, {nom: "visited"}];
		this.prototype.pseudoelements = [
			{nom: "before"}, {nom: "after"},
			{nom: "first-letter"}, {nom: "first-line"},
			{nom: "selection"}
		];
		this.prototype.attributs = [
			{nom: "src"}, {nom: "href"}, {nom: "target"}, {nom: "width"}, {nom: "height"},
			{nom: "title"}, {nom: "class"}, {nom: "id"}, {nom: "alt"}, {nom: "start"},
			{nom: "value"}, {nom: "colspan"}, {nom: "rowspan"}
		];
		this.prototype.operateurs = [
			{nom: "="}, {nom: "~="}, {nom: "!="}, {nom: "^="}, {nom: "$="}, {nom: "*="}
		];
		this.prototype.separateurs = [
			{nom: " "}, {nom: ">"}, {nom: "+"}, {nom: "~"}, {nom: ","}
		];
	}
    alea(sujet) {
        if (sujet instanceof Array) {
        	return sujet[this.alea(sujet.length)];
		} else {
			return Math.floor(Math.random() * sujet);
		}
	}
	static question() {
		var resultat = document.createElement("div");
		resultat.setAttribute("id", "question");
		var cellSelecteur = resultat.appendChild(document.createElement("div"));
		cellSelecteur.classList.add("reponse");
		cellSelecteur.classList.add("selecteur");
		cellSelecteur.setAttribute("id", "selecteur");
		var label = cellSelecteur.appendChild(document.createElement("div"));
		label.classList.add("label");
		var span = label.appendChild(document.createElement("span"));
		span.innerHTML = "Sélecteur";
		resultat.selecteur = cellSelecteur.appendChild(document.createElement("div"));
		var cellSignification = resultat.appendChild(document.createElement("div"));
		cellSignification.classList.add("reponse");
		cellSignification.classList.add("signification");
		cellSignification.setAttribute("id", "signification");
		var label = cellSignification.appendChild(document.createElement("div"));
		label.classList.add("label");
		var span = label.appendChild(document.createElement("span"));
		span.innerHTML = "Signification";
		resultat.signification = cellSignification.appendChild(document.createElement("div"));
		return resultat;
	}
    static afficherQuestion(niveau) {
		var question, mode;
		var affichage = document.getElementById("affichage");
		affichage.innerHTML = "";
		question = affichage.appendChild(this.question());
		if (document.getElementById("mode_selecteur").checked === true) {
			mode = 0;
		} else if (document.getElementById("mode_signification").checked === true) {
			mode = 1;
		} else {
			mode = this.prototype.alea(2);//TODO
		}
		question.obj = new Selecteur(niveau);
		if (mode === 1) {
			question.selecteur.innerHTML = question.obj.contenu;
		} else {
			question.signification.innerHTML = question.obj.signification;
		}
		
		var button = question.appendChild(document.createElement("button"));
		button.setAttribute("for", "solution");
		button.innerHTML = "Voir la solution";
		button.addEventListener("click", this.afficherSolution);
    }
    static afficherSolution() {
        var question;
        question = document.getElementById("question");
		question.selecteur.innerHTML = question.obj.contenu;
		question.signification.innerHTML = question.obj.signification;
	}
}
Selecteur.init();
