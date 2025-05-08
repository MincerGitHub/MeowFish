let fileContent = ""; // 初始化文件内容为空

// 从后端获取 .docx 文件内容
fetch("http://localhost:3000/docx-content")
    .then((response) => {
        if (!response.ok) {
            throw new Error("无法获取 .docx 文件内容！");
        }
        return response.json();
    })
    .then((data) => {
        fileContent = data.content || "";
    })
    .catch((error) => {
        console.error(error);
    });

let currentIndex = 0;

document.addEventListener("keydown", () => {
    const contentDiv = document.getElementById("content");
    const indicator = document.querySelector(".indicator");

    // 显示文件内容的下一个字符
    if (currentIndex < fileContent.length) {
        contentDiv.textContent += fileContent[currentIndex];
        currentIndex++;
    }

    // 改变绿色圆形的颜色
    indicator.style.backgroundColor = "red";
    setTimeout(() => {
        indicator.style.backgroundColor = "green";
    }, 1000);
});