chrome.runtime.onInstalled.addListener(() => {
    console.log('Installed EasyBookmark');
})
chrome.bookmarks.onCreated.addListener(() => {
    console.log('Created bookmark');
});
