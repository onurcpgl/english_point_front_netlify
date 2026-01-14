// app/login/layout.js

import FindSessionHeader from "../../components/header/FindSessionHeader";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <FindSessionHeader />
      {children}
    </div>
  );
}
