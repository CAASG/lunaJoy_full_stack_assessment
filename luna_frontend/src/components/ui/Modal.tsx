/**
 * @module Modal
 * @description Accessible modal dialog using Headless UI.
 * Used for confirmations like "overwrite today's log?" and
 * informational dialogs. Includes smooth transitions.
 */

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  variant?: 'info' | 'warning';
}

/**
 * Renders a centered modal with backdrop, transitions, and optional
 * confirm/cancel buttons. Closes on backdrop click or Escape key.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
  variant = 'info',
}: ModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
        </TransitionChild>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-luna-cream-dark">
              <DialogTitle className="text-lg font-medium text-luna-dark">
                {title}
              </DialogTitle>

              <div className="mt-3 text-sm text-luna-warm-gray">
                {children}
              </div>

              {(confirmLabel ?? onConfirm) && (
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    {cancelLabel}
                  </Button>
                  {confirmLabel && onConfirm && (
                    <Button
                      variant={variant === 'warning' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                    >
                      {confirmLabel}
                    </Button>
                  )}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
