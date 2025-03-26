document.addEventListener("DOMContentLoaded", function () {
    loadChiTieu(); // Gọi hàm tải danh sách chỉ tiêu khi trang web được mở
});

function loadChiTieu() {
    fetch("static/data/list.json")  // Đọc danh sách chỉ tiêu từ file JSON
        .then(response => response.json())
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

function loadData() {
    let chiTieu = document.getElementById("chiTieuSelect").value;
    let soPu = parseFloat(document.getElementById("soPu").value) || 1;
    let soPuIC = parseFloat(document.getElementById("soPuIC").value) || 1;

    if (!chiTieu) {
        alert("Vui lòng chọn chỉ tiêu!");
        return;
    }

    fetch(`static/data/${chiTieu}.json`)
        .then(response => response.json())
        .then(data => {
            let thead = document.getElementById("dataTableHead");
            let tbody = document.getElementById("dataTableBody");

            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='3' class='text-center'>Không có dữ liệu</td></tr>";
                return;
            }

            // Lấy danh sách cột từ JSON
            let columns = Object.keys(data[0]);

            // Tạo tiêu đề bảng
            let headerRow = "<tr>";
            columns.forEach(col => {
                headerRow += `<th>${col}</th>`;
            });
            headerRow += "</tr>";
            thead.innerHTML = headerRow;

            // Tạo nội dung bảng
            data.forEach((row, index) => {
                let tr = `<tr>`;
                columns.forEach((col, colIndex) => {
                    let value = row[col];

                    // Nếu cột là số, nhân với số phản ứng
                    if (colIndex === 1) value = (parseFloat(value) || 0) * soPu;
                    if (colIndex === 2) value = (parseFloat(value) || 0) * soPuIC;

                    tr += `<td>${value}</td>`;
                });
                tr += `</tr>`;
                tbody.innerHTML += tr;
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
}
