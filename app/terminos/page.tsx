import { getAllPolicies } from "@/lib/shopify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Políticas",
  description: "Consulta nuestros términos de servicio, política de privacidad y más.",
};

export default async function TerminosPage() {
  const policies = await getAllPolicies();

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-12">
        Términos y Políticas
      </h1>
      
      <div className="space-y-16">
        {policies.length > 0 ? (
          policies.map((policy, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                {policy.title}
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            </div>
          ))
        ) : (
          <p>No se encontraron políticas para mostrar.</p>
        )}
      </div>
    </div>
  );
}
