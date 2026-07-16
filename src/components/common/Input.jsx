import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, disabled, required, error, icon: Icon }) => {
    return (
        <div className="w-full text-right mb-4">
            {label && (
                <label className="block text-sm font-medium text-[#005148] mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative rounded-lg shadow-xs">
                {Icon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-primary">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    dir="auto"
                    className={`w-full pr-10 pl-3 py-2.5 bg-white border rounded-lg outline-hidden transition-colors text-right text-slate-800 text-sm
            ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary'
                    }
            disabled:bg-slate-50 disabled:text-slate-400`}
                />
            </div>
            {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
        </div>
    );
};
