import { ConfirmOptions } from "@/hooks/useConfirm";

export default async function confirmAndRun<T>(
  confirm: (options: ConfirmOptions) => Promise<boolean>,
  options: ConfirmOptions,
  action: () => Promise<T>,
): Promise<T | null> {
  const ok = await confirm(options); // <- ici on attend la promesse
  if (ok) return await action();
  return null;
}
