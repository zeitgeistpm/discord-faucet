export const THIRTY_SIX_HOURS = 1000 * 60 * 60 * 36;

export const getNow = () => {
  return Date.now();
};

export const isOkAt = (at: number): Date => {
  const now = getNow();
  return new Date(at + THIRTY_SIX_HOURS);
};

export const ok = (at: number): boolean => {
  const now = getNow();
  return at + THIRTY_SIX_HOURS <= now;
};
