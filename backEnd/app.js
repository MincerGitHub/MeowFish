const express = require('express');
const app = express();
const port = 3000;

const fs = require("fs");
const path = require("path");
const multer = require("multer"); // 用于处理文件上传
const jwt = require("jsonwebtoken"); // 用于生成和验证 JWT
const { MongoClient, ObjectId } = require("mongodb"); // 引入 MongoDB 客户端
const { extractRawText } = require("mammoth"); // 用于解析 .docx 文件为纯文本

// MongoDB 配置
const mongoUri = "mongodb://root:h6m77xr4@meowfish-db-mongodb.ns-9mcqpenu.svc:27017"; // 模拟 MongoDB 连接 URI
const dbName = "meowfish-db"; // 模拟数据库名称
const usersCollectionName = "users"; // 用户集合
const filesCollectionName = "docxFiles"; // 文件集合

// JWT 配置
const jwtSecret = "aP9!x@3#Lz$8^k&7*QwErTyUiOp1234567890ZxCvBnM"; // 替换为更安全的密钥

// 中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 配置 multer 用于文件上传
const upload = multer({ dest: "uploads/" }); // 上传的文件将存储在 uploads 文件夹中

// 连接到 MongoDB
const client = new MongoClient(mongoUri);

// 用户注册
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "用户名和密码是必填项！" });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection(usersCollectionName);

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "用户名已被注册！" });
        }

        await usersCollection.insertOne({ username, password });
        res.status(201).json({ message: "注册成功！" });
    } catch (error) {
        console.error("注册时出错：", error);
        res.status(500).json({ error: "服务器错误！" });
    }
});

// 用户登录
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "用户名和密码是必填项！" });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection(usersCollectionName);

        const user = await usersCollection.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "用户名或密码错误！" });
        }

        const token = jwt.sign({ username }, jwtSecret, { expiresIn: "24h" });
        res.json({ message: "登录成功！", token });
    } catch (error) {
        console.error("登录时出错：", error);
        res.status(500).json({ error: "服务器错误！" });
    }
});

// 文件上传
app.post("/upload", upload.single("file"), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "未提供授权令牌！" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const username = decoded.username;

        const file = req.file;
        if (!file || path.extname(file.originalname).toLowerCase() !== ".docx") {
            return res.status(400).json({ error: "请上传 .docx 文件！" });
        }

        const fileBuffer = fs.readFileSync(file.path);
        const { value: textContent } = await extractRawText({ buffer: fileBuffer });

        await client.connect();
        const db = client.db(dbName);
        const filesCollection = db.collection(filesCollectionName);

        await filesCollection.insertOne({
            username,
            fileName: file.originalname,
            textContent,
            uploadDate: new Date()
        });

        fs.unlinkSync(file.path);
        res.status(201).json({ message: "文件上传成功！" });
    } catch (error) {
        console.error("文件上传时出错：", error);
        res.status(500).json({ error: "服务器错误！" });
    }
});

// 获取文件内容
app.get("/docx-content", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "未提供授权令牌！" });
    }

    try {
        jwt.verify(token, jwtSecret);

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(filesCollectionName);

        const docxFile = await collection.aggregate([{ $sample: { size: 1 } }]).next();
        if (!docxFile) {
            return res.status(404).json({ error: "MongoDB 中没有文件！" });
        }

        res.json({ username: docxFile.username, content: docxFile.textContent });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "令牌已过期，请重新登录！" });
        }
        console.error("获取文件内容时出错：", error);
        res.status(500).json({ error: "服务器错误！" });
    }
});

// 跨域支持
const cors = require("cors");
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 确保包含 OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: false
}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})