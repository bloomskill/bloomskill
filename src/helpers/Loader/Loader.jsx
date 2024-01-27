import { Loading } from 'notiflix/build/notiflix-loading-aio';
const onLoading = () => {
  return Loading.circle('Loading...', {
    backgroundColor: 'transparent',
    svgSize: '160px',
    svgColor: `${props => props.theme.white_fon}`,
    messageFontSize: '20px',
  });
};

const onLoaded = () => {
  return Loading.remove();
};

export { onLoading, onLoaded };
