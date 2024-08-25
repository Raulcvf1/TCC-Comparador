document.addEventListener('DOMContentLoaded', () => {
  const switchInput = document.getElementById('mySwitch');
  const lblTheme = document.getElementById('lblTheme');
  const body = document.body;

  // Força o tema escuro no carregamento
  body.classList.add('dark-mode');
  switchInput.checked = true;
  lblTheme.textContent = 'Modo Escuro';

  // Adiciona um ouvinte de evento para o switch
  switchInput.addEventListener('change', () => {
    if (switchInput.checked) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      lblTheme.textContent = 'Modo Escuro';
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      lblTheme.textContent = 'Modo Claro';
    }
  });
});
