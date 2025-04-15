import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  return response.data.room.id;
}

export default async function RoomPage({ params }: { params: Promise<{slug: string}>} ) { 
    const { slug } = await params;
    const roomId = await getRoomId(slug);

  return (
    <div className="w-full h-screen bg-black text-white px-4 py-8">
    <ChatRoom id={roomId} />
    </div>
  );
}
