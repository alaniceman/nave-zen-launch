export const attachTrialDelegation = (openTrialModal: () => void) => {
  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked element or any parent has data-open-trial="true"
    const triggerElement = target.closest('[data-open-trial="true"]');
    
    if (triggerElement) {
      e.preventDefault();
      e.stopPropagation();
      openTrialModal();
    }
  };

  document.addEventListener('click', handleClick);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleClick);
  };
};