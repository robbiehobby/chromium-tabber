import { defaultSettings, Settings } from "./defaults.ts";

const handleCloseTab = (command: string) => {
  if (command !== "close-tab") return;

  chrome.windows.getCurrent({ populate: true }, async (window: chrome.windows.Window) => {
    if (!window.tabs || window.tabs.length === 0) return;
    const tab = window.tabs.find((_tab) => _tab.active);
    if (!tab?.id) return;
    const { settings } = (await chrome.storage.local.get(["settings"])) as { settings: Settings };

    // Verify whether the current tab is protected.
    const { protectPinned, protectGroups } = settings.tab;
    const isProtected = (protectPinned && tab.pinned) || (protectGroups && tab.groupId !== -1);
    if (isProtected) return;

    // Locate other tabs that are neither pinned nor grouped.
    const tabs = window.tabs.filter((_tab) => {
      return !_tab.pinned && _tab.groupId === -1 && _tab.id !== tab.id;
    });

    try {
      if (!tabs.length) {
        if (tab.url?.match(/^\w+:\/\/newtab\//)) return;
        await chrome.tabs.create({});
      }
      await chrome.tabs.remove(tab.id);
    } catch (_e) {}
  });
};

chrome.commands.onCommand.addListener(handleCloseTab);

// Set default settings when the extension is first installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ settings: defaultSettings });
});
