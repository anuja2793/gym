(function () {
  var flash = document.querySelector('.fz-flash');
  var timer;

  function showMessage(text) {
    if (!flash) { alert(text); return; }
    flash.innerHTML =
      '<div class="alert alert-success d-flex align-items-center gap-2 shadow" role="alert">' +
      '<i class="bi bi-check-circle-fill"></i><div>' + text + '</div>' +
      '<button type="button" class="btn-close ms-auto" aria-label="Close"></button></div>';
    flash.querySelector('.btn-close').addEventListener('click', function () {
      flash.innerHTML = '';
    });
    clearTimeout(timer);
    timer = setTimeout(function () { flash.innerHTML = ''; }, 6000);
  }

  // Capture phase: runs before any other submit handler (including site.js)
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Close the review modal if the review form was used
    var modalEl = form.closest('.modal');
    if (modalEl && window.bootstrap) {
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    form.reset();
    form.classList.remove('was-validated');
    showMessage('This is a demo website. Your form has been submitted successfully.');
  }, true);
})();