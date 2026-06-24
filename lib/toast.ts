import { toast } from "sonner";

let suppressSuccessToasts = 0;

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(message: string) {
  toast.error(message);
}

export function notifyInfo(message: string) {
  toast.message(message);
}

export function areSuccessToastsSuppressed() {
  return suppressSuccessToasts > 0;
}

export async function withoutSuccessToasts<T>(fn: () => Promise<T>) {
  suppressSuccessToasts += 1;
  try {
    return await fn();
  } finally {
    suppressSuccessToasts -= 1;
  }
}
