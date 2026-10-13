/**
 * Particle Network Background
 *
 * Particles drift slowly and connect with lines when close to form a mesh.
 * The mouse gently attracts nearby particles. Skipped on touch devices,
 * small screens and when the user prefers reduced motion.
 */

class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mouse = { x: null, y: null };
        this.running = false;
        this.frame = null;

        const rootStyle = getComputedStyle(document.documentElement);
        this.colors = {
            particle: rootStyle.getPropertyValue('--color-1').trim() || 'rgba(234, 190, 124, 1)',
            line: rootStyle.getPropertyValue('--color-2').trim() || 'rgba(35, 150, 127, 1)',
        };

        this.resize();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.resize(), 200);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stop();
            else this.start();
        });

        this.start();
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Re-seeding on every height-only change makes the mesh jump when
        // mobile browser chrome shows/hides; only re-seed on real resizes.
        const reseed = !this.particles || Math.abs(width - this.width) > 50 || Math.abs(height - this.height) > 150;
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        if (reseed) this.initParticles();
    }

    initParticles() {
        this.particles = [];
        const count = Math.min((this.width * this.height) / 9000, 180);

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2 + 1.5,
            });
        }
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.frame = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        this.running = false;
        if (this.frame) cancelAnimationFrame(this.frame);
    }

    animate() {
        if (!this.running) return;
        this.frame = requestAnimationFrame(this.animate.bind(this));

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = this.colors.particle;
        ctx.globalAlpha = 0.4;

        const interactionRadius = 250;
        const maxSpeed = 5;

        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (this.mouse.x != null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0 && distance < interactionRadius) {
                    const force = (interactionRadius - distance) / interactionRadius;
                    p.vx += (dx / distance) * force * 0.8;
                    p.vy += (dy / distance) * force * 0.8;
                }
            }

            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            }

            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        this.connectParticles(0.15);
        ctx.globalAlpha = 1;
    }

    connectParticles(maxOpacity) {
        const ctx = this.ctx;
        const maxDist = 140;
        const maxDistSq = maxDist * maxDist;
        const particles = this.particles;
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.colors.line;

        for (let a = 0; a < particles.length; a++) {
            const pA = particles[a];
            for (let b = a + 1; b < particles.length; b++) {
                const pB = particles[b];
                const dx = pA.x - pB.x;
                const dy = pA.y - pB.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    ctx.globalAlpha = (1 - Math.sqrt(distSq) / maxDist) * maxOpacity;
                    ctx.beginPath();
                    ctx.moveTo(pA.x, pA.y);
                    ctx.lineTo(pB.x, pB.y);
                    ctx.stroke();
                }
            }
        }
    }
}

(function initParticleNetwork() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const shouldAnimate = window.matchMedia(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 801px)'
    ).matches;

    if (shouldAnimate) new ParticleNetwork(canvas);
})();
