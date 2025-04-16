export function Footer() {
    return (
        <footer className="mt-auto py-6 px-6 bg-secondary-background text-accent border-t border-gray-200">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm font-medium">&copy; {new Date().getFullYear()} Earth Countdown</p>
                    <p className="text-xs text-accent/70 mt-1">Ensemble pour un avenir durable</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-center">
                    <a href="#" className="text-sm hover:text-primary transition-colors duration-200">À propos</a>
                    <a href="#" className="text-sm hover:text-primary transition-colors duration-200">Confidentialité</a>
                    <a href="#" className="text-sm hover:text-primary transition-colors duration-200">Conditions d&apos;utilisation</a>
                    <a href="#" className="text-sm hover:text-primary transition-colors duration-200">Contact</a>
                </div>
            </div>
        </footer>
    )
}