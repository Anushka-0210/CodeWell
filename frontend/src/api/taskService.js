// Simple mock API for frontend development

export async function createTask(task) {
  const newTask = {
    ...task,
    _id: String(Date.now()),
    status: 'pending'
  };
  return { success: true, data: newTask };
}

export async function deleteTask(taskId) {
  return { success: true, id: taskId };
}

export async function toggleTaskStatus(taskId) {
  return {
    success: true,
    data: {
      _id: taskId,
      status: 'completed'
    }
  };
}
