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
    })
    .catch((error) => {
        console.error(error);
    });

let currentIndex = 0;

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
        overlay.style.transition = "opacity 0.3s ease-out"; // 添加缓慢过渡效果
        overlay.style.opacity = "0"; // 在 1 秒内透明度变为 100%
    }, 1000);


    // 粒子效果
    const centerX = 55;
    const centerY = 110;
    createParticles(centerX, centerY);
});

function createParticles(centerX, centerY) {
    // 创建粒子容器
    const particleContainer = document.createElement("div");
    particleContainer.style.position = "fixed";
    particleContainer.style.right = `${centerX}px`;
    particleContainer.style.top = `${centerY}px`;
    particleContainer.style.pointerEvents = "none";
    particleContainer.style.zIndex = 30;
    document.body.appendChild(particleContainer);

    const particleCount = Math.floor(Math.random() * 10) + 5; // 随机生成 5-15 个粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = "10px";
        particle.style.height = "10px";
        particle.style.backgroundColor = "red";
        particle.style.borderRadius = "50%";
        particle.style.left = `${Math.random() * 50 - 25}px`; // 随机水平偏移
        particle.style.top = "0px";
        particleContainer.appendChild(particle);

        // 动画：粒子向下散落，速度先慢后快
        const duration = Math.random() * 2 + 1; // 随机持续时间 1-3 秒
        const endY = Math.random() * 200 + 100; // 随机垂直距离 100-300 像素
        particle.animate(
            [
                { transform: "translateY(0)", opacity: 1 },
                { transform: `translateY(${endY}px)`, opacity: 0 }
            ],
            {
                duration: duration * 1000,
                easing: "ease-in", // 速度先慢后快
                fill: "forwards"
            }
        );

        // 动画结束后移除粒子
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // 移除粒子容器
    setTimeout(() => {
        particleContainer.remove();
    }, 3000);
}
