import { freezeAllTabs, freezeSelectedTabs } from '../utils/tab-freezer.js';

console.log('Tab Freezer background service loaded');

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'freeze-all') {
    try {
      const frozenCount = await freezeAllTabs();
      console.log(`Froze ${frozenCount} tab(s) via keyboard shortcut (Shift+Alt+K)`);
    } catch (error) {
      console.error('Error freezing all tabs:', error);
    }
  } else if (command === 'freeze-selected') {
    try {
      const frozenCount = await freezeSelectedTabs();
      console.log(`Froze ${frozenCount} tab(s) via keyboard shortcut (Shift+Alt+L)`);
    } catch (error) {
      console.error('Error freezing selected tabs:', error);
    }
  }
});