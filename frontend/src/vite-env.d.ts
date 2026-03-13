/// <reference types="vite/client" />
/// <reference types="react/next" />
/// <reference types="react-dom/next" />

declare module 'react' {
  export = React;
  export as namespace React;
  namespace React {
    type FC<P = {}> = FunctionComponent<P>;
    export interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
      propTypes?: any;
      contextTypes?: any;
      defaultProps?: Partial<P>;
      displayName?: string;
    }
    type ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = {
      type: T;
      props: P;
      key: any | null;
    };
    export type MouseEvent<T = Element> = any;
    export type DragEvent<T = Element> = any;
    export type ChangeEvent<T = Element> = any;
    export type FormEvent<T = Element> = any;
    export function useState<S>(initialState: S | (() => S)): [S, (newState: S) => void];
    export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    export function useRef<T>(initialValue: T | null): { current: T | null };
    namespace JSX {
      interface Element {
        type: any;
        props: any;
        key: any | null;
      }
      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}

declare module 'react-router-dom' {
  export function Link(props: any): any;
  export function useLocation(): any;
  export function BrowserRouter(props: any): any;
  export function Routes(props: any): any;
  export function Route(props: any): any;
  export function Outlet(props: any): any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-chartjs-2' {
  export function Line(props: any): any;
}

declare module 'react-leaflet' {
  export function MapContainer(props: any): any;
  export function TileLayer(props: any): any;
  export function GeoJSON(props: any): any;
  export function useMap(): any;
}

declare module 'chart.js' {
  export const Chart: any;
  export const CategoryScale: any;
  export const LinearScale: any;
  export const PointElement: any;
  export const LineElement: any;
  export const Title: any;
  export const Tooltip: any;
  export const Legend: any;
  export const Filler: any;
}

declare module 'geojson' {
  export type Feature<G = any, P = any> = any;
  export type Geometry = any;
  export type FeatureCollection<G = any, P = any> = any;
}

declare namespace L {
  export type Layer = any;
}

declare namespace JSX {
  interface Element {
    type: any;
    props: any;
    key: any | null;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
