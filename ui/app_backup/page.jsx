import Image from 'next/image';
import HomePage from '@/components/HomePage';
import { nodes as Nodes } from '@/utils/mocked-nodes';
import PagePoster from '@/assets/poster.png';

const Page = () => {
  return (
    <div className="flex-1 p-6 bg-gray dark:bg-bg_dark_gray rounded-xl overflow-y-scroll no-scrollbar">
      <div className="w-full flex justify-center items-center pb-6">
        <Image src={PagePoster} alt="Page Poster" width={1200} height={240} />
      </div>
      <HomePage nodes={Nodes} />
    </div>
  );
};

export default Page;
