import Image from 'next/image';
import HomePage from '@/components/HomePage';
import PagePoster from '@/assets/poster.png';
import { fetchProjects } from '@/services/api';

export async function getStaticProps() {
    const nodes = await fetchProjects();
    return {
        props: {
            nodes,
        },
    };
}
const Page = ({ nodes }) => {
    return (
        <div className="flex-1 p-6 bg-gray dark:bg-bg_dark_gray rounded-xl h-full overflow-y-scroll no-scrollbar">
            <div className="w-full flex justify-center items-center pb-6">
                <Image src={PagePoster} alt="Page Poster" width={1200} height={240} />
            </div>
            <HomePage nodes={nodes} />
        </div>
    );
};



export default Page;
