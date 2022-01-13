var validator = new Validation();

function renderTable(arrayNV) {
  var htmlContent = '';
  for (i = 0; i < arrayNV.length; i++) {
    var nhanVien = arrayNV[i];
    var luong = nhanVien.luongCoBan
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    htmlContent += `<tr>
    <td class='bg-light text-dark'>${nhanVien.maNhanVien}</td>
    <td class='bg-light text-dark'>${nhanVien.tenNhanVien}</td>
    <td class='bg-light text-dark text-center'>${nhanVien.chucVu}</td>
    <td class='bg-light text-dark text-right'>${luong}</td>
    <td class='bg-light text-dark text-right'>${nhanVien.soGioLamTrongThang}</td>
    <td class='bg-light text-dark text-center'>
    <button class='btn btn-primary' onclick='suaNV(${nhanVien.maNhanVien})'>Sửa</button>
    <button class='btn btn-danger' onclick='xoaNV(${nhanVien.maNhanVien})'>Xóa</button>
    </td>
  </tr>`;
  }

  document.querySelector('#tbodyNhanVien').innerHTML = htmlContent;
}

function getApiData() {
  var promise = axios({
    url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayDanhSachNhanVien',
    method: 'GET',
  });

  promise.then(function (res) {
    renderTable(res.data);
  });

  promise.catch(function (err) {
    console.log('error', err);
  });
}

getApiData();

// Clear input data
function clearInput() {
  document.querySelector('#txtMaNV').value = '';
  document.querySelector('#txtTenNV').value = '';
  document.querySelector('#chucVu').value = '1';
  document.querySelector('#txtLuongCB').value = '';
  document.querySelector('#txtSoGioLam').value = '';
}

// Chuyển chữ có dấu thành không dấu
function removeAscent(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

function validateNhanVien(nhanVien) {
  var valid = true;
  // Kiểm tra rỗng
  valid &=
    validator.checkEmpty(nhanVien.maNhanVien, '#spanMaNV') &
    validator.checkEmpty(nhanVien.tenNhanVien, '#spanTenNV') &
    validator.checkEmpty(nhanVien.luongCoBan, '#spanLuongCB') &
    validator.checkEmpty(nhanVien.soGioLamTrongThang, '#spanSoGioLam');

  // Kiểm tra tên nhân viên
  tenNhanVien = removeAscent(nhanVien.tenNhanVien);
  valid &= validator.checkLetter(tenNhanVien, '#error_allLetter_spanTenNV');

  // Kiểm tra mã nhân viên 4-6 ký số
  valid &=
    validator.checkNumber(nhanVien.maNhanVien, '#error_allNumber_MaNV') &
    validator.checkLength(
      nhanVien.maNhanVien,
      '#error_minMaxLength_MaNV',
      4,
      6
    );

  // Kiểm tra lương cơ bản 1 000 000 đến 20 000 000
  valid &=
    validator.checkNumber(nhanVien.luongCoBan, '#error_allNumber_LuongCB') &
    validator.checkValue(
      nhanVien.luongCoBan,
      '#error_minMaxValue_LuongCB',
      1000000,
      20000000
    );

  // Kiểm tra số giờ làm trong tháng 50 - 150 giờ
  valid &=
    validator.checkNumber(
      nhanVien.soGioLamTrongThang,
      '#error_allNumber_SoGioLam'
    ) &
    validator.checkValue(
      nhanVien.soGioLamTrongThang,
      '#error_minMaxValue_SoGioLam',
      50,
      150
    );

  return valid;
}

// Thêm nhân viên
document
  .querySelector('#btnThemNhanVien')
  .addEventListener('click', function () {
    var nhanVien = new NhanVien();
    nhanVien.maNhanVien = document.querySelector('#txtMaNV').value;
    nhanVien.tenNhanVien = document.querySelector('#txtTenNV').value;
    nhanVien.heSoChucVu = document.querySelector('#chucVu').value;
    nhanVien.luongCoBan = document.querySelector('#txtLuongCB').value;
    nhanVien.soGioLamTrongThang = document.querySelector('#txtSoGioLam').value;

    var selectChucVu = document.querySelector('#chucVu');
    nhanVien.chucVu =
      selectChucVu.options[selectChucVu.selectedIndex].innerHTML;

    // Validation
    var valid = validateNhanVien(nhanVien);

    if (!valid) {
      return;
    }
    // -----------------------------------
    var promise = axios({
      url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/ThemNhanVien',
      method: 'POST',
      data: nhanVien,
    });

    promise.then(function (res) {
      console.log(res.data);
      clearInput();
      getApiData();
    });

    promise.catch(function (err) {
      console.log('error', err);
    });
  });

//   Xóa nhân viên
function xoaNV(maNhanVien) {
  var promise = axios({
    url:
      'http://svcy.myclass.vn/api/QuanLyNhanVienApi/XoaNhanVien?maSinhVien=' +
      maNhanVien,
    method: 'DELETE',
  });

  promise.then(function (res) {
    console.log(res.data);
    getApiData();
  });

  promise.catch(function (err) {
    console.log('error', err);
  });
}

// Sửa nhân viên
function suaNV(maNhanVien) {
  var promise = axios({
    url:
      'http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayThongTinNhanVien?maNhanVien=' +
      maNhanVien,
    method: 'GET',
  });

  promise.then(function (res) {
    var nhanVien = res.data;
    document.querySelector('#txtMaNV').value = nhanVien.maNhanVien;
    document.querySelector('#txtTenNV').value = nhanVien.tenNhanVien;
    document.querySelector('#chucVu').value = nhanVien.heSoChucVu;
    document.querySelector('#txtLuongCB').value = nhanVien.luongCoBan;
    document.querySelector('#txtSoGioLam').value = nhanVien.soGioLamTrongThang;
    document.querySelector('#txtMaNV').disabled = true;
    document.querySelector('#btnThemNhanVien').disabled = true;
    document.querySelector('#btnCapNhatNhanVien').disabled = false;
  });

  promise.catch(function (err) {
    console.log('error', err);
  });
}

// Cập nhật nhân viên
document
  .querySelector('#btnCapNhatNhanVien')
  .addEventListener('click', function () {
    var nhanVien = new NhanVien();
    nhanVien.maNhanVien = document.querySelector('#txtMaNV').value;
    nhanVien.tenNhanVien = document.querySelector('#txtTenNV').value;
    nhanVien.heSoChucVu = document.querySelector('#chucVu').value;
    nhanVien.luongCoBan = document.querySelector('#txtLuongCB').value;
    nhanVien.soGioLamTrongThang = document.querySelector('#txtSoGioLam').value;

    var selectChucVu = document.querySelector('#chucVu');
    nhanVien.chucVu =
      selectChucVu.options[selectChucVu.selectedIndex].innerHTML;

    // Validation
    var valid = validateNhanVien(nhanVien);

    if (!valid) {
      return;
    }
    // ---------------
    document.querySelector('#txtMaNV').disabled = false;
    document.querySelector('#btnThemNhanVien').disabled = false;
    document.querySelector('#btnCapNhatNhanVien').disabled = true;

    var promise = axios({
      url:
        'http://svcy.myclass.vn/api/QuanLyNhanVienApi/CapNhatThongTinNhanVien?maNhanVien=' +
        nhanVien.maNhanVien,
      method: 'PUT',
      data: nhanVien,
    });

    promise.then(function (res) {
      console.log(res.data);

      clearInput();
      getApiData();
    });

    promise.catch(function (err) {
      console.log('error', err);
    });
  });
