import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import EntryCard from "../components/EntryCard.jsx"; // Ajusta la ruta al componente EntryCard
import useAuth from "../hooks/useAuth";
import { getEntriesService } from "../services/entryServices.js";

function Home() {
  const [entries, setEntries] = useState([]);
  
  const { isAuthenticated } = useAuth();

  useEffect(()=>{
    const fetchEntries = async () => {
      try {
        const body = await getEntriesService();
        
        if (body.status === 'error') {
          throw new Error(body.message)
        }

        setEntries(body.entries)
      } catch (err) {
        console.error(err);
      }
    }

    fetchEntries()
  }, [])

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
