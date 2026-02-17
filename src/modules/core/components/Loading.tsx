export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
      <div className="mb-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-sm">Loading...</p>
    </div>
  );
};

export default LoadingPage;
