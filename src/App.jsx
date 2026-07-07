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
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // NUEVO: Estado para almacenar la lista de personajes favoritos
  const [favorites, setFavorites] = useState([]);

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

  // NUEVO: Funciones para agregar y quitar elementos de favoritos
  const toggleFavorite = (character) => {
    if (favorites.some(fav => fav.id === character.id)) {
      // Si ya existe, lo quitamos de la lista
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    } else {
      // Si no existe, lo agregamos al array
      setFavorites([...favorites, character]);
    }
  };

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Panel Izquierdo/Central: Buscador y Listado */}
        <section className="md:col-span-3 space-y-4">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <input
              type="text"
              placeholder="🔍 Buscar personaje por nombre..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
            <>
              {filteredCharacters.length === 0 ? (
                <div className="bg-amber-50 text-amber-700 p-6 rounded-xl border border-amber-200 text-center font-medium">
                  No se encontraron personajes que coincidan con "{searchTerm}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCharacters.map((char) => {
                    const isFav = favorites.some(fav => fav.id === char.id);
                    return (
                      <div key={char.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <img src={char.image} alt={char.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-800 truncate">{char.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            Especie: <span className="font-medium text-slate-700">{char.species}</span>
                          </p>
                          
                          {/* NUEVO: Botón de favorito dinámico */}
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <button 
                              onClick={() => toggleFavorite(char)}
                              className={`w-full font-medium py-1.5 px-3 rounded-lg text-sm transition-colors text-center ${
                                isFav 
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                              }`}
                            >
                              {isFav ? '⭐ Quitar de Favoritos' : '⭐ Añadir a Favoritos'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* Panel Derecho: Lista Dinámica de Favoritos */}
        <aside className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-4">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3">
            Favoritos ({favorites.length})
          </h2>
          
          {/* NUEVO: Renderizado condicional del panel lateral */}
          {favorites.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No hay personajes seleccionados.</p>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {favorites.map((fav) => (
                <div key={fav.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200 shadow-xs">
                  <img src={fav.image} alt={fav.name} className="w-12 h-12 rounded-full object-cover border border-slate-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{fav.name}</p>
                    <p className="text-xs text-slate-500">{fav.species}</p>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(fav)}
                    className="text-slate-400 hover:text-red-500 text-sm font-bold px-1.5 py-0.5 transition-colors"
                    title="Quitar"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>

      </main>
    </div>
  );
}