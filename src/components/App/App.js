import React, { Component } from 'react'
import Header from '../elements/Header/Header'
import Home from '../Home/Home'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import NotFound from '../NotFound/NotFound'
import Movie from '../Movie/Movie'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Header />
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/:movieId" component={Movie} exact />
                        <Route component={NotFound} />
                    </Switch>
                </React.Fragment>
            </BrowserRouter>
        )
    }
}
