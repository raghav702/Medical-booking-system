import { supabase, auth, database } from './supabase-config.js';

let tablinks = document.getElementsByClassName('tab-links');
let tabcontents = document.getElementsByClassName('tab-contents');

function opentab(tabname) {
	for (const tablink of tablinks) {
		tablink.classList.remove("active-link")
	}
	for (const tabcontent of tabcontents) {
		tabcontent.classList.remove("active-tab")
	}
	event.currentTarget.classList.add("active-link");
	document.getElementById(tabname).classList.add("active-tab");
}



let sidemenu = document.getElementById('sidemenu');

function openmenu() {
	sidemenu.style.right = '0';
}
function closemenu() {
	sidemenu.style.right = '-200px';
}
function handleSubmit(event) {
	
	event.preventDefault();
	window.location.href = "index.html";
}

// Add event listener to the submit button
document.getElementById("submit-btn").addEventListener("click", handleSubmit)

function handleSubmit(event) {
	// Prevent the default form submission behavior
	event.preventDefault();
	
	// Redirect to the main file after form submission
	window.location.href = "index.html";
	
	// Show confirmation message
	document.getElementById("confirmation-message").style.display = "block";
}

// Add event listener to the submit button
document.getElementById("submit-btn").addEventListener("click", handleSubmit);