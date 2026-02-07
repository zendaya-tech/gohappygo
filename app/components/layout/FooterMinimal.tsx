import { Link } from 'react-router';

export default function FooterMinimal() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="GoHappyGo" className="h-6" />
                    <span className="font-semibold text-gray-900">GoHappyGo</span>
                </div>
                <nav className="flex items-center gap-4">
                    <Link to="/annonces" className="hover">Annonces</Link>
                    <Link to="/voyageurs" className="hover">HappyVoyageurs</Link>
                    <Link to="/help-center" className="hover">Aide</Link>
                </nav>
                <p className="text-xs">© {year} GoHappyGo</p>
            </div>
        </footer>
    );
}

