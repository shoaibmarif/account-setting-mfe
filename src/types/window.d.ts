/**
 * Global Type Definitions for Runtime Configuration and Webpack
 *
 * This file contains declarations for variables injected at runtime
 * (via window._env_) or by Webpack (__webpack_public_path__).
 */

declare let __webpack_public_path__: string;

interface Window {
    _env_: {
        [key: string]: string;
    };
}
