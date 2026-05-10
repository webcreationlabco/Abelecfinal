import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import AProposClient from "./a-propos-client";

export const metadata = {
  title: "À propos — Abelec",
  description: "Une entreprise familiale belge, une passion pour la réparation. Découvrez l'histoire et les valeurs d'Abelec depuis 1983.",
};

export default function AProposPage() {
  return (
    <>
      <Header />
      <AProposClient />
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
