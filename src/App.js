import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18en/i18n";
import LanguageSwitcher from "./components/SwitchLanguage/SwitchLanguage";
import CreateRouter from "./routes/CreateRouter";
import { jwtDecode } from "jwt-decode";
//import routes from "./routes/index"

function App() {
  // const routes = CreateRouter();
  return (
    <>
      <Router>
        <div className="Container">
          <Routes>
            {routes.map((route, index) => {
              const Page = route.page;
              // const Layout = route.isShowHeader ? DefaultLayout : Fragment;
              const Protect = route.isProtected ? ProtectedRoute : Fragment;

              let Layout = DefaultLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    <Layout>
                      <Protect>
                        <I18nextProvider i18n={i18n}>
                          <Page />
                        </I18nextProvider>
                      </Protect>
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
