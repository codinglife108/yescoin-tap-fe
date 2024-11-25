import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import crypto from 'crypto-browserify';
import stream from 'stream-browserify';
import assert from 'assert';
import http from 'stream-http';
import https from 'https-browserify';
import os from 'os-browserify';
import url from 'url';

export default function override(config) {
    const fallback = config.resolve.fallback || {};
    
    Object.assign(fallback, {
        "crypto": crypto,
        "stream": stream,
        "assert": assert,
        "http": http,
        "https": https,
        "os": os,
        "url": url
    });

    config.resolve.fallback = fallback;

    return config;
}
