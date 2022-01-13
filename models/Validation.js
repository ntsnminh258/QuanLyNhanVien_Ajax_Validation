function Validation() {
  this.checkEmpty = function (value, selectorError) {
    if (value.trim() === '') {
      document.querySelector(selectorError).innerHTML = 'Không được bỏ trống!';
      return false;
    }
    document.querySelector(selectorError).innerHTML = '';
    return true;
  };

  this.checkLetter = function (value, selectorError) {
    var regexLetter = /^[A-Z a-z]+$/;
    if (regexLetter.test(value)) {
      document.querySelector(selectorError).innerHTML = '';
      return true;
    }
    document.querySelector(selectorError).innerHTML = 'Tất cả phải là chữ!';
    return false;
  };

  this.checkNumber = function (value, selectorError) {
    var regexNumber = /^[0-9]+$/;
    if (regexNumber.test(value)) {
      document.querySelector(selectorError).innerHTML = '';
      return true;
    }
    document.querySelector(selectorError).innerHTML = 'Tất cả phải là số!';
    return false;
  };

  this.checkLength = function (value, selectorError, minLength, maxLength) {
    if (value.length > maxLength || value.length < minLength) {
      document.querySelector(selectorError).innerHTML =
        'Nhập từ ' + minLength + ' - ' + maxLength + ' ký tự';
      return false;
    }
    document.querySelector(selectorError).innerHTML = '';
    return true;
  };

  this.checkValue = function (value, selectorError, minValue, maxValue) {
    if (Number(value) > maxValue || Number(value) < minValue) {
      document.querySelector(selectorError).innerHTML =
        'Giá trị từ ' + minValue + ' - ' + maxValue;
      return false;
    }
    document.querySelector(selectorError).innerHTML = '';
    return true;
  };
}
