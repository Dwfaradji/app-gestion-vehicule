"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Building, Calendar, Clock, Trash, Plus, Edit3, Save, X } from "lucide-react";
import { useEntreprises } from "@/context/entrepriseContext";
import { defaultFieldIcons, DynamicForm } from "@/components/ui/DynamicForm";
import Collapsible from "@/components/ui/Collapsible";
import { SectionCard } from "@/components/entreprise/SectionCard";
import formatDateForInput from "@/utils/formatDateForInput";
import {Entreprise, Horaire, Section, Vacances} from "@/types/entreprise";

const EntrepriseDashboard: React.FC = () => {
  const {
    entreprises,
    sections,
    vacances,
    loading,
    horaires,
    addEntreprise,
    updateEntreprise,
    addSection,
    updateSection,
    deleteSection,
    addHoraire,
    updateHoraire,
    addVacances,
    updateVacances,
    deleteVacances,
  } = useEntreprises();

  const entreprisePrincipale = entreprises[0] || null;

  const [editingEntreprise, setEditingEntreprise] = useState(false);
  const [dataEntreprise, setDataEntreprise] = useState<Partial<Entreprise>>({});
  const [dataHoraire, setDataHoraire] = useState<Partial<Horaire>>({});
  const [vacancesData, setVacancesData] = useState<Vacances[]>([]);
  const [newVac, setNewVac] = useState<Partial<Vacances>>({ description: "", debut: "", fin: "" });
  const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });

  const [vacancesOpen, setVacancesOpen] = useState(false);

  const horairePrincipal = useMemo(() => {
    return horaires.find((v) => v.entrepriseId === entreprisePrincipale?.id && !v.sectionId);
  }, [horaires, entreprisePrincipale]);

  const vacancesPrincipales = useMemo(() => {
    return vacances.filter((v) => v.entrepriseId === entreprisePrincipale?.id && !v.sectionId);
  }, [vacances, entreprisePrincipale]);

  // ✅ useEffect ne dépend que de l’entreprise (initialisation)
  useEffect(() => {
    if (!entreprisePrincipale) return;
    setDataEntreprise(entreprisePrincipale);
    if (horairePrincipal) setDataHoraire(horairePrincipal);
    setVacancesData(vacancesPrincipales);
  }, [entreprisePrincipale, horairePrincipal, vacancesPrincipales]); // 👈 ne relance plus à chaque update de horaire/vacances

  // ✅ fonction pour recharger manuellement les données si besoin
  const refreshEntrepriseData = useCallback(() => {
    if (!entreprisePrincipale) return;
    setDataEntreprise(entreprisePrincipale);
    if (horairePrincipal) setDataHoraire(horairePrincipal);
    setVacancesData(vacancesPrincipales);
  }, [entreprisePrincipale, horairePrincipal, vacancesPrincipales]);

  // ✅ Annuler sans relancer l’effet
  const handleCancel = () => {
    refreshEntrepriseData();
    setVacancesOpen(false);
    setNewVac({ description: "", debut: "", fin: "" });
    setEditingEntreprise(false);
  };

  // ✅ Sauvegarde simplifiée
  const handleSaveEntreprise = async () => {
    if (!entreprisePrincipale) {
      const added = await addEntreprise(dataEntreprise);
      setDataEntreprise( added);
      return;
    }

    await updateEntreprise(entreprisePrincipale.id, dataEntreprise);

    if (dataHoraire.id) await updateHoraire(dataHoraire.id, dataHoraire);
    else await addHoraire({ ...dataHoraire, entrepriseId: entreprisePrincipale.id });

    for (const vac of vacancesData) {
      if (vac.id) await updateVacances(vac.id, vac);
      else await addVacances({ ...vac, entrepriseId: entreprisePrincipale.id });
    }

    setEditingEntreprise(false);
  };

  /** ✅ Ajouter des vacances entreprise */
  const handleAddVacEntreprise = async () => {
    if (!newVac.debut || !newVac.fin) return;
    const added = await addVacances({
      ...newVac,
      entrepriseId: entreprisePrincipale?.id,
    });
    setVacancesData([...vacancesData, added]);
    setNewVac({ description: "", debut: "", fin: "" });
  };

  /** ✅ Supprimer des vacances entreprise */
  const handleDeleteVacEntreprise = async (id?: number) => {
    if (!id) return;
    await deleteVacances(id);
    setVacancesData(vacancesData.filter((v) => v.id !== id));
  };

  /** ✅ Ajouter section */
  const handleAddSection = async () => {
    if (!newSection.nom || !entreprisePrincipale) return;
    await addSection({
      ...newSection,
      entrepriseId: entreprisePrincipale.id,
    });
    setNewSection({ nom: "" });
  };

  // TODO  le loading me fait un effet de bord a chaque changement
  // if (loading)
  //     return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;
  //

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gray-50">
      {/* === Entreprise principale === */}
      {!entreprisePrincipale ? (
        <div className="bg-white p-6 shadow-md rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Ajouter l&#39;entreprise principale</h2>
          <DynamicForm
            data={dataEntreprise}
            setData={setDataEntreprise}
            fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
            onSubmit={handleSaveEntreprise}
            submitLabel="Ajouter entreprise"
            columns={2}
          />
        </div>
      ) : (
        <section className="bg-white p-6 shadow-md rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building size={24} /> Entreprise principale
            </h2>
            {!editingEntreprise ? (
              <button
                className="text-blue-500 font-medium flex items-center gap-1"
                onClick={() => setEditingEntreprise(true)}
              >
                <Edit3 size={16} /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 text-green-500 font-medium"
                  onClick={handleSaveEntreprise}
                >
                  <Save size={16} /> Enregistrer
                </button>
                <button
                  className="flex items-center gap-1 text-gray-500 font-medium"
                  onClick={handleCancel}
                >
                  <X size={16} /> Annuler
                </button>
              </div>
            )}
          </div>

          {/* === Informations entreprise === */}
          <DynamicForm
            data={dataEntreprise}
            setData={setDataEntreprise}
            fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
            fieldIcons={defaultFieldIcons}
            columns={3}
            readOnly={!editingEntreprise}
          />

          {/* === Horaires === */}
          <h3 className="text-lg font-semibold flex items-center gap-2 mt-6 mb-2">
            <Clock size={18} /> Horaires
          </h3>
          <DynamicForm
            data={dataHoraire}
            setData={setDataHoraire}
            fields={["ouverture", "fermeture"]}
            fieldTypes={{ ouverture: "time", fermeture: "time" }}
            inline
            readOnly={!editingEntreprise}
          />

          {/* === Vacances === */}

          <Collapsible
            title="Vacances"
            icon={<Calendar size={16} />}
            open={vacancesOpen} // 👈 état contrôlé par le parent
            onToggle={(isOpen) => setVacancesOpen(isOpen)} // 👈 sync avec parent
          >
            {vacancesData.map((v) => (
              <div key={v.id} className="flex items-center gap-2 mb-2">
                <DynamicForm
                  data={{
                    description: v.description,
                    debut: formatDateForInput(v.debut),
                    fin: formatDateForInput(v.fin),
                  }}
                  setData={(d) =>
                    setVacancesData(vacancesData.map((x) => (x.id === v.id ? { ...x, ...d } : x)))
                  }
                  fields={["description", "debut", "fin"]}
                  fieldTypes={{ debut: "date", fin: "date" }}
                  inline
                  className={"grid grid-cols-4 gap-2"}
                  readOnly={!editingEntreprise}
                />
                {editingEntreprise && (
                  <button
                    className={"flex flex-end"}
                    onClick={() => handleDeleteVacEntreprise(v.id)}
                  >
                    <Trash size={18} className="text-red-500" />
                  </button>
                )}
              </div>
            ))}
            {editingEntreprise && (
              <div className="flex items-center  gap-2 mb-2">
                <DynamicForm
                  data={newVac}
                  setData={setNewVac}
                  fields={["description", "debut", "fin"]}
                  fieldTypes={{ debut: "date", fin: "date" }}
                  className={"grid grid-cols-4 gap-2"}
                  inline
                />
                <button className="text-blue-500" onClick={handleAddVacEntreprise}>
                  <Plus size={18} />
                </button>
              </div>
            )}
          </Collapsible>
        </section>
      )}

      {/* === Sections === */}
      {sections.map((s) => (
        <SectionCard
          key={s.id}
          section={s}
          entrepriseId={entreprisePrincipale?.id || 0}
          updateSection={updateSection}
          deleteSection={deleteSection}
          addVacances={addVacances}
          updateVacances={updateVacances}
          deleteVacances={deleteVacances}
        />
      ))}

      {/* === Ajouter section === */}
      {entreprisePrincipale && (
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <DynamicForm
            data={newSection}
            setData={setNewSection}
            fields={["nom"]}
            inline
            submitLabel="Ajouter section"
            onSubmit={handleAddSection}
          />
        </div>
      )}
    </div>
  );
};

export default EntrepriseDashboard;
