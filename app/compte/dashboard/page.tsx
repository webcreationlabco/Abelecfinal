import Header from "@/components/header";
import Footer from "@/components/footer";
import DashboardClient from "./dashboard-client";

export const metadata = {
  title: "Mon compte — Abelec",
  description: "Gérez vos commandes, adresses, factures et favoris.",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <DashboardClient />
      <Footer />
    </>
  );
}
