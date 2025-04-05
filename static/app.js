// DOMContentLoaded đảm bảo rằng hàm loadChiTieu() chỉ chạy sau khi toàn bộ HTML đã tải xong.
// Khi trang web mở, danh sách chỉ tiêu sẽ tự động được tải lên dropdown.
// app.js sử dụng cho file index.html
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

// Hàm tìm kiếm trong dropdown chỉ tiêu
document.getElementById("searchChiTieu").addEventListener("input", function () {
    let searchText = this.value.toLowerCase();
    let selectBox = document.getElementById("chiTieuSelect");

    for (let option of selectBox.options) {
        let text = option.textContent.toLowerCase();
        option.style.display = text.includes(searchText) ? "block" : "none";
    }
});

// Hàm tạo nút xóa cho mỗi bảng. hàm này để tham khảo. không sử dụng trong ứng dụng này
function createDeleteButton(tableId) {
    let btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm fw-bold ms-2";
    btn.innerHTML = "🗑 Xóa";
    btn.onclick = function () {
        document.getElementById(tableId).remove();
    };
    return btn;
}

// Hàm clear all
function clearAllTables() {
    document.getElementById("dataTableHead").innerHTML = "";
    document.getElementById("dataTableBody").innerHTML = "";
    document.getElementById("chiTieuLabel").textContent = "";
    document.getElementById("multipleDataContainer").innerHTML = "";
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
            let chiTieuLabel = document.getElementById("chiTieuLabel");  // Lấy label
            
            thead.innerHTML = ""; // Xóa tiêu đề cũ
            tbody.innerHTML = ""; // Xóa nội dung cũ

            // Tạo tiêu đề chỉ tiêu kèm nút xóa
            // chiTieuLabel.innerText = `${chiTieu} / ${soPu} reaction / ${soPuIC} IC`;
            chiTieuLabel.innerHTML = `
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>${chiTieu} / ${soPu} reaction / ${soPuIC} IC</span>
                                        <button class="btn btn-danger btn-sm fw-bold ms-2" id="btnXoaBang">🗑 Xóa</button>
                                    </div>
                                    `;
             
                                    // Gán sự kiện cho nút "Xóa"
             document.getElementById("btnXoaBang").addEventListener("click", function () {
                thead.innerHTML = "";
                tbody.innerHTML = "";
                chiTieuLabel.innerHTML = ""; // Xóa tiêu đề
            });

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

            // Xóa nội dung ô tìm kiếm sau khi tính
            document.getElementById("searchChiTieu").value = "";

            // Hiển thị lại tất cả chỉ tiêu trong dropdown
            let selectBox = document.getElementById("chiTieuSelect");
            for (let option of selectBox.options) {
                option.style.display = "block";
            }

            // Reset dropdown về "Chọn chỉ tiêu"
            selectBox.value = "";  // Reset dropdown về mặc định

            // Reset số phản ứng và số phản ứng IC về 1 sau khi tính toán
            document.getElementById("soPu").value = 1;
            document.getElementById("soPuIC").value = 1;
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
}

// Hàm tạo nhiều bảng dữ liệu liên tiếp nhau
function loadMultipleData() {
    let chiTieu = document.getElementById("chiTieuSelect").value; // Lấy chỉ tiêu đã chọn
    let soPu = parseFloat(document.getElementById("soPu").value) || 1; // Lấy số phản ứng
    let soPuIC = parseFloat(document.getElementById("soPuIC").value) || 1; // Lấy số PU IC

    if (!chiTieu) { // Nếu chưa chọn chỉ tiêu thì báo lỗi
        alert("Vui lòng chọn chỉ tiêu!");
        return;
    }

    let container = document.getElementById("multipleDataContainer"); // Lấy container chứa nhiều bảng

    // Kiểm tra xem bảng đã tồn tại chưa
    let labelText = `${chiTieu} / ${soPu} reaction / ${soPuIC} IC`.trim();

    // Chuẩn hóa nội dung label cũ để so sánh chính xác hơn
    let existingLabel = Array.from(container.getElementsByTagName("h3")).find(h3 => {
        let existingText = h3.innerText.replace(/\s+/g, " ").trim(); // Xóa khoảng trắng thừa
        return existingText === labelText;
    });
    
    if (existingLabel) {
        alert(`Bảng dữ liệu cho '${chiTieu}' đã tồn tại!`);
        return;  // Nếu đã có bảng, thoát khỏi hàm
    }

    fetch(`static/data/${chiTieu}.json`) // Lấy dữ liệu từ file JSON tương ứng
        .then(response => response.json()) // Chuyển dữ liệu thành JSON
        .then(data => {
            let container = document.getElementById("multipleDataContainer"); // Lấy container chứa nhiều bảng

            // Tạo div chứa bảng dữ liệu mới
            let tableContainer = document.createElement("div");
            tableContainer.classList.add("data-table-container");
            tableContainer.style.marginBottom = "20px"; // Tạo khoảng cách giữa các bảng

            // Tạo tiêu đề chỉ tiêu
            let chiTieuLabel = document.createElement("h3");
            chiTieuLabel.innerText = `${chiTieu} / ${soPu} reaction / ${soPuIC} IC`;
            chiTieuLabel.style.fontWeight = "bold"; // In đậm tiêu đề
            // tableContainer.appendChild(chiTieuLabel); // Thêm label vào container

            // 🟢 Tạo nút xóa
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "🗑 Xóa";
            deleteButton.classList.add("btn", "btn-danger", "btn-sm");
            deleteButton.style.marginLeft = "10px";
            deleteButton.onclick = function () {
                container.removeChild(tableContainer);
            };

            // Thêm tiêu đề & nút xóa vào container bảng
            let headerDiv = document.createElement("div");
            headerDiv.style.display = "flex";
            headerDiv.style.alignItems = "center";
            headerDiv.style.justifyContent = "space-between";
            headerDiv.appendChild(chiTieuLabel);
            headerDiv.appendChild(deleteButton);

            // Gắn thẻ div có chứa lable và nút vào bảng
            tableContainer.appendChild(headerDiv);           

            // Kiểm tra nếu dữ liệu rỗng
            if (data.length === 0) {
                let emptyMessage = document.createElement("p");
                emptyMessage.innerText = "Không có dữ liệu";
                emptyMessage.classList.add("text-center");
                tableContainer.appendChild(emptyMessage);
                container.appendChild(tableContainer);
                return;
            }

            // Tạo bảng mới
            let table = document.createElement("table");
            table.classList.add("table", "table-bordered", "table-striped");

            // Tạo tiêu đề bảng
            let thead = document.createElement("thead");
            let headerRow = document.createElement("tr");
            let columns = Object.keys(data[0]);

            columns.forEach(col => {
                let th = document.createElement("th");
                th.innerText = col;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Tạo nội dung bảng
            let tbody = document.createElement("tbody");
            data.forEach((row, index) => {
                let tr = document.createElement("tr");
                columns.forEach((col, colIndex) => {
                    let td = document.createElement("td");
                    let value = row[col];

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

                    td.innerText = value;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer); // Thêm bảng mới vào container chính

            // Reset dropdown, input số PU & PU IC
            document.getElementById("searchChiTieu").value = "";
            let selectBox = document.getElementById("chiTieuSelect");
            for (let option of selectBox.options) {
                option.style.display = "block";
            }
            selectBox.value = ""; // Reset về mặc định
            document.getElementById("soPu").value = 1;
            document.getElementById("soPuIC").value = 1;
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
}

// -----------------------------------------------------------------------
// ---PHẦN XỬ LÝ CHO CHỨC NĂNG UPLOAD FILE CỦA add.html và code add.js ---
// chức năng này chưa hoàn thiện. chưa áp dụng được
// -----------------------------------------------------------------------
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");

const app = express();
app.use(express.static("static"));
app.use(express.json());

// Cấu hình lưu file CSV vào thư mục "database/"
const upload = multer({ dest: "database/" });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Không có file nào được tải lên!" });
        }

        let csvPath = req.file.path;
        let jsonFileName = req.file.originalname.replace(".csv", ".json");
        let jsonPath = `static/data/${jsonFileName}`;

        // Chuyển CSV sang JSON
        const jsonArray = await csv().fromFile(csvPath);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonArray, null, 2));

        // Cập nhật danh sách file JSON vào list.json
        let listFile = "static/data/list.json";
        let fileList = [];

        if (fs.existsSync(listFile)) {
            fileList = JSON.parse(fs.readFileSync(listFile, "utf-8"));
        }
        fileList.push(jsonFileName);
        fs.writeFileSync(listFile, JSON.stringify(fileList, null, 2));

        res.json({ message: "Tải lên thành công!", jsonFile: jsonPath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Khởi động server
app.listen(5500, () => console.log("Server chạy tại http://localhost:5500"));