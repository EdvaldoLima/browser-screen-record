export function errorMsg(msg, error) {
  if (typeof error !== "undefined") {
    console.error(msg, error);
  }
}
