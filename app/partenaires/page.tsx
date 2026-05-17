import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import PartenairesClient from "./partenaires-client";

export const metadata = {
  title: "Partenaires — Abelec",
  description: "Repair cafés, foyers, professionnels — devenez partenaire Abelec et accédez à 100 000 références de pièces détachées à des conditions préférentielles.",
};

export default function PartenairesPage() {
  return (
    <>
      <Header />
      <PartenairesClient />
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
