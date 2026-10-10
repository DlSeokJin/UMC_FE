import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
    return (
        <main className="max-w-[1300px] w-full mx-auto px-6 md:px-12 py-9 pb-16 flex-1">
            <h2 className="text-2xl md:text-[28px] font-extrabold mb-7 text-slate-900">
                영화 목록
            </h2>
            <MovieGrid movies={movies} />
            <Pagination currentPage={1} totalPages={5} />
        </main>
    );
}