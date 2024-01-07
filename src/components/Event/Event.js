import React from "react";
import { useTranslation } from "react-i18next";

function Event(props) {
  const { t } = useTranslation();
  return (
    <section className="border p-4 rounded-lg flex flex-col mt-3">
      <h2 className="font-semibold">{t("Upcoming events")}</h2>
      <p className="mt-3 mb-3 text-gray-400">
        {t("There are no upcoming events")}
      </p>
      <a href="#!" className="ml-auto text-blue-400">
        {t("See all")}
      </a>
    </section>
  );
}

export default Event;
