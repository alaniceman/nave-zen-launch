import { useEffect } from "react";
import { useTrialModal } from "@/hooks/useTrialModal";
import { attachTrialDelegation } from "@/utils/attachTrialDelegation";

export const TrialDelegationHandler = () => {
  const { openTrialModal } = useTrialModal();

  useEffect(() => {
    const cleanup = attachTrialDelegation(openTrialModal);
    return cleanup;
  }, [openTrialModal]);

  return null;
};