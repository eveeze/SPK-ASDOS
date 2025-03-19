"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <Head>
        <title>Sistem Seleksi Asisten Dosen - Beranda</title>
      </Head>

      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center  fixed top-0 w-full z-10">
        <h1 className="text-xl font-semibold">Sistem Seleksi Asisten Dosen</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-16">
        <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
          Selamat Datang di
          <br /> Sistem Seleksi Asisten Dosen!
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl animate-fade-in delay-100">
          Platform inovatif untuk membantu dalam proses seleksi asisten dosen dengan metode SAW.
        </p>
      
      </section>
    </div>
  );
}
