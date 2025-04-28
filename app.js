const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

        const canvasAspect = canvas.width / canvas.height;
        const videoAspect = video.videoWidth / video.videoHeight;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > canvasAspect) {
            drawHeight = canvas.height;
            drawWidth = video.videoWidth * (canvas.height / video.videoHeight);
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            drawWidth = canvas.width;
            drawHeight = video.videoHeight * (canvas.width / video.videoWidth);
            offsetY = (canvas.height - drawHeight) / 2;
        }

        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        context.fillStyle = "rgba(255, 0, 0, 0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height / 2);

        context.fillStyle = "rgba(0, 190, 255, 0.8)";
        context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }

    requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});

video.addEventListener("play", draw);

document.addEventListener("DOMContentLoaded", () => {
    startCamera();
    });
});
