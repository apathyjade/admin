
import React from "react";
import { createBrowserRouter } from "react-router";


// const ProductCard = React.lazy(() => import('rslib_provider/ProductCard'));

import Layout from './layout';

export default createBrowserRouter([
  {
    path: '/web',
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
      },
      {
        path: 'map',
        Component: React.lazy(() => import('./pages/map')),
      },
      {
        path: 'about',
        Component: React.lazy(() => import('./pages/about')),
      },
    //   {
    //     path: 'product',
    //     Component: () => <ProductCard product={{ name: 'test' }} />,
    //   },
      {
        path: '*',
        Component: () => <>error</>,
      }
    ],
  },
])