# Markdown清洗工具

这是一个简单实用的Markdown格式转换工具，专为解决从大模型复制Markdown格式文本到Word等编辑器中的格式问题而设计。

## 主要功能

- **Markdown清洗**：一键移除Markdown格式符号，保留纯文本内容
- **自定义转换**：可选择是否清除代码块、保留列表符号、转换标题、保留换行等
- **实时预览**：即时查看转换效果，所见即所得
- **一键复制**：快速复制转换后的文本内容
- **历史记录**：自动保存最近10条转换记录，方便重复使用

## 使用说明

1. 在左侧文本框中粘贴需要转换的Markdown格式文本
2. 根据需要选择转换选项
3. 实时查看右侧预览框中的转换结果
4. 点击"复制到剪贴板"按钮将结果复制到剪贴板
5. 在Word或其他编辑器中粘贴即可获得干净的文本

## 转换选项说明

- **清除代码块**：移除被```包围的代码块内容
- **保留列表符号**：保留无序列表的- * +符号和有序列表的数字编号
- **转换标题**：移除#号标题标记，保留标题文本
- **保留换行**：保留原文本中的换行格式，不合并段落

## 技术实现

- 纯前端实现，无需后端服务器
- 使用Tailwind CSS实现响应式设计
- 使用localStorage保存历史记录
- 通过正则表达式实现Markdown格式转换
- 使用clipboard-polyfill实现跨浏览器的复制功能

## 本地部署

只需将项目文件下载到本地，用浏览器打开index.html文件即可使用。

## 在线访问

访问[https://你的网站.com/markdown-cleaner](https://你的网站.com/markdown-cleaner)即可使用在线版本。

## 后续计划

- 添加更多转换选项和高级功能
- 支持自定义转换规则
- 实现暗黑模式
- 添加更多工具集成

## 反馈与建议

如有任何问题或建议，请通过以下方式联系：

- 邮箱：your.email@example.com
- GitHub：[你的GitHub](https://github.com/yourusername)

---

© 2024 网络工具箱 | 保留所有权利 