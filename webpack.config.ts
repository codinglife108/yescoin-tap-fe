import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
    resolve: {
        alias: {
            '@images': path.resolve(__dirname, 'src/assets/images'),
        },
    },

};

export default config;
