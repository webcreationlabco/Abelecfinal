import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import MarquesClient from "./marques-client";

export const metadata = {
  title: "Nos marques partenaires — Abelec",
  description: "Pièces détachées compatibles avec plus de 80 marques d'électroménager : Whirlpool, Bosch, Miele, Samsung, LG et bien d'autres.",
};

export default function MarquesPage() {
  return (
    <>
      <Header />
      <MarquesClient />
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
