<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <input type="file" accept=".docx" @change="handleFileChange" />
            <button type="submit">上传文件</button>
        </form>
        <p>{{ status }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            file: null, // 存储用户选择的文件
            status: '', // 存储上传状态
        };
    },
    methods: {
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            this.file = selectedFile;
        },
        async handleSubmit() {
            if (!this.file) {
                this.status = '请选择一个 .docx 文件！';
                return;
            }

            // 检查文件类型
            if (
                this.file.type !==
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                this.status = '仅支持上传 .docx 文件！';
                return;
            }

            // 创建 FormData 对象
            const formData = new FormData();
            formData.append('file', this.file);

            try {
                // 发送 POST 请求到后端
                const response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer your_jwt_token`, // 替换为实际的 JWT
                    },
                    body: formData,
                });

                // 处理响应
                if (response.ok) {
                    const result = await response.json();
                    this.status = `上传成功：${result.message}`;
                } else {
                    const error = await response.json();
                    this.status = `上传失败：${error.error}`;
                }
            } catch (error) {
                console.error('上传时出错：', error);
                this.status = '上传失败：服务器错误！';
            }
        },
    },
};
</script>

<style scoped>
/* 组件样式 */
form {
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

input {
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

p {
    margin-top: 10px;
    color: red;
}
</style>