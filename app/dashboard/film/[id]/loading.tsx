export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="w-24 h-10 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-gray-300 dark:bg-gray-700 h-96 animate-pulse"></div>
          
          <div className="p-6 md:w-2/3">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6 animate-pulse"></div>
            
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/5 mb-3 animate-pulse"></div>
            
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-24 mt-4 animate-pulse"></div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/6 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
