import { forwardRef } from 'react';
import styled from 'styled-components';

const Object = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background-color: #000;
`;

/* eslint-disable-next-line react/display-name */
export const MeshContainer = forwardRef<any, any>(( { children }, ref ) => (
  <Object
    ref={ref}
  >
    {children}
  </Object>
))

const Loader: React.FC = () => {
  return (
    <MeshContainer />
  )
}

export default Loader