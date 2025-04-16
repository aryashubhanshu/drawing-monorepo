import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasRoom({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params;

  return <RoomCanvas roomId={roomId} />;
}
