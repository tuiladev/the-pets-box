import React from 'react';

const Modal = ({ isOpen = false, className = '', children }) => {
    if (!isOpen) return null;
    
    return (
        <div className={`fixed inset-0 z-50 ${className}`}>{children}</div>
    );
};

export const ModalOverlay = ({
    className = '',
    onClick,
}) => {
    return (
        <div
            className={`
                fixed inset-0 bg-black animate-modal-overlay
                ${className}
            `}
            onClick={onClick}
        />
    );
};

export const ModalContent = ({
    size = '',
    position = '',
    className = '',
    children,
}) => {
    const getSize = () => {
        switch (size) {
            case 'xs':
                return 'w-full max-w-xs';
            case 'sm':
                return 'w-full max-w-sm';
            case 'md':
                return 'w-full max-w-md';
            case 'lg':
                return 'w-full max-w-lg';
            case 'xl':
                return 'w-full max-w-xl';
            case '2xl':
                return 'w-full max-w-2xl';
            case '3xl':
                return 'w-full max-w-3xl';
            case '4xl':
                return 'w-full max-w-4xl';
            case '5xl':
                return 'w-full max-w-5xl';
            case 'full':
                return 'w-full';
            default:
                return size || 'w-full max-w-md';
        }
    };

    const getPosition = () => {
        switch (position) {
            case 'top':
                return 'items-start';
            case 'bottom':
                return 'items-end';
            default:
                return 'items-center'; 
        }
    };

    return (
        <div 
            className={`
                fixed inset-0 flex justify-center p-4
                ${getPosition()}
            `}
        >
            <div 
                className={`
                    ${getSize()}
                    bg-white rounded-lg shadow-xl animate-modal-content
                    ${className}
                `}
            >
                {children}
            </div>
        </div>
    );
};

Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;

export default Modal; 