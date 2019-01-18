import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from '../../queries';
import Error from '../Error';

const initialState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

export class Signup extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event, signUpUser) => {
    event.preventDefault();

    signUpUser().then(data => {
      console.log(data);
      localStorage.setItem('token', data.signUpUser.token);
      this.clearState();
    });
  };

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    const isInvalid =
      !username || !email || !password || password !== passwordConfirmation;

    return isInvalid;
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;

    return (
      <div className="App">
        <h2>Signup</h2>

        <Mutation
          mutation={SIGNUP_USER}
          variables={{
            username,
            email,
            password
          }}
        >
          {(signUpUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signUpUser)}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                >
                  Submit
                </button>

                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default Signup;
