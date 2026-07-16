import React from 'react';

export const Button = ({ children, onClick, type = 'button', loading, disabled, cooldown, ...props }) => {
    const isDisabled = disabled || loading || cooldown;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
        ${isDisabled
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover active:scale-98'
            }`}
            {...props}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
                children
            )}
        </button>
    );
};
