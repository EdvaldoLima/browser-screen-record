export function messageError(msg: string, error?: ErrorCallback | string) {
  if (typeof error !== "undefined") {
    console.error(msg, error);
  }
}
