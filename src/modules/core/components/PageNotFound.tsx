const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-300 mb-2">404</h1>
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Page not found
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
