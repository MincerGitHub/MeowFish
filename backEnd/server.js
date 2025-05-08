const express = require("express");
const fs = require("fs");
const path = require("path");
const { parseDocx } = require("docx-parser"); // 使用 parseDocx 方法

const cors = require("cors"); // 引入 cors 中间件

const app = express();
const PORT = 3000;

app.use(cors()); // 启用 CORS

// 清理解压目录的函数
function clearDistDirectory(distPath) {
    if (fs.existsSync(distPath)) {
        fs.readdirSync(distPath).forEach((file) => {
            const filePath = path.join(distPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                clearDistDirectory(filePath); // 递归删除子目录
            } else {
                fs.unlinkSync(filePath); // 删除文件
            }
        });
        fs.rmdirSync(distPath); // 删除空目录
    }
}

app.get("/docx-content", (req, res) => {
    const textDir = path.join(__dirname, "text"); // 指定 /text 目录
    const distDir = path.join(__dirname, "dist"); // 解压目录

    // 获取 /text 目录下的所有 .docx 文件
    const files = fs.readdirSync(textDir).filter(file => file.endsWith(".docx"));
    if (files.length === 0) {
        return res.status(404).json({ error: "目录 /text 中没有 .docx 文件！" });
    }

    // 随机选择一个文件
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const docxFilePath = path.join(textDir, randomFile);

    // 解析文件内容
    parseDocx(docxFilePath, (content) => {
        // 清理解压目录
        clearDistDirectory(distDir);
        // 返回解压内容
        res.json({ content });
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});