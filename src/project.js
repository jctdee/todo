import { storageAvailable } from './storage.js';

class Project {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
  }
}

function getLocalProjects() {
  if(storageAvailable('localStorage')) {
    const deserializedProjects = JSON.parse(localStorage.getItem('Projects'));

    // if there are no Projects, return false
    if (deserializedProjects === null) return false;

    const projectArray = [];
    
    return deserializedProjects;
  } else {
    throw err;
  }
}

function addProjectChildren(proj, container) {
  // create the element here
  const projectItem = document.createElement('li');
  projectItem.classList.add('nav-list-item');
  projectItem.setAttribute('id', proj);
  projectItem.innerText = proj;

  // append it to the parent container
  container.appendChild(projectItem);
}

function addProjectOption(proj, container) {
  //create element here
  const projectItem = document.createElement('option');
  projectItem.setAttribute('value', proj);
  projectItem.innerText = proj;

  container.appendChild(projectItem);
}



export { Project, getLocalProjects, addProjectChildren, addProjectOption };