import './App.css';
import TaskBox from './TasksBox';
import Stack from './Stack';
import { useRef } from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Helmet } from 'react-helmet';
import "react-datepicker/dist/react-datepicker.css";

function App() {

  // Initialize variables and states for managing tasks
  // Pull tasks from the local storage, if exist
  const tasksPull = JSON.parse(localStorage.getItem('tasks')) || [];
  const [removedTasks, setRemovedTasks] = useState(new Stack());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const taskRef = useRef(null);

  // Update remaining time for each task
  if (tasksPull) {
    const today = new Date().getTime();
    for (let i = 0; i < tasksPull.length; i++) {
      tasksPull[i].timeLeft -= (today - tasksPull[i].creationTime) / (1000 * 60 * 60 * 24);
    }
  }

  // Store tasks in state
  const [tasks, setTasks] = useState(tasksPull);


  const handleSubmit = () => {

    const taskNameLabel = document.querySelector('#task_name_label')
    const field_1 = document.querySelector('#field1');
    const taskDateLabel = document.querySelector('#task_date_label')
    const field_2 = document.querySelector('#field2');

    // Initialize variables for new task object
    const taskName = taskRef.current.value
    const taskDate = selectedDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
    const creationTime = new Date().getTime()
    const timeDiff_inDays = (selectedDate.getTime() - creationTime) / (1000 * 60 * 60 * 24)

    /* Blinking occurs when attempting to add 
     a task with a selected date earlier than today's date. */
    if (timeDiff_inDays < -0.1) {
      // if the time difference is less than -0.1, set the border color of name field to red
      // and set the color of the task date label to red
      field_2.style.border = '2px solid red';
      taskDateLabel.style.color = 'red';
      
      // after 600ms, set the color of the date label back to black and
      // the border color of field_2 back to black

      setTimeout(() => {
        taskDateLabel.style.cssText = 'color: black; transition: all 0.4s ease-in-out;';
        field_2.style.cssText = 'border: 2px solid black; transition: all 0.4s ease-in-out;';
      }, 600);
      
      return;
    }
    /* Blinking occurs when attempting to add 
     a task with a empty name */
    if (!field_1.value) {
      // if the field_1 value is empty, set the border color to red
      // and set the color of the task name label to red
      field_1.style.border = '2px solid red';
      taskNameLabel.style.color = 'red';
      
      // after 600ms, set the color of the task name label back to black and
      // the border color of field_1 back to black
      setTimeout(() => {
        taskNameLabel.style.cssText = 'color: black; transition: all 0.4s ease-in-out;';
        field_1.style.cssText = 'border: 2px solid black; transition: all 0.4s ease-in-out;';
      }, 600);
    
      return;
    }
    
    // Concatenate the new task to the existing list of tasks
    // and sort the tasks based on timeLeft
    setTasks((tasks) => {
      tasks = tasks.concat({name: taskName, date: taskDate, creationTime: creationTime, timeLeft: timeDiff_inDays})
      tasks.sort((a, b) => {
        return a.timeLeft - b.timeLeft
      })
      // Store the updated list of tasks in local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks
    });
    

    // Clear input field
    taskRef.current.value = ''
  }

  const handleTaskReturn = () => {
    
    // Check if there are any removed tasks
    if (removedTasks.getSize() === 0) return;
  
    // Pop the most recently removed task
    const deletedTask = removedTasks.pop();
  
    // Update the state of tasks by concatenating the deleted task and sorting by timeLeft
    setTasks((tasks) => {
      tasks = tasks.concat(deletedTask);
      tasks.sort((a, b) => {
        return a.timeLeft - b.timeLeft
      })
      // Store the updated tasks in local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks
    })
  
    // Update the state of removed tasks
    setRemovedTasks(removedTasks)
  }
  

  const handleRemoveTask = (index, task) => {
  
    // Add the removed task to the removedTasks stack
    removedTasks.push(task)
  
    // Remove the task from the tasks array
    tasks.splice(index, 1);
  
    // Sort the remaining tasks by timeLeft
    tasks.sort((a, b) => {
      return a.timeLeft - b.timeLeft
    })
  
    // Store the updated tasks in local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    // Update the state of tasks
    setTasks([...tasks])
  
    // Update the state of removed tasks
    setRemovedTasks(removedTasks)
  }
  
  // Handle task submission when 'Enter' is pressed
  const Enter = event => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };


  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
          <title>Trackify</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
      <header id='header'>
        <h1 id='page_name'>Tasks on track . . . {tasks.length}</h1>
      </header>
      <div id='fields_form'>
        <div>
          <label htmlFor="" id='task_name_label'>Task name</label>
          <input id='field1' maxLength={50} type="text" ref={taskRef} onKeyDown={Enter}/>
        </div>
        <div>
          <label htmlFor="" id='task_date_label'>Due date</label>
          <DatePicker id='field2'
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
          />
        </div>
      </div>
      <div className='buttons'>
        <button onClick={handleSubmit} id='submit'>Add Task</button>
        <button onClick={handleTaskReturn} id='undoDelete'>Undo Delete</button>
      </div>
      <ol>
        <TaskBox tasks={tasks} removeTask={handleRemoveTask} />
      </ol>
    </div>
  );
}

export default App;
