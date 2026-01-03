/**
 * Dynamic Particle Network Background
 * 
 * Creates a canvas that covers the entire window.
 * Particles drift slowly and connect with lines when close to form a mesh.
 * Mouse interaction repels/attracts particles slightly.
 */

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) {
            console.error("Canvas #bg-canvas not found!");
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', this.resize.bind(this));
        
        // Mouse interaction
        this.mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            // Use clientX/clientY for better compatibility
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        console.log("ParticleNetwork initialized.");
    }

    /* ... resize and init methods same as before ... */
    
    // (keeping methods not shown in this generic replace call if I could, but I need to replace parts carefully)
    // Actually, I'll replace the constructor and animate/connect methods.
    
    // ... [Previous init methods skipped for brevity in Instruction, but must be in file logic]
    // Due to tool limitations, I will just rewrite the methods I want to change using multiple chunks if needed, but here a large replace is safer to ensure consistency.

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.reinitParticles();
    }

    reinitParticles() {
         this.initParticles();
    }

    initParticles() {
        this.particles = [];
        const density = (this.width * this.height) / 9000;
        console.log(`Creating ${Math.round(density)} particles.`);
        
        for (let i = 0; i < density; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.5, 
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2 + 1.5,
            });
        }
    }

    getStyles() {
        const computedStyle = getComputedStyle(document.documentElement);
        const color1 = computedStyle.getPropertyValue('--color-1').trim();
        const color2 = computedStyle.getPropertyValue('--color-2').trim();
        
        const pColor = color1 || 'rgba(234, 190, 124, 1)'; 
        const lColor = color2 || 'rgba(35, 150, 127, 1)';
        
        return {
            particle: pColor, 
            line: lColor
        };
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const styles = this.getStyles();
        const baseParticleOpacity = 0.4;  // Reduced from 0.8
        const baseLineOpacity = 0.15;     // Reduced from 0.4
        
        this.particles.forEach(p => {
            // Safety check for particle
            if (!p) return;

            // Move
            p.x += p.vx;
            p.y += p.vy;
            
            // Mouse interaction
            if (this.mouse && this.mouse.x != null) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                const interactionRadius = 250; // Increased radius
                
                if (distance < interactionRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (interactionRadius - distance) / interactionRadius;
                    const directionX = forceDirectionX * force * 1.0; 
                    const directionY = forceDirectionY * force * 1.0;
                    
                    // Stronger and faster attraction
                    p.vx += directionX * 0.8; // Significantly increased from 0.2
                    p.vy += directionY * 0.8;
                }
            }
            
            // Friction (increased to damp high speeds from interaction)
            const maxSpeed = 5; // Increased from 3 to allow faster movement
            const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            }

            // Bounce
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = styles.particle;
            this.ctx.globalAlpha = baseParticleOpacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        });
        
        this.connectParticles(styles.line, baseLineOpacity);
    }

    connectParticles(colorStr, maxOpacity) {
        let maxDist = 140;
        this.ctx.lineWidth = 1;
        
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                let pA = this.particles[a];
                let pB = this.particles[b];
                
                // Defensive check against undefined particles
                if (!pA || !pB) continue;
                
                let dx = pA.x - pB.x;
                let dy = pA.y - pB.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist) {
                    const opacity = 1 - (dist / maxDist);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = colorStr; 
                    this.ctx.globalAlpha = opacity * maxOpacity;
                    this.ctx.moveTo(pA.x, pA.y);
                    this.ctx.lineTo(pB.x, pB.y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1.0;
                }
            }
        }
    }
}

// Robust Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleNetwork();
    });
} else {
    // DOM already loaded
    new ParticleNetwork();
}
