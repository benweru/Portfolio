import { useEffect, useState } from "react";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {projects.map((project, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <p>{project.description}</p>
            <div className="flex justify-between mt-4">
              <a href={project.demo} className="text-blue-500">Live Demo</a>
              <a href={project.github} className="text-gray-500">GitHub</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
