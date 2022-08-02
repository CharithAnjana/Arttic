import { Link } from "react-router-dom";

import "./SignInPage.css";

import logo from "../../images/logo.png";

function SignInPage() {
  return (
    <>
      <span class="SignInPage">
        <div class="d-flex justify-content-center">
          <div class="col-4">
            <div class="card card-update">
              <div class="card-body">
                <div class="d-grid gap-2 col-12 mx-auto text-center arttic-logo">
                  <Link to="/">
                    <img src={logo} width="200" height="45" />
                  </Link>
                </div>

                <div class="d-grid gap-2 col-12 mx-auto text-center">
                  <button class="btn btn-outline-primary" type="button">
                    <i class="bi bi-google icon"></i>Sign In with Google
                  </button>
                  <button class="btn btn-outline-dark" type="button">
                    <i class="bi bi-apple icon"></i>Sign In with Apple
                  </button>
                  <p class="Or">Or</p>
                </div>

                <Formik
                  initialValues={initialLoginValues}
                  validationSchema={loginValidation}
                  onSubmit={loginUser}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <span className="authenticationField">
                        <div className="col-12">
                          <label htmlFor="username" className="form-label">
                            Email or Username
                          </label>
                          <Field
                            type="text"
                            className="form-control form-control-update"
                            id="username"
                            name="username"
                            placeholder="Enter Email or Username"
                          />

                          <ErrorMessage
                            name="username"
                            component="div"
                            className="error-msg"
                          />
                          <p class="error-msg">{usernameError}</p>
                        </div>
                      </span>

                      <span className="authenticationField">
                        <div className="col-12">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <Field
                            type="password"
                            className="form-control form-control-update"
                            id="password"
                            name="password"
                            placeholder="Enter Email or Username"
                          />

                          <ErrorMessage
                            name="password"
                            component="div"
                            className="error-msg"
                          />
                          <p class="error-msg">{passwordError}</p>
                        </div>
                      </span>

                      <div class="col-12 Froget-password">
                        <p class="text-end">
                          <a className="theme">
                            <small>Forgot Password</small>
                          </a>
                        </p>
                      </div>
                      <div class="col form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="remember-me"
                        />
                        <label class="form-check-label" for="remember-me">
                          Remember Me
                        </label>
                      </div>
                      <div class="text-center">
                        <div class="col-12">
                          <button
                            type="submit"
                            class="btn btn-primary col-12 btnlog"
                          >
                            Sign In
                          </button>
                        </div>
                        <div class="col-12">
                          <p class="signup">
                            Don’t have an account?{" "}
                            <Link to="/signupoption">Sign Up</Link>
                          </p>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div class="help-privacy-terms">
              <div class="row">
                <div class="col">
                  <a class="link" href="#">
                    Help
                  </a>
                </div>
                <div class="col">
                  <a class="link" href="#">
                    Privacy
                  </a>
                </div>
                <div class="col">
                  <a class="link" href="#">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </>
  );
}

export default SignInPage;
