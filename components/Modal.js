export default function Modal({ isOpen, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                {children}
            </div>
        </div>
    );
}