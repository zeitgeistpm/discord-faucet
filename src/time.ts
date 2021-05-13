export const THIRTY_SIX_HOURS = 1000 * 60 * 60 * 36;
export const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

export const getNow = () => {
  return Date.now();
};

export const isOkAt = (at: number): Date => {
  const now = getNow();
  return new Date(at + TWENTY_FOUR_HOURS);
};

export const ok = (at: number): boolean => {
  const now = getNow();
  return at + TWENTY_FOUR_HOURS <= now;
};
