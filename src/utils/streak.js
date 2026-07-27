// Daily Explorer Streak System for Vellum Growth Retention

const LOCAL_STORAGE_KEY_STREAK = 'vellum_user_streak_v1';

export function getUserStreak() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_STREAK);
    if (!raw) return { count: 1, lastVisit: new Date().toISOString(), multiplier: 1.0 };
    const data = JSON.parse(raw);
    
    // Check if streak broke (>48h since last visit)
    const lastVisitDate = new Date(data.lastVisit || Date.now());
    const hoursSinceVisit = (Date.now() - lastVisitDate.getTime()) / (1000 * 3600);

    if (hoursSinceVisit > 48) {
      // Streak reset
      const resetData = { count: 1, lastVisit: new Date().toISOString(), multiplier: 1.0 };
      saveUserStreak(resetData);
      return resetData;
    }

    return data;
  } catch (err) {
    console.warn('LocalStorage error reading streak:', err);
    return { count: 1, lastVisit: new Date().toISOString(), multiplier: 1.0 };
  }
}

export function saveUserStreak(streakObj) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_STREAK, JSON.stringify(streakObj));
  } catch (err) {
    console.warn('LocalStorage error saving streak:', err);
  }
}

export function recordDailyVisit() {
  const current = getUserStreak();
  const lastVisitDate = new Date(current.lastVisit || Date.now());
  const isSameDay = lastVisitDate.toDateString() === new Date().toDateString();

  if (isSameDay) return current; // Already recorded today

  const newCount = current.count + 1;
  const newMultiplier = parseFloat((1 + Math.min(newCount * 0.1, 0.5)).toFixed(2)); // up to +50% bonus

  const updated = {
    count: newCount,
    lastVisit: new Date().toISOString(),
    multiplier: newMultiplier,
  };

  saveUserStreak(updated);
  return updated;
}
