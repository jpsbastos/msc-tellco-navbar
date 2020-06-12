import "./set-public-path";
import "./msc-tellco-navbar.scss";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { NavbarComponent } from './components/navbar/navbar.component';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: NavbarComponent,
  // errorBoundary(err, info, props) {
  //   // Customize the root error boundary for your microfrontend here.
  //   return null;
  // },
});

export const { bootstrap, mount, unmount } = lifecycles;
