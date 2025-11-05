// components/Pagination.tsx
import Link from 'next/link';

export default function Pagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <div className="flex justify-center items-center gap-3 mt-6">
            <Link
                href={prevPage ? `?page=${prevPage}` : '#'}
                className={`btn btn-sm ${!prevPage && 'btn-disabled'}`}
            >
                « Prev
            </Link>

            <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
            </span>

            <Link
                href={nextPage ? `?page=${nextPage}` : '#'}
                className={`btn btn-sm ${!nextPage && 'btn-disabled'}`}
            >
                Next »
            </Link>
        </div>
    );
}
