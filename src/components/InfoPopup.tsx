// components/map/InfoPopup.tsx
import React from "react";
import { CloseOutlined } from "@ant-design/icons";

interface InfoPopupProps {
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  imgSrc?: string;
  imgAlt?: string;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({
  onClose,
  title,
  content,
  imgSrc,
  imgAlt = "",
}) => {
  return (
    <div className="min-w-[300px] max-w-[400px]">
      <div className="bg-[#F2F4F8] -mx-2.5 -mt-3.5 p-4 py-3 flex items-center justify-between">
        <h3 className="text-lg text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="hover:text-gray-600 cursor-pointer hover:scale-110 transition-transform"
        >
          <CloseOutlined style={{ fontSize: "20px" }} />
        </button>
      </div>
      {imgSrc && (
        <div className="-mx-2.5">
          <img src={imgSrc} alt={imgAlt} />
        </div>
      )}
      <div className="text-gray-700 text-sm px-1.5 mt-5">{content}</div>
    </div>
  );
};
