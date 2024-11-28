"use client";


export function Select({ value, onChange, options, className = "" }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}