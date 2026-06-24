"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  ConfirmDialog,
  type ConfirmDialogProps,
} from "@/components/ui/confirm-dialog";

export type ConfirmDialogOptions = {
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogProps["variant"];
  onConfirm: () => void | Promise<void>;
};

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  const confirm = useCallback((next: ConfirmDialogOptions) => {
    setOptions(next);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && isConfirming) return;
      setOpen(next);
      if (!next) {
        setOptions(null);
      }
    },
    [isConfirming]
  );

  const handleConfirm = useCallback(async () => {
    if (!options) return;

    setIsConfirming(true);
    try {
      await options.onConfirm();
      setOpen(false);
      setOptions(null);
    } finally {
      setIsConfirming(false);
    }
  }, [options]);

  const confirmDialog = options ? (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      variant={options.variant}
      onConfirm={handleConfirm}
      isConfirming={isConfirming}
    />
  ) : null;

  return { confirm, confirmDialog };
}
