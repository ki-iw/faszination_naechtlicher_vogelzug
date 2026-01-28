import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const MapLoadingIndicator = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3 border border-white/10">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 18, color: "#fff" }} spin />
          }
        />
        <span className="text-sm font-medium">Wird geladen...</span>
      </div>
    </div>
  );
};
