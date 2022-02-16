import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import Pagination from "./commons/pagination";
import Filter from "./commons/filter";

export default class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
  };

  componentDidMount = () => {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  };

  deleteHandler = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };

  likeHandler = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...this.state.movies[index] };
    movies[index].liked = !movie.liked;
    this.setState({ movies });
  };

  pageChangeHandler = (page) => {
    this.setState({ currentPage: page });
  };

  handleFilter = (group) => {
    console.log(group);
    this.setState({ selectedItem: group, currentPage: 1 });
  };

  sortHandler = (path) => {
    console.log(path);
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      genres,
      selectedItem,
    } = this.state;
    if (count === 0) return <p>There are No Movies In Database.</p>;

    const filtered =
      selectedItem && selectedItem._id
        ? allMovies.filter((item) => item.genre._id === selectedItem._id)
        : allMovies;
    const movies = paginate(filtered, currentPage, pageSize);

    return (
      <div className="row">
        <div className="col-2">
          <Filter
            items={genres}
            selectedItem={selectedItem}
            onFilterHandler={this.handleFilter}
          />
        </div>
        <div className="col">
          <p>Showing {filtered.length} of Movies in the Database.</p>
          <MoviesTable
            movies={movies}
            onLike={this.likeHandler}
            onDelete={this.deleteHandler}
            onSort={this.sortHandler}
          />
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }
}
