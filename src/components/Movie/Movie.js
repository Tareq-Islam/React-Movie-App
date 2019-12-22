import React, { Component } from 'react'
import {API_URL, API_KEY} from '../../config'
import Navigation from '../elements/Navigation/Navigation'
import './Movie.css'
import MovieInfo from '../elements/MovieInfo/MovieInfo'
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar'
import FourColGrid from '../elements/FourColGrid/FourColGrid'
import Spinner from '../elements/Spinner/Spinner'
import Actor from '../elements/Actor/Actor'

export default class Movie extends Component {
    state = {
        movie: null,
        actors: null,
        directors: [],
        loading: false
    }

    componentDidMount() {
        this.setState({loading: true});
        const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-us`;
        this.featchItems(endpoint);
    }

    featchItems = (endpoint) => {
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            if (result.status_code) {
                this.setState({loading: false});
            } else {
                this.setState({movie: result}, () => {
                    const endpoint =  `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}&language=en-us`;
                    fetch(endpoint)
                    .then(result => result.json())
                    .then(result => {
                        const directors = result.crew.filter( (member) => member.job === 'Director');
                        this.setState({
                            actors: result.cast,
                            directors,
                            loading: false
                        })
                    })
                })
            }
        })
        .catch(error => console.log(error))
    }

    render() {
        console.log(this.state.movie)
        return (
            <div className="rmdb-movie"> 
                {
                    this.state.movie ?
                    <div>
                        <Navigation movie={this.props.location.movieName}/>
                        <MovieInfo movie={this.state.movie} directors={this.state.directors}/>
                        <MovieInfoBar time={this.state.movie.runtime} budget={this.state.movie.budget} revenue={this.state.movie.revenue}/>
                    </div>
                    : 
                    null
                }
                {
                    this.state.actors ?
                    <div className="rmdb-movie-grid">
                        <FourColGrid
                        header={'Actors'} 
                        >                            
                            {
                                this.state.actors.map((element, i) => {
                                    return <Actor key={i} actor={element}/>
                                })
                            }
                        
                        </FourColGrid>
                    </div>
                    :
                    null
                }              
                {
                    !this.state.actors && !this.state.loading ? <h1>No Movie Found!</h1> : null 
                }
                {
                    this.state.loading ? <Spinner/> : null
                }
            </div>
        )
    }
}
