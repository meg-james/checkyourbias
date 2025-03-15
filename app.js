const video = document.querySelector("video");
const filter =
    Math.random() < 0.5 ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 255, 0.5)";

navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((error) => {
        console.error("Error accessing the camera: ", error);
    });

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.style.height = window.innerHeight;
canvas.height = window.innerHeight;

const lastFilter = localStorage.getItem("filterColor");
let filter = lastFilter === "rgba(255, 0, 0, 0.75)" ? "rgba(0, 200, 255, 0.8)" : "rgba(255, 0, 0, 0.75)";

localStorage.setItem("filterColor", filter);

function updateLinkColor() {
    const link = document.querySelector("a");

    if (!link) return;

    const isRedFilter = filter === "rgba(255, 0, 0, 0.75)";
    
    link.style.color = isRedFilter ? "rgb(0, 200, 255)" : "rgb(255, 0, 0)";

    link.addEventListener("mousedown", () => {
        link.style.color = isRedFilter ? "rgb(255, 0, 0)" : "rgb(0, 200, 255)";
    });

    link.addEventListener("mouseup", () => {
        link.style.color = isRedFilter ? "rgb(0, 200, 255)" : "rgb(255, 0, 0)";
    });
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const canvasRatio = canvas.width / canvas.height;
    const videoRatio = video.videoWidth / video.videoHeight;

    if (videoRatio > canvasRatio) {
        const height = canvas.width / videoRatio;
        const y = (canvas.height - height) / 2;
        context.drawImage(video, 0, y, canvas.width, height);
        context.fillStyle = filter;
        context.fillRect(0, y, canvas.width, height);
    } else {
        const width = canvas.height * videoRatio;
        const x = (canvas.width - width) / 2;
        context.drawImage(video, x, 0, width, canvas.height);
        context.fillStyle = filter;
        context.fillRect(x, 0, width, canvas.height);
    }

    requestAnimationFrame(draw);
}

video.addEventListener("play", draw);
document.addEventListener("DOMContentLoaded", updateLinkColor);
