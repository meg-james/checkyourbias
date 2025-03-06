const video = document.querySelector("video");
const filter =
    Math.random() < 0.5 ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 255, 0.5)";

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
