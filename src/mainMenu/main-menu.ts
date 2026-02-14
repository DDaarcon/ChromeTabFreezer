document.addEventListener("DOMContentLoaded", () => {
  const freezeAllBtn = document.getElementById('freezeAllBtn');
  const freezeSelectedBtn = document.getElementById('freezeSelectedBtn');
  const statusDiv = document.getElementById('status');

  if (!freezeAllBtn || !freezeSelectedBtn || !statusDiv) return;

  // Freeze all tabs button
  freezeAllBtn.addEventListener('click', async () => {
    try {
      // Get all tabs in the current window
      const tabs = await chrome.tabs.query({ currentWindow: true });

      if (tabs.length === 0) {
        showStatus(statusDiv, 'No tabs to freeze');
        return;
      }

      // Discard all tabs to freeze them (they won't be unloaded, just put in sleep mode)
      const tabIds = tabs.map(tab => tab.id).filter((id): id is number => id !== undefined);
      
      for (const tabId of tabIds) {
        try {
          await chrome.tabs.discard(tabId);
        } catch (error) {
          console.error(`Failed to discard tab ${tabId}:`, error);
        }
      }

      showStatus(statusDiv, `Froze ${tabIds.length} tab(s)!`);
      
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
      // Get selected tabs in the current window, or the active tab if none are selected
      let tabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
      
      // If no tabs are selected, get the currently active tab
      if (tabs.length === 0) {
        tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      }

      if (tabs.length === 0) {
        showStatus(statusDiv, 'No tabs to freeze');
        return;
      }

      // Discard selected tabs
      const tabIds = tabs.map(tab => tab.id).filter((id): id is number => id !== undefined);
      
      for (const tabId of tabIds) {
        try {
          await chrome.tabs.discard(tabId);
        } catch (error) {
          console.error(`Failed to discard tab ${tabId}:`, error);
        }
      }

      showStatus(statusDiv, `Froze ${tabIds.length} tab(s)!`);
      
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