// Módulo singleton: el Map persiste entre requests en el mismo proceso Node
export const loginAttempts = new Map();
// key: IP string → { count: number, blockedUntil: timestamp }
