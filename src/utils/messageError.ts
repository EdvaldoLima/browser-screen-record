export function messageError(msg: string, error?: DOMException | Error | string) {
    if (typeof error !== "undefined") {
        console.error(msg, error);
    }
}
