import React, { useState, useEffect } from 'react';

// Componente Header obligatorio con la identificación de los alumnos
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
  // 1. Definición de estados de la aplicación
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados con lectura inicial desde localStorage para persistencia
  const [favorites, setFavorites] = useState(() => {
    const localData = localStorage.getItem('rm-favorites');
    return localData ? JSON.parse(localData) : [];
  });
  
  const [blocked, setBlocked] = useState(() => {
    const localData = localStorage.getItem('rm-blocked');
    return localData ? JSON.parse(localData) : [];
  });

  // 2. Hook useEffect para consumir la API de Rick and Morty al cargar la app
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

  // 3. Hooks useEffect para la persistencia automática en el LocalStorage
  useEffect(() => {
    localStorage.setItem('rm-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rm-blocked', JSON.stringify(blocked));
  }, [blocked]);

  // 4. Funciones controladoras de eventos (Handlers)
  const toggleFavorite = (character) => {
    if (favorites.some(fav => fav.id === character.id)) {
      setFavorites(favorites.filter(fav => fav.id !== character.id));
    } else {
      setFavorites([...favorites, character]);
    }
  };

  const blockCharacter = (character) => {
    setBlocked([...blocked, character]);
    setFavorites(favorites.filter(fav => fav.id !== character.id));
  };

  const resetBlocked = () => {
    setBlocked([]);
  };

  // 5. Filtrado combinado (Busca por término escrito Y EXCLUYE los personajes bloqueados)
  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !blocked.some(b => b.id === char.id)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      
      {/* DISEÑO RESPONSIVO: Cambia de 1 columna en celulares a 4 columnas en pantallas medianas (md) */}
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Sección Central (Ocupa 3 de las 4 columnas en PC) */}
        <section className="md:col-span-3 space-y-4">
          
          {/* Controles: Barra de búsqueda y botón de reinicio */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <input
              type="text"
              placeholder="🔍 Buscar personaje por nombre..."
              className="w-full sm:flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {blocked.length > 0 && (
              <button 
                onClick={resetBlocked}
                className="w-full sm:w-auto bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-xs shrink-0"
              >
                🔄 Desbloquear todos ({blocked.length})
              </button>
            )}
          </div>

          {/* Feedback de carga y errores en la interfaz */}
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

          {/* Renderizado de Tarjetas */}
          {!loading && !error && (
            <>
              {filteredCharacters.length === 0 ? (
                <div className="bg-amber-50 text-amber-700 p-6 rounded-xl border border-amber-200 text-center font-medium">
                  No se encontraron personajes disponibles.
                </div>
              ) : (
                /* GRID DE TARJETAS: 1 col en celular, 2 en pantallas pequeñas (sm), 3 en pantallas grandes (lg) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCharacters.map((char) => {
                    const isFav = favorites.some(fav => fav.id === char.id);
                    return (
                      <div key={char.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <img src={char.image} alt={char.name} className="w-full h-48 object-cover" />
                          <div className="p-4 pb-2">
                            <h3 className="font-bold text-lg text-slate-800 truncate">{char.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Especie: <span className="font-medium text-slate-700">{char.species}</span>
                            </p>
                          </div>
                        </div>

                        {/* Botones de interacción */}
                        <div className="p-4 pt-0">
                          <div className="pt-3 border-t border-slate-100 flex gap-2">
                            <button 
                              onClick={() => toggleFavorite(char)}
                              className={`flex-1 font-medium py-1.5 px-2 rounded-lg text-xs transition-colors text-center ${
                                isFav 
                                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                              }`}
                            >
                              {isFav ? '⭐ Quitar' : '⭐ Favorito'}
                            </button>
                            
                            <button 
                              onClick={() => blockCharacter(char)}
                              className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium py-1.5 px-2 rounded-lg text-xs transition-colors text-center"
                            >
                              🚫 Bloquear
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

        {/* Panel Lateral de Favoritos (Ocupa 1 columna en PC, se va abajo en celulares) */}
        <aside className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-4">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3">
            Favoritos ({favorites.length})
          </h2>
          
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