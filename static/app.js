// DOMContentLoaded đảm bảo rằng hàm loadChiTieu() chỉ chạy sau khi toàn bộ HTML đã tải xong.
// Khi trang web mở, danh sách chỉ tiêu sẽ tự động được tải lên dropdown.
document.addEventListener("DOMContentLoaded", function () {
    loadChiTieu(); // Gọi hàm tải danh sách chỉ tiêu khi trang web được mở
});

// Hàm tải danh sách chỉ tiêu từ list.json
function loadChiTieu() {
    fetch("static/data/list.json")  // Đọc danh sách chỉ tiêu từ file JSON
        .then(response => response.json()) // Chuyển dữ liệu nhận được thành JSON
        .then(data => {
            let selectBox = document.getElementById("chiTieuSelect");

            // Xóa các option cũ trước khi thêm mới
            selectBox.innerHTML = '<option value="">Chọn chỉ tiêu</option>';

            // Duyệt qua danh sách chỉ tiêu và thêm vào dropdown
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                selectBox.appendChild(option);
            });
        })
        .catch(error => console.error("Lỗi khi tải danh sách chỉ tiêu:", error));
}

// Hàm tải dữ liệu từ file JSON của chỉ tiêu đã chọn
function loadData() {
    let chiTieu = document.getElementById("chiTieuSelect").value; // Lấy chỉ tiêu đã chọn
    let soPu = parseFloat(document.getElementById("soPu").value) || 1; // Lấy số phản ứng
    let soPuIC = parseFloat(document.getElementById("soPuIC").value) || 1; // Lấy số PU IC

    if (!chiTieu) { // Nếu chưa chọn chỉ tiêu thì báo lỗi
        alert("Vui lòng chọn chỉ tiêu!");
        return;
    }

    fetch(`static/data/${chiTieu}.json`) // Lấy dữ liệu từ file JSON tương ứng
        .then(response => response.json()) // Chuyển dữ liệu thành JSON
        .then(data => {
            let thead = document.getElementById("dataTableHead"); // Tiêu đề bảng
            let tbody = document.getElementById("dataTableBody"); // Nội dung bảng

            thead.innerHTML = ""; // Xóa tiêu đề cũ
            tbody.innerHTML = ""; // Xóa nội dung cũ

            // Kiểm tra nếu dữ liệu rỗng thì hiển thị thông báo
            if (data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='3' class='text-center'>Không có dữ liệu</td></tr>";
                return;
            }

            // Lấy danh sách cột từ JSON
            let columns = Object.keys(data[0]);

            // Tạo tiêu đề bảng động
            let headerRow = "<tr>";
            columns.forEach(col => {
                headerRow += `<th>${col}</th>`;  // Thêm từng tiêu đề cột vào bảng
            });
            headerRow += "</tr>";
            thead.innerHTML = headerRow;

            // Tạo nội dung bảng
            data.forEach((row, index) => {
                let tr = `<tr>`;
                columns.forEach((col, colIndex) => {
                    let value = row[col]; // Lấy giá trị của cột hiện tại

                    // Nếu cột là số, nhân với số phản ứng
                    // Dòng cuối cùng sẽ không nhân
                    if (index < data.length - 1) {
                        if (colIndex === 1) value = ((parseFloat(value) || 0) * soPu); // Cột 2 nhân số PU
                        if (colIndex === 2) value = ((parseFloat(value) || 0) * soPuIC); // Cột 3 nhân số PU IC
                    }

                    // Làm tròn đến 2 số lẻ nếu là số thực
                    if (!isNaN(value) && value !== "") {
                        value = Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100;
                    }

                    // Nếu giá trị là 0, hiển thị "--"
                    if (value == 0) value = "--";

                    tr += `<td>${value}</td>`; // Thêm giá trị vào dòng
                });
                tr += `</tr>`;
                tbody.innerHTML += tr;
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
}