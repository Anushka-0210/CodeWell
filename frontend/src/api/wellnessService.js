export async function createWellnessLog(log) {
  return { success: true, data: { ...log, id: String(Date.now()) } }; 
}

export async function getCurrentStress() {
  return { success: true, stress: 'medium' };
}

export async function getLatestMood() {
  return { success: true, mood: 'neutral' };
}
