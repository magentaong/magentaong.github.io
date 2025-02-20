gsap.registerPlugin(Draggable);

// Function to generate random color
function getRandomColor() {
    const colors = ["#FFA500", "#FF4500", "#FFD700", "#00FFFF", "#00FF00", "#FF69B4"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to create a single ball
function createBall() {
    const container = document.getElementById("ball-container");
    if (!container) return;

    let ball = document.createElement("div");
    ball.classList.add("drag-ball");
    ball.style.background = `radial-gradient(circle, ${getRandomColor()} 0%, rgba(255,102,0,1) 100%)`;
    ball.style.boxShadow = `0 0 20px ${getRandomColor()}, 0 0 50px ${getRandomColor()}`;
    ball.style.width = `${40 + Math.random() * 60}px`; // Random size
    ball.style.height = ball.style.width;
    ball.style.top = `${Math.random() * window.innerHeight}px`;
    ball.style.left = `${Math.random() * window.innerWidth}px`;

    container.appendChild(ball);
    randomFloat(ball); // Make it float
    makeDraggable(ball); // Make it draggable
}

// Function to create multiple balls
function createBalls(count) {
    for (let i = 0; i < count; i++) {
        createBall();
    }
}

// Function to randomize floating movement
function randomFloat(ball) {
    let randomX = (Math.random() - 0.5) * 400; 
    let randomY = (Math.random() - 0.5) * 400;

    gsap.to(ball, {
        x: `+=${randomX}`,
        y: `+=${randomY}`,
        duration: 2 + Math.random() * 2, 
        ease: "power1.inOut",
        onComplete: () => randomFloat(ball) // Loop forever
    });
}

// Function to make a ball draggable
function makeDraggable(ball) {
    Draggable.create(ball, {
        type: "x,y",
        bounds: "body",
        inertia: true,
        onPress: () => gsap.killTweensOf(ball), // Stop floating when dragged
        onRelease: () => randomFloat(ball) // Resume floating when released
    });

    // Hover effect to make it glow
    ball.addEventListener("mouseenter", () => {
        gsap.to(ball, { scale: 1.2, duration: 0.3, ease: "power1.out" });
    });

    ball.addEventListener("mouseleave", () => {
        gsap.to(ball, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
}

// Event listeners for add and remove buttons
function setupBallControls() {
    const addBallButton = document.getElementById("addBall");
    const removeBallButton = document.getElementById("removeBall");
    const ballCounter = document.getElementById("ballCounter");
    const container = document.getElementById("ball-container");
    let ballCount = 20; // Start with initial 20 balls
    ballCounter.textContent = `Balls: ${ballCount}`;

    addBallButton.addEventListener("click", () => {
        createBall();
        ballCount++;
        ballCounter.textContent = `Balls: ${ballCount}`;
    });

    removeBallButton.addEventListener("click", () => {
        const balls = container.getElementsByClassName("drag-ball");
        if (balls.length > 0) {
            container.removeChild(balls[balls.length - 1]);
            ballCount = Math.max(0, ballCount - 1);
            ballCounter.textContent = `Balls: ${ballCount}`;
        }
    });
}

// Initialize the floating balls when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const isBallPitPage = window.location.pathname.includes("ballpit.html");
    createBalls(isBallPitPage ? 100 : 20); // 100 balls for ballpit.html, 20 for other pages
});