import React from "react";
import ListComment from "../../components/Comment/Comment";
import DetailHomework from "../../components/DetailHomework/DetailHomework";

function HomeWorkPage(props) {
  return (
    <>
      <section className="container w-full lg:max-w-[calc(100%-20rem)] mx-auto mt-10">
        {/* POST */}
        <div>
          <DetailHomework />
        </div>
        {/* COMMENTS*/}
        <section className="">
          <ListComment />
        </section>
      </section>
    </>
  );
}

export default HomeWorkPage;
