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
    <ul className="space-y-4">
      {onglets.map((tab) => (
        <li key={tab}>
          <Button
            onClick={() => {
              setActiveTab(tab);
              setShowForm(false);
            }}
            isTab
            isActive={activeTab === tab}
            variant={"primary"}
            className={`w-full justify-start text-md font-medium  `}
          >
            {tab}
          </Button>
        </li>
      ))}
    </ul>
  </aside>
);

export default SidebarOnglets;
