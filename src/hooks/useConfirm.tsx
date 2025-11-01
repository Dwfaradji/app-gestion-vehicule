"use client";

import { JSX, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
};

type UseConfirmReturn = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  ConfirmContainer: JSX.Element | null;
};

export function useConfirm(): UseConfirmReturn {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    return new Promise((resolve) => setResolver(() => resolve));
  };

  const handleClose = () => {
    setOptions(null);
    resolver?.(false);
  };

  const handleConfirm = () => {
    setOptions(null);
    resolver?.(true);
  };

  const ConfirmContainer = options ? (
    <ConfirmModal
      open={true}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={options.title}
      message={options.message}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      variant={options.variant}
    />
  ) : null;

  return { confirm, ConfirmContainer };
}
