document.addEventListener('DOMContentLoaded', function () {
  var headers = document.querySelectorAll('thead th');
  var tbody = document.querySelector('tbody');

  headers.forEach(function (header, index) {
    header.style.cursor = 'pointer';
    header.addEventListener('click', function () {
      var rows = Array.from(tbody.querySelectorAll('tr'));
      var isAsc = header.getAttribute('data-sort') !== 'asc';

      headers.forEach(function (h) { h.removeAttribute('data-sort'); });
      header.setAttribute('data-sort', isAsc ? 'asc' : 'desc');

      rows.sort(function (a, b) {
        var aVal = a.cells[index].textContent.trim();
        var bVal = b.cells[index].textContent.trim();
        var aNum = parseFloat(aVal);
        var bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return isAsc ? aNum - bNum : bNum - aNum;
        }
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(function (row) { tbody.appendChild(row); });
    });
  });
});
