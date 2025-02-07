import { generateCodeImage } from './codeToImage';

interface FileContent {
  path: string;
  content: string;
  language: string;
}

export async function generateScreenshots(files: FileContent[]): Promise<{ [key: string]: string }> {
  const screenshots: { [key: string]: string } = {};

  for (const file of files) {
    try {
      // Generate screenshot for the file
      const base64Image = await generateCodeImage(file.content, file.language);
      
      // Store with a clean filename as the key
      const cleanName = file.path.split('/').pop()?.replace(/[^a-zA-Z0-9.]/g, '_') || 'unknown';
      screenshots[cleanName] = base64Image;
    } catch (error) {
      console.error(`Failed to generate screenshot for ${file.path}:`, error);
    }
  }

  return screenshots;
}
