export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> } ) {
  const { id } = await params;
  return (
    <div className="p-7">
      <h1 className="font-syne font-bold text-white text-[1.5rem] mb-1">Edit Vehicle</h1>
      <p className="text-white/30 text-[12px]">Vehicle ID: {id}</p>
    </div>
  );
}
