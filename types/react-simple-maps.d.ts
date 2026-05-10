declare module "react-simple-maps" {
  import { ReactNode, CSSProperties } from "react";

  interface ProjectionConfig {
    center?: [number, number];
    rotate?: [number, number, number];
    scale?: number;
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geography[] }) => ReactNode;
  }

  interface Geography {
    rsmKey: string;
    id: string | number;
    type: string;
    geometry: object;
    properties: Record<string, unknown>;
  }

  interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    key?: string;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
}
