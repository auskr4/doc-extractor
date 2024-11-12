function extractDocContent() {
  // Target main content areas and common documentation elements
  const mainContent = document.querySelector('main, article, .content, .documentation, [role="main"]');
  
  if (!mainContent) {
    return 'No content found';
  }

  // Clone the content to avoid modifying the actual page
  const contentClone = mainContent.cloneNode(true) as HTMLElement;

  // Remove unwanted elements
  const selectorsToRemove = [
    'nav',
    'header',
    'footer',
    '.navigation',
    '.sidebar',
    '.ads',
    '.comments',
    'script',
    'style'
  ];

  selectorsToRemove.forEach(selector => {
    contentClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Extract text content with basic formatting
  return contentClone.innerText.trim();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractDocContent();
    sendResponse({ content });
  }
}); 