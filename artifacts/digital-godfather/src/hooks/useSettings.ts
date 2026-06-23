import { useState } from "react";
import { postSettings, type BotSettings } from "@/lib/api";

const DEFAULT_SETTINGS: BotSettings = {
  projectName: "Godfather Heights — Phase 2",
  startingPrice: "55,00,000",
  possessionDate: "December 2027",
  locationDetails: "Sector 12, Panvel, Navi Mumbai — Near Panvel Railway Station (5 mins), NMSEZ (2 mins), NH-48 highway access. 800 acres township.",
  bhkOptions: ["1 BHK", "2 BHK", "3 BHK"],
  tone: "Friendly",
  language: "hinglish",
  greetingMessage: "Namaste! 🙏 Main Rohan hoon, Godfather Heights ka AI assistant. Aapka sapna ghar dhundhne mein main aapki madad karunga!",
  autoSchedule: true,
  autoBrochure: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<BotSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateField = <K extends keyof BotSettings>(key: K, value: BotSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleBhk = (option: string) => {
    setSettings(prev => ({
      ...prev,
      bhkOptions: prev.bhkOptions.includes(option)
        ? prev.bhkOptions.filter(o => o !== option)
        : [...prev.bhkOptions, option],
    }));
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await postSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return { settings, updateField, toggleBhk, save, saving, saveError, saveSuccess };
}
