let idCounter = 0;

export const createId = (prefix = "id"): string => {
  idCounter += 1;
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${randomPart}`;
};
