import CardPost from "../CardPost";
import { PostingType } from "@/types/PostingType";
import { getAllPost } from "@/lib/server/firebaseAdminOps";
import Pagination from "../Pagination";

const MAX_ITEM = 5;

export default async function FeedSection({
    page
}: { page: number }) {
    const posts: PostingType[] = await getAllPost()

    const totalPages = Math.ceil(posts.length / MAX_ITEM);
    const startIndex = (page - 1) * MAX_ITEM;
    const paginatedPosts = posts.slice(startIndex, startIndex + MAX_ITEM);

    // async function test() {
    //     console.log("Data :", posts);
    // }

    // test()

    return (
        <section className="mt-[25px] mb-[60px]">
            <div className="container mx-auto">
                <h1 className="text-xl text-center font-semibold">Public Feed | Page : {page}</h1>
                <p className="text-center text-[14px]">Let's see what is other people write</p>
                <br />
                <div className="grid grid-cols-1 gap-[35px] justify-items-center">
                    {
                        paginatedPosts && paginatedPosts.length > 0 ? (paginatedPosts.map((post, i) => {
                            return (
                                <CardPost
                                    id={post.id}
                                    key={i}
                                    author={post.author}
                                    desc={post.desc}
                                    createdAt={post.createdAt}
                                    title={post.title}
                                    imageUrl={post.imageUrl}
                                />
                            );
                        })) : (
                            <div className="text-center text-gray-400 py-10">
                                No posts yet. 🚀
                            </div>)
                    }
                </div>
                <Pagination currentPage={page} totalPages={totalPages} />
            </div>
        </section>
    );
}