// apps/web/src/app/documents/[id]/page.tsx
'use client';

type PageProps = {
  params: {
    id: string;
  };
};

export default function DocumentDetailPage({ params }: PageProps) {
  console.log('Página de detalhes renderizada para o ID:', params.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Detalhes do Documento</h1>
      <p className="mt-2">ID do Documento: {params.id}</p>
      <p className="mt-4 text-slate-500">
        ... Em breve, o texto extraído e o chat com a IA aparecerão aqui ...
      </p>
    </div>
  );
}