import SettingsContent from "./settings-content";

export default function SettingsPage() {
    return (
        <div className="flex-1 rounded-xl mx-auto p-6 bg-gray dark:bg-bg_dark_gray">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <main className="lg:col-span-3">
                    <SettingsContent />
                </main>
            </div>
        </div>
    );
}