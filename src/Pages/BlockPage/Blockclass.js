import React, { useState, useEffect } from "react";


function Blockclass() {
 


  return (
    <>
      <div className="w-[100%] h-[500px] flex justify-center items-center ">
        <img className="w-[250px] h-[250px]" src="/assets/imgs/Blocked.png"/>
      </div>
      <div className="w-[100%] flex justify-center items-center ">
        <h1 className="font-semibold text-2xl">Your Class has been temporarily suspended due to a violation of our community guidelines.</h1>
      </div>
    </>
  );
}

export default Blockclass;