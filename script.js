const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileName.textContent = `${fileInput.files.length} file(s) selected`;
    } else {
        fileName.textContent = "No file selected";
    }
});

function uploadFiles() {
    if (fileInput.files.length === 0) {
        alert("Please select at least one file.");
    } else {
        alert("Upload successful (frontend demo).");
    }
}
