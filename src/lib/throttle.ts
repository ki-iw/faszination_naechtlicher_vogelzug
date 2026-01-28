function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number,
): (...args: T) => void {
  let inThrottle: boolean;

  return function (this: unknown, ...args: T): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export default throttle;
