import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useDrag, useDrop } from "react-dnd";

const predefinedSections = {
  "API Reference": `## API Reference
  - **Endpoint 1**: Description of endpoint 1.
  - **Endpoint 2**: Description of endpoint 2.
  - **Authentication**: API requires authentication via JWT tokens.
  - **Rate Limiting**: Max 100 requests per minute.
  - **Request Example**:
    \`\`\`
    GET /api/resource
    \`\`\`
  - **Response Example**:
    \`\`\`
    { "data": "value" }
    \`\`\``,

  Demo: `## Demo
  - To demo the project, follow these steps:
    1. Clone the repository: \`git clone <repository_url>\`
    2. Install dependencies: \`npm install\`
    3. Run the app: \`npm start\`
  - Access the demo version at [demo link](http://demo-link.com).`,

  Documentation: `## Documentation
  Comprehensive guide on how to use the project:
  1. **Overview**: This project provides ...
  2. **How to use**: To get started, you need to ...
  3. **Configuration**: How to configure the project for different environments.

  Detailed documentation is available in the README.md file.`,

  Installation: `## Installation
  To install the project, follow these steps:
  1. **Clone the repository**: \`git clone <repository_url>\`
  2. **Install dependencies**: \`npm install\`
  3. **Run the application**: \`npm start\`
  
  For more details, refer to the README.md.`,

  Deployment: `## Deployment
  To deploy the project, follow these steps:
  1. **Choose your hosting platform** (e.g., Heroku, AWS, Vercel).
  2. **Set up environment variables** (check the "Environment Variables" section for details).
  3. **Deploy**: Run the necessary deployment commands specific to your platform (e.g., \`git push heroku main\` for Heroku).
  4. **Monitor deployment logs** for any issues.`,

  "Environment Variables": `## Environment Variables
  The following environment variables are required for the project:
  - \`DB_URI\`: Database connection string.
  - \`PORT\`: Port number for the server to run on (default is 3000).
  - \`JWT_SECRET\`: Secret key for JWT authentication.
  - \`API_KEY\`: API key for third-party integrations.`,

  Features: `## Features
  The key features of this project include:
  1. **User Authentication**: Sign up, login, and JWT-based authentication.
  2. **Real-time Notifications**: Push notifications to keep users updated.
  3. **Data Analytics**: Built-in analytics to track usage.
  4. **REST API**: For seamless integration with other platforms.
  5. **Responsive Design**: Fully responsive across all devices.`,

  "Tech Stack": `## Tech Stack
  Technologies used in this project:
  - **Frontend**: ReactJS, TailwindCSS, Redux
  - **Backend**: Node.js, Express.js, MongoDB
  - **Authentication**: JWT (JSON Web Tokens)
  - **Deployment**: Docker, AWS
  
  This stack ensures high scalability and maintainability for modern web applications.`,

  "Title & Description": `# Title & Description
This is a brief summary of the project, highlighting its main objectives and features. The goal of this project is to ...
It is designed to help users with [specific tasks], and it's built with the following key features...`,
};

const Sidebar = ({ setMarkdown, isImported }) => {
  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSection, setCustomSection] = useState("");

  const addSection = (section) => {
    if (isImported) return; // Prevent adding sections after import
    if (!sections.includes(section)) {
      setSections([...sections, section]);
      setMarkdown(
        (prev) =>
          prev +
          "\n\n" +
          (predefinedSections[section] || `## ${section}\nContent here...`)
      );
    }
  };

  const deleteSection = (section, index) => {
    setSections(sections.filter((s, i) => i !== index)); // Remove based on index
    setMarkdown((prev) => {
      const sectionRegex = new RegExp(
        `(^|\\n)(## ${section}\\n[\\s\\S]*?)(?=(\\n# |$))`,
        "g"
      );
      return prev.replace(sectionRegex, "").trim();
    });
  };

  const handleCustomSection = () => {
    if (customSection.trim()) {
      addSection(customSection);
      setCustomSection("");
      setIsModalOpen(false);
    }
  };

  const moveSection = (dragIndex, hoverIndex) => {
    const updatedSections = [...sections];
    const draggedItem = updatedSections[dragIndex];
    updatedSections.splice(dragIndex, 1);
    updatedSections.splice(hoverIndex, 0, draggedItem);
    setSections(updatedSections);

    const updatedMarkdown = updatedSections
      .map(
        (section) =>
          predefinedSections[section] || `## ${section}\nContent here...`
      )
      .join("\n\n");

    setMarkdown(updatedMarkdown);
  };

  const SectionItem = ({ section, index }) => {
    const [, drag] = useDrag({
      type: "SECTION",
      item: { index },
    });

    const [, drop] = useDrop({
      accept: "SECTION",
      hover: (item) => {
        if (item.index !== index) {
          moveSection(item.index, index);
          item.index = index; // Update dragged item index
        }
      },
    });

    return (
      <li
        ref={(node) => drag(drop(node))}
        className="border py-2 px-3 hover:bg-gray-200 bg-gray-100 border-gray-200 rounded-md flex items-center cursor-pointer gap-1 justify-between"
      >
        <RxDragHandleDots2 className="w-5 h-5" />
        {section}
        <button
          className="text-neutral-700"
          onClick={() => deleteSection(section, index)}
        >
          <FaTrashCan />
        </button>
      </li>
    );
  };

  return (
    <div className="w-1/4 p-4 border-r border-gray-300 h-[90vh] overflow-y-auto">
      <h4 className="font-semibold text-neutral-700 text-lg mb-2">Sections</h4>
      <ul className="flex flex-col gap-2">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <SectionItem key={index} section={section} index={index} />
          ))
        ) : (
          <p className="text-neutral-700 text-sm text-center">
            No sections yet
          </p>
        )}
      </ul>

      <div className="mt-7">
        <p className="text-xs text-neutral-700">
          Click on a section below to add it to your readme
        </p>
        <input
          type="text"
          placeholder="Search section..."
          className="w-full px-3 py-2 my-2 border rounded text-base focus:border-neutral-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="w-full bg-neutral-700 flex gap-1 items-center justify-center font-medium text-white py-2 rounded mb-2 hover:bg-neutral-800"
          disabled={isImported}
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="w-4 h-4" />
          Custom Section
        </button>

        <ul className="flex flex-col gap-2 overflow-y-auto h-[45vh] my-4 px-2">
          {Object.keys(predefinedSections)
            .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
            .map((section, index) => (
              <li
                key={index}
                className="cursor-pointer py-2 px-3 hover:bg-gray-200 bg-gray-100 border border-gray-200 rounded-md"
                onClick={() => addSection(section)}
                style={{ pointerEvents: isImported ? "none" : "auto" }} // Disable interaction if imported
              >
                {section}
              </li>
            ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-2">Enter Section Name</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customSection}
              onChange={(e) => setCustomSection(e.target.value)}
              placeholder="Custom section name"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-800"
                onClick={handleCustomSection}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
