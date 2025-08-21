import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const tabs = [
    { key: "mecanique", label: "Mécanique" },
    { key: "carrosserie", label: "Carrosserie" },
    { key: "entretien", label: "Entretien" },
    { key: "depenses", label: "Dépenses" },
];

export const SidebarTabs: React.FC<{ vehiculeId: string }> = ({ vehiculeId }) => {
    const router = useRouter();
    const currentTab = (router.query.tab as string) || "mecanique";

    return (
        <aside className="w-48 border-r border-gray-200 bg-white p-4">
            <nav className="space-y-2">
                {tabs.map((tab) => (
                    <Link
                        key={tab.key}
                        href={`/vehicules/${vehiculeId}?tab=${tab.key}`}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                            currentTab === tab.key
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};