const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();  

const lastFilter = localStorage.getItem("filterColor");
let filter = lastFilter === "rgba(255, 0, 0, 0.75)" ? "rgba(0, 200, 255, 0.8)" : "rgba(255, 0, 0, 0.75)";
localStorage.setItem("filterColor", filter);

function updateTextColor() {
    const isRedFilter = filter === "rgba(255, 0, 0, 0.75)";
    const textColor = isRedFilter ? "rgb(0, 200, 255)" : "rgb(255, 0, 0)";
    document.body.style.color = textColor;
}

function updateLinkColor() {
    const link = document.querySelector("a"); 
    if (!link) return; 

    const isRedFilter = filter === "rgba(
