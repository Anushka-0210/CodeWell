// Simple mock API for frontend development

export async function createTask(task) {
  const id = String(Date.now());
  const newTask = {
    ...task,
    _id: id,
    id,
    status: 'pending'
  };
  return { success: true, data: newTask };
}

export async function deleteTask(taskId) {
  return { success: true, id: taskId };
}

export async function updateTask(taskId, updates) {
  return {
    success: true,
    data: {
      _id: taskId,
      ...updates
    }
  };
}

export async function toggleTaskStatus(taskId, currentStatus = 'pending') {
  const status = currentStatus === 'completed' ? 'pending' : 'completed';
  return {
    success: true,
    data: {
      _id: taskId,
      status
    }
  };
}
