import { useState } from 'react';

export default function Popup() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const STATUS_RESET_DELAY = 3000; // 3 seconds for better visibility

  const copyToClipboard = async () => {
    try {
      setCopyStatus('loading');
      console.log('Copying to clipboard...');
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Active tab:', tab);
      if (!tab?.id) throw new Error('No active tab found');

      // Inject content script if needed (this ensures the content script is ready)
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Extract content from the page
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      console.log('Content extracted:', response);
      
      if (!response?.content) throw new Error('No content received from page');
      
      // Copy to clipboard
      await navigator.clipboard.writeText(response.content);
      
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), STATUS_RESET_DELAY);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), STATUS_RESET_DELAY);
    }
  };

  const saveAsFile = async () => {
    try {
      setSaveStatus('loading');
      console.log('Saving to file...');
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Active tab:', tab);
      if (!tab?.id) throw new Error('No active tab found');

      // Inject content script if needed
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Extract content from the page
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      console.log('Content extracted:', response);
      
      if (!response?.content) throw new Error('No content received from page');
      
      // Create file and trigger download
      const blob = new Blob([response.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const filename = `${tab.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.md`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), STATUS_RESET_DELAY);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), STATUS_RESET_DELAY);
    }
  };

  return (
    <div className="bg-bg-image bg-cover bg-no-repeat bg-center p-6 w-80">
      <div className="flex items-center justify-center mb-4">
        <span className="text-xl mr-2">🦄</span>
        <h1 className="text-xl font-semibold text-white opacity-60">Doc Extractor</h1>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button 
          className={`flex-1 py-2 px-2 rounded-lg transition-all duration-300 ease-in-out shadow-lg ${
            copyStatus === 'loading' 
              ? 'bg-blue-400/70 cursor-wait !hover:bg-blue-400/70' 
              : copyStatus === 'success'
              ? 'bg-green-500/70 !hover:bg-green-500/70'
              : copyStatus === 'error'
              ? 'bg-red-500/70 !hover:bg-red-500/70'
              : 'bg-blueButton/70 hover:bg-blue-600/70'
          } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
          onClick={copyToClipboard}
          disabled={copyStatus === 'loading' || saveStatus === 'loading'}
        >
          <span className="opacity-100">
            {copyStatus === 'loading' ? 'Copying...' 
              : copyStatus === 'success' ? 'Copied!' 
              : copyStatus === 'error' ? 'Failed!' 
              : 'Copy to Clipboard'}
          </span>
        </button>

        <button 
          className={`flex-1 py-2 px-2 rounded-lg transition-all duration-300 ease-in-out shadow-lg ${
            saveStatus === 'loading' 
              ? 'bg-blue-400/70 cursor-wait !hover:bg-blue-400/70' 
              : saveStatus === 'success'
              ? 'bg-green-500/70 !hover:bg-green-500/70'
              : saveStatus === 'error'
              ? 'bg-red-500/70 !hover:bg-red-500/70'
              : 'bg-blueButton/70 hover:bg-blue-600/70'
          } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
          onClick={saveAsFile}
          disabled={saveStatus === 'loading' || copyStatus === 'loading'}
        >
          <span className="opacity-100">
            {saveStatus === 'loading' ? 'Saving...' 
              : saveStatus === 'success' ? 'Saved!' 
              : saveStatus === 'error' ? 'Failed!' 
              : 'Save as File'}
          </span>
        </button>
      </div>
    </div>
  )
}