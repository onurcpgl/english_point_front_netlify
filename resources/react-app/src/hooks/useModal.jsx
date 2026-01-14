import { useState, useCallback } from "react";

/**
 * Custom hook for modal state management.
 * @param {boolean} initialState - Initial open/close state of the modal.
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal };
};
