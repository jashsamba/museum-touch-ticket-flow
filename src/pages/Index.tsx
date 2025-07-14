import React from "react";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Welcome to the Museum
      </h1>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all text-white font-semibold px-6 py-4 text-xl rounded-lg w-full">
          Buy Ticket
        </button>
        <button className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all text-white font-semibold px-6 py-4 text-xl rounded-lg w-full">
          Scan Barcode
        </button>
      </div>
    </div>
  );
};

export default Index;
