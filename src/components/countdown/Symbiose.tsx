import { useState } from 'react';

export function Gemini() {
    const [answer, setAnswer] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Nouvelle fonction pour gérer l'envoi du message
    const handleSubmit = async () => {
        if (isGenerating || !userInput.trim()) return;

        setIsGenerating(true);
        setTimeout(() => {
            setAnswer('This is a simulated answer from Symbiose.');
            setIsGenerating(false);
        }, 2000);
    };

    // Fonction pour gérer l'appui sur la touche Entrée
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10 w-full">
            <h2 className="text-2xl font-bold mb-6 text-secondary-background">Symbiose - Assistant IA</h2>

            <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md mb-6 min-h-[100px] flex items-center justify-center">
                {answer ? (
                    <p className="text-gray-800">{answer}</p>
                ) : (
                    <p className="text-gray-500 italic">Les réponses de Symbiose apparaîtront ici</p>
                )}
            </div>

            <div className="w-full max-w-md">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Prévenir Symbiose d'une action..."
                        className="border border-gray-300 rounded-md p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-secondary-background transition"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={handleSubmit}
                        className={`rounded-md p-3 transition-all duration-200 ${
                            isGenerating
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-secondary-background text-white hover:bg-opacity-90'
                        }`}
                        disabled={isGenerating || !userInput.trim()}
                    >
                        {isGenerating ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Symbiose réfléchit...</span>
                            </div>
                        ) : (
                            'Envoyer'
                        )}
                    </button>
                </div>
                {userInput.trim().length === 0 && (
                    <p className="text-xs text-gray-500 mt-2 ml-1">Entrez votre message pour Symbiose</p>
                )}
            </div>
        </div>
    );
}
