import { storageAvailable } from './storage.js';

class Task {
  constructor(project, title, description, dueDate) {
    this.project = project;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
  }

  getProject() {
    return this.project;
  }

  setProject(newProject) {
    this.project = newProject;
  }

  getTitle() {
    return this.title;
  }

  setTitle(newtitle) {
    this.title = newtitle;
  }

  getDescription() {
    return this.description;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  getDueDate() {
    return this.dueDate;
  }

  setDueDate(newDate) {
    this.dueDate = newDate;
  }
}


function addTaskChildren(title, description, date, project, container) {
  const taskItem = document.createElement('div');
  taskItem.classList.add('task-item');

  // CREATE TITLE HERE
  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task-title-container');

  const taskTitleDetails = document.createElement('details');

  const taskTitleDetailsSummary = document.createElement('summary');
  taskTitleDetailsSummary.innerHTML = title;

  const taskTitleProject = document.createElement('p');
  taskTitleProject.innerHTML = project;
  taskTitleProject.style.fontWeight = '600';
  const taskTitleDetailsDescription = document.createElement('p');
  taskTitleDetailsDescription.innerHTML = description;

  taskTitleDetails.appendChild(taskTitleDetailsSummary);
  taskTitleDetails.appendChild(taskTitleProject);
  taskTitleDetails.appendChild(taskTitleDetailsDescription);

  taskTitle.appendChild(taskTitleDetails);

  // CREATE DATE HERE
  const taskDate = document.createElement('div');
  taskDate.classList.add('task-date-container');

  const taskDueDate = document.createElement('p');
  taskDueDate.innerHTML = dateFormatter(date);
  const taskPenIcon = document.createElement('i');
  addPenIcon(taskPenIcon);
  const taskTrashIcon = document.createElement('i');
  addTrashIcon(taskTrashIcon);

  taskDate.appendChild(taskDueDate);
  taskDate.appendChild(taskPenIcon);
  taskDate.appendChild(taskTrashIcon);

  // APPEND TITLE AND DATE HERE
  taskItem.appendChild(taskTitle);
  taskItem.appendChild(taskDate);


  container.appendChild(taskItem);
}

function addPenIcon(element) {
  element.classList.add('fa-regular');
  element.classList.add('fa-pen-to-square');
  element.setAttribute("data-mode", "edit");
}

function addTrashIcon(element) {
  element.classList.add('fa-regular');
  element.classList.add('fa-trash-can');
  element.setAttribute("data-mode", "delete");
}

function dateFormatter(day) {
  const parsedDate = new Date(Date.parse(day));
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const formattedDate = `${month[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  return formattedDate;
}

function getCurrentTask(oldTitle, oldDate) {
  if(storageAvailable('localStorage')) {
    const deserializedTasks = JSON.parse(localStorage.getItem('Tasks'));
    return deserializedTasks.filter(task => task.title === oldTitle && task.dueDate === dateFormatter(oldDate))[0];
  } else {
    throw err;
  }
  
}


export { Task, addTaskChildren, dateFormatter, getCurrentTask } ;