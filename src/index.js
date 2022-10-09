import { addTaskChildren, dateFormatter, getCurrentTask } from './tasks.js';
import { getLocalProjects, addProjectChildren, addProjectOption } from './project.js';
import { saveTask, deleteLocalTask, editLocalTask } from './storage.js';


const taskModal = document.getElementById('task-modal');
const editModal = document.getElementById('edit-modal');
const taskContainer = document.getElementById('task-container');
const taskForm = document.getElementById('task-form');
const editForm = document.getElementById('edit-form');
let closeType;
let editType;

window.onload = (event) => {
  homeTab();

  // CREATE TAB NAVIGATION HERE
  document.getElementById('home').addEventListener('click', () => {
    homeTab();
  })
  document.getElementById('today').addEventListener('click', () => {
    todayTab();
  })

  createProjectTab();
  document.querySelector('.nav-list').addEventListener('click', (e) => {
    if(e.target && e.target.nodeName === 'LI' && e.target.id !== 'projects' && e.target.id !== 'add-project-button') {
      setActive(e.target.id);
    }
  })
}



taskForm.addEventListener('submit', () => {
  closeType = 'submit';
});

editForm.addEventListener('submit', () => {
  editType = 'submit';
})


document.getElementById('task-cancel').addEventListener('click', () => {
  closeType = null;
  taskModal.close();
});


taskContainer.addEventListener('click', (e) => {
  if(e.target && e.target.dataset.mode === 'delete') {
    if(confirm('Are you sure you want to remove this To Do Task?')) deleteLocalTask(e.target.parentNode.parentNode);
  } else if (e.target && e.target.dataset.mode === 'edit') {
    const editDate = document.getElementById('edit-date');
    editDate.setAttribute('min', minDate());
    editModal.showModal();
    setTempOldValues(e.target.parentNode.parentNode);
  }
})

taskModal.addEventListener('close', () => {
  if(closeType === 'submit') {
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskDate = document.getElementById('task-date');
    const taskProject = document.getElementById('task-project');
  
    if(saveTask(taskProject, taskTitle, taskDescription, taskDate)) {
      addTaskChildren(taskTitle, taskDescription, taskDate, taskProject, taskContainer);
      document.getElementById('task-error-message').classList.add('hidden');
    } else {
      document.getElementById('task-error-message').classList.remove('hidden');
      taskModal.showModal();
    }
  } 
})

editModal.addEventListener('close', () => {
  if(editType === 'submit') {
    const taskTitle = document.getElementById('edit-title');
    const taskDescription = document.getElementById('edit-description');
    const taskDate = document.getElementById('edit-date');
    const taskProject = document.getElementById('edit-project');
    const oldTitle = document.getElementById('old-title');
    const oldDate = document.getElementById('old-date');
  
    if(editLocalTask(taskProject, taskTitle, taskDescription, taskDate, oldTitle, oldDate)){
      document.getElementById('edit-error-message').classList.add('hidden');
    } else {
      document.getElementById('edit-error-message').classList.remove('hidden');
      editModal.showModal();
    }
  }
  
})

function setTempOldValues(e) {
  // temporary store values of task here
  const taskTitle = e.childNodes[0].childNodes[0].firstChild.innerText
  const taskDate = e.childNodes[1].innerText;

  document.getElementById('old-title').setAttribute('value', taskTitle);
  document.getElementById('old-date').setAttribute('value', taskDate);

  // also set modal values here
  const currentTask = getCurrentTask(taskTitle, taskDate);
  document.getElementById('edit-title').value = currentTask.title;
  document.getElementById('edit-description').value = currentTask.description;
  document.getElementById('edit-project').value = currentTask.project;
  document.getElementById('edit-date').value = formatDate(currentTask.dueDate);
  console.log(currentTask.dueDate);
}

function minDate() {
  const parsedDate = new Date(Date.now());
  const minDay = ("0" + parsedDate.getDate()).slice(-2);
  const minMonth = ("0" + (parsedDate.getMonth() + 1)).slice(-2);
  return `${parsedDate.getFullYear()}-${minMonth}-${minDay}`;
}


function formatDate(date) {
  // THIS FUNCTION IS TO CONVERT STRING OF DATE E.G, (OCTOBER 11, 2022) TO YYYY/MM/DD FORMAT E.G,  (2022-10-11)
  const newDate = date.split(' ');
  const newYear = newDate[2];
  let newDay;
  if(newDate[1].length === 3) {
    newDay = newDate[1].slice(0, 2);
  } else {
    newDay = "0" + newDate[1].slice(0,1);
  }
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthIndex = months.indexOf(newDate[0]) + 1;
  return `${newYear}-${monthIndex}-${newDay}`;
}

// TAB CREATORS HERE

function homeTab() {
  resetContainer();
  setActive('home');
  createTaskHeader('Home');
  if(!localStorage.getItem('Tasks')) {

  } else {
    const taskList = JSON.parse(localStorage.getItem('Tasks'));
    taskList.forEach(task => {
      addTaskChildren(task.title, task.description, task.dueDate, task.project, taskContainer);
    })
    createTaskButton();
  }
}

function todayTab() {
  resetContainer();
  setActive('today');
  createTaskHeader('Today');
  if(!localStorage.getItem('Tasks')) {

  } else {
    const taskList = JSON.parse(localStorage.getItem('Tasks')).filter(task => task.dueDate === dateFormatter(minDate()));
    taskList.forEach(task => {
      addTaskChildren(task.title, task.description, task.dueDate, task.project, taskContainer);
    })
    createTaskButton();
  }
}

function createProjectTab() {
  const projects = getLocalProjects();

  if(projects) {
    projects.forEach(proj => {
      addProjectChildren(proj.name, document.querySelector('ul'));
    });
  }
  createAddProjectButton();
}

function createProjectOptions(selectId) {
  const projects = getLocalProjects();
  const select = document.querySelector(selectId);

  if(projects) {
    projects.forEach(proj => {
      addProjectOption(proj.name, select);
    })
  }
}

function createAddProjectButton() {
  const addProject = document.createElement('li');
  addProject.classList.add('nav-list-item');
  addProject.setAttribute('id', 'add-project-button');
  addProject.innerText = '+add project';
  const hr = document.createElement('hr');

  document.querySelector('ul').appendChild(addProject);
}

function createTaskHeader(tab) {
  //header
  const taskHeader = document.createElement('div');
  taskHeader.innerText = tab;
  taskHeader.classList.add('task-header');

  taskContainer.appendChild(taskHeader);
}

function createTaskButton() {
  //add task button
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('add-task-container');
  const taskButton = document.createElement('button');
  taskButton.setAttribute('id', 'add-task-button');
  taskButton.innerText = 'Add Task';
  buttonContainer.appendChild(taskButton);
  taskContainer.appendChild(buttonContainer);

  createTaskButtonlistener();
}

function createTaskButtonlistener() {
  const addTaskButton = document.getElementById('add-task-button');
  addTaskButton.addEventListener('click', () => {
    const taskDate = document.getElementById('task-date');
    taskDate.setAttribute('min', minDate());
    createProjectOptions('#task-project');
    taskModal.showModal();
  })
}

function setActive(tab) {
  const activeTab = document.getElementById(tab);
  removeActive();
  activeTab.classList.add('active-item');
}

function removeActive() {
  const navItems = document.getElementsByTagName('li');
  Array.from(navItems).forEach(item => {
    item.classList.remove('active-item');
  });
}

function resetContainer() {
  taskContainer.innerHTML = "";
}
