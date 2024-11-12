document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('processLogButton').addEventListener('click', processLog);

let logData = '';
let roles = {};  // 角色识别和颜色设定

// 处理文件上传
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        logData = e.target.result;
        // 自动预览
        processLog();
    };
    reader.readAsText(file);
}

// 处理日志
function processLog() {
    let processedLog = logData;

    // 是否删除日期
    if (document.getElementById('removeDate').checked) {
        processedLog = processedLog.replace(/\d{4}-\d{2}-\d{2}/g, '');
    }

    // 是否删除时间
    if (document.getElementById('removeTime').checked) {
        processedLog = processedLog.replace(/\d{2}:\d{2}:\d{2}/g, '');
    }

    // 添加<>在名字周围
    if (document.getElementById('addBrackets').checked) {
        processedLog = processedLog.replace(/^(.*?)(?=\s)/gm, (match) => `<${match.trim()}>`);
    }

    // 删除戏外记录
    if (document.getElementById('removeOOC').checked) {
        const removeSymbols = [];
        if (document.getElementById('symbolParentheses').checked) removeSymbols.push('\\(');
        if (document.getElementById('symbolStar').checked) removeSymbols.push('\\*');
        const symbolRegex = new RegExp(`^(${removeSymbols.join('|')}).*`, 'gm');
        processedLog = processedLog.replace(symbolRegex, '');
    }

    // 删除冒号
    if (document.getElementById('removeColon').checked) {
        processedLog = processedLog.replace(/:/g, '');
    }

    // 过滤机器人指令
    if (document.getElementById('filterBotCommands').checked) {
        processedLog = processedLog.replace(/@\S+\s+1D100[^]*?(?=\d{2}:\d{2})/g, (match) => {
            const name = match.match(/@\S+/)[0];
            const result = match.match(/\d+ → .*/)[0];
            return `<${name}>掷出了 ${result}`;
        });
    }

    // 删除换行并添加符号
    if (document.getElementById('removeNewlinesAddSymbols').checked) {
        processedLog = processedLog.replace(/\n/g, ' ');
    }

    // 识别角色并修改颜色
    if (document.getElementById('recognizeRoles').checked) {
        recognizeRoles(processedLog);
    }

    // 更新预览
    document.getElementById('logContent').textContent = processedLog;
}

// 角色识别和颜色更改
function recognizeRoles(log) {
    const lines = log.split('\n');
    const roleConfigContainer = document.getElementById('roleConfigContainer');
    roleConfigContainer.innerHTML = '';  // 清空之前的角色设定

    lines.forEach((line) => {
        const roleMatch = line.match(/^([^\s]+)\s+/);
        if (roleMatch) {
            const roleName = roleMatch[1];
            if (!roles[roleName]) {
                roles[roleName] = { name: roleName, color: '#000000' }; // 默认颜色

                // 创建角色设置行
                const roleDiv = document.createElement('div');
                const roleInput = document.createElement('input');
                roleInput.type = 'text';
                roleInput.value = roleName;
                roleInput.oninput = (e) => { roles[roleName].name = e.target.value; };

                const colorPicker = document.createElement('input');
                colorPicker.type = 'color';
                colorPicker.value = '#000000';
                colorPicker.oninput = (e) => { roles[roleName].color = e.target.value; };

                roleDiv.appendChild(roleInput);
                roleDiv.appendChild(colorPicker);
                roleConfigContainer.appendChild(roleDiv);
            }
        }
    });

    updatePreviewWithColors(lines);
}

// 根据颜色更新预览
function updatePreviewWithColors(lines) {
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = '';  // 清空之前的预览

    lines.forEach((line) => {
        const roleMatch = line.match(/^([^\s]+)\s+/);
        const logLine = document.createElement('div');

        if (roleMatch) {
            const roleName = roleMatch[1];
            const color = roles[roleName]?.color || '#000000'; // 获取角色颜色
            logLine.style.color = color;
        }
        
        logLine.textContent = line;
        logContent.appendChild(logLine);
    });
}
