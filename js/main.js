/* ===================================================================
 * Main JS
 *
 * ------------------------------------------------------------------- */

(function() {

    "use strict";

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


   /* Mobile Menu
    * ---------------------------------------------------- */
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function() {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        window.addEventListener("scroll", navHighlight, { passive: true });

        function navHighlight() {

            const scrollY = window.pageYOffset;

            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
                const link = document.querySelector(".main-nav a[href*=" + sectionId + "]");
                if (!link) return;

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.parentNode.classList.add("current");
                } else {
                    link.parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Reveal blocks when they enter the viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
            blocks.forEach(function(block) { block.classList.add('is-revealed'); });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -15% 0px' });

        blocks.forEach(function(block) { observer.observe(block); });

    }; // end ssViewAnimate


   /* Project dialogs
    * ------------------------------------------------------ */
    const ssProjectDialogs = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');

        folioLinks.forEach(function(link) {
            const dialog = document.querySelector(link.getAttribute('href'));
            if (!dialog || typeof dialog.showModal !== 'function') return;

            link.addEventListener('click', function(event) {
                event.preventDefault();
                dialog.showModal();
            });

            dialog.querySelector('.project-dialog__close').addEventListener('click', function() {
                dialog.close();
            });

            // clicks on the ::backdrop target the dialog element itself
            dialog.addEventListener('click', function(event) {
                if (event.target === dialog) dialog.close();
            });

            dialog.addEventListener('close', function() {
                link.focus({ preventScroll: true });
            });
        });

        if (window.location.hash) {
            const target = document.getElementById(window.location.hash.slice(1));
            if (target && target.tagName === 'DIALOG' && typeof target.showModal === 'function') target.showModal();
        }

    }; // end ssProjectDialogs


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssProjectDialogs();

    })();

})();
