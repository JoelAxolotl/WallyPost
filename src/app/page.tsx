import Navbar from "@/components/Navbar";
import FeedSection from "@/components/pages/FeedSection";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const page = (await searchParams).page ? (await searchParams).page : 1;

	return (
		<main>
			<Navbar />

			<FeedSection page={Number(page)} />
		</main>
	);
}
