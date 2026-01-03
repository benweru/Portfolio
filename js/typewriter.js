/**
 * Typewriter Effect
 * Animates text character by character.
 */

document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.s-intro .text-huge-title');
    if (heroTitle) {
        // Backup original content including breaks
        const originalHTML = heroTitle.innerHTML.trim();
        // Hide initially to prevent flash/jank
        heroTitle.style.opacity = '0';
        heroTitle.innerHTML = '';
        
        let i = 0;
        const speed = 40; 
        
        const lines = originalHTML.split(/<br\s*\/?>/i);
        
        async function typeWriter(lines, element) {
            // Fade in gracefully before typing
            element.style.transition = "opacity 0.5s ease";
            element.style.opacity = '1';

            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                // Decode HTML entities (like &amp;) to plain text (like &)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = lines[lineIndex].trim();
                const lineText = tempDiv.textContent || tempDiv.innerText || "";
                
                const lineSpan = document.createElement('div'); // Block for new line
                element.appendChild(lineSpan);
                
                for (let charIndex = 0; charIndex < lineText.length; charIndex++) {
                    lineSpan.textContent += lineText.charAt(charIndex);
                    await new Promise(r => setTimeout(r, speed));
                }
            }
            
            // Cursor effect
            const cursor = document.createElement('span');
            cursor.className = 'cursor-blink';
            cursor.innerHTML = '|';
            element.appendChild(cursor);

            // Remove cursor after 3 seconds for a cleaner look
            setTimeout(() => {
                cursor.remove();
            }, 3000);
        }
        
        // Start after a slight delay to allow preloader to finish
        setTimeout(() => {
            typeWriter(lines, heroTitle);
        }, 1200); // Slightly earlier start since we manually fade in
    }
});
