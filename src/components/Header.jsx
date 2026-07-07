import React from 'react';

export default function Header() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Rick and Morty App</h1>
      <span className="text-sm text-slate-300">
        Integrantes: Ranses Encarnación | Nombre de tu compañero
      </span>
    </header>
  );
}