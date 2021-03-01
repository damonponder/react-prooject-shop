import React, {Component} from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import {connect} from 'react-redux'
import { setCurrentUser } from "./redux/actions/user/userAction";
import { createStructuredSelector } from "reselect";
import HomePage from "./pages/homepage/homePage";
import ShopPage from "./pages/shop/shop";
import Header from './components/header/header'
import CheckOutPage from "./pages/checkout/checkout";
import SignInAndSignUp from "./components/signinandsignup/signInAndSignUp";
import { auth, createUserProfileDocument } from './firebase/firebase.utils.js'
import { selectCurrentUser } from "./redux/actions/user/user.selector";

import './App.css';

class App extends Component {
    unsubscribeFromAuth = null;

    componentDidMount() {

        const { setCurrentUser } = this.props;

        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if(userAuth) {
                const userRef = await createUserProfileDocument(userAuth);

                userRef.onSnapshot(snapShot => {
                   setCurrentUser({
                            id: snapShot.id,
                            ...snapShot.data()
                });
            });
        }
            setCurrentUser(userAuth);
    });
}
    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header/>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route exact path='/shop' component={ShopPage}/>
                    <Route exact path='/checkout' component={CheckOutPage}/>
                    <Route exact
                           path='/signin'
                           render={() =>
                               this.props.currentUser ? (
                                    <Redirect to='/'/>
                            ) : (
                                <SignInAndSignUp/>
                        )
                        }
                        />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (App);
