import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, DownloadIcon, PrinterIcon } from "lucide-react";

// --- Programme source (résumé compact basé sur notre plan) ---
const blocks = [
  {
    id: "b1",
    title: "Bloc 1 — Remise en route (Sem. 1–2)",
    weeklyHours: "6–8 h (≈180–240 km)",
    focus: [
      "Longue 3–4 h Z1–Z2",
      "Vallonnée 2 h Z2 + 3×10’ Z3",
      "1–2 récup 60–90’ Z1",
      "CAP 2×40–50’ footing Z1",
      "Force/Mob 2×/sem"
    ],
  },
  {
    id: "b2",
    title: "Bloc 2 — Construction (Sem. 3–6)",
    weeklyHours: "9–12 h (≈250–350 km)",
    focus: [
      "Longue 4–5 h Z1–Z2",
      "Tempo/SS 3×15’ Z3 (récup 5’)",
      "Vallonnée 2–3 h avec D+",
      "Récup 60–90’",
      "CAP 1×50–60’ + 1×40’",
      "Force 1×/sem"
    ],
  },
  {
    id: "b3",
    title: "Bloc 3 — Spécifique ultra (Sem. 7–10)",
    weeklyHours: "12–18 h (≈350–550 km)",
    focus: [
      "Back-to-back : 5–6 h + 4–5 h puis 8 h + 6 h",
      "Sortie de nuit 2–4 h toutes les 1–2 sem",
      "Sweet spot 2×25’ Z3",
      "Beaucoup de Z1–Z2, viser 3000–5000 m D+/sem (pics 6000–8000 m)",
      "CAP 1×40–50’ facile (optionnel)",
      "Force/Mob 1×/sem (léger)"
    ],
  },
  {
    id: "b4",
    title: "Affûtage (Sem. 11–12)",
    weeklyHours: "S-2 : 60–70 % du pic | S-1 : 40–50 %",
    focus: [
      "S-2 : 1 longue 3–4 h max + rappels Z3",
      "S-1 : 2–3 sorties 60–90’ faciles + 1 × 2 h Z2",
      "Objectif : fraîcheur > volume"
    ],
  },
];

const exampleWeek = [
  { day: "Lundi", text: "Off + mobilité 20’" },
  { day: "Mardi", text: "Vélo 2 h Z2 + 3×10’ Z3 (5’ recup)" },
  { day: "Mercredi", text: "CAP 60–75’ footing Z1 (ou marche)" },
  { day: "Jeudi", text: "Vélo 90’ Z1–Z2 souple" },
  { day: "Vendredi", text: "Off / Natation 30’ facile" },
  { day: "Samedi", text: "Vélo 6–8 h Z1–Z2 + D+ (tests nutrition/éclairage)" },
  { day: "Dimanche", text: "Vélo 4–6 h Z1–Z2 (back-to-back)" },
];

const tips = [
  {
    title: "Nutrition",
    items: [
      "60–80 g glucides/h (jusqu’à 90 g/h si toléré, ratio 2:1)",
      "Hydratation 500–750 ml/h + électrolytes selon chaleur",
      "Solide toutes les 2–3 h (alterner sucré/salé)",
    ],
  },
  {
    title: "Logistique",
    items: [
      "Éclairage + batteries, couches, gants longs, imper",
      "Outils/plaquettes, sacs étanches, chamois crème",
      "Tester transitions nuit & arrêts (ravito/eau/habillage)",
    ],
  },
  {
    title: "Sommeil & gestion",
    items: [
      "Simuler micro-siestes 10–20 min sur longues",
      "Surveille RPE/FC vs puissance → alléger si dérive",
      "1 semaine allégée toutes les 3–4 semaines (–30 %)",
    ],
  },
];

// Utilitaire pour générer un calendrier de 12 semaines à partir d’une date cible
function buildCalendar(targetDateStr) {
  if (!targetDateStr) return [];
  const target = new Date(targetDateStr);
  if (Number.isNaN(target.getTime())) return [];
  // On remonte 12 semaines
  const weeks = [];
  const start = new Date(target);
  start.setDate(start.getDate() - 7 * 12);
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    const label = `S${i + 1}`;
    let block;
    if (i < 2) block = blocks[0];
    else if (i < 6) block = blocks[1];
    else if (i < 10) block = blocks[2];
    else block = blocks[3];
    weeks.push({ label, start: weekStart, block });
  }
  return weeks;
}

export default function RAF2500App() {
  const [target, setTarget] = useState("");
  const weeks = useMemo(() => buildCalendar(target), [target]);

  const printPage = () => window.print();

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Programme RAF 2500 – 12 semaines</h1>
            <p className="text-slate-600 mt-1">Endurance, spécifique ultra, puis affûtage. Vélo (Vélo + Vélo virtuel fusionnés), CAP (inclut trail & randonnée), natation en récup.</p>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={printPage} className="rounded-2xl"><PrinterIcon className="h-4 w-4 mr-2"/>Imprimer</Button>
          </div>
        </header>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Date cible & calendrier 12 semaines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="target">Date de l’épreuve</Label>
                <div className="flex gap-2">
                  <Input id="target" type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-2xl"/>
                  <Button variant="secondary" onClick={() => setTarget("")} className="rounded-2xl"><CalendarIcon className="h-4 w-4 mr-2"/>Réinitialiser</Button>
                </div>
                <p className="text-sm text-slate-500">Renseigne la date pour générer la numérotation des semaines et caler les blocs.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="text-xs uppercase text-slate-500">Zonage</p>
                <p className="text-sm">Z1 facile · Z2 endurance · Z3 tempo/SS · Z4 seuil (touches)</p>
              </div>
            </div>
            {weeks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeks.map((w) => (
                  <Card key={w.label} className="rounded-2xl border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{w.label} · {w.start.toLocaleDateString()}</span>
                        <Badge variant="secondary" className="rounded-full">{w.block.weeklyHours}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-700">
                      <ul className="list-disc ml-5 space-y-1">
                        {w.block.focus.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="overview">Aperçu des blocs</TabsTrigger>
            <TabsTrigger value="week">Semaine-type (exemple)</TabsTrigger>
            <TabsTrigger value="tips">Conseils course</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {blocks.map((b) => (
                <AccordionItem key={b.id} value={b.id} className="border-slate-200">
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{b.title}</span>
                      <span className="text-sm text-slate-500">Charge hebdo : {b.weeklyHours}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                      {b.focus.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="week" className="mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Semaine-type (Bloc spécifique)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleWeek.map((it) => (
                  <div key={it.day} className="p-3 rounded-2xl border border-slate-200">
                    <div className="font-medium">{it.day}</div>
                    <div className="text-sm text-slate-700">{it.text}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((t, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                      {t.items.map((it, j) => <li key={j}>{it}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="text-xs text-slate-500 pt-6">
          <p>Astuce : imprime la page ou exporte en PDF pour partager. Ajuste la date de l’épreuve pour caler automatiquement les 12 semaines.</p>
        </footer>
      </div>
    </div>
  );
}
