import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let stars = [];

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Star class for dark mode
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedY = Math.random() * 0.1;
                this.opacity = Math.random();
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.y += this.speedY;
                if (this.y > canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;
                }

                // Twinkling effect
                this.opacity += this.twinkleSpeed;
                if (this.opacity > 1 || this.opacity < 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }
            }
        }

        // Particle class for light mode (clouds/particles)
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            draw() {
                ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
            }
        }

        // Initialize based on theme
        const initElements = () => {
            particles = [];
            stars = [];

            if (isDark) {
                // Create stars for dark mode
                const numberOfStars = Math.floor((canvas.width * canvas.height) / 3000);
                for (let i = 0; i < numberOfStars; i++) {
                    stars.push(new Star());
                }
            } else {
                // Create particles for light mode
                const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
                for (let i = 0; i < numberOfParticles; i++) {
                    particles.push(new Particle());
                }
            }
        };
        initElements();

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isDark) {
                // Draw stars
                stars.forEach((star) => {
                    star.update();
                    star.draw();
                });
            } else {
                // Draw particles
                particles.forEach((particle) => {
                    particle.update();
                    particle.draw();
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};

export default AnimatedBackground;
