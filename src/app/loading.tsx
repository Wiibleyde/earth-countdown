export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-secondary-background">
            <div className="flex flex-col items-center">
                <svg
                    className="animate-spin h-16 w-16 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        strokeWidth="4"
                        stroke="currentColor"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-9 0z"
                    />
                </svg>
                <p className="mt-4 text-lg font-semibold text-accent">Chargement...</p>
                <p className="text-sm text-gray-500">Veuillez patienter pendant que nous préparons votre expérience.</p>
            </div>
        </div>
    );
}