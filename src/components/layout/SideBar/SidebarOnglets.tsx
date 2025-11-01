import { Button } from "@/components/ui/Button";

const onglets = ["Mécanique", "Carrosserie", "Révision", "Dépenses"] as const;
type Onglet = (typeof onglets)[number];

interface SidebarOngletsProps {
  activeTab: Onglet;
  setActiveTab: (tab: Onglet) => void;
  setShowForm: (show: boolean) => void;
}

const SidebarOnglets = ({ activeTab, setActiveTab, setShowForm }: SidebarOngletsProps) => (
  <aside className="w-64 rounded-xl bg-white shadow-sm p-4">
    <h2 className="text-lg font-semibold mb-4">Suivi</h2>
    <ul className="space-y-2">
      {onglets.map((tab) => (
        <li key={tab}>
          <Button
            onClick={() => {
              setActiveTab(tab);
              setShowForm(false);
            }}
            className={`w-full justify-start px-3 py-3 rounded-lg text-md font-medium  ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md font-bold"
                : "bg-gray-100 text-gray-700 "
            }`}
          >
            {tab}
          </Button>
        </li>
      ))}
    </ul>
  </aside>
);

export default SidebarOnglets;
