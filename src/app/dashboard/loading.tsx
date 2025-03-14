// src/app/dashboard/loading.tsx

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-16 h-16 mb-4 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
      <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
      <p className="mt-2 text-sm text-gray-500">
        Please wait while we fetch your data
      </p>
    </div>
  );
}
