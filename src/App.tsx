import React, { useState } from 'react';
import { GraduationCap, Loader2, BookOpen, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { generateProject, generateAllTopics } from './lib/gemini';
import { generateCodeImage } from './lib/codeToImage';
import { CodeBlock } from './components/CodeBlock';

const topics = [
  'Python Variables and Data Types',
  'Control Flow (If Statements and Loops)',
  'Functions and Parameters',
  'Lists and Dictionaries',
  'File Handling',
  'Object-Oriented Programming',
  'Error Handling',
  'Modules and Packages'
];

function App() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenshots, setScreenshots] = useState<{ [key: string]: string }>({});

  const handleGenerate = async () => {
    if (!selectedTopic) {
      setError('Please select a topic');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    setScreenshots({});

    try {
      const content = await generateProject(selectedTopic);
      setGeneratedContent(content);

      // Extract code blocks and generate screenshots
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const codeBlocks: { language: string; code: string }[] = [];
      let match;

      while ((match = codeBlockRegex.exec(content)) !== null) {
        codeBlocks.push({
          language: match[1] || 'text',
          code: match[2].trim()
        });
      }

      // Generate screenshots for each code block
      const shots: { [key: string]: string } = {};
      for (let i = 0; i < codeBlocks.length; i++) {
        const { language, code } = codeBlocks[i];
        try {
          const base64Image = await generateCodeImage(code, language);
          shots[`code_block_${i + 1}_${language}`] = base64Image;
        } catch (error) {
          console.error(`Failed to generate screenshot for code block ${i + 1}:`, error);
        }
      }
      setScreenshots(shots);

    } catch (error) {
      setError('Failed to generate content. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    setIsLoading(true);
    setError('');
    setSelectedTopic('');
    
    try {
      const content = await generateAllTopics(topics);
      setGeneratedContent(content);
    } catch (err) {
      setError('Failed to generate complete course. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = selectedTopic ? 
      `${selectedTopic.toLowerCase().replace(/\s+/g, '-')}.md` : 
      'complete-python-course.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadScreenshot = (filename: string, base64Image: string) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllScreenshots = () => {
    Object.entries(screenshots).forEach(([filename, base64Image]) => {
      downloadScreenshot(filename, base64Image);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Python Project Generator</h1>
                <p className="text-indigo-200">Generate custom Python projects with AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-4"
            >
              <option value="">Choose a topic...</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedTopic}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  'Generate Single Topic'
                )}
              </button>

              <button
                onClick={handleGenerateAll}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Generate Complete Course
                  </>
                )}
              </button>

              {generatedContent && (
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download Markdown
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {generatedContent && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Generated Content</h2>
                  {Object.keys(screenshots).length > 0 && (
                    <button
                      onClick={downloadAllScreenshots}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Download All Screenshots
                    </button>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                          <CodeBlock
                            language={match ? match[1] : ''}
                            value={String(children).replace(/\n$/, '')}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {generatedContent}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Code Screenshots Display */}
              {Object.entries(screenshots).length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">Code Screenshots</h2>
                  <div className="grid gap-8">
                    {Object.entries(screenshots).map(([filename, base64Image]) => (
                      <div key={filename} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {filename.replace(/_/g, ' ')}
                          </h3>
                          <button
                            onClick={() => downloadScreenshot(filename, base64Image)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                        <img 
                          src={base64Image} 
                          alt={`Code: ${filename}`}
                          className="w-full rounded-lg shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Code Screenshot Generator</h2>
          <label className="block mb-4">
            <span className="text-gray-700">Upload Code Files:</span>
            <input
              type="file"
              multiple
              className="mt-2 block w-full text-gray-700"
              accept=".js,.jsx,.ts,.tsx,.py,.css,.html,.json"
            />
          </label>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Python Project Generator. Generated content is for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;