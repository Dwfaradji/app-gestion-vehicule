const onglets = ["Mécanique", "Carrosserie", "Révision", "Dépenses"] as const;
type Onglet = typeof onglets[number];

interface SidebarOngletsProps {
    activeTab: Onglet;
    setActiveTab: (tab: Onglet) => void;
    setShowForm: (show: boolean) => void;
}

const SidebarOnglets = ({ activeTab, setActiveTab, setShowForm }: SidebarOngletsProps) => (
    <aside className="w-64 rounded-xl bg-white shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Suivi</h2>
        <ul className="space-y-2">
            {onglets.map(tab => (
                <li key={tab}>
                    <button
                        onClick={() => { setActiveTab(tab); setShowForm(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                            activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab}
                    </button>
                </li>
            ))}
        </ul>
    </aside>
);

export default SidebarOnglets;