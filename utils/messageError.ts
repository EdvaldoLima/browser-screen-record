export function errorMsg(msg: string, error: any = undefined) {
  if (typeof error !== "undefined") {
    console.error(msg, error);
  }
}
