document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const markdownInput = document.getElementById('markdownInput');
    const outputPreview = document.getElementById('outputPreview');
    const copyOutputBtn = document.getElementById('copyOutput');
    const clearInputBtn = document.getElementById('clearInput');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const historyContainer = document.getElementById('historyContainer');
    const emptyHistory = document.getElementById('emptyHistory');
    
    // 获取选项复选框
    const removeCodeBlocksCheckbox = document.getElementById('removeCodeBlocks');
    const keepListSymbolsCheckbox = document.getElementById('keepListSymbols');
    const convertHeadersCheckbox = document.getElementById('convertHeaders');
    const keepLineBreaksCheckbox = document.getElementById('keepLineBreaks');
    
    // 初始化历史记录
    let history = JSON.parse(localStorage.getItem('markdownHistory')) || [];
    updateHistoryUI();
    
    // 主转换函数
    function convertMarkdown(text) {
        if (!text) return '';
        
        let converted = text;
        
        // 清除代码块
        if (removeCodeBlocksCheckbox.checked) {
            converted = converted.replace(/```[\s\S]*?```/g, '');
        }
        
        // 转换标题
        if (convertHeadersCheckbox.checked) {
            // 将标题转为普通文本，保留文本内容
            converted = converted.replace(/^#{1,6}\s+(.*?)$/gm, '$1');
        }
        
        // 处理列表符号
        if (!keepListSymbolsCheckbox.checked) {
            // 移除无序列表符号
            converted = converted.replace(/^[\s]*[-*+]\s+/gm, '');
            // 移除有序列表编号
            converted = converted.replace(/^[\s]*\d+\.\s+/gm, '');
        }
        
        // 处理换行
        if (!keepLineBreaksCheckbox.checked) {
            // 合并连续的换行为一个换行
            converted = converted.replace(/\n{3,}/g, '\n\n');
            
            // 合并段落内的换行
            converted = converted.replace(/([^\n])\n([^\n])/g, '$1 $2');
        }
        
        // 通用转换规则
        converted = converted
            // 移除粗体标记
            .replace(/\*\*(.*?)\*\*/g, '$1')
            // 移除斜体标记
            .replace(/\*(.*?)\*/g, '$1')
            // 移除下划线标记
            .replace(/__(.*?)__/g, '$1')
            // 移除删除线标记
            .replace(/~~(.*?)~~/g, '$1')
            // 移除内联代码标记
            .replace(/`([^`]+)`/g, '$1')
            // 移除链接，保留链接文本
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            // 移除图片，保留alt文本
            .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
            // 移除HTML标签
            .replace(/<[^>]*>/g, '');
        
        return converted;
    }
    
    // 实时转换预览
    markdownInput.addEventListener('input', function() {
        const markdown = this.value;
        const converted = convertMarkdown(markdown);
        outputPreview.textContent = converted;
    });
    
    // 复选框变化时重新转换
    const checkboxes = [removeCodeBlocksCheckbox, keepListSymbolsCheckbox, convertHeadersCheckbox, keepLineBreaksCheckbox];
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const markdown = markdownInput.value;
            const converted = convertMarkdown(markdown);
            outputPreview.textContent = converted;
        });
    });
    
    // 复制到剪贴板
    copyOutputBtn.addEventListener('click', function() {
        const textToCopy = outputPreview.textContent;
        
        if (!textToCopy) {
            showNotification('没有内容可复制');
            return;
        }
        
        clipboardPolyfill.writeText(textToCopy).then(function() {
            // 成功复制到剪贴板
            copyOutputBtn.classList.add('copy-success');
            copyOutputBtn.textContent = '已复制!';
            showNotification('已复制到剪贴板');
            
            // 保存到历史记录
            saveToHistory(markdownInput.value, textToCopy);
            
            // 恢复按钮状态
            setTimeout(function() {
                copyOutputBtn.classList.remove('copy-success');
                copyOutputBtn.textContent = '复制到剪贴板';
            }, 2000);
        }).catch(function() {
            showNotification('复制失败，请重试');
        });
    });
    
    // 清空输入
    clearInputBtn.addEventListener('click', function() {
        markdownInput.value = '';
        outputPreview.textContent = '';
    });
    
    // 清空历史记录
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('确定要清空所有历史记录吗？')) {
            history = [];
            localStorage.removeItem('markdownHistory');
            updateHistoryUI();
            showNotification('历史记录已清空');
        }
    });
    
    // 保存到历史记录
    function saveToHistory(input, output) {
        if (!input || !output) return;
        
        // 创建新的历史记录项
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            input: input,
            output: output,
            preview: input.substring(0, 50) + (input.length > 50 ? '...' : '')
        };
        
        // 添加到历史记录最前面
        history.unshift(historyItem);
        
        // 限制历史记录数量为10条
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // 保存到本地存储
        localStorage.setItem('markdownHistory', JSON.stringify(history));
        
        // 更新UI
        updateHistoryUI();
    }
    
    // 更新历史记录UI
    function updateHistoryUI() {
        if (history.length === 0) {
            emptyHistory.style.display = 'block';
            return;
        }
        
        emptyHistory.style.display = 'none';
        
        // 清空容器
        while (historyContainer.firstChild) {
            if (historyContainer.firstChild === emptyHistory) {
                historyContainer.appendChild(emptyHistory);
                break;
            }
            historyContainer.removeChild(historyContainer.firstChild);
        }
        
        // 添加历史记录项
        history.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item fade-in';
            historyElement.innerHTML = `
                <div class="timestamp">${item.timestamp}</div>
                <div class="preview">${item.preview}</div>
            `;
            
            // 点击历史记录项恢复内容
            historyElement.addEventListener('click', function() {
                markdownInput.value = item.input;
                outputPreview.textContent = item.output;
                showNotification('已恢复历史记录');
            });
            
            historyContainer.appendChild(historyElement);
        });
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 自动移除通知
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // 示例用法
    const exampleMarkdown = `# Markdown示例
这是一个**粗体**和*斜体*文本的示例。

## 代码块示例
\`\`\`javascript
function hello() {
    console.log("Hello World!");
}
\`\`\`

### 列表示例
- 项目1
- 项目2
  - 子项目A
  - 子项目B

1. 第一步
2. 第二步

> 这是一段引用文本

[这是一个链接](https://example.com)

![图片描述](image.jpg)
`;

    // 添加示例按钮
    const exampleBtn = document.createElement('button');
    exampleBtn.textContent = '加载示例';
    exampleBtn.className = 'text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded ml-2';
    clearInputBtn.parentNode.appendChild(exampleBtn);
    
    exampleBtn.addEventListener('click', function() {
        markdownInput.value = exampleMarkdown;
        const converted = convertMarkdown(exampleMarkdown);
        outputPreview.textContent = converted;
    });
}); 