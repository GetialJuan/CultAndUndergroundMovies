/**
 * @fileoverview Loading component to display a loading spinner and message.
 * This component provides a visual cue to the user that content is being loaded.
 * It uses Tailwind CSS for styling and animation.
 *
 * @component
 * @example
 * <Loading />
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-400"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-300">Loading movies...</h2>
      </div>
    </div>
  );
}