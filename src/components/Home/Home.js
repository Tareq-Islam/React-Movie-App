import React, { Component } from 'react'
import { API_KEY, API_URL, BACKDROP_SIZE, IMAGE_BASE_URL, POSTER_SIZE } from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage'
import SearchBar from '../elements/SearchBar/SearchBar'
import FourColGrid from '../elements/FourColGrid/FourColGrid'
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn'
import MovieThumb from '../elements/MovieThumb/MovieThumb'
import Spinner from '../elements/Spinner/Spinner'
import './Home.css'
export default class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPage: 0,
        searchItem: ''
    }
    componentDidMount() {
        this.setState({ loading: true });
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        this.fetchItems(endpoint);
    }

    loadMoreItems = () => {
        let endpoint = '';
        this.setState({ loading: true });
        if (this.state.searchItem === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.searchItem}&page=${this.state.currentPage + 1}`;
        }
        this.fetchItems(endpoint);
    }

    searchItems = (searchItem) => {
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchItem
        });
        if (searchItem === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchItem}`;
        }
        this.fetchItems(endpoint);
    }


    fetchItems = (endpoint) => {
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    movies: [...this.state.movies, ...result.results],
                    heroImage: this.state.heroImage || result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPage: result.total_pages
                })
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroImage ?
                    <div>
                        <HeroImage
                            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                            title={this.state.heroImage.original_title}
                            text={this.state.heroImage.overview}
                        />
                        <SearchBar callback={this.searchItems} />
                    </div> : null}
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={this.state.searchItem ? 'Search Result' : 'Popular Movies'}
                        loading={this.state.loading}
                    >
                        {this.state.movies.map((element, i) => {
                            return (<MovieThumb
                                key={i}
                                clickable={true}
                                image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                movieId={element.id}
                                movieName={element.original_title}
                            />)
                        }
                        )}
                    </FourColGrid>
                    {
                        this.state.loading ? <Spinner/> : null
                    }
                    {
                        (this.state.currentPage <= this.state.totalPage && !this.state.loading) ? 
                        <LoadMoreBtn text="Load More" onClick={this.loadMoreItems}/> : null 
                    }
                </div>
            </div>
        )
    }
}
