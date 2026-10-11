// FitZone Gym – public website behaviour (no external dependencies)
(function () {
    'use strict';

    // Navbar gets a solid background after scrolling.
    var nav = document.querySelector('.fz-nav');
    var onScroll = function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Collapse the mobile menu after choosing a link.
    document.querySelectorAll('.fz-nav .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            var collapse = document.getElementById('fzNavMenu');
            if (collapse && collapse.classList.contains('show') && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });

    // Highlight the nav link for the section currently in view.
    var links = Array.prototype.slice.call(document.querySelectorAll('.fz-nav a[href^="#"]'));
    if ('IntersectionObserver' in window && links.length) {
        var map = {};
        links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting && map[e.target.id]) {
                    links.forEach(function (a) { a.classList.remove('active'); });
                    map[e.target.id].classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    }

    // Scroll-reveal animations.
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // Before / after comparison sliders.
    document.querySelectorAll('[data-compare]').forEach(function (box) {
        var range = box.querySelector('input[type=range]');
        var after = box.querySelector('.after');
        var handle = box.querySelector('.handle');
        if (!range || !after || !handle) return;
        var update = function () {
            var v = range.value;
            after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
            handle.style.left = v + '%';
        };
        range.addEventListener('input', update);
        update();
    });

    // Trial form: prevent past dates, show a loading state on submit.
    var dateInput = document.querySelector('input[name=preferred_date]');
    if (dateInput) {
        var today = new Date();
        var pad = function (n) { return String(n).padStart(2, '0'); };
        dateInput.min = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
    }
    document.querySelectorAll('form[data-public-form]').forEach(function (form) {
        form.addEventListener('submit', function () {
            var btn = form.querySelector('button[type=submit]');
            if (btn) {
                btn.classList.add('is-loading');
                btn.dataset.originalText = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending…';
            }
        });
    });
})();
document.addEventListener('DOMContentLoaded', function () {
    var menu = document.querySelector('.fz-nav .navbar-collapse');
    if (!menu || typeof bootstrap === 'undefined') return;

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });
});