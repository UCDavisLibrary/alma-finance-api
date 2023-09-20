exports.checkall = (source) => {
    console.log('checkall');
    checkboxes = document.querySelectorAll('input[type=checkbox]')
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
  }