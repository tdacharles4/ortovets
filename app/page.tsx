
export default function Home() {
  return (
    <main className="flex-grow">
      {/* Frame */}
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold">Your Frame Title</h1>
        </div>
      </div>

      {/* Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Service 1</h3>
            <p>Description of service 1.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Service 2</h3>
            <p>Description of service 2.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Service 3</h3>
            <p>Description of service 3.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
