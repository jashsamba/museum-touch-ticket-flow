import React from "react";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-red-900 to-black text-white font-orbitron flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center drop-shadow-lg">
        Welcome to the Museum
      </h1>
      <p className="text-lg md:text-xl text-red-200 mb-10 text-center max-w-xl">
        Begin your journey through time. Tap to continue.
      </p>
      <button className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg">
        Start Experience
      </button>
    </div>
  );
};

export default Index;
