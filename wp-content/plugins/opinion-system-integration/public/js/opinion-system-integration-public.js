// (function( $ ) {
// 	'use strict';

// 	/**
// 	 * All of the code for your public-facing JavaScript source
// 	 * should reside in this file.
// 	 *
// 	 * Note: It has been assumed you will write jQuery code here, so the
// 	 * $ function reference has been prepared for usage within the scope
// 	 * of this function.
// 	 *
// 	 * This enables you to define handlers, for when the DOM is ready:
// 	 *
// 	 * $(function() {
// 	 *
// 	 * });
// 	 *
// 	 * When the window is loaded:
// 	 *
// 	 * $( window ).load(function() {
// 	 *
// 	 * });
// 	 *
// 	 * ...and/or other possibilities.
// 	 *
// 	 * Ideally, it is not considered best practise to attach more than a
// 	 * single DOM-ready or window-load handler for a particular page.
// 	 * Although scripts in the WordPress core, Plugins and Themes may be
// 	 * practising this, we should strive to set a better example in our own work.
// 	 */

// })( jQuery );



document.addEventListener("DOMContentLoaded", function() {
	
// console.log("Coucou");
// console.log(document.getElementById("preview"));
	if(document.getElementById("preview") != null) {
		console.log("Le preview n'est pas null");
		// // -----------------
		// // FETCHING datas via proxy.php
		// // -----------------
		const preview = document.getElementById("preview");
	
	
		// console.log(preview);
		

		// Change this to not show 
		const proxy = "http://localhost/wordpress/wp-content/plugins/opinion-system-integration/proxy.php?action=reviews";
	
		const timeout = 15000;
	
		const promise = fetch(proxy);
	
		const timeoutPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error("La requête a expiré"));
			}, timeout);
		});
	
	
		Promise.race([promise, timeoutPromise])
		.then(response => {
			// console.log("Réponse API");
			return response.json();
			
		})
		.then(data => {
			if(data.error === true) {
				console.log(data.error);
				preview.innerHTML = data.message;
			} else {
				// console.log(data);
				preview.innerHTML = data.html;
	
			}
			
			return data;
	
		})
		.then(data => {
			// link js to data
			if(data.error != true) {
				mountJavaScriptAccordion();
			}
		})
		.catch(error => {
			console.error(error);
			// ne marche pas vraiment car est affiché même quand la clé API n'est pas bonne
			preview.innerHTML = "<p>Service indisponible actuellement, veuillez réessayer plus tard.<br/><a href='https://www.opinionsystem.fr/fr-fr/certificate/2002'>Vous pouvez consulter tous les avis en cliquant sur ce lien.</a></p>";
		});

	} // fin du if preview != null
	
	
	
	
	
	mountJavaScriptAccordion();

	function mountJavaScriptAccordion () {

		const detailsBtns = document.querySelectorAll(".btn-details-accordion");
		// console.log(detailsBtns);
		
		// 
		detailsBtns.forEach(function(btn){
			btn.addEventListener("click", function (e) {

				const detailsAccordion  = document.querySelector(`[id='${btn.dataset.survey}'] .details-accordion`);
				if(detailsAccordion.classList.contains('show-details-accordion')) {
					detailsAccordion.classList.remove('show-details-accordion');
					// detailsAccordion.style.maxHeight = null;
				} else {
					detailsAccordion.classList.add('show-details-accordion');
					// detailsAccordion.style.maxHeight = `${detailsAccordion.scrollHeight}px`;
				}


				// animate rating and recommandation progress bars
				document.querySelector(`#rating-circle-${btn.dataset.survey}`).style.animation = "progress 1s ease-out forwards";
				document.querySelector(`#recommandation-circle-${btn.dataset.survey}`).style.animation = "progress 1s ease-out forwards";


				// animate all questions progress bars 
				document.querySelectorAll(`[id='${btn.dataset.survey}'] .details-accordion .progress-content`).forEach(progressbar => {
					progressbar.style.animation = "fill 1s ease-out forwards";
				});

				// ajouter au click ici l'ajout de la classe css qui permet de remplir les progressbar
				// ajouter le remplissage des valeurs, 
				// mettre du texte alternatif pour montrer tout de même les notes

			});
		}); // endforeach detailsBtns
	} // end of mountAccordion function




})
