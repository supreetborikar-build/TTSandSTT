/**
 * Utility to download text content as a formatted .txt file
 */
export function downloadTextAsFile(content: string, filenamePrefix: string = 'VoiceFlow-Note'): void {
  if (!content.trim()) {
    throw new Error('No content available to export.');
  }

  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${filenamePrefix}_${dateStr}.txt`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
