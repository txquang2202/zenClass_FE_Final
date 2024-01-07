import React from "react";
import HeroMedia from "../../components/HeroMedia/HeroMedia";
import Event from "../../components/Event/Event";
import ClassId from "../../components/ClassId/ClassId";
import ListHomeWork from "../../components/ListHomeWork/ListHomeWork";

function DetailPage(props) {
  return (
    <>
      {/* MAIN CONTENT */}
      <section className="container w-full lg:max-w-[calc(100%-10rem)] mx-auto mt-6">
        {/* Hero media */}
        <HeroMedia />
        {/* CONTENT */}
        <section className="mt-4 grid grid-cols-4 gap-4">
          {/* LEFT */}
          <article>
            <ClassId />
            <Event />
          </article>
          {/* RIGHT */}
          <article className="col-span-3 grid grid-flow-row auto-rows-max gap-4">
            <ListHomeWork />
          </article>
        </section>
      </section>
    </>
  );
}

export default DetailPage;
