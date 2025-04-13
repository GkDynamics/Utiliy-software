const { ipcRenderer } = require('electron');

let selectedPath = null;

document.getElementById('select-folder').addEventListener('click', async () => {
  const dir = await ipcRenderer.invoke('choose-directory');
  if (dir) {
    selectedPath = dir;
    document.getElementById('chosen-path').textContent = `Target: ${dir}`;
  }
});

document.getElementById('create').addEventListener('click', async () => {
  if (!selectedPath) {
    alert('Please select a folder first.');
    return;
  }

  const rawText = document.getElementById('names').value;
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    alert('Please enter some file/folder names.');
    return;
  }

  await ipcRenderer.invoke('create-entries', selectedPath, lines);

  document.getElementById('status').textContent = '✅ Created successfully!';
});
