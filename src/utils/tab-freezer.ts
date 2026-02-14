/**
 * Utility functions for freezing tabs
 */

/**
 * Freeze tabs by their IDs
 * @param tabIds Array of tab IDs to freeze
 * @returns Number of tabs successfully frozen
 */
export async function freezeTabs(tabIds: number[]): Promise<number> {
  let frozenCount = 0;
  for (const tabId of tabIds) {
    try {
      await chrome.tabs.discard(tabId);
      frozenCount++;
    } catch (error) {
      console.error(`Failed to discard tab ${tabId}:`, error);
    }
  }
  return frozenCount;
}

/**
 * Freeze all tabs in the current window
 * @returns Number of tabs frozen
 */
export async function freezeAllTabs(): Promise<number> {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    if (tabs.length === 0) {
      return 0;
    }
    const tabIds = tabs.map(tab => tab.id).filter((id): id is number => id !== undefined);
    return await freezeTabs(tabIds);
  } catch (error) {
    console.error('Error freezing all tabs:', error);
    throw error;
  }
}

/**
 * Freeze selected tabs or the current tab if none are selected
 * @returns Number of tabs frozen
 */
export async function freezeSelectedTabs(): Promise<number> {
  try {
    // Get selected tabs in the current window, or the active tab if none are selected
    let tabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
    
    // If no tabs are selected, get the currently active tab
    if (tabs.length === 0) {
      tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    }

    if (tabs.length === 0) {
      return 0;
    }

    const tabIds = tabs.map(tab => tab.id).filter((id): id is number => id !== undefined);
    return await freezeTabs(tabIds);
  } catch (error) {
    console.error('Error freezing selected tabs:', error);
    throw error;
  }
}
