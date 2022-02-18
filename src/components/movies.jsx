import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import Pagination from "./commons/pagination";
import Filter from "./commons/filter";
import Link from "react-router-dom/Link";
import _ from "lodash";
import SearchBox from "./searchBox";

export default class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    selectedItem: null,
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
    this.setState({ searchQuery: "", selectedItem: group, currentPage: 1 });
  };

  sortHandler = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedItem: null, currentPage: 1 });
  };

  getPaginatedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedItem,
      searchQuery,
      sortColumn,
    } = this.state;
    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedItem && selectedItem._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedItem._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres,
      selectedItem,
      sortColumn,
      searchQuery,
    } = this.state;
    if (count === 0) return <p>There are No Movies In Database.</p>;

    const { totalCount, data: movies } = this.getPaginatedData();

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
          <Link
            className="btn btn-primary"
            to="/movies/new"
            style={{ marginBottom: 20 }}
          >
            Add Movie
          </Link>
          <p>Showing {totalCount} of Movies in the Database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.likeHandler}
            onDelete={this.deleteHandler}
            onSort={this.sortHandler}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }
}
