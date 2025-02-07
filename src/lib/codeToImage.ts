import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export async function generateCodeImage(code: string, language: string): Promise<string> {
  // Map common language names to Prism's language identifiers
  const languageMap: { [key: string]: string } = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'python': 'python',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'jsx': 'jsx',
    'tsx': 'tsx',
    'css': 'css',
    'json': 'json',
  };

  const prismLanguage = languageMap[language.toLowerCase()] || 'text';

  // Create a temporary div to hold the highlighted code
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  document.body.appendChild(tempDiv);

  // Create pre and code elements
  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '20px';
  pre.style.backgroundColor = '#1E1E1E';
  pre.style.borderRadius = '8px';
  pre.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

  const codeElement = document.createElement('code');
  codeElement.className = `language-${prismLanguage}`;
  codeElement.textContent = code;
  codeElement.style.fontFamily = 'Fira Code, Consolas, Monaco, monospace';
  codeElement.style.fontSize = '14px';
  codeElement.style.lineHeight = '1.5';

  pre.appendChild(codeElement);
  tempDiv.appendChild(pre);

  // Apply syntax highlighting
  Prism.highlightElement(codeElement);

  // Create canvas with higher resolution for better quality
  const scale = 2; // Increase resolution
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size
  const padding = 20 * scale;
  const lineHeight = 20 * scale;
  const lines = code.split('\n').length;
  canvas.width = 800 * scale;
  canvas.height = (lines * lineHeight) + (padding * 2);

  // Draw background
  ctx.scale(scale, scale);
  ctx.fillStyle = '#1E1E1E';
  ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

  // Draw code
  ctx.font = '14px "Fira Code", Consolas, Monaco, monospace';
  
  // Get the computed styles after Prism has highlighted the code
  const highlightedCode = codeElement.innerHTML;
  const spans = Array.from(codeElement.querySelectorAll('span'));
  let currentX = padding / scale;
  let currentY = (padding / scale) + 14; // Adjust for font height

  spans.forEach(span => {
    const color = window.getComputedStyle(span).color || '#FFFFFF';
    ctx.fillStyle = color;
    ctx.fillText(span.textContent || '', currentX, currentY);
    currentX += ctx.measureText(span.textContent || '').width;

    if (span.textContent?.includes('\n')) {
      currentY += 20;
      currentX = padding / scale;
    }
  });

  // Clean up
  document.body.removeChild(tempDiv);

  // Return as data URL with proper scaling
  return canvas.toDataURL('image/png');
}
