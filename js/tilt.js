/**
 * Vanilla 3D Tilt Effect
 * Adds a subtle 3D tilt to project cards on mousemove (mouse users only).
 */

(function initTilt() {
    const canTilt = window.matchMedia(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'
    ).matches;
    if (!canTilt) return;

    const maxRotation = 4;
    const cards = document.querySelectorAll('.folio-list__item-link');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -maxRotation;
            const rotateY = ((e.clientX - rect.left - centerX) / centerX) * maxRotation;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
