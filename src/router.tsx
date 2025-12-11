
import React from "react";
import { createBrowserRouter } from "react-router";

import Layout from './layout';

export default createBrowserRouter([
  {
    path: '',
    Component: Layout,
    children: [
      {
        index: true,
        path: 'home',
        lazy: async () => {
          const [Component] = await Promise.all([
            import("./pages/home"),
          ]);
          return { Component: (props) => Component.default({ ...props, test: "test" }) };
        },
        // Component: React.lazy(() => import('./pages/home')),
      },
      {
        path: 'about',
        Component: React.lazy(() => import('./pages/about')),
      },
      {
        path: 'baidu',
        Component: () => <div id="micro-app" />,
      },
      {
        path: '*',
        Component: () => <>error</>,
      }
    ],
  },
])