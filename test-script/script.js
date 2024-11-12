document.getElementById('processLog').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
      alert('请上传一个日志文件');
      return;
    }
  
    const removeDate = document.getElementById('removeDate').checked;
    const removeTime = document.getElementById('removeTime').checked;
    const removeRP = document.getElementById('removeRP').checked;
    const addBrackets = document.getElementById('addBrackets').checked;
    const removeColon = document.getElementById('removeColon').checked;
    const filterDice = document.getElementById('filterDice').checked;
    const roles = document.querySelectorAll('.role');
  
    let roleColors = {};
  
    roles.forEach(role => {
      const roleName = role.getAttribute('data-role');
      const roleColor = role.querySelector('input[type="color"]').value;
      roleColors[roleName] = roleColor;
    });
  
    const reader = new FileReader();
    reader.onload = function(event) {
      let logLines = event.target.result.split('\n');
  
      logLines = logLines.map(line => {
        if (removeDate) {
          line = line.replace(/\d{4}-\d{2}-\d{2}/, '');
        }
        if (removeTime) {
          line = line.replace(/\d{2}:\d{2}:\d{2}/, '');
        }
        if (removeRP && line.includes('（')) {
          return '';
        }
        if (addBrackets) {
          line = line.replace(/^(\S+)(\s)/, '<$1>$2');
        }
        if (removeColon) {
          line = line.replace(/^(\S+)(:)/, '$1');
        }
        if (filterDice && /1D100/.test(line)) {
          line = line.replace(/(.*：)(.*)( → .*)/, '$1$2$3');
        }
        for (let role in roleColors) {
          const regex = new RegExp(`(<${role}>)`, 'g');
          line = line.replace(regex, `<span style="color:${roleColors[role]}">$1</span>`);
        }
        return line;
      });
  
      const output = document.getElementById('output');
      output.innerHTML = logLines.slice(0, 300).join('\n');
      output.dataset.fullLog = logLines.join('\n');
    };
  
    reader.readAsText(fileInput);
  });
  
  document.getElementById('downloadLog').addEventListener('click', function() {
    const output = document.getElementById('output');
    const fullLog = output.dataset.fullLog;
    const blob = new Blob([fullLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_log.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
  