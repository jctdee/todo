import { Task, dateFormatter } from './tasks.js';
import { Project } from './project.js';

function storageAvailable(type) {
  let storage;
  try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch (e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

function saveTask(project, title, description, date) {
  if(storageAvailable('localStorage')) {
    try {
      const taskArray = [];

      // grab task items here first and parse
      if(localStorage.getItem('Tasks') !== null) {
        const deserializedTasks = JSON.parse(localStorage.getItem('Tasks'));

        // insert deserialized list into js array
        for(let i = 0; i < deserializedTasks.length; i++) taskArray.push(deserializedTasks[i]);

        // check if there's a task with same name and date
        if(taskArray.filter(task => task.title === title.value && task.dueDate === dateFormatter(date.value)).length !== 0) {
          return;
        } else {
          // push this new task into tasks array
          const tempTask = new Task(project.value, title.value, description.value, dateFormatter(date.value));
          taskArray.push(tempTask);

          // save the new array into local storage
          localStorage.setItem('Tasks', JSON.stringify(taskArray));

          // refresh the page because it is showing html object
          window.location = window.location;
        }
      } else {
        // NO EXISTING TASK..

        // push this new task into tasks array
        const tempTask = new Task(project.value, title.value, description.value, dateFormatter(date.value));
        taskArray.push(tempTask);

        // save the new array into local storage
        localStorage.setItem('Tasks', JSON.stringify(taskArray));

        // refresh the page because it is showing html object
        window.location = window.location;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function deleteLocalTask(e) {
  const taskTitle = e.childNodes[0].innerText;
  const taskDate = e.childNodes[1].innerText;

  const taskList = JSON.parse(localStorage.getItem('Tasks'));

  // filter the array to return one excluding the title and date
  const newList = taskList.filter(task => task.title !== taskTitle && task.dueDate !== taskDate);

  // replace this new array into the local storage
  localStorage.setItem('Tasks', JSON.stringify(newList));

  // refresh the page
  window.location = window.location;

}

function editLocalTask(project, title, description, date, oldTitle, oldDate) {
  if(storageAvailable('localStorage')) {
    try {
      const taskArray = [];

      // grab task items here and parse
      const deserializedTasks = JSON.parse(localStorage.getItem('Tasks'));

      // check if there's a task with same name and date
      if(deserializedTasks.filter(task => task.title === title.value && task.dueDate === dateFormatter(date.value)).length !== 0) {
        return false;
      } else {
        //function to look for same title & date
        const indexFinder = (element) => element.title === oldTitle.getAttribute('value') && element.dueDate == oldDate.getAttribute('value');
        // in the saveLocalTask function, .value works but not here... used getAttribute('value') instead

        // make a variable to store the index
        const taskIndex = deserializedTasks.findIndex(indexFinder);
        // edit the values at the index found
        deserializedTasks[taskIndex].project = project.value;
        deserializedTasks[taskIndex].title = title.value;
        deserializedTasks[taskIndex].description = description.value;
        deserializedTasks[taskIndex].dueDate = dateFormatter(date.value);

        // insert deserialized list into js array
        for(let i = 0; i < deserializedTasks.length; i++) taskArray.push(deserializedTasks[i]);

        // replace the array in the local storage
        localStorage.setItem('Tasks', JSON.stringify(taskArray));

        // refresh the page because it is showing html object
        window.location = window.location;
      }
    } catch (err) {
      console.log(err);
    }
  } 
}

function saveLocalProject(project) {
  if(storageAvailable('localStorage')) {
    try {
      const projectArray = [];

      // grab task items here first and parse
      if(localStorage.getItem('Projects') !== null) {
        const deserializedProjects = JSON.parse(localStorage.getItem('Projects'));

        // insert deserialized list into js array
        for(let i = 0; i < deserializedProjects.length; i++) projectArray.push(deserializedProjects[i]);

        // check if there's a project with same name
        if(projectArray.filter(task => task.name === project).length !== 0) {
          return;
        } else {
          // push this new task into project array
          const tempProject = new Project(project);
          projectArray.push(tempProject);

          // save the new array into local storage
          localStorage.setItem('Projects', JSON.stringify(projectArray));

          // refresh the page because it is showing html object
          window.location = window.location;
        }
      } else {
        // PROJECT DOES NOT EXIST YET..

        // push this new task into project array
        const tempProject = new Project(project);
        projectArray.push(tempProject);

        // save the new array into local storage
        localStorage.setItem('Projects', JSON.stringify(projectArray));

        // refresh the page because it is showing html object
        window.location = window.location;
      }
    } catch (err) {
      console.log(err);
    }
  } 
}



export { saveTask, deleteLocalTask, editLocalTask, storageAvailable, saveLocalProject };