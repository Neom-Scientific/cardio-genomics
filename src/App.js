import React, { useEffect, useState } from "react";
import Home from "./Home";
import NewProject from "./NewProject";
import ProjectAnalysis from "./ProjectAnalysis";
import Cookies from "js-cookie"
import Auth from "./Auth";
import Header from "./Header";
import Help from "./Help";
import AnimatedBackground from "./AnimatedBackground";
import Reports from "./Reports";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [User, setUser] = useState(null);

  useEffect(()=>{
    const user = Cookies.get('cardio_genomics_user');
    if(user){
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    }
  },[])

  useEffect(() => {
    if (User) {
      document.body.classList.add('body-bg');
    } else {
      document.body.classList.remove('body-bg');
    }
    // Clean up on unmount
    return () => document.body.classList.remove('body-bg');
  }, [User]);

  if(!User) {
    return <Auth/>;
  }

  const tabList = [
    { key: "home", label: "Home" },
    { key: "new_project", label: "New Project" },
    { key: "project_analysis", label: "Project Analysis" },
    { key: "result", label: "Result" },
    {key: "reports", label: "Reports"},
    { key: "help", label: "Help" },
  ];

  return (
    <>
    <Header/>
    <div className="mx-auto p-3 ">
      <div className="w-full bg-white rounded-lg flex justify-center items-center mt-4">
      {/* {User && <AnimatedBackground/>} */}
        <ul className="flex w-full">
          {tabList.map((tab) => (
            <li key={tab.key} className="flex-1">
              <button
                className={`w-full p-[3px] font-bold rounded-lg
                  ${
                    activeTab === tab.key
                      
                      ? "bg-gradient-to-r from-red-500 to-blue-600 text-white m-1"
                      : "bg-white text-orange-500 m-1"
                  }
                `}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        {activeTab === "home" && <Home />}
        {activeTab === "new_project" && <NewProject onShowAnalysis={()=>setActiveTab('project_analysis')} />}
        {activeTab === "project_analysis" && <ProjectAnalysis />}
        {activeTab === "result" && <Reports/>}
        {activeTab === "help" && <Help/>}
      </div>
    </div>
    </>
  );
}

export default App;