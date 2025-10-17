"use client";

import Collapsible from "@/components/ui/Collapsible";
import Image from "next/image";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Comment ajouter un véhicule ?",
    answer:
      "Allez dans la section 'Véhicules' puis cliquez sur 'Ajouter un véhicule'. Remplissez les informations et sauvegardez.",
  },
  {
    question: "Comment enregistrer une dépense ?",
    answer:
      "Dans la fiche du véhicule, cliquez sur 'Ajouter dépense', choisissez la catégorie et saisissez le montant.",
  },
  {
    question: "Comment exporter les données ?",
    answer:
      "Utilisez le menu 'Exporter les données' en haut à droite pour télécharger les véhicules, trajets ou dépenses au format PDF.",
  },
  {
    question: "Puis-je modifier un véhicule après l'avoir ajouté ?",
    answer: "Oui, cliquez sur le véhicule dans la liste et utilisez le bouton 'Modifier'.",
  },
  {
    question: "Qui contacter pour support technique ?",
    answer: "Contactez-nous via contact@devevoke.com pour toute question ou problème technique.",
  },
];

export default function AidePage() {
  return (
    <div className="min-h-screen p-6 space-y-6 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Aide & FAQ</h1>
      {/*<Image*/}
      {/*    src="/backgroundCars.jpg"*/}
      {/*    width={1920}*/}
      {/*    height={1080}*/}
      {/*    quality={100}*/}
      {/*    priority*/}
      {/*    alt="Illustration connexion"*/}
      {/*    className="absolute inset-0 w-full h-full object-cover opacity-30"*/}
      {/*/>*/}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Collapsible key={index} title={faq.question}>
            <p className="text-gray-700">{faq.answer}</p>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg bottom-0 fixed w-full text-center">
        <h2 className="font-semibold text-blue-700 mb-2">Besoin de plus d&#39;aide ?</h2>
        <p className="text-blue-800">
          Contactez notre support à{" "}
          <a href="mailto:contact@devevoke.com" className="underline">
            contact@devevoke.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
