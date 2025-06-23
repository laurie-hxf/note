const inputBox = document.getElementById('inputBox');
    const outputText = document.getElementById('outputText');

    inputBox.addEventListener('input', () => {
      outputText.textContent = inputBox.value || '你输入的内容将显示在这里。';
    });