import { ChangeEvent } from 'react';
import * as React from 'react';
import { IUser } from '../../interfaces/user.interface';
import { CartWidgetComponent } from "@msc-tellco/shopping-cart";
import { apiService } from '../../shared/api.service';
import { Modal } from '../modal/modal.component';

enum ModalMode {
    SIGN_UP,
    SIGN_IN,
    SIGN_OUT
}

interface INavbarState {
    loggedUser: IUser;
    modalMode: ModalMode;
    modalForm: {[key: string] : string}
    showModal: false;
    text: string;
}

export class NavbarComponent extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    public state: INavbarState = {
        loggedUser: null,
        modalForm: {},
        modalMode: null,
        showModal: false,
        text: '',
    };

    public componentDidMount(): void {
        addEventListener('unauthorized-access-cart', () => {
            this.onSignIn();
        });
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void { }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <div className="tellco-navbar">
                    <div className="navigation-container">
                        <a href="/"><img className="logo" src="https://i.ibb.co/f9y8600/logo.png" alt="logo.png"/></a>
                        <div className="search-container">
                            <input type="text" placeholder="Search in Tellco..." onChange={(e) => this.onChangeSearch(e)}/>
                            <button disabled={!this.state.text} className="search-btn" onClick={() => this.onSearch()}>Search</button>
                        </div>
                        <CartWidgetComponent/>
                    </div>
                    {this.renderUserArea()}
                </div>
                <Modal show={this.state.showModal} handleClose={this.hideModal} handleConfirm={this.handleConfirm}>
                    {this.renderModalContent()}
                </Modal>
            </React.Fragment>
        );
    }

    private renderUserArea(): JSX.Element {
        const name = localStorage.getItem('user-first-name');
        return (
            <div className="auth-container">
                { name ? this.renderUserNameAndLogout(name) : this.renderLogin()}
            </div>
        );
    }

    private renderUserNameAndLogout(name: string): JSX.Element {
        return (
            <React.Fragment>
                <span className="greeting">Hi, <strong>{name}</strong>!</span>
                <a className="login-btn" onClick={() => this.onLogout()}>Logout</a>
            </React.Fragment>
        )
    }

    private renderLogin(): JSX.Element {
        return (
            <React.Fragment>
                <a className="login-btn" onClick={() => this.onSignIn()}>Sign-in</a>
                <a className="login-btn" onClick={() => this.onSignUp()}>Sign-up</a>
            </React.Fragment>
        )
    }

    private showModal(modalMode: ModalMode) {
        this.setState({ modalMode, showModal: true });
    }

    private hideModal() {
        this.setState({ modalMode: null, showModal: false, modalForm: {} });
    }

    private onSignIn(): void {
        this.showModal(ModalMode.SIGN_IN);
    }

    private renderModalContent(): JSX.Element {
        switch(this.state.modalMode) {
            case ModalMode.SIGN_IN:
                return this.renderSignin();
            case ModalMode.SIGN_UP:
                return this.renderSignup();
            case ModalMode.SIGN_OUT:
                return this.renderSignout();
        }
    }

    private handleConfirm(): void {
        switch(this.state.modalMode) {
            case ModalMode.SIGN_IN:
                return this.handleSignin();
            case ModalMode.SIGN_UP:
                return this.handleSignup();
            case ModalMode.SIGN_OUT:
                return this.handleSignout();
        }
    }

    private renderSignup(): JSX.Element {
        return (
            <form className="modal-form">
                <h3>Sign-Up</h3>
                <div className="form-group">
                    <label>First Name:</label>
                    <input id="first-name" type="text" onChange={(e) => this.handleOnChange(e, 'firstName')}/>
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input id="last-name" type="text" onChange={(e) => this.handleOnChange(e, 'lastName')}/>
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input id="email" type="email" onChange={(e) => this.handleOnChange(e, 'email')}/>
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <input id="username" type="text" onChange={(e) => this.handleOnChange(e, 'username')}/>
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input id="password" type="password" onChange={(e) => this.handleOnChange(e, 'password')}/>
                </div>
            </form>
        );
    }

    private handleOnChange(e: ChangeEvent<HTMLInputElement>, key: string): void {
        this.setState({ modalForm : { ...this.state.modalForm, [key]: e.target.value } });
    }

    private renderSignin(): JSX.Element {
        return (
            <form className="modal-form">
                <h3>Sign-In</h3>
                <div className="form-group">
                    <label>Username:</label>
                    <input id="username" type="text" onChange={(e) => this.handleOnChange(e, 'username')}/>
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input id="password" type="password" onChange={(e) => this.handleOnChange(e, 'password')}/>
                </div>
            </form>
        );
    }

    private renderSignout(): JSX.Element {
        return (
            <div className="modal-form"><h3>Sign-Out</h3>Do you want to sign-out?</div>
        );
    }

    private handleSignup(): void {
        apiService.signUp(this.state.modalForm).then(() => {
            this.hideModal();
        })
    }

    private handleSignin(): void {
        apiService.signIn(this.state.modalForm).then((response: { data: {[key: string]: string} }) => {
            localStorage.setItem('user-token', response.data.accessToken);
            localStorage.setItem('user-first-name', response.data.firstName);
            const event = new CustomEvent('signin', { detail: { userId: response.data.id }});
            dispatchEvent(event);
            this.hideModal();
        })
    }

    private handleSignout(): void {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-first-name');
        const event = new CustomEvent('signout');
        dispatchEvent(event);
        this.hideModal();
    }


    private onSignUp(): void {
        this.showModal(ModalMode.SIGN_UP);
    }

    private onLogout(): void {
        this.showModal(ModalMode.SIGN_OUT);
    }

    private onChangeSearch(e: ChangeEvent<HTMLInputElement>): void {
        this.setState({ text: e.target.value });
    }

    private onSearch(): void {
        alert('About to send ' + this.state.text);
        const event = new CustomEvent("search", {
            detail: {
                query:  this.state.text
            }
        });
        dispatchEvent(event);
    }
}
