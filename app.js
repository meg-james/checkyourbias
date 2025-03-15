const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}

// Resize canvas on load and when window resizes
window.addEventListener("resize", resizeCanvas);
resizeCanvas();  // Initial call

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

async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: "environment" }, // Prefer rear camera but fallback if unavailable
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // Important for iOS
        video.play();
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function draw() {
    if (video.readyState >= 2) { 
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const videoRatio = video.videoWidth / video.videoHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        // Scale the video to completely fill the canvas (crop excess)
        if (videoRatio > canvasRatio) {
            // Video is wider than canvas, crop width
            drawHeight = canvas.height;
            drawWidth = video.videoWidth * (canvas.height / video.videoHeight);
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Video is taller than canvas, crop height
            drawWidth = canvas.width;
            drawHeight = video.videoHeight * (canvas.width / video.videoWidth);
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        context.fillStyle = filter;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
    updateLinkColor();
    startCamera();
});

video.addEventListener("play", draw);
