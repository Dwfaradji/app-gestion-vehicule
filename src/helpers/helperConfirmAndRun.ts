// import {ConfirmOptions, useConfirm} from "@/hooks/useConfirm";
//
// export default async function confirmAndRun<T>(
//     confirm: (message?: ConfirmOptions) => boolean,
//     options: ConfirmOptions,
//     action: () => Promise<T>
// ) {
//     const ok = confirm(options);
//     if (ok) return await action();
//     return null;
// }

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
