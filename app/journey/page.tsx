import type { Metadata } from "next";
import Journey from "./Journey";

export const metadata: Metadata = {
  title: "Le parcours — Guide du Facilitateur",
  description:
    "Un parcours immersif à travers les 6 phases du cycle communautaire PCRSS / DCC.",
};

export default function JourneyPage() {
  return <Journey />;
}
