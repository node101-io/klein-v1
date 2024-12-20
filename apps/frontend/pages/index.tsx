import Image from "next/image";
import localFont from "next/font/local";

import { fetchProjects } from "@/services/api";
import { TransformedProject } from "@/types/projects.types";
import NodeExplorer from "@/components/home/home-page-nodes";
import PagePoster from "@/assets/poster.png";

const AnekBangla = localFont({
  src: "./fonts/AnekBangla.ttf",
  variable: "--font-anek-bangla",
  weight: "100 900",
});

export async function getStaticProps() {
  try {
    const nodes: TransformedProject[] = await fetchProjects();
    return {
      props: {
        nodes,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      props: {
        nodes: [],
      },
    };
  }
}

interface HomeProps {
  nodes: TransformedProject[];
}

export default function Home({ nodes }: HomeProps) {
  return (
    <div
      className={`${AnekBangla.variable} flex-1 p-6 bg-gray dark:bg-bg_dark_gray rounded-xl h-full overflow-y-scroll no-scrollbar`}
    >
      <div className="w-full flex justify-center items-center pb-6">
        <Image
          src={PagePoster}
          alt="Page Poster"
          width={1200}
          height={240}
        />
      </div>
      <NodeExplorer nodes={nodes} />
    </div>
  );
}
