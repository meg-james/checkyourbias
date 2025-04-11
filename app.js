const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function draw() {
    if (video.readyState >= 2) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const videoRatio = video.videoWidth / video.videoHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (videoRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = videoRatio * canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = canvas.width / videoRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        // Draw the video first
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        // Then overlay the filters
        context.fillStyle = "rgba(255, 0, 0, 0.25)";
        context.fillRect(0, 0, canvas.width, canvas.height / 2);

        context.fillStyle = "rgba(0, 200, 255, 0.25)";
        context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }

    requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});

video.addEventListener("play", draw);
