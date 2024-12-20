import React, { useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { TransformedProject } from "@/types/projects.types";

interface NodeCardProps {
  node: TransformedProject;
  highlightText?: (text: string) => JSX.Element;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, highlightText }) => {
  const router = useRouter();
  const { setCollapsed } = useSidebar();

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleInstallClick = () => {
    setCollapsed(true);
    router.push(`/login?id=${node.id}`);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (tooltipVisible) {
      timeout = setTimeout(() => {
        setTooltipVisible(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [tooltipVisible]);

  if (!node) return null;

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInstallClick}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col border border-[#B715FF] border-opacity-0 hover:border-opacity-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {node.image ? (
            <Image
              src={node.image}
              alt={node.name}
              width={80}
              height={80}
              className="rounded-xl shadow-md mr-4"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-xl mr-4" />
          )}
          <div className="text-start">
            <div className="flex">
              <h3 className="text-xl font-semibold text-gray-900">
                {highlightText ? highlightText(node.name) : node.name}
              </h3>
            </div>
            <p className="text-sm mt-1 text-text_gray">
              {node.network.charAt(0).toUpperCase() + node.network.slice(1)}
            </p>
          </div>
        </div>
      </div>
      {tooltipVisible && (
        <div
          className={`absolute text-[#3341A4] whitespace-nowrap z-50 pointer-events-none flex items-center rounded`}
          style={{
            top: mousePosition.y - 15,
            left: mousePosition.x - 10,
          }}
        >
          <div className="w-[15px] h-[15px] rounded-full mr-2 bg-[#AAB3FF]"></div>
          Install Node
        </div>
      )}
    </button>
  );
};

export default NodeCard;
