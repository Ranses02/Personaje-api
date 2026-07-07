import React, { useState, useEffect } from 'react';

function Header() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Rick and Morty App</h1>
      <span className="text-sm text-slate-300">
        Integrantes: Ranses Encarnación | Matias Cortes
      </span>
    </header>
  );
}

export default function App() {
  // Solo los estados necesarios para la carga de datos y errores
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (!response.ok) {
          throw new Error('Hubo un problema al conectar con la API');
        }
        const data = await response.json();
        setCharacters(data.results);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Panel Izquierdo/Central: Listado de Personajes */}
        <section className="md:col-span-3 space-y-4">
          
          {loading && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-200 text-center font-medium animate-pulse">
              Cargando personajes desde la API...
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-medium">
              ❌ Error: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((char) => (
                <div key={char.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <img src={char.image} alt={char.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-800 truncate">{char.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Especie: <span className="font-medium text-slate-700">{char.species}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Panel Derecho: Vacío por ahora, se usará en el commit de favoritos */}
        <aside className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-4">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3">
            Favoritos
          </h2>
          <p className="text-sm text-slate-400 italic">No hay personajes seleccionados.</p>
        </aside>

      </main>
    </div>
  );
}