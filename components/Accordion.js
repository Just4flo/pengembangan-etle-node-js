'use client'; // or remove this line if you are on Pages Router

import { useState } from 'react';

export default function Accordion({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        // Kita hapus border-b dari sini agar tidak ada garis ganda
        <div className="mb-2">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <svg
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>

            {/* Bagian ini yang kita ubah */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen" : "max-h-0"}`}>
                <div className="p-5 mt-2 bg-blue-50 border-l-4 border-blue-500 text-blue-900">
                    {children}
                </div>
            </div>
        </div>
    );
}