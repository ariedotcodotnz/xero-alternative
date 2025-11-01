export interface DebounceFunction {
  func: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  timeout?: number;
}

export default (func, timeout = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
