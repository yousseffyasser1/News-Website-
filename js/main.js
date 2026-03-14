// Highlight active navigation link based on current page
document.addEventListener('DOMContentLoaded', function () {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.menu a');
  navLinks.forEach(function (link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Search functionality
  var searchInput = document.querySelector('.search input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        var query = searchInput.value.trim();
        if (query) {
          alert('Search results for: "' + query + '"');
        }
      }
    });
  }
});
