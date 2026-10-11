// FitZone Gym – admin panel behaviour
(function () {
    'use strict';

    // Confirmation dialog for destructive actions: <form data-confirm="Question?">
    var modalEl = document.getElementById('fzConfirmModal');
    var pendingForm = null;
    var modal = modalEl && window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;
    if (modal) {
        document.getElementById('fzConfirmYes').addEventListener('click', function () {
            if (pendingForm) {
                pendingForm.dataset.confirmed = '1';
                modal.hide();
                pendingForm.requestSubmit();
            }
        });
    }
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!(form instanceof HTMLFormElement) || !form.dataset.confirm) return;
        if (form.dataset.confirmed === '1') { form.dataset.confirmed = ''; return; }
        if (!modal) { if (!window.confirm(form.dataset.confirm)) e.preventDefault(); return; }
        e.preventDefault();
        pendingForm = form;
        document.getElementById('fzConfirmText').textContent = form.dataset.confirm;
        document.getElementById('fzConfirmTitle').textContent = form.dataset.confirmTitle || 'Please confirm';
        modal.show();
    }, true);

    // Loading state on any submit button in forms marked data-loading (prevents double-posting).
    document.querySelectorAll('form[data-loading]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (form.dataset.submitting === '1') { e.preventDefault(); return; }
            form.dataset.submitting = '1';
            var btn = form.querySelector('button[type=submit]');
            if (btn) {
                btn.classList.add('is-loading');
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>' + (form.dataset.loading || 'Saving…');
            }
        });
    });

    // Client-side search for tables: <input data-table-search="#tableId">
    document.querySelectorAll('[data-table-search]').forEach(function (input) {
        var table = document.querySelector(input.dataset.tableSearch);
        if (!table) return;
        input.addEventListener('input', function () {
            var q = input.value.trim().toLowerCase();
            table.querySelectorAll('tbody tr[data-search]').forEach(function (row) {
                row.style.display = !q || row.dataset.search.indexOf(q) !== -1 ? '' : 'none';
            });
        });
    });

    // Charts (Chart.js). <canvas data-chart="bar|line|doughnut" data-labels='[..]' data-values='[..]' data-label="...">
    if (window.Chart) {
        window.Chart.defaults.color = '#c9c9d1';
        window.Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';
        window.Chart.defaults.font.family = '"Segoe UI", system-ui, sans-serif';
        var palette = ['#ff4d2e', '#ff8a1f', '#22c55e', '#38bdf8', '#facc15', '#a78bfa'];
        document.querySelectorAll('canvas[data-chart]').forEach(function (canvas) {
            var type = canvas.dataset.chart;
            var labels = JSON.parse(canvas.dataset.labels || '[]');
            var values = JSON.parse(canvas.dataset.values || '[]');
            var money = canvas.dataset.money === '1';
            var isPie = type === 'doughnut' || type === 'pie';
            var datasetColor = isPie ? palette : 'rgba(255, 77, 46, 0.85)';
            new window.Chart(canvas, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: canvas.dataset.label || '',
                        data: values,
                        backgroundColor: datasetColor,
                        borderColor: isPie ? '#131315' : '#ff4d2e',
                        borderWidth: isPie ? 2 : (type === 'line' ? 3 : 0),
                        borderRadius: type === 'bar' ? 6 : 0,
                        tension: 0.35,
                        fill: type === 'line' ? { target: 'origin', above: 'rgba(255,77,46,0.12)' } : false,
                        pointRadius: type === 'line' ? 3 : 0,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: isPie, position: 'bottom', labels: { boxWidth: 12 } },
                        tooltip: { callbacks: { label: function (ctx) {
                            var v = ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.parsed;
                            return (ctx.dataset.label ? ctx.dataset.label + ': ' : '') + (money ? '₹' + Number(v).toLocaleString('en-IN') : v);
                        } } },
                    },
                    scales: isPie ? {} : {
                        y: { beginAtZero: true, ticks: { callback: function (v) { return money ? '₹' + Number(v).toLocaleString('en-IN') : v; } } },
                        x: { grid: { display: false } },
                    },
                },
            });
        });
    }

    // Print buttons
    document.querySelectorAll('[data-print]').forEach(function (btn) {
        btn.addEventListener('click', function () { window.print(); });
    });
})();
