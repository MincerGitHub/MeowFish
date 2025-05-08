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
        fileContent = data.content || ""
        fileContent = fileContent.trim();
    })
    .catch((error) => {
        console.error(error);
    });

let currentIndex = 1;

document.addEventListener("keydown", () => {
    const contentDiv = document.getElementById("content");
    const overlay = document.querySelector(".people-overlay");

    // 显示文件内容的下一个字符
    if (currentIndex < fileContent.length) {
        contentDiv.textContent += fileContent[currentIndex];
        currentIndex++;
    }

    // 清除之前的透明度恢复计时器
    clearTimeout(overlay.fadeOutTimer);

    // 设置透明度为 0.5（瞬间变化）
    overlay.style.transition = "none"; // 取消过渡效果
    overlay.style.opacity = "0.5"; // 立即变为半透明

    setTimeout(() => {
        overlay.style.transition = "opacity 0.5s ease-out"; // 添加缓慢过渡效果
        overlay.style.opacity = "0"; // 在 1 秒内透明度变为 100%
    }, 1000);
});

