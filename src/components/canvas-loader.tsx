import { forwardRef } from 'react';
import styled from 'styled-components';

//TODO: AJUSTAR CSS
const Object = styled.div<{zIndex?: number, width?: number, height?: number, backgroundColor?: string}>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  z-index: ${props => props.zIndex ? props.zIndex : 1};
`;
interface IProps{
  zIndex?: number,
  width?: number,
  height?: number,
  backgroundColor?: string
}
/* eslint-disable-next-line react/display-name */
export const Container = forwardRef<any, IProps>((props, ref) => (
  <Object
    ref={ref}
    zIndex={props.zIndex}
    width={props.width}
    height={props.height}
    backgroundColor={props.backgroundColor}
  >
  </Object>
))

const Loader: React.FC = () => {
  return (
    <Container />
  )
}

export default Loader