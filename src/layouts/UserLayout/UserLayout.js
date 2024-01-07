import React from "react";
import SideBarUser from "../../components/SideBarUser/SideBarUser";


function Default({ children }) {
  return (
    <div>
      <div className="flex flex-row">
        {/* Sidebar content */}
        {/* <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} /> */}
        <div className="basis-1/12">
          <SideBarUser />
        </div>
        {/* Main content */}
        <div className="basis-11/12 bg-white">{children}</div>
      </div>
    </div>
  );
}

export default Default;
