import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import EntryCard from "../components/EntryCard.jsx"; // Ajusta la ruta al componente EntryCard
import useServer from "../hooks/useServer";
import useAuth from "../hooks/useAuth";

function Home() {
  const [entries, setEntries] = useState([]);
  
  const { get } = useServer();
  const { isAuthenticated } = useAuth();

  const getEntries = () => {
    get({ url: "/entries" }).then(({ data }) => {
      if (data.data && data.data.entries) {
        setEntries(data.data.entries);
      }
    });
  };



  useEffect(()=>{
    getEntries()
  },[])

  

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />

        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}

export default Home;
