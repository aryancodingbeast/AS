import React, { useState } from 'react';
import { Code, ChevronDown, ChevronUp, Download } from 'lucide-react';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadFile = (fileName: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
        <p className="mt-2 text-gray-600">{project.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {project.topics.map((topic) => (
            <span key={topic} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {topic}
            </span>
          ))}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 flex items-center text-indigo-600 hover:text-indigo-500"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide Project Files
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              View Project Files
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-6">
            {project.files.map((file) => (
              <div key={file.name} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-mono text-sm">{file.name}</span>
                  </div>
                  <button
                    onClick={() => downloadFile(file.name, file.content)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <code>{file.content}</code>
                </pre>
                <div className="px-4 py-3 bg-blue-50">
                  <p className="text-sm text-blue-800">{file.description}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">Project Explanation:</h4>
              <p className="mt-2 text-gray-700">{project.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}