import Header from "@/components/header";
import Footer from "@/components/footer";
import SuiviCommandeClient from "./suivi-commande-client";

export const metadata = {
  title: "Suivi de commande — Abelec",
  description: "Suivez votre commande en temps réel.",
};

export default function SuiviCommandePage() {
  return (
    <>
      <Header />
      <SuiviCommandeClient />
      <Footer />
    </>
  );
}
