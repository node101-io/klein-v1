"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Select } from "@/components/ui/select";
import { SectionCard } from "@/components/settings/section-card";

const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
];

export default function SettingsContent() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState("en");
    const [usageData, setUsageData] = useState(true);
    const [performanceData, setPerformanceData] = useState(true);

    return (
        <div className="space-y-8">
            <SectionCard title="Theme">
                <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <ToggleSwitch
                        checked={theme === "dark"}
                        onChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                </div>
            </SectionCard>

            <SectionCard title="Language">
                <Select
                    value={language}
                    onChange={setLanguage}
                    options={languageOptions}
                />
            </SectionCard>

            <SectionCard title="Privacy & Security">
                <div className="space-y-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-1">Data Collection</h3>
                        <p className="text-sm">
                            We keep this data anonymous to improve your experience.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Usage Data of User Interface</span>
                            <ToggleSwitch
                                checked={usageData}
                                onChange={setUsageData}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Performance Data & Crash Reports</span>
                            <ToggleSwitch
                                checked={performanceData}
                                onChange={setPerformanceData}
                            />
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}