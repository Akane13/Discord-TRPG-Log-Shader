document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('processLogButton').addEventListener('click', processLog);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        logData = e.target.result;
        processLog();
    };
    reader.readAsText(file);
}

let roles = {}; // 用于存储角色名和颜色信息

// 提取角色并渲染设置项
function extractRoles(logContent) {
    const rolePattern = /^([\S ]+?)\t/gm; // 使用正则匹配角色名
    let match;
    roles = {}; // 重置角色列表

    // 从日志内容中提取角色名
    while ((match = rolePattern.exec(logContent)) !== null) {
        const roleName = match[1];
        if (!roles[roleName]) {
            roles[roleName] = { color: 'blue' }; // 默认颜色
        }
    }
    renderRoleSettings();
}

// 渲染角色设置项
function renderRoleSettings() {
    const roleList = document.getElementById('roleList');
    roleList.innerHTML = ''; // 清空角色列表

    for (const roleName in roles) {
        const roleItem = document.createElement('div');
        roleItem.classList.add('role-item');
        
        // 创建角色名称的输入框
        const roleInput = document.createElement('input');
        roleInput.type = 'text';
        roleInput.value = roleName;
        roleInput.oninput = function () {
            const newRoleName = roleInput.value;
            if (newRoleName !== roleName) {
                updateRoleName(roleName, newRoleName);
            }
        };

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.innerText = '删除';
        deleteButton.onclick = function () {
            deleteRole(roleName);
        };

        roleItem.appendChild(roleInput);
        roleItem.appendChild(deleteButton);
        roleList.appendChild(roleItem);
    }
}

// 更新角色名
function updateRoleName(oldName, newName) {
    roles[newName] = roles[oldName]; // 复制原角色的设定
    delete roles[oldName]; // 删除旧角色名
    processLog(); // 重新处理日志内容
}

// 删除角色
function deleteRole(roleName) {
    if (confirm(`确认要删除角色 "${roleName}" 的所有记录吗？`)) {
        const regex = new RegExp(`^${roleName}\\t.*\\n?`, 'gm');
        logContent = logContent.replace(regex, ''); // 删除日志中该角色的所有记录
        delete roles[roleName]; // 删除角色设定
        renderRoleSettings(); // 更新角色列表显示
        document.getElementById('logContent').innerText = logContent; // 更新日志预览
    }
}

function processLog() {
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
            logContent = logContent.replace(/^([\S ]+?)(\t)/gm, '<$1>$2');
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
            logContent = logContent.replace(/^\s*：\s*/gm, '');
        }

        // 过滤并缩短 HKTRPG 机器人指令
        if (document.getElementById('filterBotCommands').checked) {
            logContent = logContent.replace(/(\(🤖\)HKTRPG\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}).*D100\s*=\s*(\d+).*/g, '$1 <$2> 掷出了 D100=$2');
        }

        // 删除换行并添加符号
        if (document.getElementById('removeNewlinesAddSymbols').checked) {
            logContent = logContent.replace(/(\S+)(\t)(.*)\n/g, '[$1]:$3');
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
            logContent = logContent.replace(/(\S+)(\t)(.*)\n/g, '$1');
        }        

        // 在预览区域显示处理后的日志内容
        document.getElementById('logContent').innerText = logContent;
    };

    reader.readAsText(fileInput.files[0]);
};

document.getElementById('preview').addEventListener('change', function() {
    const logContent = document.getElementById('logContent');
    if (this.checked) {
        logContent.setAttribute('contenteditable', 'false');  // 禁用编辑
    } else {
        logContent.setAttribute('contenteditable', 'true');   // 启用编辑
    }
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

