const BASE_URL = process.env.REACT_APP_REMINDER_API || 'http://localhost:5000/api/reminders';

async function request(method, path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[Reminder API Error]', data);
    }
    return data;
  } catch (err) {
    console.error('[Reminder API Network Error]', err.message);
    return null;
  }
}

function schedule(task, userEmail) {
  return request('POST', '/schedule', { ...task, userEmail });
}

function update(task, userEmail) {
  return request('PUT', '/update', { ...task, userEmail });
}

function cancel(taskId) {
  return request('DELETE', `/cancel/${taskId}`);
}

function complete(taskId) {
  return request('PATCH', `/complete/${taskId}`);
}

const reminderAPI = { schedule, update, cancel, complete };
export default reminderAPI;
