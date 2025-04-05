function uploadFile() {
    let fileInput = document.getElementById("fileUpload");
    let file = fileInput.files[0];

    if (!file) {
        alert("Vui lòng chọn một file CSV!");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error("Lỗi:", error));
}
