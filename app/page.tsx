import { ButtonExamples } from "@/components/button-examples";

export default function Home() {
  return (
    <main className="flex-grow container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-10">Landing Page</h1>
      <p className="text-center text-lg">Welcome to Ortovets. Please explore the pages.</p>
      <div className="mt-10">
        <ButtonExamples />
      </div>
    </main>
  );
}
