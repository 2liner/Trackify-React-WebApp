import './App.css'
import { useState } from 'react';
import { motion } from 'framer-motion';

const TaskBox = ({ tasks, removeTask }) => {

  // Keep track of date format change
  const [showDate, setShowDate] = useState(true)

  // Calculate the color of task based on the remaining time of the task
  const colorCalculator = (timeLeft) => {
    let r, g, b;
    let percentage = timeLeft / 10;
    if (percentage <= 0.5) {
      r = 255;
      g = 255 * percentage * 0.5;
      b = 0;
    } else {
      r = 255 * (2 - percentage);
      g = 255 * percentage / 1.5;
      b = 0;
    }
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  // Function to display the remaining time of the task in a proper format (days or hours)
  const timeDisplay = (task) => {
    const timeLeft = task.timeLeft * 24
    if (timeLeft >= 24) {
      return Math.round(timeLeft / 24) + ' days'
    } else if (timeLeft > 0) {
      return timeLeft.toFixed(1) + ' hours'
    } else if (timeLeft > -4) {
      return 'Today!'
    }
    else {
      return 'Past deadline'
    }
  }

  return (
    <div id="tasks_box">
      {tasks.map((task, index) => {
        return (
          <motion.div
          initial={{scale: 0.8, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          id="task" key={index} style={{ backgroundColor: `${colorCalculator(task.timeLeft)}` }}>
            <div id="task_name" onClick={() => removeTask(index, task)}>
              {task.name}
            </div>
            <div id="task_date" onClick={() => setShowDate(!showDate)}>
              {(showDate ? task.date.toString() : timeDisplay(task))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TaskBox;

