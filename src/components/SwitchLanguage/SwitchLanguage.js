// LanguageSwitcher.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");

  const handleLangChange = (evt) => {
    const lang = evt.target.value;
    console.log(lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <select
      onChange={handleLangChange}
      value={language}
      className="rounded px-2 py-0.5 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
    >
      <option value="en" className="font-sans font-semibold text-sm">
        en
      </option>
      <option value="fr" className="font-sans font-semibold text-sm">
        vi
      </option>
    </select>
  );
}

export default LanguageSwitcher;
