import {proxy} from 'valtio';

const state = proxy({
    intro : true,
    color : '#EFBD48',
    isLogoTexture : true,
    isFullTexture : false, 
    logoDecal : './shirt-logo.png',
    fullDecal : './shirt-logo.png',
    fullImage : null,
});
export default state;