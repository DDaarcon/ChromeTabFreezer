import { freezeAllTabs, freezeSelectedTabs } from '../utils/tab-freezer.js';

document.addEventListener("DOMContentLoaded", () => {
  const freezeAllBtn = document.getElementById('freezeAllBtn');
  const freezeSelectedBtn = document.getElementById('freezeSelectedBtn');
  const statusDiv = document.getElementById('status');

  if (!freezeAllBtn || !freezeSelectedBtn || !statusDiv) return;

  chrome.commands.getAll().then(commands => {
    const freezeAllCommand = commands.find(cmd => cmd.name === 'freeze-all');
    if (freezeAllCommand && freezeAllCommand.shortcut) {
      freezeAllBtn.querySelector('.shortcut')!.textContent = `(${freezeAllCommand.shortcut})`;
    }

    const freezeSelectedCommand = commands.find(cmd => cmd.name === 'freeze-selected');
    if (freezeSelectedCommand && freezeSelectedCommand.shortcut) {
      freezeSelectedBtn.querySelector('.shortcut')!.textContent = `(${freezeSelectedCommand.shortcut})`;
    }
  });

  // Freeze all tabs button
  freezeAllBtn.addEventListener('click', async () => {
    try {
      const frozenCount = await freezeAllTabs();

      if (frozenCount === 0) {
        showStatus(statusDiv, 'No tabs to freeze');
        return;
      }

      showStatus(statusDiv, `Froze ${frozenCount} tab(s)!`);
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        statusDiv.classList.remove('success');
        statusDiv.textContent = '';
      }, 3000);
    } catch (error) {
      console.error('Error freezing tabs:', error);
      showStatus(statusDiv, 'Error freezing tabs');
    }
  });

  // Freeze selected tabs button
  freezeSelectedBtn.addEventListener('click', async () => {
    try {
      const frozenCount = await freezeSelectedTabs();

      if (frozenCount === 0) {
        showStatus(statusDiv, 'No tabs to freeze');
        return;
      }

      showStatus(statusDiv, `Froze ${frozenCount} tab(s)!`);
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        statusDiv.classList.remove('success');
        statusDiv.textContent = '';
      }, 3000);
    } catch (error) {
      console.error('Error freezing tabs:', error);
      showStatus(statusDiv, 'Error freezing tabs');
    }
  });
});

function showStatus(element: HTMLElement, message: string) {
  element.textContent = message;
  element.classList.add('success');
}