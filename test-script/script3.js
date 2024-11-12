document.getElementById('processLogButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('请先上传文件');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        let logContent = event.target.result;

        // 删除年月日
        if (document.getElementById('removeDate').checked) {
            logContent = logContent.replace(/\d{4}-\d{2}-\d{2}/g, '');
        }

        // 删除时间
        if (document.getElementById('removeTime').checked) {
            logContent = logContent.replace(/\d{2}:\d{2}:\d{2}/g, '');
        }

        // 给名字添加<>
        if (document.getElementById('addBrackets').checked) {
            logContent = logContent.replace(/^(\S+)(\t)/gm, '<$1>$2');
        }

        // 删除戏外记录
        if (document.getElementById('removeOOC').checked) {
            let symbols = [];
            if (document.getElementById('symbolParentheses').checked) symbols.push('\\(');
            if (document.getElementById('symbolStar').checked) symbols.push('\\*');
            const regex = new RegExp(`^\\S+\\s+\\d{4}-\\d{2}-\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}\\s*[${symbols.join('')}].*`, 'gm');
            logContent = logContent.replace(regex, '');
        }

        // 删除冒号
        if (document.getElementById('removeColon').checked) {
            logContent = logContent.replace(/:(?!\/)/g, '');
        }

        // 过滤并缩短 HKTRPG 机器人指令
        if (document.getElementById('filterBotCommands').checked) {
            logContent = logContent.replace(/(\(🤖\)HKTRPG\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}).*D100\s*=\s*(\d+).*/g, '$1 <$2> 掷出了 D100=$2');
        }

        // 删除换行并添加符号
        if (document.getElementById('removeNewlinesAddSymbols').checked) {
            logContent = logContent.replace(/(\S+)(\t)(.*)\n/g, '[$1] $3');
        }

        // 识别角色并换色（示例）
        if (document.getElementById('recognizeRoles').checked) {
            const roles = ['水熙AKANE', '月牙_', '千本 晓'];
            roles.forEach(role => {
                const regex = new RegExp(`^(${role})(.*)`, 'gm');
                logContent = logContent.replace(regex, '<span style="color:blue">$1</span>$2');
            });
        }

        // 删除换行符
        if (document.getElementById('removeNewlines').checked) {
            logContent = logContent.replace(/\n/g, ' ');
        }

        // 在预览区域显示处理后的日志内容
        document.getElementById('logContent').innerText = logContent;
    };

    reader.readAsText(fileInput.files[0]);
});

// 下载处理后的日志为 TXT 文件
document.getElementById('downloadTxtButton').addEventListener('click', function() {
    const text = document.getElementById('logContent').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'processed_log.txt';
    link.click();
});

// 下载 Word 文件
document.getElementById('downloadDocxButton').addEventListener('click', function() {
    const text = document.getElementById('logContent').innerText;
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'processed_log.docx';
    link.click();
});

// 下载 Excel 文件
document.getElementById('downloadExcelButton').addEventListener('click', function() {
    const text = document.getElementById('logContent').innerText;
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'processed_log.xlsx';
    link.click();
});

// 下载 PDF 示例
document.getElementById('downloadPdfButton').addEventListener('click', function() {
    const doc = new jsPDF();
    const text = document.getElementById('logContent').innerText;
    doc.text(text, 10, 10);
    doc.save('processed_log.pdf');
});

