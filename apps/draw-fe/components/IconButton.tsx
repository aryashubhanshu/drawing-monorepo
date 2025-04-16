import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated
}: {
  icon: ReactNode;
  onClick: () => void;
  activated?: boolean;
}) {
  return (
    <div className={`cursor-pointer hover-bg-gray-800 ${activated ? "text-blue-600" : "text-gray-700"} flex items-center justify-center`} onClick={onClick}>
      {icon}
    </div>
  );
}
