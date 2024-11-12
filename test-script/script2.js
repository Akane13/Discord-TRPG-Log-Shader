let characters = [];

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('analyzeButton').addEventListener('click', analyzeCharacters);
document.getElementById('downloadTxtButton').addEventListener('click', downloadProcessedLogTxt);
document.getElementById('downloadWordButton').addEventListener('click', downloadProcessedLogWord);

function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    document.getElementById('logContent').textContent = content;
    document.getElementById('logPreview').style.display = 'block';
  };
  reader.readAsText(file);
}

function analyzeCharacters() {
  const logContent = document.getElementById('logContent').textContent;
  const lines = logContent.split('\n');
  const characterMap = {};

  lines.forEach(line => {
    const match = line.match(/^([^\s]+)\s/);
    if (match) {
      const name = match[1];
      const dateMatch = line.match(/^\S+\s(\d{4}-\d{2}-\d{2})\s/);
      if (dateMatch) {
        const date = dateMatch[1];
        const nameWithDate = `${date} ${name}`;
        if (!characterMap[nameWithDate]) {
          characterMap[nameWithDate] = {
            name: nameWithDate,
            displayName: name,
            color: getRandomColor(),
          };
        }
      }
    }
  });

  characters = Object.values(characterMap);
  displayCharacterSettings();
}

function displayCharacterSettings() {
  const characterSettings = document.getElementById('characterSettings');
  characterSettings.innerHTML = '';

  characters.forEach((character, index) => {
    const characterDiv = document.createElement('div');
    characterDiv.className = 'character';

    const removeButton = document.createElement('button');
    removeButton.textContent = '删除';
    removeButton.style.backgroundColor = 'red';
    removeButton.style.border = 'none';
    removeButton.style.color = 'white';
    removeButton.style.cursor = 'pointer';
    removeButton.onclick = () => {
      characters.splice(index, 1);
      displayCharacterSettings();
      updatePreview();
    };

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = character.name;
    nameInput.readOnly = true;

    const displayNameInput = document.createElement('input');
    displayNameInput.type = 'text';
    displayNameInput.value = character.displayName;
    displayNameInput.oninput = (e) => {
      character.displayName = e.target.value;
      updatePreview();
    };

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = character.color;
    colorInput.oninput = (e) => {
      character.color = e.target.value;
      updatePreview();
    };

    characterDiv.appendChild(removeButton);
    characterDiv.appendChild(nameInput);
    characterDiv.appendChild(displayNameInput);
    characterDiv.appendChild(colorInput);

    characterSettings.appendChild(characterDiv);
  });

  document.getElementById('downloadTxtButton').style.display = 'block';
  document.getElementById('downloadWordButton').style.display = 'block';
  updatePreview();
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function updatePreview() {
  const logContent = document.getElementById('logContent').textContent;
  const lines = logContent.split('\n');
  const processedLines = lines.map(line => {
    const match = line.match(/^([^\s]+)\s/);
    if (match) {
      const name = match[1];
      const dateMatch = line.match(/^\S+\s(\d{4}-\d{2}-\d{2})\s/);
      if (dateMatch) {
        const date = dateMatch[1];
        const nameWithDate = `${date} ${name}`;
        const character = characters.find(c => c.name === nameWithDate);
        if (character) {
          const regex = new RegExp(`^${nameWithDate}`);
          return `<span style="color:${character.color};">${character.displayName}</span>` + line.replace(regex, '');
        }
      }
    }
    return line;
  });

  document.getElementById('logContent').innerHTML = processedLines.join('\n');
}

function downloadProcessedLogTxt() {
  const logContent = document.getElementById('logContent').textContent;
  const lines = logContent.split('\n');
  const processedLines = lines.map(line => {
    const match = line.match(/^([^\s]+)\s/);
    if (match) {
      const name = match[1];
      const dateMatch = line.match(/^\S+\s(\d{4}-\d{2}-\d{2})\s/);
      if (dateMatch) {
        const date = dateMatch[1];
        const nameWithDate = `${date} ${name}`;
        const character = characters.find(c => c.name === nameWithDate);
        if (character) {
          const regex = new RegExp(`^${nameWithDate}`);
          return `${character.displayName}` + line.replace(regex, '');
        }
      }
    }
    return line;
  });

  const processedLog = processedLines.join('\n');
  const blob = new Blob([processedLog], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'processed_log.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadProcessedLogWord() {
  const logContent = document.getElementById('logContent').textContent;
  const lines = logContent.split('\n');
  const processedLines = lines.map(line => {
    const match = line.match(/^([^\s]+)\s/);
    if (match) {
      const name = match[1];
      const dateMatch = line.match(/^\S+\s(\d{4}-\d{2}-\d{2})\s/);
      if (dateMatch) {
        const date = dateMatch[1];
        const nameWithDate = `${date} ${name}`;
        const character = characters.find(c => c.name === nameWithDate);
        if (character) {
          const regex = new RegExp(`^${nameWithDate}`);
          return `<span style="color:${character.color};">${character.displayName}</span>` + line.replace(regex, '');
        }
      }
    }
    return line;
  });

  const processedLog = processedLines.join('\n');
  const blob = new Blob([processedLog], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url   = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'processed_log.docx';
  a.click();
  URL.revokeObjectURL(url);
}
