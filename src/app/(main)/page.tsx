"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Users, BookOpen, ClipboardCheck, BarChart } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const stats = [
    { title: "Total Kandidat", value: 0, icon: <Users className="w-8 h-8 text-blue-500" /> },
    { title: "Kursus Aktif", value: 0, icon: <BookOpen className="w-8 h-8 text-green-500" /> },
    { title: "Total Penilaian", value: 0, icon: <ClipboardCheck className="w-8 h-8 text-yellow-500" /> },
    { title: "Skor Rata-Rata", value: 0.0, icon: <BarChart className="w-8 h-8 text-red-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Sistem Seleksi Asisten Dosen - Beranda</title>
      </Head>

      {/* Header */}
      <header className="bg-gray-300 py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold text-gray-900">Sistem Seleksi Asisten Dosen</h1>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-white">
          Selamat Datang di Sistem Seleksi Asisten Dosen!
        </h2>
        <p className="mt-2 text-gray-300">
          Platform untuk memilih asisten dosen terbaik berdasarkan berbagai kriteria menggunakan metode SAW.
        </p>
      </section>

      {/* Perkenalan & Deskripsi */}
      <section className="px-6 py-12 bg-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Apa Itu Sistem Seleksi Asisten Dosen?</h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Sistem Seleksi Asisten Dosen adalah platform yang dirancang untuk membantu dalam pemilihan asisten dosen terbaik
          berdasarkan berbagai kriteria yang telah ditentukan. Sistem ini menggunakan metode
          <span className="font-semibold"> Simple Additive Weighting (SAW)</span>, sebuah metode perhitungan yang membantu dalam
          pengambilan keputusan berbasis nilai dan bobot.
        </p>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Dengan sistem ini, Anda dapat melakukan seleksi kandidat secara objektif, efisien, dan transparan.
          Platform ini dirancang untuk mempermudah proses seleksi, memastikan keadilan, dan meningkatkan kualitas pengajaran.
        </p>
      </section>

      {/* Ringkasan Data */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-10">
        {stats.map((item, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg text-center">
            <div className="flex justify-center">{item.icon}</div>
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-700 text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      {/* Tombol */}
      <div className="flex justify-center mt-6 pb-10">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Mulai Seleksi Sekarang
        </button>
      </div>

      {/* Panduan Pemilihan Asisten Dosen */}
      <section className="px-6 py-12 bg-white">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Panduan Pemilihan Asisten Dosen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            { step: "Langkah 1", title: "Menentukan Kriteria", desc: "Sistem menggunakan 5 kriteria: IPK, Tes Pemrograman, Kemampuan Mengajar, Nilai Rekomendasi, dan Kerja Sama Tim." },
            { step: "Langkah 2", title: "Menetapkan Bobot", desc: "Setiap kriteria diberikan bobot berdasarkan tingkat kepentingannya dalam proses seleksi." },
            { step: "Langkah 3", title: "Normalisasi Nilai", desc: "Semua nilai penilaian dinormalisasi menggunakan metode SAW untuk menciptakan skala yang sebanding." },
            { step: "Langkah 4", title: "Menghitung Nilai Preferensi", desc: "Skor akhir dihitung sebagai jumlah dari nilai yang telah dinormalisasi dikalikan dengan bobot masing-masing." },
          ].map((item, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold">{item.step}</h4>
              <p className="text-gray-700 mt-1 font-bold">{item.title}</p>
              <p className="text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        © 2025 Sistem Seleksi Asisten Dosen. Hak cipta dilindungi.
      </footer>
    </div>
  );
}
