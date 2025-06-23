const STORAGE_KEY = 'note-default-md';
let noteId = 'note-default';
const noteArea = document.getElementById('noteArea');
const textarea = document.getElementById('editor');
const preview = document.getElementById('preview');

// 字体大小调整
function setFontSize(size) {
  textarea.style.fontSize = size + 'px';
}

// 恢复上次字体大小
const savedFontSize = localStorage.getItem('note-font-size');
if (savedFontSize) setFontSize(savedFontSize);

// 监听主进程事件
if (window.electronAPI) {
  window.electronAPI.onInitNote((event, id) => {
    noteId = id;
    textarea.value = localStorage.getItem(noteId) || '';
    // 恢复字体大小
    const savedFontSize = localStorage.getItem(`font-size-${noteId}`);
    if (savedFontSize) textarea.style.fontSize = savedFontSize + 'px';
  });
  window.electronAPI.onSetFontSize((event, size) => {
    textarea.style.fontSize = size + 'px';
    localStorage.setItem(`font-size-${noteId}`, size);
  });
  window.electronAPI.onClearNote(() => {
    textarea.value = '';
    localStorage.setItem(noteId, '');
  });
}

// 自动保存内容
textarea.value = localStorage.getItem(noteId) || '';
textarea.addEventListener('input', () => {
  localStorage.setItem(noteId, textarea.value);
});

// 内容变化 → 实时渲染
function updatePreview() {
  preview.innerHTML = marked.parse(textarea.value);
  localStorage.setItem(noteId, textarea.value);
}

// 初始化
let markdown = localStorage.getItem(STORAGE_KEY) || '';
textarea.value = markdown;
updatePreview();

// 切换编辑/预览模式
function setEditing(editing) {
  if (editing) {
    noteArea.classList.add('editing');
    textarea.focus();
  } else {
    noteArea.classList.remove('editing');
    const md = textarea.value;
    localStorage.setItem(STORAGE_KEY, md);
    updatePreview();
  }
}

// 双击切换
noteArea.addEventListener('dblclick', () => setEditing(true));
// Ctrl+E 切换
noteArea.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 'e') {
    setEditing(!noteArea.classList.contains('editing'));
    e.preventDefault();
  }
  // 编辑状态下 Ctrl+Enter 退出编辑
  if (noteArea.classList.contains('editing') && e.ctrlKey && e.key === 'Enter') {
    setEditing(false);
    e.preventDefault();
  }
});
// 失焦自动退出编辑
textarea.addEventListener('blur', () => setEditing(false));
// 实时渲染
textarea.addEventListener('input', updatePreview);

// 初始为预览模式
setEditing(false);

// 快捷键 Ctrl+D/Cmd+D 清空当前便签内容
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    textarea.value = '';
    localStorage.setItem(noteId, '');
    e.preventDefault();
  }
});

// 双击 textarea 清空当前便签内容
textarea.addEventListener('dblclick', () => {
  textarea.value = '';
  localStorage.setItem(noteId, '');
});