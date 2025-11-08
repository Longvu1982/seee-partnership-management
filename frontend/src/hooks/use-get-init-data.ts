import { useEffect } from "react";
import { useTriggerLoading } from "./use-trigger-loading";

type Callback = () => Promise<void> | void;

type UseGetInitDataOptions = {
  enabled?: boolean;
  dependencies?: React.DependencyList;
};

/**
 * Hook to fetch initial data on component mount
 * @param callback - Function to execute on mount. Can be async or sync.
 * @param options - Optional configuration
 * @param options.enabled - Whether to enable the hook (default: true)
 * @param options.dependencies - Dependencies array for the effect. If not provided, runs only once on mount.
 */
export const useGetInitData = (
  callback: Callback,
  options?: UseGetInitDataOptions
) => {
  const { triggerLoading } = useTriggerLoading();
  const { enabled = true, dependencies = [] } = options || {};

  useEffect(() => {
    if (!enabled) return;

    triggerLoading(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
