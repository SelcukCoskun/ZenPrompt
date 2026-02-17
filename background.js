// Background Service Worker
// For future features like keyboard shortcuts, context menus, etc.

chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Prompt Optimizer extension loaded!');
});

// Adding Context menu (right-click menu)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'optimizePrompt',
        title: '⚡ Optimize Prompt',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'optimizePrompt' && info.selectionText) {
        // Seçili metni popup'a gönder
        chrome.storage.local.set({ pendingPrompt: info.selectionText });
        chrome.action.openPopup();
    }
});
