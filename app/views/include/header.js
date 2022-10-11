/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ var __webpack_modules__ = {
    /***/ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.js':
      /*!*****************************************************************************************!*\
  !*** ./node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.js ***!
  \*****************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ UcdThemeHeader,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');
        /* harmony import */ var _ucd_theme_header_tpl_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./ucd-theme-header.tpl.js */ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.tpl.js'
          );
        /* harmony import */ var _utils_controllers__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../utils/controllers */ './node_modules/@ucd-lib/theme-elements/utils/controllers/index.js'
          );

        /**
         * @class UcdThemeHeader
         * @classdesc Component class for displaying the site header
         *
         *  PatternLab Url:
         *    - http://dev.webstyleguide.ucdavis.edu/redesign/?p=organisms-header
         *
         * @property {String} siteName - Name of website to display
         * @property {String} slogan - Optional text to display below site name
         * @property {String} figureSrc - Site logo/icon to display next to site name
         * @property {String} siteUrl - Url to use for links around site name and figure
         * @property {Boolean} opened - Whether header is open in the mobile view
         * @property {Boolean} preventFixed - Navbar will not be fixed to top of screen in desktop view
         *
         * @example
         *  <ucd-theme-header site-name="A UC Davis Website">
         *    <ucd-theme-primary-nav>
         *      <a href="#">LINK 1</a>
         *      <a href="#">LINK 2</a>
         *      <a href="#">LINK 3</a>
         *    </ucd-theme-primary-nav>
         *    <ucd-theme-search-popup>
         *      <ucd-theme-search-form>
         *      </ucd-theme-search-form>
         *    </ucd-theme-search-popup>
         *    <ucd-theme-quick-links>
         *      <a href="#">LINK 4</a>
         *      <a href="#">LINK 5</a>
         *      <a href="#">LINK 6</a>
         *    </ucd-theme-quick-links>
         *  </ucd-theme-header>
         *
         */
        class UcdThemeHeader extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
          mutationObserver =
            new _utils_controllers__WEBPACK_IMPORTED_MODULE_2__.MutationObserverController(
              this
            );
          wait =
            new _utils_controllers__WEBPACK_IMPORTED_MODULE_2__.WaitController(
              this
            );

          static get properties() {
            return {
              siteName: { type: String, attribute: 'site-name' },
              slogan: { type: String },
              figureSrc: { type: String, attribute: 'figure-src' },
              siteUrl: { type: String, attribute: 'site-url' },
              opened: { type: Boolean },
              preventFixed: { type: Boolean, attribute: 'prevent-fixed' },
              isDemo: { type: Boolean, attribute: 'is-demo' },
              _transitioning: { type: Boolean, state: true },
              _hasSlottedBranding: { type: Boolean, state: true },
              _hasQuickLinks: { type: Boolean, state: true },
              _hasSearch: { type: Boolean, state: true },
              _brandingBarInView: { type: Boolean, state: true },
            };
          }

          static get styles() {
            return (0,
            _ucd_theme_header_tpl_js__WEBPACK_IMPORTED_MODULE_1__.styles)();
          }

          constructor() {
            super();
            this.render =
              _ucd_theme_header_tpl_js__WEBPACK_IMPORTED_MODULE_1__.render.bind(
                this
              );

            this.siteName = '';
            this.siteUrl = '/';
            this.slogan = '';
            this.figureSrc = '';
            this.opened = false;
            this.isDemo = false;

            this._transitioning = false;
            this._hasSlottedBranding = false;
            this._hasQuickLinks = false;
            this._hasSearch = false;
            this._animationDuration = 500;
            this._brandingBarInView = false;
          }

          connectedCallback() {
            super.connectedCallback();
            if (!this.preventFixed) {
              this.intersectionObserver =
                new _utils_controllers__WEBPACK_IMPORTED_MODULE_2__.IntersectionObserverController(
                  this,
                  {},
                  '_onBrandingBarIntersection',
                  false
                );
            }
          }

          firstUpdated() {
            if (!this.preventFixed) {
              let aboveNav = this.renderRoot.getElementById(
                'branding-bar-container'
              );
              this.intersectionObserver.observer.observe(aboveNav);
            }
          }

          _onBrandingBarIntersection(entries) {
            let offSetValue = 0;
            try {
              offSetValue = this.renderRoot
                .getElementById('nav-bar')
                .getBoundingClientRect().height;
            } catch (error) {}
            if (offSetValue > 150) offSetValue = 0;
            entries.forEach((entry) => {
              this._brandingBarInView = entry.isIntersecting;
              if (this._brandingBarInView) {
                this.style.marginBottom = '0px';
              } else {
                this.style.marginBottom = offSetValue + 'px';
              }
            });
          }

          /**
           * @method open
           * @description Opens header menu in mobile
           * @returns {Promise}
           */
          async open() {
            if (this._transitioning || this.opened) return false;

            this.opened = true;
            this._transitioning = true;
            await this.wait.wait(this._animationDuration);
            this._transitioning = false;
            return true;
          }

          /**
           * @method close
           * @description Closes heaader menu in mobile
           * @returns {Promise}
           */
          async close() {
            if (this._transitioning || !this.opened) return false;

            this.opened = false;
            this._transitioning = true;
            await this.wait.wait(this._animationDuration);
            this._transitioning = false;
            return true;
          }

          /**
           * @method _onBtnClick
           * @private
           * @description Attached to menu open/close button
           */
          async _onBtnClick() {
            let didToggle;
            if (this.opened) {
              didToggle = await this.close();
            } else {
              didToggle = await this.open();
            }
            if (didToggle) {
              this.dispatchEvent(
                new CustomEvent('toggle', {
                  detail: { open: this.opened },
                })
              );
            }
          }

          /**
           * @method _getNavbarClasses
           * @description Get classes to be assigned to the navbar container
           * @private
           * @returns {Object}
           */
          _getNavbarClasses() {
            let classes = {
              'l-navbar': true,
              header__navbar: true,
            };

            if (this.opened) {
              classes['menu--open'] = true;
            } else {
              if (!this._transitioning) classes['menu--hidden'] = true;
              classes['menu--closed'] = true;
            }

            return classes;
          }

          /**
           * @method _getHeaderClasses
           * @description Get classes to be assigned to the header element
           * @private
           * @returns {Object}
           */
          _getHeaderClasses() {
            let classes = {
              'l-header': true,
              header: true,
            };

            classes['fixed-mobile'] = !this.preventFixed;
            classes['fixed-desktop'] =
              !this.preventFixed && !this._brandingBarInView;

            return classes;
          }

          /**
           * @method _ucdLogo
           * @description Returns URI-encoded svg string of UC Davis logo
           * @private
           * @param {String} color - Color of logo. 'blue' or 'gold'.
           * @returns {String}
           */
          _ucdLogo(color = 'blue') {
            const colors = {
              blue: '#022851',
              gold: '#FFBF00',
            };
            return encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="16.157"><path fill="${colors[color]}" d="M58.865 4.877c.101.661 1.101 5.405 1.101 5.405h-2.194l1.093-5.405zm-8.328 11.03h5.806l.438-1.947h4.144l.554 1.947h5.806L61.846.403h-6.087l-5.222 15.504zM36.284.402h5.624c5.107 0 9.007 2.277 9.007 7.974 0 4.591-3.18 7.529-7.645 7.529l-6.986-.009V.402zm5.524 11.052h.376c1.843 0 3.207-1.072 3.207-3.096 0-2.179-1.21-3.395-3.234-3.395h-.349v6.491zM32.941.888l.296 2.545c.071.604.426 2.052-.011 1.858-.276-.121-.502-.776-.726-1.36-.114-.295-.658-1.695-.801-1.799-.685-.501-2.401-1.064-3.561-1.069-3.521-.013-5.847 2.509-5.847 6.982 0 3.208 1.582 7.061 5.607 7.061 1.441 0 4.201-.443 4.952-2.436.339-.9.65-1.703.876-1.459.166.177-.05.899-.15 1.289-.474 1.847-.501 2.406-.65 2.479-1.818.885-4.15 1.178-6.191 1.178-6.485 0-8.726-3.678-8.726-7.354 0-6.379 4.032-9.021 10.286-8.791 1.58.058 3.163.334 4.646.876M13.784 1.171L12.745.819c-.35-.306.075-.391.075-.391s1.5.271 5.24-.036c0 0 .328.062.103.319l-1.228.511c-.798.338-.798.143-.798.994l-.007 7.902c0 6.178-6.47 6.039-7.73 6.039-.6 0-6.488 0-6.488-4.961V2.834c0-1.46.159-1.419-.338-1.591L.071.695S-.183.347.269.368c1.227.06 3.004.316 7.133.024 0 0 .362.085.125.342l-1.201.339c-.95.414-.825.098-.849 1.045l.028 8.248c0 2.021 1.07 4.524 4.395 4.524 4.585 0 4.627-3.854 4.627-4.71l.009-8.167c.049-.77-.052-.551-.752-.842M87.65 14.715l1.6-4.111.281.23c.982.781 2.316 1.443 3.574 1.471 1.127.023 1.676-.268 1.527-1.191-.113-.693-.916-.812-1.417-.91l-1.103-.213c-2.143-.39-3.941-1.673-3.941-4.104 0-3.677 3.262-5.737 6.544-5.737 1.726 0 3.306.424 4.786 1.36L98.11 5.156c-.762-.533-1.918-1.285-3.377-1.337-.482-.018-1.58.229-1.229 1.312.152.462.833.657 1.252.755l1.241.292c2.325.526 4.003 1.81 4.003 4.432 0 3.699-3.281 5.529-6.542 5.529-1.901 0-4.106-.527-5.808-1.424M80.979.403h5.492v15.504h-5.492zM74.684.402h5.72l-5.843 15.503h-4.644L64.09.402h5.704l2.442 9.354z"/></svg>`
            );
          }

          /**
           * @method _onChildListMutation
           * @description Fires when there are changes to this element's non-shadow DOM children
           * @private
           */
          _onChildListMutation() {
            let primaryNav = this.querySelector('ucd-theme-primary-nav');
            if (primaryNav) {
              primaryNav.setAttribute('slot', 'primary-nav');
            } else {
              console.warn("No 'ucd-theme-primary-nav' child element found!");
            }

            let quickLinks = this.querySelector('ucd-theme-quick-links');
            if (quickLinks) {
              quickLinks.setAttribute('slot', 'quick-links');
              this._hasQuickLinks = true;
            } else {
              this._hasQuickLinks = false;
            }

            let search = this.querySelector('ucd-theme-search-popup');
            if (search) {
              search.setAttribute('slot', 'search');
              this._hasSearch = true;
            } else {
              this._hasSearch = false;
            }

            let UcdlibBrandingBar = this.querySelector('ucdlib-branding-bar');
            if (UcdlibBrandingBar) {
              UcdlibBrandingBar.setAttribute('slot', 'branding-bar');
              this._hasSlottedBranding = true;
            } else if (this.querySelector("*[slot='branding-bar']")) {
              this._hasSlottedBranding = true;
            } else {
              this._hasSlottedBranding = false;
            }
          }
        }

        customElements.define('ucd-theme-header', UcdThemeHeader);

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.tpl.js':
      /*!*********************************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.tpl.js ***!
      \*********************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ styles: () => /* binding */ styles,
          /* harmony export */ render: () => /* binding */ render,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');
        /* harmony import */ var lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! lit/directives/class-map.js */ './node_modules/lit/directives/class-map.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_1_base_html_headings_css_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/1_base_html/_headings.css.js */ './node_modules/@ucd-lib/theme-sass/1_base_html/_headings.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_header_css_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_header.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_header.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_5_layout_l_header_css_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/5_layout/_l-header.css.js */ './node_modules/@ucd-lib/theme-sass/5_layout/_l-header.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_site_branding_css_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_site-branding.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_site-branding.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_mobile_bar_css_js__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_mobile-bar.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_mobile-bar.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_nav_toggle_css_js__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_nav-toggle.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_nav-toggle.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_nav_off_canvas_css_js__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_nav-off-canvas.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_nav-off-canvas.css.js'
          );

        function styles() {
          const elementStyles = lit__WEBPACK_IMPORTED_MODULE_0__.css`
        :host {
          display: block;
        }
        [hidden] {
          display: none !important;
        }
        button {
          cursor: pointer;
        }
        ::slotted(ucdlib-branding-bar){
          width: 100%;
        }
    
        @media (max-width: 991px) {
          .fixed-mobile .mobile-bar {
            position: fixed;
            width: 100%;
            z-index: 1000;
            top: 0;
          }
          .fixed-mobile .off-canvas {
            position: fixed;
            overflow: auto;
            z-index: 1000;
            top: 55px;
          }
          .fixed-mobile .l-header__branding {
            margin-top: 55px;
          }
        }
    
        @media (min-width: 992px) {
          .fixed-desktop .l-navbar {
            position: fixed;
            z-index: 1000;
            top: 0;
            right: 0;
            left: 0;
            width: 100%;
          }
        }
    
      `;

          return [
            _ucd_lib_theme_sass_1_base_html_headings_css_js__WEBPACK_IMPORTED_MODULE_2__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_header_css_js__WEBPACK_IMPORTED_MODULE_3__[
              'default'
            ],
            _ucd_lib_theme_sass_5_layout_l_header_css_js__WEBPACK_IMPORTED_MODULE_4__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_site_branding_css_js__WEBPACK_IMPORTED_MODULE_5__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_mobile_bar_css_js__WEBPACK_IMPORTED_MODULE_6__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_nav_toggle_css_js__WEBPACK_IMPORTED_MODULE_7__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_nav_off_canvas_css_js__WEBPACK_IMPORTED_MODULE_8__[
              'default'
            ],
            elementStyles,
          ];
        }

        function render() {
          return lit__WEBPACK_IMPORTED_MODULE_0__.html`
    ${
      this.isDemo
        ? lit__WEBPACK_IMPORTED_MODULE_0__.html`
      <style>
        .l-navbar { top: auto !important}
      </style>
    `
        : lit__WEBPACK_IMPORTED_MODULE_0__.html``
    }
    <header class=${(0,
    lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_1__.classMap)(
      this._getHeaderClasses()
    )}>
      <div class="mobile-bar">
        <div class="mobile-bar__nav-toggle">
          <button 
            @click=${this._onBtnClick}
            class="nav-toggle ${this.opened ? 'nav-toggle--active' : ''}" 
            aria-controls="primary-nav" 
            aria-expanded="${this.opened ? 'true' : 'false'}" 
            aria-label="Toggle Main Menu">
            <span class="nav-toggle__icon nav-toggle__icon--menu">Menu</span>
          </button>
        </div>
        <div class="mobile-bar__fixed-site-name"><a href=${this.siteUrl}>${
            this.siteName
          }</a></div>
        <div class="mobile-bar__university">
          <a href="https://www.ucdavis.edu/">
            <img class="ucd-logo" src='data:image/svg+xml;utf8,${this._ucdLogo(
              'gold'
            )}'>
          </a>
        </div>
      </div>
    
      <div id="branding-bar-container">
        <div class="header__bar">
            <div class="header__university">
              <a href="https://www.ucdavis.edu/">
                <img class="ucd-logo" src='data:image/svg+xml;utf8,${this._ucdLogo()}'>
              </a>
            </div>
        </div>
        <div class="l-header__branding">
          ${
            this._hasSlottedBranding
              ? lit__WEBPACK_IMPORTED_MODULE_0__.html`
            <slot name="branding-bar"></slot>
          `
              : lit__WEBPACK_IMPORTED_MODULE_0__.html`
            <div class="site-branding">
              <div class="site-branding__figure" ?hidden=${!this.figureSrc}>
                <a href="${this.siteUrl}" class=""><img src=${
                  this.figureSrc
                } class="site-logo" alt="Site Logo" /></a>
              </div>
              <div class="site-branding__body">
              <h1 class="site-branding__site-name" ?hidden=${!this.siteName}>
                <a href=${this.siteUrl}>${this.siteName}</a>
              </h1>
              <div class="site-branding__slogan" ?hidden=${!this.slogan}>${
                  this.slogan
                }</div>
              </div>
            </div>
          `
          }
        </div>
      </div>
    
      <div class="${(0,
      lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_1__.classMap)(
        this._getNavbarClasses()
      )}" id="nav-bar">
        <div class="l-container--navigation off-canvas off-canvas--left">
          <div class="off-canvas__container l-nav-horizontal">
            ${
              this._hasSearch
                ? lit__WEBPACK_IMPORTED_MODULE_0__.html`
              <div class="l-nav-horizontal__search-popup">
                <slot name="search"></slot>
              </div>
            `
                : lit__WEBPACK_IMPORTED_MODULE_0__.html``
            }
            ${
              this._hasQuickLinks
                ? lit__WEBPACK_IMPORTED_MODULE_0__.html`
              <div class="l-nav-horizontal__quick-links">
                <slot name="quick-links"></slot>
              </div>
            `
                : lit__WEBPACK_IMPORTED_MODULE_0__.html``
            }
            <div class="l-nav-horizontal__primary-nav">
              <slot name="primary-nav"></slot>
            </div>
          </div>
        </div>
      </div>
    </header>
      
    
    `;
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.js':
      /*!***************************************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.js ***!
      \***************************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ UcdThemePrimaryNav,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');
        /* harmony import */ var _ucd_theme_primary_nav_tpl_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./ucd-theme-primary-nav.tpl.js */ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.tpl.js'
          );
        /* harmony import */ var lit_directives_style_map_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! lit/directives/style-map.js */ './node_modules/lit/directives/style-map.js'
          );
        /* harmony import */ var lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! lit/directives/class-map.js */ './node_modules/lit/directives/class-map.js'
          );
        /* harmony import */ var lit_directives_if_defined_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! lit/directives/if-defined.js */ './node_modules/lit/directives/if-defined.js'
          );
        /* harmony import */ var _utils_mixins__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../../utils/mixins */ './node_modules/@ucd-lib/theme-elements/utils/mixins/index.js'
          );
        /* harmony import */ var _utils_controllers__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../../utils/controllers */ './node_modules/@ucd-lib/theme-elements/utils/controllers/index.js'
          );

        /**
         * @class UcdThemePrimaryNav
         * @classdesc Component class for displaying a primary site nav
         *
         * Pattern Lab Url:
         *  - http://dev.webstyleguide.ucdavis.edu/redesign/patterns/molecules-navigation-00-primary-nav/molecules-navigation-00-primary-nav.rendered.html
         *  - http://dev.webstyleguide.ucdavis.edu/redesign/patterns/molecules-navigation-00-primary-nav-megamenu/molecules-navigation-00-primary-nav-megamenu.rendered.html
         *
         * @property {String} navType - The primary style type of the nav:
         *  'superfish' - The default
         *  'mega' - Hovering over any top-level link opens a single nav with all subnav links
         * @property {String} styleModifiers - Apply alternate styles with a space-separated list.
         *  e.g. 'justify' for 'primary-nav--justify'
         * @property {Number} hoverDelay - How long (ms) after hover will menu open/close
         * @property {Number} animationDuration - How long (ms) for a menu to fade in/out
         * @property {Number} maxDepth - Maximum number of submenus to show
         *
         * @example
         *  <ucd-theme-primary-nav>
         *    <a href="#">link 1</a>
         *    <a href="#">link 2</a>
         *    <ul link-title="link with subnav" href="#">
         *      <li><a href="#">subnav link 1</a></li>
         *    </ul>
         *  </ucd-theme-primary-nav>
         */
        class UcdThemePrimaryNav extends (0,
        _utils_mixins__WEBPACK_IMPORTED_MODULE_5__.Mixin)(
          lit__WEBPACK_IMPORTED_MODULE_0__.LitElement
        ).with(_utils_mixins__WEBPACK_IMPORTED_MODULE_5__.NavElement) {
          mutationObserver =
            new _utils_controllers__WEBPACK_IMPORTED_MODULE_6__.MutationObserverController(
              this,
              { subtree: true, childList: true }
            );
          breakPoints =
            new _utils_controllers__WEBPACK_IMPORTED_MODULE_6__.BreakPointsController(
              this
            );

          static get properties() {
            return {
              navType: { type: String, attribute: 'nav-type' },
              styleModifiers: { type: String, attribute: 'style-modifiers' },
              hoverDelay: { type: Number, attribute: 'hover-delay' },
              animationDuration: {
                type: Number,
                attribute: 'animation-duration',
              },
              navItems: { type: Array },
              maxDepth: { type: Number, attribute: 'max-depth' },
              _megaIsOpen: { type: Boolean, state: true },
            };
          }

          static get styles() {
            return (0,
            _ucd_theme_primary_nav_tpl_js__WEBPACK_IMPORTED_MODULE_1__.styles)();
          }

          constructor() {
            super();
            this.render =
              _ucd_theme_primary_nav_tpl_js__WEBPACK_IMPORTED_MODULE_1__.render.bind(
                this
              );
            this.navType = 'superfish';
            this.styleModifiers = '';
            this.hoverDelay = 300;
            this.animationDuration = 300;

            this._classPrefix = 'primary-nav';
            this._acceptedNavTypes = ['superfish', 'mega'];
            this._megaIsOpen = false;
          }

          /**
           * @method openMegaNav
           * @description Opens the meganav menu
           */
          openMegaNav() {
            this._megaIsOpen = true;
          }

          /**
           * @method closeMegaNav
           * @description Closes the meganav menu
           */
          closeMegaNav() {
            this._megaIsOpen = false;
          }

          /**
           * @method openSubNav
           * @description Opens the specified subnav
           * @param {Array} navLocation - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4].
           */
          async openSubNav(navLocation) {
            // non-mega menu
            if (
              typeof navLocation !== 'object' ||
              !Array.isArray(navLocation) ||
              navLocation.length === 0
            )
              return;
            let navItem = this.getNavItem(navLocation);
            if (!navItem) return;

            // Open on mobile
            if (this.breakPoints.isMobile()) {
              let nav = this.renderRoot.getElementById(
                `nav--${navLocation.join('-')}`
              );
              if (!nav) return;
              let ul = nav.querySelector('ul');
              if (!ul) return;
              if (navItem.isTransitioning) return;
              navItem.isTransitioning = true;

              // Get expanded height
              navItem.inlineStyles.display = 'block';
              navItem.inlineStyles.height = 0 + 'px';
              this.requestUpdate();
              await this.updateComplete;
              const expandedHeight = ul.scrollHeight + 'px';

              // Set expanded height
              navItem.inlineStyles.height = expandedHeight;
              this.requestUpdate();
              await this.updateComplete;

              // Remove transition state after animation duration
              this._completeMobileTransition(navItem);

              // Open on desktop
            } else {
              // mega menu
              if (this.isMegaMenu()) {
                return;
              }

              this.clearItemInlineStyles(navItem);
              if (navItem.isClosing) {
                navItem.isClosing = false;
                this.requestUpdate();
              }
              if (navItem.timeout) clearTimeout(navItem.timeout);
              if (navItem.isOpen) return;

              navItem.timeout = setTimeout(() => {
                navItem.isOpen = true;
                this.requestUpdate();
              }, this.hoverDelay);
            }
          }

          /**
           * @method closeSubNav
           * @description Closes a subnav given its coordinates
           * @param {Array} navLocation - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4].
           */
          async closeSubNav(navLocation) {
            if (
              typeof navLocation !== 'object' ||
              !Array.isArray(navLocation) ||
              navLocation.length === 0
            )
              return;
            let navItem = this.getNavItem(navLocation);
            if (!navItem) return;

            // close on mobile
            if (this.breakPoints.isMobile()) {
              let nav = this.renderRoot.getElementById(
                `nav--${navLocation.join('-')}`
              );
              if (!nav) return;
              let ul = nav.querySelector('ul');
              if (!ul) return;
              if (navItem.isTransitioning) return;
              navItem.isTransitioning = true;

              // Set expanded height
              navItem.inlineStyles.height = ul.scrollHeight + 'px';
              navItem.inlineStyles.display = 'block';
              this.requestUpdate();
              await this.updateComplete;

              // Set height to 0 by requesting all of the animation frames :-(
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  navItem.inlineStyles.height = '0px';
                  this.requestUpdate();

                  requestAnimationFrame(() => {
                    // Remove transition state after animation duration
                    this._completeMobileTransition(navItem);
                  });
                });
              });

              // close on desktop
            } else {
              // mega menu
              if (this.isMegaMenu()) {
                return;
              }

              this.clearItemInlineStyles(navItem);
              if (navItem.timeout) clearTimeout(navItem.timeout);
              if (!navItem.isOpen) return;

              navItem.isClosing = true;
              this.requestUpdate();
              navItem.timeout = setTimeout(() => {
                navItem.isOpen = false;
                navItem.isClosing = false;
                this.requestUpdate();
              }, this.hoverDelay + this.animationDuration);
            }
          }

          /**
           * @method closeAllSubNavs
           * @description Recursively closes all nav submenus within specified menu.
           * @param {Array} navItems - The subItems property of any object within the 'navItems' element property.
           * @param {Boolean} requestUpdate - Should an update be requested after each subnav closing?
           */
          closeAllSubNavs(navItems, requestUpdate = true) {
            if (!navItems) navItems = this.navItems;
            navItems.forEach((navItem) => {
              if (navItem.isOpen) {
                navItem.isOpen = false;
                if (requestUpdate) this.requestUpdate();
              }
              if (navItem.subItems) {
                this.closeAllSubNavs(navItem.subItems);
              }
            });
          }

          /**
           * @method isMegaMenu
           * @description Does this element use the mega menu?
           * @returns {Boolean}
           */
          isMegaMenu() {
            if (this.navType.toLowerCase().trim() === 'mega') return true;
            return false;
          }

          /**
           * @method _getNavClasses
           * @private
           * @description Get classes to be applied to the top-level 'nav' element
           * @returns {String}
           */
          _getNavClasses() {
            let navType = this._acceptedNavTypes[0];
            if (this._acceptedNavTypes.includes(this.navType.toLowerCase()))
              navType = this.navType;

            let styleModifiers = '';
            if (this.styleModifiers) {
              styleModifiers = this.styleModifiers
                .split(' ')
                .map((mod) => `${this._classPrefix}--${mod}`)
                .join(' ');
            }
            let megaIsOpen =
              this.isMegaMenu() && this._megaIsOpen ? 'is-hover' : '';
            return `${this._classPrefix} ${this._classPrefix}--${navType} ${styleModifiers} ${megaIsOpen}`;
          }

          /**
           * @method _onChildListMutation
           * @private
           * @description Fires when light dom child list changes. Injected by MutationObserverController.
           *  Sets the 'navItems' property.
           */
          _onChildListMutation() {
            let navItems = this.parseNavChildren();
            if (navItems.length) this.navItems = navItems;
          }

          /**
           * @method _renderNavItem
           * @private
           * @description Renders a menu item and all its children to the specified max depth
           * @param {Object} navItem - An item from the 'navItems' element property
           * @param {Array} location - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4]
           * @returns {TemplateResult}
           */
          _renderNavItem(navItem, location) {
            const depth = location.length - 1;

            // Render item and its subnav
            if (this.itemHasSubNav(navItem) && depth < this.maxDepth) {
              return lit__WEBPACK_IMPORTED_MODULE_0__.html`
          <li 
            id="nav--${location.join('-')}"
            .key=${location}
            .hasnav=${true}
            @mouseenter=${this._onItemMouseenter} 
            @mouseleave=${this._onItemMouseleave}
            class=${(0,
            lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_3__.classMap)(
              this._makeLiClassMap(navItem, depth)
            )}>
            <div class="submenu-toggle__wrapper ${
              depth === 0 ? `${this._classPrefix}__top-link` : ''
            }">
              <a 
                href=${(0,
                lit_directives_if_defined_js__WEBPACK_IMPORTED_MODULE_4__.ifDefined)(
                  navItem.href ? navItem.href : null
                )}
                tabindex=${this._setTabIndex(depth)}
                @focus=${this._onItemFocus}>
                ${navItem.linkText}<span class="${
                this._classPrefix
              }__submenu-indicator"></span>
              </a>
              <button 
              @click=${() => this._toggleMobileMenu(location)}
              class="submenu-toggle ${
                navItem.isOpen ? 'submenu-toggle--open' : ''
              }" 
              ?disabled=${navItem.isTransitioning}
              aria-label="Toggle Submenu">
              <span class="submenu-toggle__icon"></span>
            </button>
            </div>
            <ul class="menu ${navItem.isOpen ? 'menu--open' : ''}" style=${(0,
              lit_directives_style_map_js__WEBPACK_IMPORTED_MODULE_2__.styleMap)(
                this._getItemMobileStyles(location)
              )}>
              ${navItem.subItems.map((subItem, i) =>
                this._renderNavItem(subItem, location.concat([i]))
              )}
            </ul>
          </li>
        `;
            }

            // render as normal link
            return lit__WEBPACK_IMPORTED_MODULE_0__.html`
          <li id="nav--${location.join('-')}" .key=${location} class=${(0,
            lit_directives_class_map_js__WEBPACK_IMPORTED_MODULE_3__.classMap)(
              this._makeLiClassMap(navItem, depth)
            )}>
            <div class="${depth === 0 ? `${this._classPrefix}__top-link` : ''}">
              ${
                navItem.href
                  ? lit__WEBPACK_IMPORTED_MODULE_0__.html`
                <a 
                  href=${navItem.href} 
                  @focus=${this._onItemFocus}
                  tabindex=${this._setTabIndex(depth)}>
                  ${navItem.linkText}</a>
              `
                  : lit__WEBPACK_IMPORTED_MODULE_0__.html`
                <span class="${this._classPrefix}__nolink">${navItem.linkText}</span>
              `
              }
            </div>
          </li>
        `;
          }

          /**
           * @method _setTabIndex
           * @private
           * @description Sets the tab index of menu links
           * @param {Number} depth - Level of the menu link
           * @returns {Number}
           */
          _setTabIndex(depth = 0) {
            let i = 0;
            if (
              this.isMegaMenu() &&
              depth > 0 &&
              !this._megaIsOpen &&
              this.breakPoints.isDesktop()
            )
              i = -1;

            return i;
          }

          /**
           * @method _makeLiClassMap
           * @private
           * @description Classes to be assigned to each LI element in the nav.
           * @param {Object} navItem - An item in the navItems property.
           * @param {Number} depth - Depth of the navItem
           * @returns {Object}
           */
          _makeLiClassMap(navItem, depth = 0) {
            let classes = {};
            classes[`depth-${depth}`] = true;
            if (navItem.isOpen) classes['sf--hover'] = true;
            if (navItem.isClosing) classes.closing = true;
            if (navItem.megaFocus) classes['mega-focus'] = true;
            return classes;
          }

          /**
           * @method _toggleMobileMenu
           * @private
           * @description Expands/collapses mobile subnavs with animation on user click.
           * @param {Array} navLocation - Array coordinates of corresponding nav item
           */
          async _toggleMobileMenu(navLocation) {
            if (this.breakPoints.isDesktop()) return;
            let navItem = this.getNavItem(navLocation);
            if (navItem.isOpen) {
              this.closeSubNav(navLocation);
            } else {
              this.openSubNav(navLocation);
            }
          }

          /**
           * @method _onNavMouseenter
           * @private
           * @description Attached to top-level nav element. Opens mega menu in desktop view
           */
          _onNavMouseenter() {
            if (this.breakPoints.isMobile() || !this.isMegaMenu()) return;

            if (this._megaTimeout) clearTimeout(this._megaTimeout);
            this._megaTimeout = setTimeout(() => {
              this.openMegaNav();
            }, this.hoverDelay);
          }

          /**
           * @method _onNavMouseleave
           * @private
           * @description Attached to top-level nav element. Closes mega menu in desktop view
           */
          _onNavMouseleave() {
            if (this.breakPoints.isMobile() || !this.isMegaMenu()) return;

            if (this._megaTimeout) clearTimeout(this._megaTimeout);

            this._megaTimeout = setTimeout(() => {
              this.closeMegaNav();
            }, this.hoverDelay);
          }

          /**
           * @method _onNavFocusin
           * @private
           * @description Fires when focus enters the main nav element. Used to open the meganav
           */
          _onNavFocusin() {
            if (this.breakPoints.isMobile() || !this.isMegaMenu()) return;

            if (this._megaIsOpen) return;
            if (this._megaTimeout) clearTimeout(this._megaTimeout);

            this._megaTimeout = setTimeout(() => {
              this.openMegaNav();
            }, this.hoverDelay);
          }

          /**
           * @method _onItemMouseenter
           * @private
           * @description Bound to nav li items with a subnav
           * @param {Event} e
           */
          _onItemMouseenter(e) {
            if (this.breakPoints.isMobile()) return;
            this.openSubNav(e.target.key);
          }

          /**
           * @method _onItemFocus
           * @private
           * @description Bound to nav a elements
           * @param {Event} e
           */
          _onItemFocus(e) {
            if (this.breakPoints.isMobile()) return;
            const LI = e.target.parentElement.parentElement;

            if (LI.hasnav) {
              this.openSubNav(LI.key);
            }

            if (this.isMegaMenu() && this._megaIsOpen) {
              this._setMegaFocus(LI.key);
            }
          }

          /**
           * @method _setMegaFocus
           * @private
           * @description Displays custom styling to meganav item when focused to fix bug in sitefarm code.
           * @param {Array} navLocation - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4].
           */
          _setMegaFocus(navLocation) {
            this.navItems.forEach((nav) => (nav.megaFocus = false));
            if (
              typeof navLocation !== 'object' ||
              !Array.isArray(navLocation) ||
              navLocation.length < 1
            )
              return;
            let navItem = this.getNavItem([navLocation[0]]);
            navItem.megaFocus = true;
            this.requestUpdate();
          }

          /**
           * @method _completeMobileTransition
           * @private
           * @description Sets timeout to remove animation styles from mobile transition
           * @param {Object} navItem - Member 'navItems' element property.
           */
          _completeMobileTransition(navItem) {
            navItem.timeout = setTimeout(() => {
              navItem.inlineStyles = {};
              navItem.isOpen = !navItem.isOpen;
              navItem.isTransitioning = false;
              this.requestUpdate();
            }, this.animationDuration);
          }

          /**
           * @method _onItemMouseleave
           * @private
           * @description Bound to nav li items with a subnav
           * @param {Event} e
           */
          _onItemMouseleave(e) {
            if (this.breakPoints.isMobile() || this.isMegaMenu()) return;
            this.closeSubNav(e.target.key);
          }

          /**
           * @method _onNavFocusout
           * @private
           * @description Attached to the top-level nav element. Closes subnav if it doesn't contain focused link.
           */
          _onNavFocusout() {
            if (this.breakPoints.isMobile()) return;
            if (this.isMegaMenu()) {
              if (this._megaTimeout) clearTimeout(this._megaTimeout);
              requestAnimationFrame(() => {
                const focusedEle = this.renderRoot.activeElement;
                if (focusedEle) return;
                this._megaTimeout = setTimeout(() => {
                  this.navItems.forEach((nav) => (nav.megaFocus = false));
                  this.closeMegaNav();
                }, this.hoverDelay);
              });
            } else {
              requestAnimationFrame(() => {
                const focusedEle = this.renderRoot.activeElement;
                if (!focusedEle) {
                  this.closeAllSubNavs();
                  return;
                }

                let ele = focusedEle;
                while (
                  ele &&
                  ele.tagName !== this.tagName &&
                  !Array.isArray(ele.key)
                ) {
                  ele = ele.parentElement;
                }
                if (!ele.key) return;
                let navLocation = [...ele.key];
                let currentIndex = navLocation.pop();
                let navSiblings =
                  navLocation.length == 0
                    ? this.navItems
                    : this.getNavItem(navLocation).subItems;
                navSiblings.forEach((sibling, i) => {
                  if (i !== currentIndex) {
                    sibling.isOpen = false;
                    this.closeAllSubNavs(sibling.subItems, false);
                  }
                });
                this.requestUpdate();
              });
            }
          }

          /**
           * @method _getItemMobileStyles
           * @private
           * @description Returns inline styles on a nav element (used for mobile transition animation)
           * @param {Array} location - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4].
           * @returns {Object} - Style map
           */
          _getItemMobileStyles(location) {
            if (this.breakPoints.isDesktop()) return {};
            let navItem = this.getNavItem(location);
            if (!navItem.inlineStyles) return {};
            return navItem.inlineStyles;
          }
        }

        customElements.define('ucd-theme-primary-nav', UcdThemePrimaryNav);

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.tpl.js':
      /*!*******************************************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.tpl.js ***!
      \*******************************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ styles: () => /* binding */ styles,
          /* harmony export */ render: () => /* binding */ render,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');
        /* harmony import */ var _ucd_lib_theme_sass_normalize_css_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/normalize.css.js */ './node_modules/@ucd-lib/theme-sass/normalize.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_1_base_html_forms_css_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/1_base_html/_forms.css.js */ './node_modules/@ucd-lib/theme-sass/1_base_html/_forms.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_2_base_class_misc_css_js__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/2_base_class/_misc.css.js */ './node_modules/@ucd-lib/theme-sass/2_base_class/_misc.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_nav_primary_css_js__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_nav-primary.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_nav-primary.css.js'
          );
        /* harmony import */ var _ucd_lib_theme_sass_4_component_submenu_toggle_css_js__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @ucd-lib/theme-sass/4_component/_submenu-toggle.css.js */ './node_modules/@ucd-lib/theme-sass/4_component/_submenu-toggle.css.js'
          );

        function styles() {
          const elementStyles = lit__WEBPACK_IMPORTED_MODULE_0__.css`
        :host {
          display: block;
        }
        .submenu-toggle * {
          pointer-events: none;
        }
        button[disabled] {
          pointer-events: none;
        }
        @media (min-width: 992px) {
          nav.primary-nav--mega li.depth-0 > ul.menu {
            opacity: 1;
            display: block;
          }
    
          ul.menu ul.menu {
            opacity: 0;
            display: none;
          }
          ul.menu li.sf--hover > ul.menu {
            display: block;
            opacity: 1;
          }
          ul.menu li.closing > ul.menu {
            display: block;
            opacity: 0;
          }
          .mega-focus .primary-nav__top-link a, 
          .mega-focus .primary-nav__top-link a::before, .mega-focus 
          .primary-nav__top-link a::after {
            background-color: rgb(255, 223, 128);
          }
          .mega-focus .primary-nav__top-link a:focus, 
          .mega-focus .primary-nav__top-link a:focus::before, 
          .mega-focus .primary-nav__top-link a:focus::after {
            background-color: rgb(255, 191, 0);
          }
          .mega-focus > ul {
            background-color: rgb(255, 251, 237);
          }
    
        }
    
        @media (max-width: 991px) {
          ul.menu ul.menu {
            display: none;
            overflow-y: hidden;
            visibility: visible;
            height: auto;
            border-top-width: 0px;
            border-bottom-width: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
          }
    
          ul.menu ul.menu.menu--open {
            display: block;
          }
    
        }
      `;

          return [
            _ucd_lib_theme_sass_normalize_css_js__WEBPACK_IMPORTED_MODULE_1__[
              'default'
            ],
            _ucd_lib_theme_sass_1_base_html_forms_css_js__WEBPACK_IMPORTED_MODULE_2__[
              'default'
            ],
            _ucd_lib_theme_sass_2_base_class_misc_css_js__WEBPACK_IMPORTED_MODULE_3__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_nav_primary_css_js__WEBPACK_IMPORTED_MODULE_4__[
              'default'
            ],
            _ucd_lib_theme_sass_4_component_submenu_toggle_css_js__WEBPACK_IMPORTED_MODULE_5__[
              'default'
            ],
            elementStyles,
          ];
        }

        function render() {
          return lit__WEBPACK_IMPORTED_MODULE_0__.html`
    <style>
      ul.menu ul.menu {
        transition: opacity ${this.animationDuration + 'ms'}, height ${
            this.animationDuration + 'ms'
          };
      }
      ul.menu li.sf--hover > ul.menu {
        transition: opacity ${this.animationDuration + 'ms'} ${
            this.hoverDelay + 'ms'
          }, height ${this.animationDuration + 'ms'};
      }
    
    </style>
    <nav 
      id=${this._classPrefix}
      class="${this._getNavClasses()}" 
      @mouseenter=${this._onNavMouseenter}
      @mouseleave=${this._onNavMouseleave}
      @focusout=${this._onNavFocusout}
      @focusin=${this._onNavFocusin}
      aria-label="Main Menu">
      <ul class="menu">
        ${this.navItems.map((navItem, i) => this._renderNavItem(navItem, [i]))}
      </ul>
    </nav>
    `;
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/controllers/break-points.js':
      /*!********************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/controllers/break-points.js ***!
      \********************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BreakPointsController: () =>
            /* binding */ BreakPointsController,
          /* harmony export */
        });
        class BreakPointsController {
          mobileBreakPoint = 992;

          constructor(host) {
            (this.host = host).addController(this);
          }

          /**
           * @method isDesktop
           * @description Is the desktop view currently active?
           * @returns {Boolean}
           */
          isDesktop() {
            return window.innerWidth >= this.mobileBreakPoint;
          }

          /**
           * @method isMobile
           * @description Is the mobile view currently active?
           * @returns {Boolean}
           */
          isMobile() {
            return !this.isDesktop();
          }
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/controllers/index.js':
      /*!*************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/controllers/index.js ***!
      \*************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BreakPointsController: () =>
            /* reexport safe */ _break_points__WEBPACK_IMPORTED_MODULE_0__.BreakPointsController,
          /* harmony export */ IntersectionObserverController: () =>
            /* reexport safe */ _intersection_observer__WEBPACK_IMPORTED_MODULE_1__.IntersectionObserverController,
          /* harmony export */ MutationObserverController: () =>
            /* reexport safe */ _mutation_observer__WEBPACK_IMPORTED_MODULE_2__.MutationObserverController,
          /* harmony export */ WaitController: () =>
            /* reexport safe */ _wait__WEBPACK_IMPORTED_MODULE_3__.WaitController,
          /* harmony export */
        });
        /* harmony import */ var _break_points__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./break-points */ './node_modules/@ucd-lib/theme-elements/utils/controllers/break-points.js'
          );
        /* harmony import */ var _intersection_observer__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./intersection-observer */ './node_modules/@ucd-lib/theme-elements/utils/controllers/intersection-observer.js'
          );
        /* harmony import */ var _mutation_observer__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./mutation-observer */ './node_modules/@ucd-lib/theme-elements/utils/controllers/mutation-observer.js'
          );
        /* harmony import */ var _wait__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./wait */ './node_modules/@ucd-lib/theme-elements/utils/controllers/wait.js'
          );

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/controllers/intersection-observer.js':
      /*!*****************************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/controllers/intersection-observer.js ***!
      \*****************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ IntersectionObserverController: () =>
            /* binding */ IntersectionObserverController,
          /* harmony export */
        });
        /**
         * @class IntersectionObserverController
         * @classdesc Lit controller that attaches an IntersectionObserver to an element
         *
         * @property {LitElement} host - 'this' from a Lit element
         * @property {Object} options - IntersectionObserver options. Default: {}
         * @property {String} callback - Name of element method called on intersection. Default: '_onIntersection'
         * @property {Boolean} observeSelf - Automatically observes host element on connected. Default: true
         *
         * @examples
         * // To watch for element's intersection with viewport, instantiate class in element constructor:
         * new IntersectionObserverController(this)
         *
         * // Or watch for a specific element within your Lit element:
         * // In constructor:
         * this.intersectionObserver = new IntersectionObserverController(this, {}, "_onMyDivIntersection", false);
         * // In firstUpdated:
         * let myDiv = this.renderRoot.getElementById('my-div');
         * this.intersectionObserver.observer.observe(my-div);
         *
         */
        class IntersectionObserverController {
          host;
          options;
          callback;
          observer;
          observeSelf;

          constructor(
            host,
            options = {},
            callback = '_onIntersection',
            observeSelf = true
          ) {
            (this.host = host).addController(this);
            this.options = options;
            this.callback = callback;
            this.observeSelf = observeSelf;
          }

          hostConnected() {
            this.observer = new IntersectionObserver(
              this._callback.bind(this),
              this.options
            );
            if (this.observeSelf) {
              this.observer.observe(this.host);
            }
          }

          hostDisconnected() {
            this.observer.disconnect();
          }

          _callback(entries, observer) {
            if (!this.host[this.callback]) {
              console.warn(
                `Element has no '${this.callback}' method. 
            Either add this method, or change the 'callback' argument on controller instantiation.`
              );
              return;
            }
            this.host[this.callback](entries, observer);
          }
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/controllers/mutation-observer.js':
      /*!*************************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/controllers/mutation-observer.js ***!
      \*************************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MutationObserverController: () =>
            /* binding */ MutationObserverController,
          /* harmony export */
        });
        /**
         * @class MutationObserverController
         * @classdesc Lit controller that attaches a MutationObserver to an element
         *
         * @property {LitElement} host - 'this' from a Lit element
         * @property {Object} options - MutationObserver.observe options. Default: {childList: true}
         * @property {String} callback - Name of element method called on mutation. Default: '_onChildListMutation'
         *
         * @examples
         * // For a basic childlist observer, instantiate this class in your element:
         *  mutationObserver = new MutationObserverController(this);
         *
         * // or customize the options/callback:
         *  mutationObserver = new MutationObserverController(this, {childList: true, attributes: true}, 'aDifferentCallbackMethod');
         */
        class MutationObserverController {
          host;
          options;
          callback;

          _observer;

          constructor(
            host,
            options = { childList: true },
            callback = '_onChildListMutation'
          ) {
            (this.host = host).addController(this);
            this.options = options;
            this.callback = callback;
          }

          hostConnected() {
            this._observer = new MutationObserver((mutationsList, observer) =>
              this._onMutation(mutationsList, observer)
            );
            this._observer.observe(this.host, this.options);
            this._onMutation();
          }

          hostDisconnected() {
            this._observer.disconnect();
          }

          _onMutation(mutationsList, observer) {
            if (!this.host[this.callback]) {
              console.warn(
                `Element has no '${this.callback}' method. 
            Either add this method, or change the 'callback' argument on instantiation.`
              );
              return;
            }
            this.host[this.callback](mutationsList, observer);
          }
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/controllers/wait.js':
      /*!************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/controllers/wait.js ***!
      \************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ WaitController: () =>
            /* binding */ WaitController,
          /* harmony export */
        });
        class WaitController {
          host;

          constructor(host) {
            (this.host = host).addController(this);
          }

          /**
           * @method wait
           * @description Wait for the specified amount of time
           * @param {Number} time - Time to wait (ms)
           * @returns
           */
          async wait(time) {
            return new Promise((resolve) => {
              setTimeout(resolve, time);
            });
          }

          /**
           * @method waitForUpdate
           * @description Requests and waits for Lit update.
           */
          async waitForUpdate() {
            this.host.requestUpdate();
            await this.host.updateComplete;
          }

          /**
           * @method waitForFrames
           * @description Wait for specified number of animation frames
           * @param {Number} ct Number of frames
           */
          async waitForFrames(ct = 1) {
            for (let i = 0; i < ct; i++) {
              await new Promise((resolve) => {
                requestAnimationFrame(resolve);
              });
            }
          }
        }

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/mixins/index.js':
      /*!********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/mixins/index.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Mixin: () =>
            /* reexport safe */ _mixin_js__WEBPACK_IMPORTED_MODULE_0__[
              'default'
            ],
          /* harmony export */ MainDomElement: () =>
            /* reexport safe */ _main_dom_element_js__WEBPACK_IMPORTED_MODULE_1__.MainDomElement,
          /* harmony export */ NavElement: () =>
            /* reexport safe */ _nav_element_js__WEBPACK_IMPORTED_MODULE_2__.NavElement,
          /* harmony export */
        });
        /* harmony import */ var _mixin_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./mixin.js */ './node_modules/@ucd-lib/theme-elements/utils/mixins/mixin.js'
          );
        /* harmony import */ var _main_dom_element_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./main-dom-element.js */ './node_modules/@ucd-lib/theme-elements/utils/mixins/main-dom-element.js'
          );
        /* harmony import */ var _nav_element_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./nav-element.js */ './node_modules/@ucd-lib/theme-elements/utils/mixins/nav-element.js'
          );

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/mixins/main-dom-element.js':
      /*!*******************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/mixins/main-dom-element.js ***!
      \*******************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MainDomElement: () =>
            /* binding */ MainDomElement,
          /* harmony export */
        });
        /**
         * @function MainDomElement
         * @param {Class} superClass - LitElement or child class.
         * @description set render context for lit element to main DOM instead of the
         * default shadow root
         *
         * @returns {Class} LitElement updated createRenderRoot function.
         */
        const MainDomElement = (superClass) =>
          class extends superClass {
            /**
             * @method createRenderRoot
             * @description set the root element to render into
             *
             * @returns {LitElement}
             */
            createRenderRoot() {
              return this;
            }
          };

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/mixins/mixin.js':
      /*!********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/mixins/mixin.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /**
         * From:
         * https://stackoverflow.com/questions/41839198/applying-behaviors-with-js-mixins-in-polymer-2
         **/
        class MixinBuilder {
          constructor(superclass) {
            this.superclass = superclass;
          }
          with(...mixins) {
            return mixins.reduce((c, mixin) => mixin(c), this.superclass);
          }
        }
        const Mixin = (superclass) => new MixinBuilder(superclass);

        // Set global if available
        // Hummmm...
        // if( typeof window !== 'undefined' ) {
        //   window.Mixin = Mixin;
        // }

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = Mixin;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-elements/utils/mixins/nav-element.js':
      /*!**************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-elements/utils/mixins/nav-element.js ***!
      \**************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ NavElement: () => /* binding */ NavElement,
          /* harmony export */
        });
        /**
         * @function NavElement
         * @param {Class} superClass - LitElement or child class.
         * @description Adds utilities for navigation to a LitElement
         *
         * @returns {Class} LitElement with Nav utilities attached
         */
        const NavElement = (superClass) =>
          class extends superClass {
            constructor() {
              super();
              this.navItems = [];
              this.maxDepth = 2;
            }

            /**
             * @method parseChildren
             * @description Creates a tree-like nav Array structure from element children
             * @param {HTMLCollection} children - Element children (non-shadow)
             * @returns {Array}
             */
            parseNavChildren(children = this.children) {
              if (!children) return [];
              children = Array.from(this.children);
              let navItems = children
                .map((child) => this._makeNavItemTree(child))
                .filter((navItem) => navItem.linkText);
              return navItems;
            }

            /**
             * @method _makeNavItemTree
             * @private
             * @description Extracts menu item data from DOM Element
             * @param {Element} ele - Element
             * @returns {Object} Formatted object describing the menu item and its children
             */
            _makeNavItemTree(ele) {
              let linkText,
                href,
                subItems = [],
                isOpen = false,
                inlineStyles = {},
                newTab = false;
              if (ele.tagName === 'LI' && ele.children.length > 0)
                ele = ele.children[0];

              if (ele.tagName === 'A') {
                linkText = ele.innerText;
                href = ele.href;
              } else if (ele.tagName === 'LI') {
                linkText = ele.innerText;
              } else if (ele.tagName === 'OL' || ele.tagName === 'UL') {
                linkText = ele.getAttribute('link-text');
                href = ele.getAttribute('href');
                isOpen = ele.hasAttribute('is-open');

                for (const child of Array.from(ele.children)) {
                  let childItem = this._makeNavItemTree(child);
                  if (childItem.linkText) subItems.push(childItem);
                }
              }
              if (ele.getAttribute('target') == '_blank') newTab = true;

              if (linkText) linkText = linkText.trim();
              return { linkText, href, subItems, isOpen, inlineStyles, newTab };
            }

            /**
             * @method getNavItem
             * @description Retrieves an item from the navItems array.
             * @param {Array} location - Coordinates of the item in the 'navItems' array. i.e. [0, 1, 4].
             * @returns {Object}
             */
            getNavItem(location) {
              let accessor = 'this.navItems';
              if (location && location.length > 0) {
                accessor += '[' + location.join('].subItems[') + ']';
              }
              return eval(accessor);
            }

            /**
             * @method itemHasSubNav
             * @description Utility function for determining if a menu has subitems
             * @param {Object} navItem - A member of the navItems array.
             * @returns {Boolean}
             */
            itemHasSubNav(navItem) {
              if (navItem && navItem.subItems && navItem.subItems.length)
                return true;
              return false;
            }

            /**
             * @method clearMobileAnimationStyles
             * @description Removes inline styles on a nav element (used for mobile transition animation)
             * @param {Object} navItem - Member of the this.navItems array
             */
            clearItemInlineStyles(navItem) {
              if (
                navItem &&
                navItem.inlineStyles &&
                Object.keys(navItem.inlineStyles).length > 0
              ) {
                navItem.inlineStyles = {};
                this.requestUpdate();
              }
            }
          };

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/1_base_html/_forms.css.js':
      /*!********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/1_base_html/_forms.css.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    fieldset {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #f7fafd;
      border-top: 3px solid #022851;
    }
    fieldset > legend {
      padding: 0.25rem;
      font-size: 1.125rem;
    }
    
    label {
      display: block;
      padding-bottom: 0.25rem;
      color: #022851;
      font-weight: 700;
    }
    
    input,
    select,
    textarea {
      margin: 0;
      padding: 0.25rem 0.75rem;
      border: 1px solid #999;
      border-radius: 0;
      background-color: #fff;
      background-image: none;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;
      color: #13639e;
      font-family: inherit;
      outline: 0;
    }
    input:focus,
    select:focus,
    textarea:focus {
      border-color: #ffbf00;
      background-color: #fffbed;
      outline: none;
    }
    
    input,
    select {
      height: 2.5rem;
    }
    
    input,
    textarea,
    select {
      width: 100%;
    }
    
    [type=text],
    [type=search],
    [type=url],
    [type=number],
    textarea {
      appearance: none;
    }
    
    button,
    [type=submit] {
      cursor: pointer;
    }
    button:focus,
    [type=submit]:focus {
      color: #00b2e3;
    }
    
    [type=checkbox],
    [type=radio] {
      width: auto;
      height: auto;
      margin-right: 0.3em;
    }
    
    [type=search] {
      box-sizing: border-box;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/1_base_html/_headings.css.js':
      /*!***********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/1_base_html/_headings.css.js ***!
      \***********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    h1 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      font-size: 1.91rem;
    }
    h1:first-child {
      margin-top: 0;
    }
    h1 a {
      color: #022851;
      text-decoration: underline;
    }
    h1 a:hover, h1 a:focus {
      color: #022851;
      text-decoration: none;
    }
    @media (min-width: 768px) {
      h1 {
        font-size: 2.94rem;
      }
    }
    
    h2 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      color: #13639e;
      font-size: 1.6055rem;
    }
    h2:first-child {
      margin-top: 0;
    }
    @media (min-width: 768px) {
      h2 {
        font-size: 2.0995rem;
      }
    }
    h2 a {
      color: #13639e;
      text-decoration: underline;
    }
    h2 a:hover, h2 a:focus {
      color: #13639e;
      text-decoration: none;
    }
    
    h3 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      color: #666;
      font-size: 1.3325rem;
    }
    h3:first-child {
      margin-top: 0;
    }
    @media (min-width: 768px) {
      h3 {
        font-size: 1.7425rem;
      }
    }
    h3 a {
      color: #666;
      text-decoration: underline;
    }
    h3 a:hover, h3 a:focus {
      color: #666;
      text-decoration: none;
    }
    
    h4 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      font-size: 1.092rem;
    }
    h4:first-child {
      margin-top: 0;
    }
    h4 a {
      color: #022851;
      text-decoration: underline;
    }
    h4 a:hover, h4 a:focus {
      color: #022851;
      text-decoration: none;
    }
    @media (min-width: 768px) {
      h4 {
        font-size: 1.428rem;
      }
    }
    
    h5 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      font-size: 1rem;
    }
    h5:first-child {
      margin-top: 0;
    }
    h5 a {
      color: #022851;
      text-decoration: underline;
    }
    h5 a:hover, h5 a:focus {
      color: #022851;
      text-decoration: none;
    }
    @media (min-width: 768px) {
      h5 {
        font-size: 1.207rem;
      }
    }
    
    h6 {
      margin: 0.75em 0 0.25em;
      padding: 0;
      color: #022851;
      font-size: 1rem;
      font-style: normal;
      font-weight: 800;
      line-height: 1.2;
      font-size: 1rem;
    }
    h6:first-child {
      margin-top: 0;
    }
    h6 a {
      color: #022851;
      text-decoration: underline;
    }
    h6 a:hover, h6 a:focus {
      color: #022851;
      text-decoration: none;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/2_base_class/_misc.css.js':
      /*!********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/2_base_class/_misc.css.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .menu {
      margin: 0;
      padding: 0 0 0 1.25rem;
      padding-left: 0;
      list-style: none;
    }
    .menu li {
      list-style: none;
    }
    .menu li {
      margin: 0;
      padding: 0 0 0 1.25rem;
      padding-left: 0;
      list-style: none;
    }
    .menu li li {
      list-style: none;
    }
    
    .view-all {
      display: block;
      padding-top: 0.5rem;
      border-top: 1px solid #cce0f3;
    }
    
    .sf-underline {
      border-bottom: 1px solid #f7fafd;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_header.css.js':
      /*!*********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_header.css.js ***!
      \*********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .header {
      background-color: #fff;
      box-shadow: 0 1px 1px rgba(2, 40, 81, 0.15);
    }
    .header__bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-height: 2rem;
      background-color: #d8d8d8;
    }
    @media (max-width: 991px) {
      .header__bar {
        display: none;
      }
    }
    .header__university {
      display: flex;
      align-items: center;
      height: 2rem;
      padding-right: 0.75rem;
      background-color: #e5e5e5;
    }
    .header__university:before {
      width: 0.75rem;
      height: 2rem;
      margin-right: 0.75rem;
      margin-left: -0.75rem;
      background-color: #e5e5e5;
      clip-path: polygon(93% 0, 110% 0, 110% 102%, 0% 102%);
      content: "";
    }
    .header__university a {
      display: flex;
      margin-left: 0.5rem;
    }
    .header .ucd-logo {
      width: auto;
      height: 1.25rem;
    }
    @media (min-width: 992px) {
      .header .ucd-logo {
        height: 0.75rem;
      }
    }
    .header__navbar {
      background-color: #022851;
      box-shadow: 0 2px 1px rgba(2, 40, 81, 0.15);
    }
    .has-mega .header__navbar {
      background-color: #fff;
    }
    
    .site-logo {
      max-height: 6.25rem;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_mobile-bar.css.js':
      /*!*************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_mobile-bar.css.js ***!
      \*************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .mobile-bar {
      display: flex;
      align-items: center;
      overflow: hidden;
      min-height: 3.25rem;
      background-color: #022851;
    }
    @media (min-width: 992px) {
      .mobile-bar {
        display: none;
      }
    }
    .mobile-bar__nav-toggle {
      position: relative;
      display: flex;
      flex-shrink: 0;
      margin-right: 1rem;
      background-color: #13639e;
    }
    .mobile-bar__nav-toggle:before {
      position: absolute;
      right: -1rem;
      width: 1rem;
      height: 100%;
      background-color: #022851;
      content: "";
      transform: skewX(16deg);
    }
    .mobile-bar__nav-toggle:after {
      width: 1rem;
      margin-left: 0.5rem;
      background-color: #14447a;
      content: "";
      transform: skewX(16deg);
    }
    .mobile-bar__fixed-site-name {
      z-index: 1;
      visibility: hidden;
      width: 0;
      height: 0;
      padding-right: 1rem;
      color: #fff;
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1;
      opacity: 0;
      transition: visibility 0s, opacity 0.5s linear;
    }
    @media (min-width: 768px) {
      .mobile-bar__fixed-site-name {
        font-size: 1.25rem;
        line-height: 1;
      }
    }
    .is-fixed .mobile-bar__fixed-site-name {
      visibility: visible;
      width: auto;
      height: auto;
      opacity: 1;
    }
    .mobile-bar__fixed-site-name a {
      color: #fff;
      text-decoration: none;
    }
    .mobile-bar__fixed-site-name a:hover {
      text-decoration: none;
    }
    .mobile-bar__university {
      margin-right: 1rem;
      margin-left: auto;
      line-height: 1;
    }
    .is-fixed .mobile-bar__university {
      display: none;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_nav-off-canvas.css.js':
      /*!*****************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_nav-off-canvas.css.js ***!
      \*****************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    @media (max-width: 991px) {
      .off-canvas {
        position: absolute;
        z-index: 830;
        width: 70vw;
        min-width: 15rem;
        height: 100%;
        background: #fff;
        transition: all 0.3s;
      }
      .off-canvas__container {
        position: static;
      }
      .menu--hidden .off-canvas__container {
        display: none;
      }
      .off-canvas--fixed, .l-header--fixed .off-canvas {
        position: fixed;
        z-index: 1000;
        overflow: auto;
      }
      .off-canvas--fixed .off-canvas__container, .l-header--fixed .off-canvas .off-canvas__container {
        padding-bottom: 9rem;
      }
      .off-canvas--left {
        left: 0;
      }
      .menu--closed .off-canvas--left {
        transform: translateX(-105%);
      }
      .off-canvas--right {
        right: 0;
      }
      .menu--closed .off-canvas--right {
        transform: translateX(105%);
      }
      .menu--open .off-canvas {
        box-shadow: 0 10px 10px 5px rgba(25, 25, 25, 0.4);
      }
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_nav-primary.css.js':
      /*!**************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_nav-primary.css.js ***!
      \**************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    @charset "UTF-8";
    .primary-nav {
      min-height: 3.25rem;
      background-color: #fff;
    }
    @media (min-width: 992px) {
      .primary-nav {
        background-color: transparent;
        font-size: 0.85rem;
      }
      .primary-nav ul ul {
        display: none;
      }
      .primary-nav li {
        float: left;
      }
      .primary-nav li:hover ul {
        background-color: #fffbed;
      }
      .primary-nav li li {
        float: none;
      }
      .primary-nav li:hover > .primary-nav__top-link a, .primary-nav li:focus-within > .primary-nav__top-link a, .primary-nav li:hover > .primary-nav__top-link .primary-nav__nolink {
        color: #022851;
      }
      .primary-nav .submenu-toggle {
        display: none;
      }
    }
    .primary-nav a, .primary-nav__nolink {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 0.15rem solid #fff;
      background-color: #dbeaf7;
      color: #022851;
      font-weight: 700;
      line-height: 1.5rem;
      text-decoration: none;
    }
    @media (min-width: 992px) {
      .primary-nav a, .primary-nav__nolink {
        margin-left: 1rem;
        padding: 0;
        border-bottom: 0;
        background-color: transparent;
        font-weight: 700;
        line-height: 3.25rem;
      }
      .primary-nav a:before, .primary-nav__nolink:before {
        width: 1rem;
        height: 3.25rem;
        margin-right: 0.5rem;
        margin-left: -1rem;
        background-color: transparent;
        clip-path: polygon(93% 0, 110% 0, 110% 102%, 0% 102%);
        content: "";
      }
      .primary-nav a:focus:before, .primary-nav a:hover:before, .primary-nav__nolink:focus:before, .primary-nav__nolink:hover:before {
        background-color: #ffbf00;
      }
      .primary-nav a:after, .primary-nav__nolink:after {
        z-index: 1;
        width: 1rem;
        height: 3.25rem;
        margin-right: -1rem;
        margin-left: 0.5rem;
        background-color: transparent;
        clip-path: polygon(-2px -2px, 100% -2px, 7% 102%, -2px 100%);
        content: "";
      }
      .primary-nav a:focus:after, .primary-nav a:hover:after, .primary-nav__nolink:focus:after, .primary-nav__nolink:hover:after {
        background-color: #ffbf00;
      }
    }
    .primary-nav a:hover, .primary-nav__nolink:hover {
      background-color: #ffbf00;
    }
    .primary-nav a:focus,
    .primary-nav a .active, .primary-nav__nolink:focus,
    .primary-nav__nolink .active {
      background-color: #ffbf00;
    }
    @media (min-width: 992px) {
      .primary-nav__top-link a, .primary-nav__top-link .primary-nav__nolink {
        color: #fff;
        white-space: nowrap;
      }
      .primary-nav__top-link a:hover, .primary-nav__top-link .primary-nav__nolink:hover {
        color: #022851;
      }
    }
    .primary-nav li li a, li li .primary-nav__nolink {
      flex-grow: 1;
      border-color: #fff;
      background-color: #fde9ac;
      font-weight: 400;
    }
    @media (max-width: 991px) {
      .primary-nav li li a, li li .primary-nav__nolink {
        display: flex;
        align-items: center;
      }
      .primary-nav li li a:before, li li .primary-nav__nolink:before {
        margin-right: 0.5rem;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
      }
      .primary-nav li li a:before, li li .primary-nav__nolink:before {
        color: #ffbf00;
        content: "";
        font-size: 1.25em;
      }
      .primary-nav li li a:focus:before, .primary-nav li li a:hover:before, li li .primary-nav__nolink:focus:before, li li .primary-nav__nolink:hover:before {
        color: #022851;
      }
    }
    @media (min-width: 992px) {
      .primary-nav li li a, li li .primary-nav__nolink {
        margin-left: 0;
        padding: 0.5rem 1rem;
        font-size: 0.9375em;
        line-height: 1.35;
      }
      .primary-nav li li a:focus, li li .primary-nav__nolink:focus {
        background-color: #ffbf00;
      }
      .primary-nav li li a:before, .primary-nav li li a:after, li li .primary-nav__nolink:before, li li .primary-nav__nolink:after {
        display: none;
      }
    }
    .primary-nav li li li a {
      background-color: #fff9e6;
    }
    @media (min-width: 992px) {
      .primary-nav--justify > .menu {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      .primary-nav--justify li {
        float: none;
        flex-basis: 0;
        flex-grow: 1;
        width: auto;
      }
      .primary-nav--justify li:last-child .primary-nav__top-link a, .primary-nav--justify li:last-child .primary-nav__top-link .primary-nav__nolink {
        margin-right: 1rem;
      }
      .primary-nav--justify a:after,
    .primary-nav--justify .primary-nav__nolink:after {
        margin-left: auto;
      }
    }
    @media (min-width: 992px) {
      .primary-nav--mega {
        overflow: hidden;
        max-height: 3.25rem;
        margin-right: -1rem;
        transition: max-height 0.3s;
      }
      .primary-nav--mega.is-hover {
        max-height: 600px;
      }
      .primary-nav--mega a:after,
    .primary-nav--mega .primary-nav__nolink:after {
        margin-left: auto;
      }
      .primary-nav--mega > .menu {
        display: flex;
        flex-wrap: wrap;
      }
      .primary-nav--mega li {
        float: none;
        width: auto;
        min-width: 9em;
      }
      .primary-nav--mega li li a,
    .primary-nav--mega li li .primary-nav__nolink {
        background: none;
      }
      .primary-nav--mega li:hover .primary-nav__top-link a,
    .primary-nav--mega li:hover .primary-nav__top-link .primary-nav__nolink {
        background-color: #ffdf80;
      }
      .primary-nav--mega li:hover .primary-nav__top-link a:before, .primary-nav--mega li:hover .primary-nav__top-link a:after,
    .primary-nav--mega li:hover .primary-nav__top-link .primary-nav__nolink:before,
    .primary-nav--mega li:hover .primary-nav__top-link .primary-nav__nolink:after {
        background-color: #ffdf80;
      }
      .primary-nav--mega li .primary-nav__top-link a:hover {
        background-color: #ffbf00;
      }
      .primary-nav--mega li .primary-nav__top-link a:hover:before, .primary-nav--mega li .primary-nav__top-link a:hover:after {
        background-color: #ffbf00;
      }
      .primary-nav--mega .primary-nav__top-link {
        background-color: #022851;
      }
    }
    @media (min-width: 992px) {
      .primary-nav--superfish {
        box-shadow: inset 0 -1px 0 #14447a;
      }
      .primary-nav--superfish li {
        position: relative;
      }
      .primary-nav--superfish ul ul {
        position: absolute;
        z-index: 840;
        top: 100%;
        left: 0;
        display: none;
        min-width: 12em;
        background-color: #fff;
      }
      .primary-nav--superfish ul ul ul {
        top: 0;
        left: 100%;
      }
      .primary-nav--superfish li li a,
    .primary-nav--superfish li li .primary-nav__nolink {
        background-color: #fffbed;
      }
      .primary-nav--superfish li li li a,
    .primary-nav--superfish li li li .primary-nav__nolink {
        background-color: #fffbed;
      }
      .primary-nav--superfish li li li li a,
    .primary-nav--superfish li li li li .primary-nav__nolink {
        background-color: #fff9e6;
      }
      .primary-nav--superfish .primary-nav__submenu-indicator {
        display: flex;
        align-items: center;
        width: 1rem;
        height: auto;
        margin-right: -0.5rem;
        margin-left: auto;
        padding-top: 0;
        padding-bottom: 0;
        background-color: transparent;
      }
      .primary-nav--superfish .primary-nav__submenu-indicator:after {
        margin-left: 0.5rem;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
      }
      .primary-nav--superfish .primary-nav__submenu-indicator:focus {
        box-shadow: none;
      }
      .primary-nav--superfish .primary-nav__submenu-indicator:after {
        color: #ffbf00;
        content: "";
        font-size: 0.75em;
      }
      .primary-nav--superfish li li .primary-nav__submenu-indicator:after {
        color: #022851;
      }
      .primary-nav--superfish li li li .primary-nav__submenu-indicator {
        display: none;
      }
      .primary-nav--superfish li:hover > ul,
    .primary-nav--superfish .sf--hover > ul {
        display: block;
      }
      .primary-nav--superfish li:hover > .primary-nav__top-link a,
    .primary-nav--superfish li:hover > .primary-nav__top-link .primary-nav__nolink,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link a,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link .primary-nav__nolink {
        background-color: #ffbf00;
      }
      .primary-nav--superfish li:hover > .primary-nav__top-link a:before, .primary-nav--superfish li:hover > .primary-nav__top-link a:after,
    .primary-nav--superfish li:hover > .primary-nav__top-link .primary-nav__nolink:before,
    .primary-nav--superfish li:hover > .primary-nav__top-link .primary-nav__nolink:after,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link a:before,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link a:after,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link .primary-nav__nolink:before,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link .primary-nav__nolink:after {
        background-color: #ffbf00;
      }
      .primary-nav--superfish li:hover > .primary-nav__top-link a .primary-nav__submenu-indicator:after,
    .primary-nav--superfish li:hover > .primary-nav__top-link .primary-nav__nolink .primary-nav__submenu-indicator:after,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link a .primary-nav__submenu-indicator:after,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link .primary-nav__nolink .primary-nav__submenu-indicator:after {
        color: #022851;
      }
      .primary-nav--superfish li:hover > .primary-nav__top-link a,
    .primary-nav--superfish .sf--hover > .primary-nav__top-link a,
    .primary-nav--superfish li:hover > .primary-nav__top-link .primary-nav__nolink {
        color: #022851;
      }
    }
    .primary-nav .submenu-toggle:focus {
      box-shadow: inset 0 0 0 3px #ffbf00;
      outline: none;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_nav-toggle.css.js':
      /*!*************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_nav-toggle.css.js ***!
      \*************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .nav-toggle {
      overflow: hidden;
      text-indent: 110%;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.75rem;
      height: 3.25rem;
      padding: 0;
      border: 0;
      appearance: none;
      background: transparent;
      text-indent: 300%;
    }
    .nav-toggle:focus {
      outline: dotted #ffbf00;
      outline-offset: -0.5rem;
    }
    .nav-toggle__icon--menu {
      position: relative;
      margin-top: 8px;
      margin-bottom: 8px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin: 0;
    }
    .nav-toggle__icon--menu, .nav-toggle__icon--menu::before, .nav-toggle__icon--menu::after {
      display: block;
      width: 1.4444444444rem;
      height: 3px;
      background-color: #fff;
      outline: 1px solid transparent;
      -webkit-transition-property: background-color, -webkit-transform;
      -moz-transition-property: background-color, -moz-transform;
      -o-transition-property: background-color, -o-transform;
      transition-property: background-color, transform;
      -webkit-transition-duration: 0.3s;
      -moz-transition-duration: 0.3s;
      -o-transition-duration: 0.3s;
      transition-duration: 0.3s;
    }
    .nav-toggle__icon--menu::before, .nav-toggle__icon--menu::after {
      position: absolute;
      content: "";
    }
    .nav-toggle__icon--menu::before {
      top: -8px;
    }
    .nav-toggle__icon--menu::after {
      top: 8px;
    }
    .nav-toggle--active .nav-toggle__icon--menu {
      background-color: transparent;
    }
    .nav-toggle--active .nav-toggle__icon--menu::before {
      -webkit-transform: translateY(8px) rotate(45deg);
      -moz-transform: translateY(8px) rotate(45deg);
      -ms-transform: translateY(8px) rotate(45deg);
      -o-transform: translateY(8px) rotate(45deg);
      transform: translateY(8px) rotate(45deg);
    }
    .nav-toggle--active .nav-toggle__icon--menu::after {
      -webkit-transform: translateY(-8px) rotate(-45deg);
      -moz-transform: translateY(-8px) rotate(-45deg);
      -ms-transform: translateY(-8px) rotate(-45deg);
      -o-transform: translateY(-8px) rotate(-45deg);
      transform: translateY(-8px) rotate(-45deg);
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_site-branding.css.js':
      /*!****************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_site-branding.css.js ***!
      \****************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .site-branding {
      --o-media-gutter: var(--o-media-gutter-default, 1rem);
      --o-media-gutter--right: var(--o-media-gutter-default, 1rem);
      --o-media-gutter--left: 0;
      display: flex;
      align-items: flex-start;
      align-items: center;
    }
    .site-branding__figure {
      margin-right: var(--o-media-gutter--right);
      margin-left: var(--o-media-gutter--left);
    }
    .site-branding__body {
      display: block;
      flex: 1;
    }
    .site-branding__body,
    .site-branding__body > :last-child {
      margin-bottom: 0;
    }
    .site-branding--small {
      --o-media-gutter: 0.5rem;
      --o-media-gutter--right: var(--o-media-gutter);
    }
    .site-branding--large {
      --o-media-gutter: 2rem;
      --o-media-gutter--right: var(--o-media-gutter);
    }
    .site-branding--rev {
      --o-media-gutter--right: 0;
      --o-media-gutter--left: var(--o-media-gutter, 1rem);
      flex-direction: row-reverse;
    }
    .site-branding--flush {
      --o-media-gutter--right: 0;
      --o-media-gutter--left: 0;
    }
    .site-branding__figure {
      margin-right: var(--o-media-gutter--right);
      margin-left: var(--o-media-gutter--left);
    }
    .site-branding__body {
      display: block;
      flex: 1;
    }
    .site-branding__body,
    .site-branding__body > :last-child {
      margin-bottom: 0;
    }
    .site-branding__site-name {
      margin-bottom: 0.25rem;
      color: #022851;
      font-size: 1.5rem;
      font-weight: 700;
    }
    @media (min-width: 992px) {
      .site-branding__site-name {
        font-size: 2rem;
      }
    }
    .site-branding__site-name a {
      color: #022851;
      text-decoration: none;
    }
    .site-branding__site-name a:hover, .site-branding__site-name a:focus {
      color: #022851;
      text-decoration: underline;
    }
    .site-branding__slogan {
      color: #022851;
      font-size: 1.375rem;
      line-height: 1;
    }
    @media (min-width: 992px) {
      .site-branding__slogan {
        font-size: 1.5rem;
      }
    }
    .site-branding a {
      color: #022851;
      text-decoration: none;
    }
    .site-branding a:hover, .site-branding a:focus {
      color: #022851;
      text-decoration: underline;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/4_component/_submenu-toggle.css.js':
      /*!*****************************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/4_component/_submenu-toggle.css.js ***!
      \*****************************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    .submenu-toggle {
      display: flex;
      float: right;
      flex-shrink: 0;
      width: 50px;
      margin-left: auto;
      padding-bottom: 1px;
      border: 0;
      border-bottom: 0.15rem solid #fff;
      appearance: none;
      background-color: #022851;
      text-align: center;
    }
    @media (min-width: 310px) {
      .submenu-toggle {
        width: 3rem;
      }
    }
    @media (min-width: 992px) {
      .submenu-toggle {
        display: none;
      }
      .submenu-toggle__icon {
        display: none;
      }
    }
    @media (min-width: 992px) {
      .submenu-toggle {
        display: flex;
      }
      .submenu-toggle__icon {
        display: block;
      }
    }
    .submenu-toggle:focus {
      box-shadow: inset 0 0 0 3px #022851;
      outline: none;
    }
    a:hover .submenu-toggle {
      background-color: #997300;
    }
    .submenu-toggle--open .submenu-toggle__icon:before {
      transform: rotate(0deg);
    }
    .submenu-toggle__wrapper {
      display: flex;
      align-items: stretch;
    }
    .submenu-toggle__wrapper a:first-child,
    .submenu-toggle__wrapper .nolink:first-child {
      flex-grow: 1;
    }
    .submenu-toggle__icon {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      z-index: 830;
      left: 30%;
      display: block;
      width: 40%;
      height: 3px;
      background-color: #fff;
      font-size: 0;
    }
    .submenu-toggle__icon:before {
      position: absolute;
      z-index: 830;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      content: "";
      transform: rotate(90deg);
      transition: all 0.3s;
    }
    a:hover .submenu-toggle__icon {
      background-color: #fff;
    }
    a:hover .submenu-toggle__icon:before {
      background-color: #fff;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/5_layout/_l-header.css.js':
      /*!********************************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/5_layout/_l-header.css.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    :host {
      --fixed-page-offset: 3.25rem;
      --fixed-header-scroll-offset: 4.0625rem;
    }
    
    .l-header__branding {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
    }
    @media (min-width: 992px) {
      .l-header__branding {
        min-height: 7.5rem;
        padding-right: 1.5rem;
        padding-left: 1.5rem;
      }
    }
    @media (max-width: 991px) {
      .l-header--fixed {
        padding-top: 3.25rem;
      }
    }
    @media (min-width: 992px) {
      .l-header--fixed.is-fixed .l-main {
        padding-top: var(--fixed-page-offset);
      }
    }
    .l-header--fixed .mobile-bar {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
    }
    .l-header--fixed [id] {
      scroll-margin-top: var(--fixed-header-scroll-offset);
    }
    
    .l-navbar {
      position: relative;
      z-index: 830;
      height: 100%;
      min-height: 3.25rem;
    }
    @media (max-width: 991px) {
      .l-navbar {
        position: absolute;
        top: 3.25rem;
        left: 0;
      }
    }
    @media (min-width: 992px) {
      .l-navbar {
        width: 100%;
        height: auto;
      }
    }
    @media (min-width: 992px) {
      .l-header--fixed .l-navbar.is-fixed {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
      }
    }
    
    @media (min-width: 992px) {
      .l-nav-horizontal {
        display: grid;
        grid-template-areas: "nav search quick";
        grid-template-columns: 1fr max-content max-content;
      }
      .l-nav-horizontal__primary-nav {
        grid-area: nav;
      }
      .l-nav-horizontal__search-popup {
        z-index: 3;
        grid-area: search;
      }
      .l-nav-horizontal__search-popup .search-popup__open {
        position: relative;
      }
      .l-nav-horizontal__quick-links {
        z-index: 2;
        grid-area: quick;
      }
    }
    
    .has-mega .l-navbar {
      position: absolute;
    }
    @media (min-width: 992px) {
      .has-mega .l-main {
        padding-top: 3.25rem;
      }
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@ucd-lib/theme-sass/normalize.css.js':
      /*!***********************************************************!*\
      !*** ./node_modules/@ucd-lib/theme-sass/normalize.css.js ***!
      \***********************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! lit */ './node_modules/lit/index.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = lit__WEBPACK_IMPORTED_MODULE_0__.css`
    
    /*! normalize-scss | MIT/GPLv2 License | bit.ly/normalize-scss */
    /* Document
       ========================================================================== */
    /**
     * 1. Correct the line height in all browsers.
     * 2. Prevent adjustments of font size after orientation changes in
     *    IE on Windows Phone and in iOS.
     */
    html {
      line-height: 1.15;
      /* 1 */
      -ms-text-size-adjust: 100%;
      /* 2 */
      -webkit-text-size-adjust: 100%;
      /* 2 */
    }
    
    /* Sections
       ========================================================================== */
    /**
     * Remove the margin in all browsers (opinionated).
     */
    body {
      margin: 0;
    }
    
    /**
     * Add the correct display in IE 9-.
     */
    article,
    aside,
    footer,
    header,
    nav,
    section {
      display: block;
    }
    
    /**
     * Correct the font size and margin on 'h1' elements within 'section' and
     * 'article' contexts in Chrome, Firefox, and Safari.
     */
    h1 {
      font-size: 2em;
      margin: 0.67em 0;
    }
    
    /* Grouping content
       ========================================================================== */
    /**
     * Add the correct display in IE 9-.
     */
    figcaption,
    figure {
      display: block;
    }
    
    /**
     * Add the correct margin in IE 8.
     */
    figure {
      margin: 1em 40px;
    }
    
    /**
     * 1. Add the correct box sizing in Firefox.
     * 2. Show the overflow in Edge and IE.
     */
    hr {
      box-sizing: content-box;
      /* 1 */
      height: 0;
      /* 1 */
      overflow: visible;
      /* 2 */
    }
    
    /**
     * Add the correct display in IE.
     */
    main {
      display: block;
    }
    
    /**
     * 1. Correct the inheritance and scaling of font size in all browsers.
     * 2. Correct the odd 'em' font sizing in all browsers.
     */
    pre {
      font-family: monospace, monospace;
      /* 1 */
      font-size: 1em;
      /* 2 */
    }
    
    /* Links
       ========================================================================== */
    /**
     * 1. Remove the gray background on active links in IE 10.
     * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.
     */
    a {
      background-color: transparent;
      /* 1 */
      -webkit-text-decoration-skip: objects;
      /* 2 */
    }
    
    /* Text-level semantics
       ========================================================================== */
    /**
     * 1. Remove the bottom border in Chrome 57- and Firefox 39-.
     * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
     */
    abbr[title] {
      border-bottom: none;
      /* 1 */
      text-decoration: underline;
      /* 2 */
      text-decoration: underline dotted;
      /* 2 */
    }
    
    /**
     * Prevent the duplicate application of 'bolder' by the next rule in Safari 6.
     */
    b,
    strong {
      font-weight: inherit;
    }
    
    /**
     * Add the correct font weight in Chrome, Edge, and Safari.
     */
    b,
    strong {
      font-weight: bolder;
    }
    
    /**
     * 1. Correct the inheritance and scaling of font size in all browsers.
     * 2. Correct the odd 'em' font sizing in all browsers.
     */
    code,
    kbd,
    samp {
      font-family: monospace, monospace;
      /* 1 */
      font-size: 1em;
      /* 2 */
    }
    
    /**
     * Add the correct font style in Android 4.3-.
     */
    dfn {
      font-style: italic;
    }
    
    /**
     * Add the correct background and color in IE 9-.
     */
    mark {
      background-color: #ff0;
      color: #000;
    }
    
    /**
     * Add the correct font size in all browsers.
     */
    small {
      font-size: 80%;
    }
    
    /**
     * Prevent 'sub' and 'sup' elements from affecting the line height in
     * all browsers.
     */
    sub,
    sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }
    
    sub {
      bottom: -0.25em;
    }
    
    sup {
      top: -0.5em;
    }
    
    /* Embedded content
       ========================================================================== */
    /**
     * Add the correct display in IE 9-.
     */
    audio,
    video {
      display: inline-block;
    }
    
    /**
     * Add the correct display in iOS 4-7.
     */
    audio:not([controls]) {
      display: none;
      height: 0;
    }
    
    /**
     * Remove the border on images inside links in IE 10-.
     */
    img {
      border-style: none;
    }
    
    /**
     * Hide the overflow in IE.
     */
    svg:not(:root) {
      overflow: hidden;
    }
    
    /* Forms
       ========================================================================== */
    /**
     * 1. Change the font styles in all browsers (opinionated).
     * 2. Remove the margin in Firefox and Safari.
     */
    button,
    input,
    optgroup,
    select,
    textarea {
      font-family: sans-serif;
      /* 1 */
      font-size: 100%;
      /* 1 */
      line-height: 1.15;
      /* 1 */
      margin: 0;
      /* 2 */
    }
    
    /**
     * Show the overflow in IE.
     */
    button {
      overflow: visible;
    }
    
    /**
     * Remove the inheritance of text transform in Edge, Firefox, and IE.
     * 1. Remove the inheritance of text transform in Firefox.
     */
    button,
    select {
      /* 1 */
      text-transform: none;
    }
    
    /**
     * 1. Prevent a WebKit bug where (2) destroys native 'audio' and 'video'
     *    controls in Android 4.
     * 2. Correct the inability to style clickable types in iOS and Safari.
     */
    button,
    html [type=button],
    [type=reset],
    [type=submit] {
      -webkit-appearance: button;
      /* 2 */
    }
    
    button,
    [type=button],
    [type=reset],
    [type=submit] {
      /**
       * Remove the inner border and padding in Firefox.
       */
      /**
       * Restore the focus styles unset by the previous rule.
       */
    }
    button::-moz-focus-inner,
    [type=button]::-moz-focus-inner,
    [type=reset]::-moz-focus-inner,
    [type=submit]::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }
    button:-moz-focusring,
    [type=button]:-moz-focusring,
    [type=reset]:-moz-focusring,
    [type=submit]:-moz-focusring {
      outline: 1px dotted ButtonText;
    }
    
    /**
     * Show the overflow in Edge.
     */
    input {
      overflow: visible;
    }
    
    /**
     * 1. Add the correct box sizing in IE 10-.
     * 2. Remove the padding in IE 10-.
     */
    [type=checkbox],
    [type=radio] {
      box-sizing: border-box;
      /* 1 */
      padding: 0;
      /* 2 */
    }
    
    /**
     * Correct the cursor style of increment and decrement buttons in Chrome.
     */
    [type=number]::-webkit-inner-spin-button,
    [type=number]::-webkit-outer-spin-button {
      height: auto;
    }
    
    /**
     * 1. Correct the odd appearance in Chrome and Safari.
     * 2. Correct the outline style in Safari.
     */
    [type=search] {
      -webkit-appearance: textfield;
      /* 1 */
      outline-offset: -2px;
      /* 2 */
      /**
       * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.
       */
    }
    [type=search]::-webkit-search-cancel-button, [type=search]::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    
    /**
     * 1. Correct the inability to style clickable types in iOS and Safari.
     * 2. Change font properties to 'inherit' in Safari.
     */
    ::-webkit-file-upload-button {
      -webkit-appearance: button;
      /* 1 */
      font: inherit;
      /* 2 */
    }
    
    /**
     * Correct the padding in Firefox.
     */
    fieldset {
      padding: 0.35em 0.75em 0.625em;
    }
    
    /**
     * 1. Correct the text wrapping in Edge and IE.
     * 2. Correct the color inheritance from 'fieldset' elements in IE.
     * 3. Remove the padding so developers are not caught out when they zero out
     *    'fieldset' elements in all browsers.
     */
    legend {
      box-sizing: border-box;
      /* 1 */
      display: table;
      /* 1 */
      max-width: 100%;
      /* 1 */
      padding: 0;
      /* 3 */
      color: inherit;
      /* 2 */
      white-space: normal;
      /* 1 */
    }
    
    /**
     * 1. Add the correct display in IE 9-.
     * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.
     */
    progress {
      display: inline-block;
      /* 1 */
      vertical-align: baseline;
      /* 2 */
    }
    
    /**
     * Remove the default vertical scrollbar in IE.
     */
    textarea {
      overflow: auto;
    }
    
    /* Interactive
       ========================================================================== */
    /*
     * Add the correct display in Edge, IE, and Firefox.
     */
    details {
      display: block;
    }
    
    /*
     * Add the correct display in all browsers.
     */
    summary {
      display: list-item;
    }
    
    /*
     * Add the correct display in IE 9-.
     */
    menu {
      display: block;
    }
    
    /* Scripting
       ========================================================================== */
    /**
     * Add the correct display in IE 9-.
     */
    canvas {
      display: inline-block;
    }
    
    /**
     * Add the correct display in IE.
     */
    template {
      display: none;
    }
    
    /* Hidden
       ========================================================================== */
    /**
     * Add the correct display in IE 10-.
     */
    [hidden] {
      display: none;
    }
    
    `;

        /***/
      },

    /***/ './node_modules/@lit/reactive-element/development/css-tag.js':
      /*!*******************************************************************!*\
      !*** ./node_modules/@lit/reactive-element/development/css-tag.js ***!
      \*******************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ supportsAdoptingStyleSheets: () =>
            /* binding */ supportsAdoptingStyleSheets,
          /* harmony export */ CSSResult: () => /* binding */ CSSResult,
          /* harmony export */ unsafeCSS: () => /* binding */ unsafeCSS,
          /* harmony export */ css: () => /* binding */ css,
          /* harmony export */ adoptStyles: () => /* binding */ adoptStyles,
          /* harmony export */ getCompatibleStyle: () =>
            /* binding */ getCompatibleStyle,
          /* harmony export */
        });
        /**
         * @license
         * Copyright 2019 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        /**
         * Whether the current browser supports `adoptedStyleSheets`.
         */
        const supportsAdoptingStyleSheets =
          window.ShadowRoot &&
          (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
          'adoptedStyleSheets' in Document.prototype &&
          'replace' in CSSStyleSheet.prototype;
        const constructionToken = Symbol();
        const styleSheetCache = new Map();
        /**
         * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
         *
         * CSSResult is the return value of `css`-tagged template literals and
         * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
         * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
         */
        class CSSResult {
          constructor(cssText, safeToken) {
            // This property needs to remain unminified.
            this['_$cssResult$'] = true;
            if (safeToken !== constructionToken) {
              throw new Error(
                'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
              );
            }
            this.cssText = cssText;
          }
          // Note, this is a getter so that it's lazy. In practice, this means
          // stylesheets are not created until the first element instance is made.
          get styleSheet() {
            // Note, if `supportsAdoptingStyleSheets` is true then we assume
            // CSSStyleSheet is constructable.
            let styleSheet = styleSheetCache.get(this.cssText);
            if (supportsAdoptingStyleSheets && styleSheet === undefined) {
              styleSheetCache.set(
                this.cssText,
                (styleSheet = new CSSStyleSheet())
              );
              styleSheet.replaceSync(this.cssText);
            }
            return styleSheet;
          }
          toString() {
            return this.cssText;
          }
        }
        const textFromCSSResult = (value) => {
          // This property needs to remain unminified.
          if (value['_$cssResult$'] === true) {
            return value.cssText;
          } else if (typeof value === 'number') {
            return value;
          } else {
            throw new Error(
              `Value passed to 'css' function must be a 'css' function result: ` +
                `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
                `to ensure page security.`
            );
          }
        };
        /**
         * Wrap a value for interpolation in a [[`css`]] tagged template literal.
         *
         * This is unsafe because untrusted CSS text can be used to phone home
         * or exfiltrate data to an attacker controlled site. Take care to only use
         * this with trusted input.
         */
        const unsafeCSS = (value) =>
          new CSSResult(
            typeof value === 'string' ? value : String(value),
            constructionToken
          );
        /**
         * A template literal tag which can be used with LitElement's
         * [[LitElement.styles | `styles`]] property to set element styles.
         *
         * For security reasons, only literal string values and number may be used in
         * embedded expressions. To incorporate non-literal values [[`unsafeCSS`]] may
         * be used inside an expression.
         */
        const css = (strings, ...values) => {
          const cssText =
            strings.length === 1
              ? strings[0]
              : values.reduce(
                  (acc, v, idx) =>
                    acc + textFromCSSResult(v) + strings[idx + 1],
                  strings[0]
                );
          return new CSSResult(cssText, constructionToken);
        };
        /**
         * Applies the given styles to a `shadowRoot`. When Shadow DOM is
         * available but `adoptedStyleSheets` is not, styles are appended to the
         * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
         * Note, when shimming is used, any styles that are subsequently placed into
         * the shadowRoot should be placed *before* any shimmed adopted styles. This
         * will match spec behavior that gives adopted sheets precedence over styles in
         * shadowRoot.
         */
        const adoptStyles = (renderRoot, styles) => {
          if (supportsAdoptingStyleSheets) {
            renderRoot.adoptedStyleSheets = styles.map((s) =>
              s instanceof CSSStyleSheet ? s : s.styleSheet
            );
          } else {
            styles.forEach((s) => {
              const style = document.createElement('style');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const nonce = window['litNonce'];
              if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
              }
              style.textContent = s.cssText;
              renderRoot.appendChild(style);
            });
          }
        };
        const cssResultFromStyleSheet = (sheet) => {
          let cssText = '';
          for (const rule of sheet.cssRules) {
            cssText += rule.cssText;
          }
          return unsafeCSS(cssText);
        };
        const getCompatibleStyle = supportsAdoptingStyleSheets
          ? (s) => s
          : (s) =>
              s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
        //# sourceMappingURL=css-tag.js.map

        /***/
      },

    /***/ './node_modules/@lit/reactive-element/development/reactive-element.js':
      /*!****************************************************************************!*\
      !*** ./node_modules/@lit/reactive-element/development/reactive-element.js ***!
      \****************************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CSSResult: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult,
          /* harmony export */ adoptStyles: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles,
          /* harmony export */ css: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css,
          /* harmony export */ getCompatibleStyle: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle,
          /* harmony export */ supportsAdoptingStyleSheets: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets,
          /* harmony export */ unsafeCSS: () =>
            /* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS,
          /* harmony export */ defaultConverter: () =>
            /* binding */ defaultConverter,
          /* harmony export */ notEqual: () => /* binding */ notEqual,
          /* harmony export */ ReactiveElement: () =>
            /* binding */ ReactiveElement,
          /* harmony export */
        });
        /* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./css-tag.js */ './node_modules/@lit/reactive-element/development/css-tag.js'
          );
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        var _a, _b, _c;
        var _d;
        /**
         * Use this module if you want to create your own base class extending
         * [[ReactiveElement]].
         * @packageDocumentation
         */

        const DEV_MODE = true;
        let requestUpdateThenable;
        let issueWarning;
        const polyfillSupport = DEV_MODE
          ? window.reactiveElementPolyfillSupportDevMode
          : window.reactiveElementPolyfillSupport;
        if (DEV_MODE) {
          // Ensure warnings are issued only 1x, even if multiple versions of Lit
          // are loaded.
          const issuedWarnings =
            (_a = globalThis.litIssuedWarnings) !== null && _a !== void 0
              ? _a
              : (globalThis.litIssuedWarnings = new Set());
          // Issue a warning, if we haven't already.
          issueWarning = (code, warning) => {
            warning += ` See https://lit.dev/msg/${code} for more information.`;
            if (!issuedWarnings.has(warning)) {
              console.warn(warning);
              issuedWarnings.add(warning);
            }
          };
          issueWarning(
            'dev-mode',
            `Lit is in dev mode. Not recommended for production!`
          );
          // Issue polyfill support warning.
          if (
            ((_b = window.ShadyDOM) === null || _b === void 0
              ? void 0
              : _b.inUse) &&
            polyfillSupport === undefined
          ) {
            issueWarning(
              'polyfill-support-missing',
              `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
                `the \`polyfill-support\` module has not been loaded.`
            );
          }
          requestUpdateThenable = (name) => ({
            then: (onfulfilled, _onrejected) => {
              issueWarning(
                'request-update-promise',
                `The \`requestUpdate\` method should no longer return a Promise but ` +
                  `does so on \`${name}\`. Use \`updateComplete\` instead.`
              );
              if (onfulfilled !== undefined) {
                onfulfilled(false);
              }
            },
          });
        }
        /*
         * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
         * replaced at compile time by the munged name for object[property]. We cannot
         * alias this function, so we have to use a small shim that has the same
         * behavior when not compiling.
         */
        /*@__INLINE__*/
        const JSCompiler_renameProperty = (prop, _obj) => prop;
        const defaultConverter = {
          toAttribute(value, type) {
            switch (type) {
              case Boolean:
                value = value ? '' : null;
                break;
              case Object:
              case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
            }
            return value;
          },
          fromAttribute(value, type) {
            let fromValue = value;
            switch (type) {
              case Boolean:
                fromValue = value !== null;
                break;
              case Number:
                fromValue = value === null ? null : Number(value);
                break;
              case Object:
              case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                  // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                  fromValue = JSON.parse(value);
                } catch (e) {
                  fromValue = null;
                }
                break;
            }
            return fromValue;
          },
        };
        /**
         * Change function that returns true if `value` is different from `oldValue`.
         * This method is used as the default for a property's `hasChanged` function.
         */
        const notEqual = (value, old) => {
          // This ensures (old==NaN, value==NaN) always returns false
          return old !== value && (old === old || value === value);
        };
        const defaultPropertyDeclaration = {
          attribute: true,
          type: String,
          converter: defaultConverter,
          reflect: false,
          hasChanged: notEqual,
        };
        /**
         * The Closure JS Compiler doesn't currently have good support for static
         * property semantics where "this" is dynamic (e.g.
         * https://github.com/google/closure-compiler/issues/3177 and others) so we use
         * this hack to bypass any rewriting by the compiler.
         */
        const finalized = 'finalized';
        /**
         * Base element class which manages element properties and attributes. When
         * properties change, the `update` method is asynchronously called. This method
         * should be supplied by subclassers to render updates as desired.
         * @noInheritDoc
         */
        class ReactiveElement extends HTMLElement {
          constructor() {
            super();
            this.__instanceProperties = new Map();
            /**
             * True if there is a pending update as a result of calling `requestUpdate()`.
             * Should only be read.
             * @category updates
             */
            this.isUpdatePending = false;
            /**
             * Is set to `true` after the first update. The element code cannot assume
             * that `renderRoot` exists before the element `hasUpdated`.
             * @category updates
             */
            this.hasUpdated = false;
            /**
             * Name of currently reflecting property
             */
            this.__reflectingProperty = null;
            this._initialize();
          }
          /**
           * Adds an initializer function to the class that is called during instance
           * construction.
           *
           * This is useful for code that runs against a `ReactiveElement`
           * subclass, such as a decorator, that needs to do work for each
           * instance, such as setting up a `ReactiveController`.
           *
           * ```ts
           * const myDecorator = (target: typeof ReactiveElement, key: string) => {
           *   target.addInitializer((instance: ReactiveElement) => {
           *     // This is run during construction of the element
           *     new MyController(instance);
           *   });
           * }
           * ```
           *
           * Decorating a field will then cause each instance to run an initializer
           * that adds a controller:
           *
           * ```ts
           * class MyElement extends LitElement {
           *   @myDecorator foo;
           * }
           * ```
           *
           * Initializers are stored per-constructor. Adding an initializer to a
           * subclass does not add it to a superclass. Since initializers are run in
           * constructors, initializers will run in order of the class hierarchy,
           * starting with superclasses and progressing to the instance's class.
           *
           * @nocollapse
           */
          static addInitializer(initializer) {
            var _a;
            (_a = this._initializers) !== null && _a !== void 0
              ? _a
              : (this._initializers = []);
            this._initializers.push(initializer);
          }
          /**
           * Returns a list of attributes corresponding to the registered properties.
           * @nocollapse
           * @category attributes
           */
          static get observedAttributes() {
            // note: piggy backing on this to ensure we're finalized.
            this.finalize();
            const attributes = [];
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            this.elementProperties.forEach((v, p) => {
              const attr = this.__attributeNameForProperty(p, v);
              if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
              }
            });
            return attributes;
          }
          /**
           * Creates a property accessor on the element prototype if one does not exist
           * and stores a `PropertyDeclaration` for the property with the given options.
           * The property setter calls the property's `hasChanged` property option
           * or uses a strict identity check to determine whether or not to request
           * an update.
           *
           * This method may be overridden to customize properties; however,
           * when doing so, it's important to call `super.createProperty` to ensure
           * the property is setup correctly. This method calls
           * `getPropertyDescriptor` internally to get a descriptor to install.
           * To customize what properties do when they are get or set, override
           * `getPropertyDescriptor`. To customize the options for a property,
           * implement `createProperty` like this:
           *
           * ```ts
           * static createProperty(name, options) {
           *   options = Object.assign(options, {myOption: true});
           *   super.createProperty(name, options);
           * }
           * ```
           *
           * @nocollapse
           * @category properties
           */
          static createProperty(name, options = defaultPropertyDeclaration) {
            // if this is a state property, force the attribute to false.
            if (options.state) {
              // Cast as any since this is readonly.
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options.attribute = false;
            }
            // Note, since this can be called by the `@property` decorator which
            // is called before `finalize`, we ensure finalization has been kicked off.
            this.finalize();
            this.elementProperties.set(name, options);
            // Do not generate an accessor if the prototype already has one, since
            // it would be lost otherwise and that would never be the user's intention;
            // Instead, we expect users to call `requestUpdate` themselves from
            // user-defined accessors. Note that if the super has an accessor we will
            // still overwrite it
            if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
              const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
              const descriptor = this.getPropertyDescriptor(name, key, options);
              if (descriptor !== undefined) {
                Object.defineProperty(this.prototype, name, descriptor);
              }
            }
          }
          /**
           * Returns a property descriptor to be defined on the given named property.
           * If no descriptor is returned, the property will not become an accessor.
           * For example,
           *
           * ```ts
           * class MyElement extends LitElement {
           *   static getPropertyDescriptor(name, key, options) {
           *     const defaultDescriptor =
           *         super.getPropertyDescriptor(name, key, options);
           *     const setter = defaultDescriptor.set;
           *     return {
           *       get: defaultDescriptor.get,
           *       set(value) {
           *         setter.call(this, value);
           *         // custom action.
           *       },
           *       configurable: true,
           *       enumerable: true
           *     }
           *   }
           * }
           * ```
           *
           * @nocollapse
           * @category properties
           */
          static getPropertyDescriptor(name, key, options) {
            return {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              get() {
                return this[key];
              },
              set(value) {
                const oldValue = this[name];
                this[key] = value;
                this.requestUpdate(name, oldValue, options);
              },
              configurable: true,
              enumerable: true,
            };
          }
          /**
           * Returns the property options associated with the given property.
           * These options are defined with a `PropertyDeclaration` via the `properties`
           * object or the `@property` decorator and are registered in
           * `createProperty(...)`.
           *
           * Note, this method should be considered "final" and not overridden. To
           * customize the options for a given property, override [[`createProperty`]].
           *
           * @nocollapse
           * @final
           * @category properties
           */
          static getPropertyOptions(name) {
            return (
              this.elementProperties.get(name) || defaultPropertyDeclaration
            );
          }
          /**
           * Creates property accessors for registered properties, sets up element
           * styling, and ensures any superclasses are also finalized. Returns true if
           * the element was finalized.
           * @nocollapse
           */
          static finalize() {
            if (this.hasOwnProperty(finalized)) {
              return false;
            }
            this[finalized] = true;
            // finalize any superclasses
            const superCtor = Object.getPrototypeOf(this);
            superCtor.finalize();
            this.elementProperties = new Map(superCtor.elementProperties);
            // initialize Map populated in observedAttributes
            this.__attributeToPropertyMap = new Map();
            // make any properties
            // Note, only process "own" properties since this element will inherit
            // any properties defined on the superClass, and finalization ensures
            // the entire prototype chain is finalized.
            if (
              this.hasOwnProperty(JSCompiler_renameProperty('properties', this))
            ) {
              const props = this.properties;
              // support symbols in properties (IE11 does not support this)
              const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...Object.getOwnPropertySymbols(props),
              ];
              // This for/of is ok because propKeys is an array
              for (const p of propKeys) {
                // note, use of `any` is due to TypeScript lack of support for symbol in
                // index types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.createProperty(p, props[p]);
              }
            }
            this.elementStyles = this.finalizeStyles(this.styles);
            // DEV mode warnings
            if (DEV_MODE) {
              const warnRemovedOrRenamed = (name, renamed = false) => {
                if (this.prototype.hasOwnProperty(name)) {
                  issueWarning(
                    renamed ? 'renamed-api' : 'removed-api',
                    `\`${name}\` is implemented on class ${this.name}. It ` +
                      `has been ${renamed ? 'renamed' : 'removed'} ` +
                      `in this version of LitElement.`
                  );
                }
              };
              warnRemovedOrRenamed('initialize');
              warnRemovedOrRenamed('requestUpdateInternal');
              warnRemovedOrRenamed('_getUpdateComplete', true);
            }
            return true;
          }
          /**
           * Takes the styles the user supplied via the `static styles` property and
           * returns the array of styles to apply to the element.
           * Override this method to integrate into a style management system.
           *
           * Styles are deduplicated preserving the _last_ instance in the list. This
           * is a performance optimization to avoid duplicated styles that can occur
           * especially when composing via subclassing. The last item is kept to try
           * to preserve the cascade order with the assumption that it's most important
           * that last added styles override previous styles.
           *
           * @nocollapse
           * @category styles
           */
          static finalizeStyles(styles) {
            const elementStyles = [];
            if (Array.isArray(styles)) {
              // Dedupe the flattened array in reverse order to preserve the last items.
              // Casting to Array<unknown> works around TS error that
              // appears to come from trying to flatten a type CSSResultArray.
              const set = new Set(styles.flat(Infinity).reverse());
              // Then preserve original order by adding the set items in reverse order.
              for (const s of set) {
                elementStyles.unshift(
                  (0,
                  _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(
                    s
                  )
                );
              }
            } else if (styles !== undefined) {
              elementStyles.push(
                (0,
                _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(
                  styles
                )
              );
            }
            return elementStyles;
          }
          /**
           * Returns the property name for the given attribute `name`.
           * @nocollapse
           */
          static __attributeNameForProperty(name, options) {
            const attribute = options.attribute;
            return attribute === false
              ? undefined
              : typeof attribute === 'string'
              ? attribute
              : typeof name === 'string'
              ? name.toLowerCase()
              : undefined;
          }
          /**
           * Internal only override point for customizing work done when elements
           * are constructed.
           *
           * @internal
           */
          _initialize() {
            var _a;
            this.__updatePromise = new Promise(
              (res) => (this.enableUpdating = res)
            );
            this._$changedProperties = new Map();
            this.__saveInstanceProperties();
            // ensures first update will be caught by an early access of
            // `updateComplete`
            this.requestUpdate();
            (_a = this.constructor._initializers) === null || _a === void 0
              ? void 0
              : _a.forEach((i) => i(this));
          }
          /**
           * Registers a `ReactiveController` to participate in the element's reactive
           * update cycle. The element automatically calls into any registered
           * controllers during its lifecycle callbacks.
           *
           * If the element is connected when `addController()` is called, the
           * controller's `hostConnected()` callback will be immediately called.
           * @category controllers
           */
          addController(controller) {
            var _a, _b;
            ((_a = this.__controllers) !== null && _a !== void 0
              ? _a
              : (this.__controllers = [])
            ).push(controller);
            // If a controller is added after the element has been connected,
            // call hostConnected. Note, re-using existence of `renderRoot` here
            // (which is set in connectedCallback) to avoid the need to track a
            // first connected state.
            if (this.renderRoot !== undefined && this.isConnected) {
              (_b = controller.hostConnected) === null || _b === void 0
                ? void 0
                : _b.call(controller);
            }
          }
          /**
           * Removes a `ReactiveController` from the element.
           * @category controllers
           */
          removeController(controller) {
            var _a;
            // Note, if the indexOf is -1, the >>> will flip the sign which makes the
            // splice do nothing.
            (_a = this.__controllers) === null || _a === void 0
              ? void 0
              : _a.splice(this.__controllers.indexOf(controller) >>> 0, 1);
          }
          /**
           * Fixes any properties set on the instance before upgrade time.
           * Otherwise these would shadow the accessor and break these properties.
           * The properties are stored in a Map which is played back after the
           * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
           * (<=41), properties created for native platform properties like (`id` or
           * `name`) may not have default values set in the element constructor. On
           * these browsers native properties appear on instances and therefore their
           * default value will overwrite any element default (e.g. if the element sets
           * this.id = 'id' in the constructor, the 'id' will become '' since this is
           * the native platform default).
           */
          __saveInstanceProperties() {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            this.constructor.elementProperties.forEach((_v, p) => {
              if (this.hasOwnProperty(p)) {
                this.__instanceProperties.set(p, this[p]);
                delete this[p];
              }
            });
          }
          /**
           * Returns the node into which the element should render and by default
           * creates and returns an open shadowRoot. Implement to customize where the
           * element's DOM is rendered. For example, to render into the element's
           * childNodes, return `this`.
           *
           * @return Returns a node into which to render.
           * @category rendering
           */
          createRenderRoot() {
            var _a;
            const renderRoot =
              (_a = this.shadowRoot) !== null && _a !== void 0
                ? _a
                : this.attachShadow(this.constructor.shadowRootOptions);
            (0, _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(
              renderRoot,
              this.constructor.elementStyles
            );
            return renderRoot;
          }
          /**
           * On first connection, creates the element's renderRoot, sets up
           * element styling, and enables updating.
           * @category lifecycle
           */
          connectedCallback() {
            var _a;
            // create renderRoot before first update.
            if (this.renderRoot === undefined) {
              this.renderRoot = this.createRenderRoot();
            }
            this.enableUpdating(true);
            (_a = this.__controllers) === null || _a === void 0
              ? void 0
              : _a.forEach((c) => {
                  var _a;
                  return (_a = c.hostConnected) === null || _a === void 0
                    ? void 0
                    : _a.call(c);
                });
          }
          /**
           * Note, this method should be considered final and not overridden. It is
           * overridden on the element instance with a function that triggers the first
           * update.
           * @category updates
           */
          enableUpdating(_requestedUpdate) {}
          /**
           * Allows for `super.disconnectedCallback()` in extensions while
           * reserving the possibility of making non-breaking feature additions
           * when disconnecting at some point in the future.
           * @category lifecycle
           */
          disconnectedCallback() {
            var _a;
            (_a = this.__controllers) === null || _a === void 0
              ? void 0
              : _a.forEach((c) => {
                  var _a;
                  return (_a = c.hostDisconnected) === null || _a === void 0
                    ? void 0
                    : _a.call(c);
                });
          }
          /**
           * Synchronizes property values when attributes change.
           * @category attributes
           */
          attributeChangedCallback(name, _old, value) {
            this._$attributeToProperty(name, value);
          }
          __propertyToAttribute(
            name,
            value,
            options = defaultPropertyDeclaration
          ) {
            var _a, _b;
            const attr = this.constructor.__attributeNameForProperty(
              name,
              options
            );
            if (attr !== undefined && options.reflect === true) {
              const toAttribute =
                (_b =
                  (_a = options.converter) === null || _a === void 0
                    ? void 0
                    : _a.toAttribute) !== null && _b !== void 0
                  ? _b
                  : defaultConverter.toAttribute;
              const attrValue = toAttribute(value, options.type);
              if (
                DEV_MODE &&
                this.constructor.enabledWarnings.indexOf('migration') >= 0 &&
                attrValue === undefined
              ) {
                issueWarning(
                  'undefined-attribute-value',
                  `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`
                );
              }
              // Track if the property is being reflected to avoid
              // setting the property again via `attributeChangedCallback`. Note:
              // 1. this takes advantage of the fact that the callback is synchronous.
              // 2. will behave incorrectly if multiple attributes are in the reaction
              // stack at time of calling. However, since we process attributes
              // in `update` this should not be possible (or an extreme corner case
              // that we'd like to discover).
              // mark state reflecting
              this.__reflectingProperty = name;
              if (attrValue == null) {
                this.removeAttribute(attr);
              } else {
                this.setAttribute(attr, attrValue);
              }
              // mark state not reflecting
              this.__reflectingProperty = null;
            }
          }
          /** @internal */
          _$attributeToProperty(name, value) {
            var _a, _b, _c;
            const ctor = this.constructor;
            // Note, hint this as an `AttributeMap` so closure clearly understands
            // the type; it has issues with tracking types through statics
            const propName = ctor.__attributeToPropertyMap.get(name);
            // Use tracking info to avoid reflecting a property value to an attribute
            // if it was just set because the attribute changed.
            if (
              propName !== undefined &&
              this.__reflectingProperty !== propName
            ) {
              const options = ctor.getPropertyOptions(propName);
              const converter = options.converter;
              const fromAttribute =
                (_c =
                  (_b =
                    (_a = converter) === null || _a === void 0
                      ? void 0
                      : _a.fromAttribute) !== null && _b !== void 0
                    ? _b
                    : typeof converter === 'function'
                    ? converter
                    : null) !== null && _c !== void 0
                  ? _c
                  : defaultConverter.fromAttribute;
              // mark state reflecting
              this.__reflectingProperty = propName;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this[propName] = fromAttribute(value, options.type);
              // mark state not reflecting
              this.__reflectingProperty = null;
            }
          }
          /**
           * Requests an update which is processed asynchronously. This should be called
           * when an element should update based on some state not triggered by setting
           * a reactive property. In this case, pass no arguments. It should also be
           * called when manually implementing a property setter. In this case, pass the
           * property `name` and `oldValue` to ensure that any configured property
           * options are honored.
           *
           * @param name name of requesting property
           * @param oldValue old value of requesting property
           * @param options property options to use instead of the previously
           *     configured options
           * @category updates
           */
          requestUpdate(name, oldValue, options) {
            let shouldRequestUpdate = true;
            // If we have a property key, perform property update steps.
            if (name !== undefined) {
              options = options || this.constructor.getPropertyOptions(name);
              const hasChanged = options.hasChanged || notEqual;
              if (hasChanged(this[name], oldValue)) {
                if (!this._$changedProperties.has(name)) {
                  this._$changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (
                  options.reflect === true &&
                  this.__reflectingProperty !== name
                ) {
                  if (this.__reflectingProperties === undefined) {
                    this.__reflectingProperties = new Map();
                  }
                  this.__reflectingProperties.set(name, options);
                }
              } else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
              }
            }
            if (!this.isUpdatePending && shouldRequestUpdate) {
              this.__updatePromise = this.__enqueueUpdate();
            }
            // Note, since this no longer returns a promise, in dev mode we return a
            // thenable which warns if it's called.
            return DEV_MODE ? requestUpdateThenable(this.localName) : undefined;
          }
          /**
           * Sets up the element to asynchronously update.
           */
          async __enqueueUpdate() {
            this.isUpdatePending = true;
            try {
              // Ensure any previous update has resolved before updating.
              // This `await` also ensures that property changes are batched.
              await this.__updatePromise;
            } catch (e) {
              // Refire any previous errors async so they do not disrupt the update
              // cycle. Errors are refired so developers have a chance to observe
              // them, and this can be done by implementing
              // `window.onunhandledrejection`.
              Promise.reject(e);
            }
            const result = this.scheduleUpdate();
            // If `scheduleUpdate` returns a Promise, we await it. This is done to
            // enable coordinating updates with a scheduler. Note, the result is
            // checked to avoid delaying an additional microtask unless we need to.
            if (result != null) {
              await result;
            }
            return !this.isUpdatePending;
          }
          /**
           * Schedules an element update. You can override this method to change the
           * timing of updates by returning a Promise. The update will await the
           * returned Promise, and you should resolve the Promise to allow the update
           * to proceed. If this method is overridden, `super.scheduleUpdate()`
           * must be called.
           *
           * For instance, to schedule updates to occur just before the next frame:
           *
           * ```ts
           * override protected async scheduleUpdate(): Promise<unknown> {
           *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
           *   super.scheduleUpdate();
           * }
           * ```
           * @category updates
           */
          scheduleUpdate() {
            return this.performUpdate();
          }
          /**
           * Performs an element update. Note, if an exception is thrown during the
           * update, `firstUpdated` and `updated` will not be called.
           *
           * Call `performUpdate()` to immediately process a pending update. This should
           * generally not be needed, but it can be done in rare cases when you need to
           * update synchronously.
           *
           * Note: To ensure `performUpdate()` synchronously completes a pending update,
           * it should not be overridden. In LitElement 2.x it was suggested to override
           * `performUpdate()` to also customizing update scheduling. Instead, you should now
           * override `scheduleUpdate()`. For backwards compatibility with LitElement 2.x,
           * scheduling updates via `performUpdate()` continues to work, but will make
           * also calling `performUpdate()` to synchronously process updates difficult.
           *
           * @category updates
           */
          performUpdate() {
            var _a;
            // Abort any update if one is not pending when this is called.
            // This can happen if `performUpdate` is called early to "flush"
            // the update.
            if (!this.isUpdatePending) {
              return;
            }
            // create renderRoot before first update.
            if (!this.hasUpdated) {
              // Produce warning if any class properties are shadowed by class fields
              if (DEV_MODE) {
                const shadowedProperties = [];
                this.constructor.elementProperties.forEach((_v, p) => {
                  var _a;
                  if (
                    this.hasOwnProperty(p) &&
                    !((_a = this.__instanceProperties) === null || _a === void 0
                      ? void 0
                      : _a.has(p))
                  ) {
                    shadowedProperties.push(p);
                  }
                });
                if (shadowedProperties.length) {
                  throw new Error(
                    `The following properties on element ${this.localName} will not ` +
                      `trigger updates as expected because they are set using class ` +
                      `fields: ${shadowedProperties.join(', ')}. ` +
                      `Native class fields and some compiled output will overwrite ` +
                      `accessors used for detecting changes. See ` +
                      `https://lit.dev/msg/class-field-shadowing ` +
                      `for more information.`
                  );
                }
              }
            }
            // Mixin instance properties once, if they exist.
            if (this.__instanceProperties) {
              // Use forEach so this works even if for/of loops are compiled to for loops
              // expecting arrays
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.__instanceProperties.forEach((v, p) => (this[p] = v));
              this.__instanceProperties = undefined;
            }
            let shouldUpdate = false;
            const changedProperties = this._$changedProperties;
            try {
              shouldUpdate = this.shouldUpdate(changedProperties);
              if (shouldUpdate) {
                this.willUpdate(changedProperties);
                (_a = this.__controllers) === null || _a === void 0
                  ? void 0
                  : _a.forEach((c) => {
                      var _a;
                      return (_a = c.hostUpdate) === null || _a === void 0
                        ? void 0
                        : _a.call(c);
                    });
                this.update(changedProperties);
              } else {
                this.__markUpdated();
              }
            } catch (e) {
              // Prevent `firstUpdated` and `updated` from running when there's an
              // update exception.
              shouldUpdate = false;
              // Ensure element can accept additional updates after an exception.
              this.__markUpdated();
              throw e;
            }
            // The update is no longer considered pending and further updates are now allowed.
            if (shouldUpdate) {
              this._$didUpdate(changedProperties);
            }
          }
          /**
           * @category updates
           */
          willUpdate(_changedProperties) {}
          // Note, this is an override point for polyfill-support.
          // @internal
          _$didUpdate(changedProperties) {
            var _a;
            (_a = this.__controllers) === null || _a === void 0
              ? void 0
              : _a.forEach((c) => {
                  var _a;
                  return (_a = c.hostUpdated) === null || _a === void 0
                    ? void 0
                    : _a.call(c);
                });
            if (!this.hasUpdated) {
              this.hasUpdated = true;
              this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
            if (
              DEV_MODE &&
              this.isUpdatePending &&
              this.constructor.enabledWarnings.indexOf('change-in-update') >= 0
            ) {
              issueWarning(
                'change-in-update',
                `Element ${this.localName} scheduled an update ` +
                  `(generally because a property was set) ` +
                  `after an update completed, causing a new update to be scheduled. ` +
                  `This is inefficient and should be avoided unless the next update ` +
                  `can only be scheduled as a side effect of the previous update.`
              );
            }
          }
          __markUpdated() {
            this._$changedProperties = new Map();
            this.isUpdatePending = false;
          }
          /**
           * Returns a Promise that resolves when the element has completed updating.
           * The Promise value is a boolean that is `true` if the element completed the
           * update without triggering another update. The Promise result is `false` if
           * a property was set inside `updated()`. If the Promise is rejected, an
           * exception was thrown during the update.
           *
           * To await additional asynchronous work, override the `getUpdateComplete`
           * method. For example, it is sometimes useful to await a rendered element
           * before fulfilling this Promise. To do this, first await
           * `super.getUpdateComplete()`, then any subsequent state.
           *
           * @return A promise of a boolean that resolves to true if the update completed
           *     without triggering another update.
           * @category updates
           */
          get updateComplete() {
            return this.getUpdateComplete();
          }
          /**
           * Override point for the `updateComplete` promise.
           *
           * It is not safe to override the `updateComplete` getter directly due to a
           * limitation in TypeScript which means it is not possible to call a
           * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
           * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
           * This method should be overridden instead. For example:
           *
           * ```ts
           * class MyElement extends LitElement {
           *   override async getUpdateComplete() {
           *     const result = await super.getUpdateComplete();
           *     await this._myChild.updateComplete;
           *     return result;
           *   }
           * }
           * ```
           *
           * @return A promise of a boolean that resolves to true if the update completed
           *     without triggering another update.
           * @category updates
           */
          getUpdateComplete() {
            return this.__updatePromise;
          }
          /**
           * Controls whether or not `update()` should be called when the element requests
           * an update. By default, this method always returns `true`, but this can be
           * customized to control when to update.
           *
           * @param _changedProperties Map of changed properties with old values
           * @category updates
           */
          shouldUpdate(_changedProperties) {
            return true;
          }
          /**
           * Updates the element. This method reflects property values to attributes.
           * It can be overridden to render and keep updated element DOM.
           * Setting properties inside this method will *not* trigger
           * another update.
           *
           * @param _changedProperties Map of changed properties with old values
           * @category updates
           */
          update(_changedProperties) {
            if (this.__reflectingProperties !== undefined) {
              // Use forEach so this works even if for/of loops are compiled to for
              // loops expecting arrays
              this.__reflectingProperties.forEach((v, k) =>
                this.__propertyToAttribute(k, this[k], v)
              );
              this.__reflectingProperties = undefined;
            }
            this.__markUpdated();
          }
          /**
           * Invoked whenever the element is updated. Implement to perform
           * post-updating tasks via DOM APIs, for example, focusing an element.
           *
           * Setting properties inside this method will trigger the element to update
           * again after this update cycle completes.
           *
           * @param _changedProperties Map of changed properties with old values
           * @category updates
           */
          updated(_changedProperties) {}
          /**
           * Invoked when the element is first updated. Implement to perform one time
           * work on the element after update.
           *
           * Setting properties inside this method will trigger the element to update
           * again after this update cycle completes.
           *
           * @param _changedProperties Map of changed properties with old values
           * @category updates
           */
          firstUpdated(_changedProperties) {}
        }
        _d = finalized;
        /**
         * Marks class as having finished creating properties.
         */
        ReactiveElement[_d] = true;
        /**
         * Memoized list of all element properties, including any superclass properties.
         * Created lazily on user subclasses when finalizing the class.
         * @nocollapse
         * @category properties
         */
        ReactiveElement.elementProperties = new Map();
        /**
         * Memoized list of all element styles.
         * Created lazily on user subclasses when finalizing the class.
         * @nocollapse
         * @category styles
         */
        ReactiveElement.elementStyles = [];
        /**
         * Options used when calling `attachShadow`. Set this property to customize
         * the options for the shadowRoot; for example, to create a closed
         * shadowRoot: `{mode: 'closed'}`.
         *
         * Note, these options are used in `createRenderRoot`. If this method
         * is customized, options should be respected if possible.
         * @nocollapse
         * @category rendering
         */
        ReactiveElement.shadowRootOptions = { mode: 'open' };
        // Apply polyfills if available
        polyfillSupport === null || polyfillSupport === void 0
          ? void 0
          : polyfillSupport({ ReactiveElement });
        // Dev mode warnings...
        if (DEV_MODE) {
          // Default warning set.
          ReactiveElement.enabledWarnings = ['change-in-update'];
          const ensureOwnWarnings = function (ctor) {
            if (
              !ctor.hasOwnProperty(
                JSCompiler_renameProperty('enabledWarnings', ctor)
              )
            ) {
              ctor.enabledWarnings = ctor.enabledWarnings.slice();
            }
          };
          ReactiveElement.enableWarning = function (warning) {
            ensureOwnWarnings(this);
            if (this.enabledWarnings.indexOf(warning) < 0) {
              this.enabledWarnings.push(warning);
            }
          };
          ReactiveElement.disableWarning = function (warning) {
            ensureOwnWarnings(this);
            const i = this.enabledWarnings.indexOf(warning);
            if (i >= 0) {
              this.enabledWarnings.splice(i, 1);
            }
          };
        }
        // IMPORTANT: do not change the property name or the assignment expression.
        // This line will be used in regexes to search for ReactiveElement usage.
        ((_c = globalThis.reactiveElementVersions) !== null && _c !== void 0
          ? _c
          : (globalThis.reactiveElementVersions = [])
        ).push('1.0.1');
        if (DEV_MODE && globalThis.reactiveElementVersions.length > 1) {
          issueWarning(
            'multiple-versions',
            `Multiple versions of Lit loaded. Loading multiple versions ` +
              `is not recommended.`
          );
        }
        //# sourceMappingURL=reactive-element.js.map

        /***/
      },

    /***/ './node_modules/lit-element/development/lit-element.js':
      /*!*************************************************************!*\
      !*** ./node_modules/lit-element/development/lit-element.js ***!
      \*************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CSSResult: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult,
          /* harmony export */ ReactiveElement: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement,
          /* harmony export */ adoptStyles: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles,
          /* harmony export */ css: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css,
          /* harmony export */ defaultConverter: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter,
          /* harmony export */ getCompatibleStyle: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle,
          /* harmony export */ notEqual: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual,
          /* harmony export */ supportsAdoptingStyleSheets: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets,
          /* harmony export */ unsafeCSS: () =>
            /* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS,
          /* harmony export */ INTERNAL: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.INTERNAL,
          /* harmony export */ _$LH: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH,
          /* harmony export */ html: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html,
          /* harmony export */ noChange: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange,
          /* harmony export */ nothing: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing,
          /* harmony export */ render: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render,
          /* harmony export */ svg: () =>
            /* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg,
          /* harmony export */ UpdatingElement: () =>
            /* binding */ UpdatingElement,
          /* harmony export */ LitElement: () => /* binding */ LitElement,
          /* harmony export */ _$LE: () => /* binding */ _$LE,
          /* harmony export */
        });
        /* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @lit/reactive-element */ './node_modules/@lit/reactive-element/development/reactive-element.js'
          );
        /* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! lit-html */ './node_modules/lit-html/development/lit-html.js'
          );
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        var _a, _b, _c;
        /**
         * The main LitElement module, which defines the [[`LitElement`]] base class and
         * related APIs.
         *
         *  LitElement components can define a template and a set of observed
         * properties. Changing an observed property triggers a re-render of the
         * element.
         *
         *  Import [[`LitElement`]] and [[`html`]] from this module to create a
         * component:
         *
         *  ```js
         * import {LitElement, html} from 'lit-element';
         *
         * class MyElement extends LitElement {
         *
         *   // Declare observed properties
         *   static get properties() {
         *     return {
         *       adjective: {}
         *     }
         *   }
         *
         *   constructor() {
         *     this.adjective = 'awesome';
         *   }
         *
         *   // Define the element's template
         *   render() {
         *     return html`<p>your ${adjective} template here</p>`;
         *   }
         * }
         *
         * customElements.define('my-element', MyElement);
         * ```
         *
         * `LitElement` extends [[`ReactiveElement`]] and adds lit-html templating.
         * The `ReactiveElement` class is provided for users that want to build
         * their own custom element base classes that don't use lit-html.
         *
         * @packageDocumentation
         */

        // For backwards compatibility export ReactiveElement as UpdatingElement. Note,
        // IE transpilation requires exporting like this.
        const UpdatingElement =
          _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement;
        const DEV_MODE = true;
        let issueWarning;
        if (DEV_MODE) {
          // Ensure warnings are issued only 1x, even if multiple versions of Lit
          // are loaded.
          const issuedWarnings =
            (_a = globalThis.litIssuedWarnings) !== null && _a !== void 0
              ? _a
              : (globalThis.litIssuedWarnings = new Set());
          // Issue a warning, if we haven't already.
          issueWarning = (code, warning) => {
            warning += ` See https://lit.dev/msg/${code} for more information.`;
            if (!issuedWarnings.has(warning)) {
              console.warn(warning);
              issuedWarnings.add(warning);
            }
          };
        }
        /**
         * Base element class that manages element properties and attributes, and
         * renders a lit-html template.
         *
         * To define a component, subclass `LitElement` and implement a
         * `render` method to provide the component's template. Define properties
         * using the [[`properties`]] property or the [[`property`]] decorator.
         */
        class LitElement extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement {
          constructor() {
            super(...arguments);
            /**
             * @category rendering
             */
            this.renderOptions = { host: this };
            this.__childPart = undefined;
          }
          /**
           * @category rendering
           */
          createRenderRoot() {
            var _a;
            var _b;
            const renderRoot = super.createRenderRoot();
            // When adoptedStyleSheets are shimmed, they are inserted into the
            // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
            // any styles in Lit content render before adoptedStyleSheets. This is
            // important so that adoptedStyleSheets have precedence over styles in
            // the shadowRoot.
            (_a = (_b = this.renderOptions).renderBefore) !== null &&
            _a !== void 0
              ? _a
              : (_b.renderBefore = renderRoot.firstChild);
            return renderRoot;
          }
          /**
           * Updates the element. This method reflects property values to attributes
           * and calls `render` to render DOM via lit-html. Setting properties inside
           * this method will *not* trigger another update.
           * @param changedProperties Map of changed properties with old values
           * @category updates
           */
          update(changedProperties) {
            // Setting properties in `render` should not trigger an update. Since
            // updates are allowed after super.update, it's important to call `render`
            // before that.
            const value = this.render();
            if (!this.hasUpdated) {
              this.renderOptions.isConnected = this.isConnected;
            }
            super.update(changedProperties);
            this.__childPart = (0,
            lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(
              value,
              this.renderRoot,
              this.renderOptions
            );
          }
          /**
           * Invoked when the component is added to the document's DOM.
           *
           * In `connectedCallback()` you should setup tasks that should only occur when
           * the element is connected to the document. The most common of these is
           * adding event listeners to nodes external to the element, like a keydown
           * event handler added to the window.
           *
           * ```ts
           * connectedCallback() {
           *   super.connectedCallback();
           *   addEventListener('keydown', this._handleKeydown);
           * }
           * ```
           *
           * Typically, anything done in `connectedCallback()` should be undone when the
           * element is disconnected, in `disconnectedCallback()`.
           *
           * @category lifecycle
           */
          connectedCallback() {
            var _a;
            super.connectedCallback();
            (_a = this.__childPart) === null || _a === void 0
              ? void 0
              : _a.setConnected(true);
          }
          /**
           * Invoked when the component is removed from the document's DOM.
           *
           * This callback is the main signal to the element that it may no longer be
           * used. `disconnectedCallback()` should ensure that nothing is holding a
           * reference to the element (such as event listeners added to nodes external
           * to the element), so that it is free to be garbage collected.
           *
           * ```ts
           * disconnectedCallback() {
           *   super.disconnectedCallback();
           *   window.removeEventListener('keydown', this._handleKeydown);
           * }
           * ```
           *
           * An element may be re-connected after being disconnected.
           *
           * @category lifecycle
           */
          disconnectedCallback() {
            var _a;
            super.disconnectedCallback();
            (_a = this.__childPart) === null || _a === void 0
              ? void 0
              : _a.setConnected(false);
          }
          /**
           * Invoked on each update to perform rendering tasks. This method may return
           * any value renderable by lit-html's `ChildPart` - typically a
           * `TemplateResult`. Setting properties inside this method will *not* trigger
           * the element to update.
           * @category rendering
           */
          render() {
            return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
          }
        }
        /**
         * Ensure this class is marked as `finalized` as an optimization ensuring
         * it will not needlessly try to `finalize`.
         *
         * Note this property name is a string to prevent breaking Closure JS Compiler
         * optimizations. See @lit/reactive-element for more information.
         */
        LitElement['finalized'] = true;
        // This property needs to remain unminified.
        LitElement['_$litElement$'] = true;
        // Install hydration if available
        (_b = globalThis.litElementHydrateSupport) === null || _b === void 0
          ? void 0
          : _b.call(globalThis, { LitElement });
        // Apply polyfills if available
        const polyfillSupport = DEV_MODE
          ? globalThis.litElementPolyfillSupportDevMode
          : globalThis.litElementPolyfillSupport;
        polyfillSupport === null || polyfillSupport === void 0
          ? void 0
          : polyfillSupport({ LitElement });
        // DEV mode warnings
        if (DEV_MODE) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          // Note, for compatibility with closure compilation, this access
          // needs to be as a string property index.
          LitElement['finalize'] = function () {
            const finalized =
              _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement.finalize.call(
                this
              );
            if (!finalized) {
              return false;
            }
            const warnRemovedOrRenamed = (obj, name, renamed = false) => {
              if (obj.hasOwnProperty(name)) {
                const ctorName = (
                  typeof obj === 'function' ? obj : obj.constructor
                ).name;
                issueWarning(
                  renamed ? 'renamed-api' : 'removed-api',
                  `\`${name}\` is implemented on class ${ctorName}. It ` +
                    `has been ${renamed ? 'renamed' : 'removed'} ` +
                    `in this version of LitElement.`
                );
              }
            };
            warnRemovedOrRenamed(this, 'render');
            warnRemovedOrRenamed(this, 'getStyles', true);
            warnRemovedOrRenamed(this.prototype, 'adoptStyles');
            return true;
          };
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        /**
         * END USERS SHOULD NOT RELY ON THIS OBJECT.
         *
         * Private exports for use by other Lit packages, not intended for use by
         * external users.
         *
         * We currently do not make a mangled rollup build of the lit-ssr code. In order
         * to keep a number of (otherwise private) top-level exports  mangled in the
         * client side code, we export a _$LE object containing those members (or
         * helper methods for accessing private fields of those members), and then
         * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
         * client-side code is being used in `dev` mode or `prod` mode.
         *
         * This has a unique name, to disambiguate it from private exports in
         * lit-html, since this module re-exports all of lit-html.
         *
         * @private
         */
        const _$LE = {
          _$attributeToProperty: (el, name, value) => {
            // eslint-disable-next-line
            el._$attributeToProperty(name, value);
          },
          // eslint-disable-next-line
          _$changedProperties: (el) => el._$changedProperties,
        };
        // IMPORTANT: do not change the property name or the assignment expression.
        // This line will be used in regexes to search for LitElement usage.
        ((_c = globalThis.litElementVersions) !== null && _c !== void 0
          ? _c
          : (globalThis.litElementVersions = [])
        ).push('3.0.1');
        if (DEV_MODE && globalThis.litElementVersions.length > 1) {
          issueWarning(
            'multiple-versions',
            `Multiple versions of Lit loaded. Loading multiple versions ` +
              `is not recommended.`
          );
        }
        //# sourceMappingURL=lit-element.js.map

        /***/
      },

    /***/ './node_modules/lit-html/development/directive.js':
      /*!********************************************************!*\
      !*** ./node_modules/lit-html/development/directive.js ***!
      \********************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PartType: () => /* binding */ PartType,
          /* harmony export */ directive: () => /* binding */ directive,
          /* harmony export */ Directive: () => /* binding */ Directive,
          /* harmony export */
        });
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const PartType = {
          ATTRIBUTE: 1,
          CHILD: 2,
          PROPERTY: 3,
          BOOLEAN_ATTRIBUTE: 4,
          EVENT: 5,
          ELEMENT: 6,
        };
        /**
         * Creates a user-facing directive function from a Directive class. This
         * function has the same parameters as the directive's render() method.
         */
        const directive =
          (c) =>
          (...values) => ({
            // This property needs to remain unminified.
            ['_$litDirective$']: c,
            values,
          });
        /**
         * Base class for creating custom directives. Users should extend this class,
         * implement `render` and/or `update`, and then pass their subclass to
         * `directive`.
         */
        class Directive {
          constructor(_partInfo) {}
          // See comment in Disconnectable interface for why this is a getter
          get _$isConnected() {
            return this._$parent._$isConnected;
          }
          /** @internal */
          _$initialize(part, parent, attributeIndex) {
            this.__part = part;
            this._$parent = parent;
            this.__attributeIndex = attributeIndex;
          }
          /** @internal */
          _$resolve(part, props) {
            return this.update(part, props);
          }
          update(_part, props) {
            return this.render(...props);
          }
        }
        //# sourceMappingURL=directive.js.map

        /***/
      },

    /***/ './node_modules/lit-html/development/directives/class-map.js':
      /*!*******************************************************************!*\
      !*** ./node_modules/lit-html/development/directives/class-map.js ***!
      \*******************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ classMap: () => /* binding */ classMap,
          /* harmony export */
        });
        /* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../lit-html.js */ './node_modules/lit-html/development/lit-html.js'
          );
        /* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../directive.js */ './node_modules/lit-html/development/directive.js'
          );
        /**
         * @license
         * Copyright 2018 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */

        class ClassMapDirective extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive {
          constructor(partInfo) {
            var _a;
            super(partInfo);
            if (
              partInfo.type !==
                _directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE ||
              partInfo.name !== 'class' ||
              ((_a = partInfo.strings) === null || _a === void 0
                ? void 0
                : _a.length) > 2
            ) {
              throw new Error(
                '`classMap()` can only be used in the `class` attribute ' +
                  'and must be the only part in the attribute.'
              );
            }
          }
          render(classInfo) {
            // Add spaces to ensure separation from static classes
            return (
              ' ' +
              Object.keys(classInfo)
                .filter((key) => classInfo[key])
                .join(' ') +
              ' '
            );
          }
          update(part, [classInfo]) {
            var _a, _b;
            // Remember dynamic classes on the first render
            if (this._previousClasses === undefined) {
              this._previousClasses = new Set();
              if (part.strings !== undefined) {
                this._staticClasses = new Set(
                  part.strings
                    .join(' ')
                    .split(/\s/)
                    .filter((s) => s !== '')
                );
              }
              for (const name in classInfo) {
                if (
                  classInfo[name] &&
                  !((_a = this._staticClasses) === null || _a === void 0
                    ? void 0
                    : _a.has(name))
                ) {
                  this._previousClasses.add(name);
                }
              }
              return this.render(classInfo);
            }
            const classList = part.element.classList;
            // Remove old classes that no longer apply
            // We use forEach() instead of for-of so that we don't require down-level
            // iteration.
            this._previousClasses.forEach((name) => {
              if (!(name in classInfo)) {
                classList.remove(name);
                this._previousClasses.delete(name);
              }
            });
            // Add or remove classes based on their classMap value
            for (const name in classInfo) {
              // We explicitly want a loose truthy check of `value` because it seems
              // more convenient that '' and 0 are skipped.
              const value = !!classInfo[name];
              if (
                value !== this._previousClasses.has(name) &&
                !((_b = this._staticClasses) === null || _b === void 0
                  ? void 0
                  : _b.has(name))
              ) {
                if (value) {
                  classList.add(name);
                  this._previousClasses.add(name);
                } else {
                  classList.remove(name);
                  this._previousClasses.delete(name);
                }
              }
            }
            return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;
          }
        }
        /**
         * A directive that applies dynamic CSS classes.
         *
         * This must be used in the `class` attribute and must be the only part used in
         * the attribute. It takes each property in the `classInfo` argument and adds
         * the property name to the element's `classList` if the property value is
         * truthy; if the property value is falsey, the property name is removed from
         * the element's `class`.
         *
         * For example `{foo: bar}` applies the class `foo` if the value of `bar` is
         * truthy.
         *
         * @param classInfo
         */
        const classMap = (0,
        _directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(
          ClassMapDirective
        );
        //# sourceMappingURL=class-map.js.map

        /***/
      },

    /***/ './node_modules/lit-html/development/directives/if-defined.js':
      /*!********************************************************************!*\
      !*** ./node_modules/lit-html/development/directives/if-defined.js ***!
      \********************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ifDefined: () => /* binding */ ifDefined,
          /* harmony export */
        });
        /* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../lit-html.js */ './node_modules/lit-html/development/lit-html.js'
          );
        /**
         * @license
         * Copyright 2018 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */

        /**
         * For AttributeParts, sets the attribute if the value is defined and removes
         * the attribute if the value is undefined.
         *
         * For other part types, this directive is a no-op.
         */
        const ifDefined = (value) =>
          value !== null && value !== void 0
            ? value
            : _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing;
        //# sourceMappingURL=if-defined.js.map

        /***/
      },

    /***/ './node_modules/lit-html/development/directives/style-map.js':
      /*!*******************************************************************!*\
      !*** ./node_modules/lit-html/development/directives/style-map.js ***!
      \*******************************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ styleMap: () => /* binding */ styleMap,
          /* harmony export */
        });
        /* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../lit-html.js */ './node_modules/lit-html/development/lit-html.js'
          );
        /* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../directive.js */ './node_modules/lit-html/development/directive.js'
          );
        /**
         * @license
         * Copyright 2018 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */

        class StyleMapDirective extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive {
          constructor(partInfo) {
            var _a;
            super(partInfo);
            if (
              partInfo.type !==
                _directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE ||
              partInfo.name !== 'style' ||
              ((_a = partInfo.strings) === null || _a === void 0
                ? void 0
                : _a.length) > 2
            ) {
              throw new Error(
                'The `styleMap` directive must be used in the `style` attribute ' +
                  'and must be the only part in the attribute.'
              );
            }
          }
          render(styleInfo) {
            return Object.keys(styleInfo).reduce((style, prop) => {
              const value = styleInfo[prop];
              if (value == null) {
                return style;
              }
              // Convert property names from camel-case to dash-case, i.e.:
              //  `backgroundColor` -> `background-color`
              // Vendor-prefixed names need an extra `-` appended to front:
              //  `webkitAppearance` -> `-webkit-appearance`
              // Exception is any property name containing a dash, including
              // custom properties; we assume these are already dash-cased i.e.:
              //  `--my-button-color` --> `--my-button-color`
              prop = prop
                .replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, '-$&')
                .toLowerCase();
              return style + `${prop}:${value};`;
            }, '');
          }
          update(part, [styleInfo]) {
            const { style } = part.element;
            if (this._previousStyleProperties === undefined) {
              this._previousStyleProperties = new Set();
              for (const name in styleInfo) {
                this._previousStyleProperties.add(name);
              }
              return this.render(styleInfo);
            }
            // Remove old properties that no longer exist in styleInfo
            // We use forEach() instead of for-of so that re don't require down-level
            // iteration.
            this._previousStyleProperties.forEach((name) => {
              // If the name isn't in styleInfo or it's null/undefined
              if (styleInfo[name] == null) {
                this._previousStyleProperties.delete(name);
                if (name.includes('-')) {
                  style.removeProperty(name);
                } else {
                  // Note reset using empty string (vs null) as IE11 does not always
                  // reset via null (https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style#setting_styles)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style[name] = '';
                }
              }
            });
            // Add or update properties
            for (const name in styleInfo) {
              const value = styleInfo[name];
              if (value != null) {
                this._previousStyleProperties.add(name);
                if (name.includes('-')) {
                  style.setProperty(name, value);
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style[name] = value;
                }
              }
            }
            return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;
          }
        }
        /**
         * A directive that applies CSS properties to an element.
         *
         * `styleMap` can only be used in the `style` attribute and must be the only
         * expression in the attribute. It takes the property names in the `styleInfo`
         * object and adds the property values as CSS properties. Property names with
         * dashes (`-`) are assumed to be valid CSS property names and set on the
         * element's style object using `setProperty()`. Names without dashes are
         * assumed to be camelCased JavaScript property names and set on the element's
         * style object using property assignment, allowing the style object to
         * translate JavaScript-style names to CSS property names.
         *
         * For example `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size':
         * '0'})` sets the `background-color`, `border-top` and `--size` properties.
         *
         * @param styleInfo
         */
        const styleMap = (0,
        _directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(
          StyleMapDirective
        );
        //# sourceMappingURL=style-map.js.map

        /***/
      },

    /***/ './node_modules/lit-html/development/lit-html.js':
      /*!*******************************************************!*\
      !*** ./node_modules/lit-html/development/lit-html.js ***!
      \*******************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ INTERNAL: () => /* binding */ INTERNAL,
          /* harmony export */ html: () => /* binding */ html,
          /* harmony export */ svg: () => /* binding */ svg,
          /* harmony export */ noChange: () => /* binding */ noChange,
          /* harmony export */ nothing: () => /* binding */ nothing,
          /* harmony export */ render: () => /* binding */ render,
          /* harmony export */ _$LH: () => /* binding */ _$LH,
          /* harmony export */
        });
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        var _a, _b, _c, _d;
        const DEV_MODE = true;
        const ENABLE_EXTRA_SECURITY_HOOKS = true;
        const ENABLE_SHADYDOM_NOPATCH = true;
        /**
         * `true` if we're building for google3 with temporary back-compat helpers.
         * This export is not present in prod builds.
         * @internal
         */
        const INTERNAL = true;
        let issueWarning;
        if (DEV_MODE) {
          (_a = globalThis.litIssuedWarnings) !== null && _a !== void 0
            ? _a
            : (globalThis.litIssuedWarnings = new Set());
          // Issue a warning, if we haven't already.
          issueWarning = (code, warning) => {
            warning += code
              ? ` See https://lit.dev/msg/${code} for more information.`
              : '';
            if (!globalThis.litIssuedWarnings.has(warning)) {
              console.warn(warning);
              globalThis.litIssuedWarnings.add(warning);
            }
          };
          issueWarning(
            'dev-mode',
            `Lit is in dev mode. Not recommended for production!`
          );
        }
        const wrap =
          ENABLE_SHADYDOM_NOPATCH &&
          ((_b = window.ShadyDOM) === null || _b === void 0
            ? void 0
            : _b.inUse) &&
          ((_c = window.ShadyDOM) === null || _c === void 0
            ? void 0
            : _c.noPatch) === true
            ? window.ShadyDOM.wrap
            : (node) => node;
        const trustedTypes = globalThis.trustedTypes;
        /**
         * Our TrustedTypePolicy for HTML which is declared using the html template
         * tag function.
         *
         * That HTML is a developer-authored constant, and is parsed with innerHTML
         * before any untrusted expressions have been mixed in. Therefor it is
         * considered safe by construction.
         */
        const policy = trustedTypes
          ? trustedTypes.createPolicy('lit-html', {
              createHTML: (s) => s,
            })
          : undefined;
        const identityFunction = (value) => value;
        const noopSanitizer = (_node, _name, _type) => identityFunction;
        /** Sets the global sanitizer factory. */
        const setSanitizer = (newSanitizer) => {
          if (!ENABLE_EXTRA_SECURITY_HOOKS) {
            return;
          }
          if (sanitizerFactoryInternal !== noopSanitizer) {
            throw new Error(
              `Attempted to overwrite existing lit-html security policy.` +
                ` setSanitizeDOMValueFactory should be called at most once.`
            );
          }
          sanitizerFactoryInternal = newSanitizer;
        };
        /**
         * Only used in internal tests, not a part of the public API.
         */
        const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
          sanitizerFactoryInternal = noopSanitizer;
        };
        const createSanitizer = (node, name, type) => {
          return sanitizerFactoryInternal(node, name, type);
        };
        // Added to an attribute name to mark the attribute as bound so we can find
        // it easily.
        const boundAttributeSuffix = '$lit$';
        // This marker is used in many syntactic positions in HTML, so it must be
        // a valid element name and attribute name. We don't support dynamic names (yet)
        // but this at least ensures that the parse tree is closer to the template
        // intention.
        const marker = `lit$${String(Math.random()).slice(9)}$`;
        // String used to tell if a comment is a marker comment
        const markerMatch = '?' + marker;
        // Text used to insert a comment marker node. We use processing instruction
        // syntax because it's slightly smaller, but parses as a comment node.
        const nodeMarker = `<${markerMatch}>`;
        const d = document;
        // Creates a dynamic marker. We never have to search for these in the DOM.
        const createMarker = (v = '') => d.createComment(v);
        const isPrimitive = (value) =>
          value === null ||
          (typeof value != 'object' && typeof value != 'function');
        const isArray = Array.isArray;
        const isIterable = (value) => {
          var _a;
          return (
            isArray(value) ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof ((_a = value) === null || _a === void 0
              ? void 0
              : _a[Symbol.iterator]) === 'function'
          );
        };
        const SPACE_CHAR = `[ \t\n\f\r]`;
        const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
        const NAME_CHAR = `[^\\s"'>=/]`;
        // These regexes represent the five parsing states that we care about in the
        // Template's HTML scanner. They match the *end* of the state they're named
        // after.
        // Depending on the match, we transition to a new state. If there's no match,
        // we stay in the same state.
        // Note that the regexes are stateful. We utilize lastIndex and sync it
        // across the multiple regexes used. In addition to the five regexes below
        // we also dynamically create a regex to find the matching end tags for raw
        // text elements.
        /**
         * End of text is: `<` followed by:
         *   (comment start) or (tag) or (dynamic tag binding)
         */
        const textEndRegex =
          /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
        const COMMENT_START = 1;
        const TAG_NAME = 2;
        const DYNAMIC_TAG_NAME = 3;
        const commentEndRegex = /-->/g;
        /**
         * Comments not started with <!--, like </{, can be ended by a single `>`
         */
        const comment2EndRegex = />/g;
        /**
         * The tagEnd regex matches the end of the "inside an opening" tag syntax
         * position. It either matches a `>`, an attribute-like sequence, or the end
         * of the string after a space (attribute-name position ending).
         *
         * See attributes in the HTML spec:
         * https://www.w3.org/TR/html5/syntax.html#elements-attributes
         *
         * " \t\n\f\r" are HTML space characters:
         * https://infra.spec.whatwg.org/#ascii-whitespace
         *
         * So an attribute is:
         *  * The name: any character except a whitespace character, ("), ('), ">",
         *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
         *  * Followed by zero or more space characters
         *  * Followed by "="
         *  * Followed by zero or more space characters
         *  * Followed by:
         *    * Any character except space, ('), ("), "<", ">", "=", (`), or
         *    * (") then any non-("), or
         *    * (') then any non-(')
         */
        const tagEndRegex = new RegExp(
          `>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`,
          'g'
        );
        const ENTIRE_MATCH = 0;
        const ATTRIBUTE_NAME = 1;
        const SPACES_AND_EQUALS = 2;
        const QUOTE_CHAR = 3;
        const singleQuoteAttrEndRegex = /'/g;
        const doubleQuoteAttrEndRegex = /"/g;
        /**
         * Matches the raw text elements.
         *
         * Comments are not parsed within raw text elements, so we need to search their
         * text content for marker strings.
         */
        const rawTextElement = /^(?:script|style|textarea)$/i;
        /** TemplateResult types */
        const HTML_RESULT = 1;
        const SVG_RESULT = 2;
        // TemplatePart types
        // IMPORTANT: these must match the values in PartType
        const ATTRIBUTE_PART = 1;
        const CHILD_PART = 2;
        const PROPERTY_PART = 3;
        const BOOLEAN_ATTRIBUTE_PART = 4;
        const EVENT_PART = 5;
        const ELEMENT_PART = 6;
        const COMMENT_PART = 7;
        /**
         * Generates a template literal tag function that returns a TemplateResult with
         * the given result type.
         */
        const tag =
          (type) =>
          (strings, ...values) => {
            // Warn against templates octal escape sequences
            // We do this here rather than in render so that the warning is closer to the
            // template definition.
            if (DEV_MODE && strings.some((s) => s === undefined)) {
              console.warn(
                'Some template strings are undefined.\n' +
                  'This is probably caused by illegal octal escape sequences.'
              );
            }
            return {
              // This property needs to remain unminified.
              ['_$litType$']: type,
              strings,
              values,
            };
          };
        /**
         * Interprets a template literal as an HTML template that can efficiently
         * render to and update a container.
         *
         * ```ts
         * const header = (title: string) => html`<h1>${title}</h1>`;
         * ```
         *
         * The `html` tag returns a description of the DOM to render as a value. It is
         * lazy, meaning no work is done until the template is rendered. When rendering,
         * if a template comes from the same expression as a previously rendered result,
         * it's efficiently updated instead of replaced.
         */
        const html = tag(HTML_RESULT);
        /**
         * Interprets a template literal as an SVG template that can efficiently
         * render to and update a container.
         */
        const svg = tag(SVG_RESULT);
        /**
         * A sentinel value that signals that a value was handled by a directive and
         * should not be written to the DOM.
         */
        const noChange = Symbol.for('lit-noChange');
        /**
         * A sentinel value that signals a ChildPart to fully clear its content.
         *
         * ```ts
         * const button = html`${
         *  user.isAdmin
         *    ? html`<button>DELETE</button>`
         *    : nothing
         * }`;
         * ```
         *
         * Prefer using `nothing` over other falsy values as it provides a consistent
         * behavior between various expression binding contexts.
         *
         * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
         * same and render no nodes. In attribute expressions, `nothing` _removes_ the
         * attribute, while `undefined` and `null` will render an empty string. In
         * property expressions `nothing` becomes `undefined`.
         */
        const nothing = Symbol.for('lit-nothing');
        /**
         * The cache of prepared templates, keyed by the tagged TemplateStringsArray
         * and _not_ accounting for the specific template tag used. This means that
         * template tags cannot be dynamic - the must statically be one of html, svg,
         * or attr. This restriction simplifies the cache lookup, which is on the hot
         * path for rendering.
         */
        const templateCache = new WeakMap();
        /**
         * Renders a value, usually a lit-html TemplateResult, to the container.
         * @param value
         * @param container
         * @param options
         */
        const render = (value, container, options) => {
          var _a, _b, _c;
          const partOwnerNode =
            (_a =
              options === null || options === void 0
                ? void 0
                : options.renderBefore) !== null && _a !== void 0
              ? _a
              : container;
          // This property needs to remain unminified.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let part = partOwnerNode['_$litPart$'];
          if (part === undefined) {
            const endNode =
              (_b =
                options === null || options === void 0
                  ? void 0
                  : options.renderBefore) !== null && _b !== void 0
                ? _b
                : null;
            // Internal modification: don't clear container to match lit-html 2.0
            if (
              INTERNAL &&
              ((_c = options) === null || _c === void 0
                ? void 0
                : _c.clearContainerForLit2MigrationOnly) === true
            ) {
              let n = container.firstChild;
              // Clear only up to the `endNode` aka `renderBefore` node.
              while (n && n !== endNode) {
                const next = n.nextSibling;
                n.remove();
                n = next;
              }
            }
            // This property needs to remain unminified.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            partOwnerNode['_$litPart$'] = part = new ChildPart(
              container.insertBefore(createMarker(), endNode),
              endNode,
              undefined,
              options !== null && options !== void 0 ? options : {}
            );
          }
          part._$setValue(value);
          return part;
        };
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
          render.setSanitizer = setSanitizer;
          render.createSanitizer = createSanitizer;
          if (DEV_MODE) {
            render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
              _testOnlyClearSanitizerFactoryDoNotCallOrElse;
          }
        }
        const walker = d.createTreeWalker(
          d,
          129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */,
          null,
          false
        );
        let sanitizerFactoryInternal = noopSanitizer;
        /**
         * Returns an HTML string for the given TemplateStringsArray and result type
         * (HTML or SVG), along with the case-sensitive bound attribute names in
         * template order. The HTML contains comment comment markers denoting the
         * `ChildPart`s and suffixes on bound attributes denoting the `AttributeParts`.
         *
         * @param strings template strings array
         * @param type HTML or SVG
         * @return Array containing `[html, attrNames]` (array returned for terseness,
         *     to avoid object fields since this code is shared with non-minified SSR
         *     code)
         */
        const getTemplateHtml = (strings, type) => {
          // Insert makers into the template HTML to represent the position of
          // bindings. The following code scans the template strings to determine the
          // syntactic position of the bindings. They can be in text position, where
          // we insert an HTML comment, attribute value position, where we insert a
          // sentinel string and re-write the attribute name, or inside a tag where
          // we insert the sentinel string.
          const l = strings.length - 1;
          // Stores the case-sensitive bound attribute names in the order of their
          // parts. ElementParts are also reflected in this array as undefined
          // rather than a string, to disambiguate from attribute bindings.
          const attrNames = [];
          let html = type === SVG_RESULT ? '<svg>' : '';
          // When we're inside a raw text tag (not it's text content), the regex
          // will still be tagRegex so we can find attributes, but will switch to
          // this regex when the tag ends.
          let rawTextEndRegex;
          // The current parsing state, represented as a reference to one of the
          // regexes
          let regex = textEndRegex;
          for (let i = 0; i < l; i++) {
            const s = strings[i];
            // The index of the end of the last attribute name. When this is
            // positive at end of a string, it means we're in an attribute value
            // position and need to rewrite the attribute name.
            // We also use a special value of -2 to indicate that we encountered
            // the end of a string in attribute name position.
            let attrNameEndIndex = -1;
            let attrName;
            let lastIndex = 0;
            let match;
            // The conditions in this loop handle the current parse state, and the
            // assignments to the `regex` variable are the state transitions.
            while (lastIndex < s.length) {
              // Make sure we start searching from where we previously left off
              regex.lastIndex = lastIndex;
              match = regex.exec(s);
              if (match === null) {
                break;
              }
              lastIndex = regex.lastIndex;
              if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                  regex = commentEndRegex;
                } else if (match[COMMENT_START] !== undefined) {
                  // We started a weird comment, like </{
                  regex = comment2EndRegex;
                } else if (match[TAG_NAME] !== undefined) {
                  if (rawTextElement.test(match[TAG_NAME])) {
                    // Record if we encounter a raw-text element. We'll switch to
                    // this regex at the end of the tag.
                    rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                  }
                  regex = tagEndRegex;
                } else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                  if (DEV_MODE) {
                    throw new Error(
                      'Bindings in tag names are not supported. Please use static templates instead. ' +
                        'See https://lit.dev/docs/templates/expressions/#static-expressions'
                    );
                  }
                  regex = tagEndRegex;
                }
              } else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                  // End of a tag. If we had started a raw-text element, use that
                  // regex
                  regex =
                    rawTextEndRegex !== null && rawTextEndRegex !== void 0
                      ? rawTextEndRegex
                      : textEndRegex;
                  // We may be ending an unquoted attribute value, so make sure we
                  // clear any pending attrNameEndIndex
                  attrNameEndIndex = -1;
                } else if (match[ATTRIBUTE_NAME] === undefined) {
                  // Attribute name position
                  attrNameEndIndex = -2;
                } else {
                  attrNameEndIndex =
                    regex.lastIndex - match[SPACES_AND_EQUALS].length;
                  attrName = match[ATTRIBUTE_NAME];
                  regex =
                    match[QUOTE_CHAR] === undefined
                      ? tagEndRegex
                      : match[QUOTE_CHAR] === '"'
                      ? doubleQuoteAttrEndRegex
                      : singleQuoteAttrEndRegex;
                }
              } else if (
                regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex
              ) {
                regex = tagEndRegex;
              } else if (
                regex === commentEndRegex ||
                regex === comment2EndRegex
              ) {
                regex = textEndRegex;
              } else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
              }
            }
            if (DEV_MODE) {
              // If we have a attrNameEndIndex, which indicates that we should
              // rewrite the attribute name, assert that we're in a valid attribute
              // position - either in a tag, or a quoted attribute value.
              console.assert(
                attrNameEndIndex === -1 ||
                  regex === tagEndRegex ||
                  regex === singleQuoteAttrEndRegex ||
                  regex === doubleQuoteAttrEndRegex,
                'unexpected parse state B'
              );
            }
            // We have four cases:
            //  1. We're in text position, and not in a raw text element
            //     (regex === textEndRegex): insert a comment marker.
            //  2. We have a non-negative attrNameEndIndex which means we need to
            //     rewrite the attribute name to add a bound attribute suffix.
            //  3. We're at the non-first binding in a multi-binding attribute, use a
            //     plain marker.
            //  4. We're somewhere else inside the tag. If we're in attribute name
            //     position (attrNameEndIndex === -2), add a sequential suffix to
            //     generate a unique attribute name.
            // Detect a binding next to self-closing tag end and insert a space to
            // separate the marker from the tag end:
            const end =
              regex === tagEndRegex && strings[i + 1].startsWith('/>')
                ? ' '
                : '';
            html +=
              regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                ? (attrNames.push(attrName),
                  s.slice(0, attrNameEndIndex) +
                    boundAttributeSuffix +
                    s.slice(attrNameEndIndex)) +
                  marker +
                  end
                : s +
                  marker +
                  (attrNameEndIndex === -2
                    ? (attrNames.push(undefined), i)
                    : end);
          }
          const htmlResult =
            html +
            (strings[l] || '<?>') +
            (type === SVG_RESULT ? '</svg>' : '');
          // Returned as an array for terseness
          return [
            policy !== undefined ? policy.createHTML(htmlResult) : htmlResult,
            attrNames,
          ];
        };
        class Template {
          constructor(
            // This property needs to remain unminified.
            { strings, ['_$litType$']: type },
            options
          ) {
            /** @internal */
            this.parts = [];
            let node;
            let nodeIndex = 0;
            let attrNameIndex = 0;
            const partCount = strings.length - 1;
            const parts = this.parts;
            // Create template element
            const [html, attrNames] = getTemplateHtml(strings, type);
            this.el = Template.createElement(html, options);
            walker.currentNode = this.el.content;
            // Reparent SVG nodes into template root
            if (type === SVG_RESULT) {
              const content = this.el.content;
              const svgElement = content.firstChild;
              svgElement.remove();
              content.append(...svgElement.childNodes);
            }
            // Walk the template to find binding markers and create TemplateParts
            while (
              (node = walker.nextNode()) !== null &&
              parts.length < partCount
            ) {
              if (node.nodeType === 1) {
                if (DEV_MODE) {
                  const tag = node.localName;
                  // Warn if `textarea` includes an expression and throw if `template`
                  // does since these are not supported. We do this by checking
                  // innerHTML for anything that looks like a marker. This catches
                  // cases like bindings in textarea there markers turn into text nodes.
                  if (
                    /^(?:textarea|template)$/i.test(tag) &&
                    node.innerHTML.includes(marker)
                  ) {
                    const m =
                      `Expressions are not supported inside \`${tag}\` ` +
                      `elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
                      `information.`;
                    if (tag === 'template') {
                      throw new Error(m);
                    } else issueWarning('', m);
                  }
                }
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                  // We defer removing bound attributes because on IE we might not be
                  // iterating attributes in their template order, and would sometimes
                  // remove an attribute that we still need to create a part for.
                  const attrsToRemove = [];
                  for (const name of node.getAttributeNames()) {
                    // `name` is the name of the attribute we're iterating over, but not
                    // _neccessarily_ the name of the attribute we will create a part
                    // for. They can be different in browsers that don't iterate on
                    // attributes in source order. In that case the attrNames array
                    // contains the attribute name we'll process next. We only need the
                    // attribute name here to know if we should process a bound attribute
                    // on this element.
                    if (
                      name.endsWith(boundAttributeSuffix) ||
                      name.startsWith(marker)
                    ) {
                      const realName = attrNames[attrNameIndex++];
                      attrsToRemove.push(name);
                      if (realName !== undefined) {
                        // Lowercase for case-sensitive SVG attributes like viewBox
                        const value = node.getAttribute(
                          realName.toLowerCase() + boundAttributeSuffix
                        );
                        const statics = value.split(marker);
                        const m = /([.?@])?(.*)/.exec(realName);
                        parts.push({
                          type: ATTRIBUTE_PART,
                          index: nodeIndex,
                          name: m[2],
                          strings: statics,
                          ctor:
                            m[1] === '.'
                              ? PropertyPart
                              : m[1] === '?'
                              ? BooleanAttributePart
                              : m[1] === '@'
                              ? EventPart
                              : AttributePart,
                        });
                      } else {
                        parts.push({
                          type: ELEMENT_PART,
                          index: nodeIndex,
                        });
                      }
                    }
                  }
                  for (const name of attrsToRemove) {
                    node.removeAttribute(name);
                  }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                  // For raw text elements we need to split the text content on
                  // markers, create a Text node for each segment, and create
                  // a TemplatePart for each marker.
                  const strings = node.textContent.split(marker);
                  const lastIndex = strings.length - 1;
                  if (lastIndex > 0) {
                    node.textContent = trustedTypes
                      ? trustedTypes.emptyScript
                      : '';
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    // We can't use empty text nodes as markers because they're
                    // normalized when cloning in IE (could simplify when
                    // IE is no longer supported)
                    for (let i = 0; i < lastIndex; i++) {
                      node.append(strings[i], createMarker());
                      // Walk past the marker node we just added
                      walker.nextNode();
                      parts.push({ type: CHILD_PART, index: ++nodeIndex });
                    }
                    // Note because this marker is added after the walker's current
                    // node, it will be walked to in the outer loop (and ignored), so
                    // we don't need to adjust nodeIndex here
                    node.append(strings[lastIndex], createMarker());
                  }
                }
              } else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                  parts.push({ type: CHILD_PART, index: nodeIndex });
                } else {
                  let i = -1;
                  while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                    // Comment node has a binding marker inside, make an inactive part
                    // The binding won't work, but subsequent bindings will
                    parts.push({ type: COMMENT_PART, index: nodeIndex });
                    // Move to the end of the match
                    i += marker.length - 1;
                  }
                }
              }
              nodeIndex++;
            }
          }
          // Overridden via `litHtmlPolyfillSupport` to provide platform support.
          /** @nocollapse */
          static createElement(html, _options) {
            const el = d.createElement('template');
            el.innerHTML = html;
            return el;
          }
        }
        function resolveDirective(part, value, parent = part, attributeIndex) {
          var _a, _b, _c;
          var _d;
          // Bail early if the value is explicitly noChange. Note, this means any
          // nested directive is still attached and is not run.
          if (value === noChange) {
            return value;
          }
          let currentDirective =
            attributeIndex !== undefined
              ? (_a = parent.__directives) === null || _a === void 0
                ? void 0
                : _a[attributeIndex]
              : parent.__directive;
          const nextDirectiveConstructor = isPrimitive(value)
            ? undefined
            : // This property needs to remain unminified.
              value['_$litDirective$'];
          if (
            (currentDirective === null || currentDirective === void 0
              ? void 0
              : currentDirective.constructor) !== nextDirectiveConstructor
          ) {
            // This property needs to remain unminified.
            (_b =
              currentDirective === null || currentDirective === void 0
                ? void 0
                : currentDirective['_$notifyDirectiveConnectionChanged']) ===
              null || _b === void 0
              ? void 0
              : _b.call(currentDirective, false);
            if (nextDirectiveConstructor === undefined) {
              currentDirective = undefined;
            } else {
              currentDirective = new nextDirectiveConstructor(part);
              currentDirective._$initialize(part, parent, attributeIndex);
            }
            if (attributeIndex !== undefined) {
              ((_c = (_d = parent).__directives) !== null && _c !== void 0
                ? _c
                : (_d.__directives = []))[attributeIndex] = currentDirective;
            } else {
              parent.__directive = currentDirective;
            }
          }
          if (currentDirective !== undefined) {
            value = resolveDirective(
              part,
              currentDirective._$resolve(part, value.values),
              currentDirective,
              attributeIndex
            );
          }
          return value;
        }
        /**
         * An updateable instance of a Template. Holds references to the Parts used to
         * update the template instance.
         */
        class TemplateInstance {
          constructor(template, parent) {
            /** @internal */
            this._parts = [];
            /** @internal */
            this._$disconnectableChildren = undefined;
            this._$template = template;
            this._$parent = parent;
          }
          // Called by ChildPart parentNode getter
          get parentNode() {
            return this._$parent.parentNode;
          }
          // See comment in Disconnectable interface for why this is a getter
          get _$isConnected() {
            return this._$parent._$isConnected;
          }
          // This method is separate from the constructor because we need to return a
          // DocumentFragment and we don't want to hold onto it with an instance field.
          _clone(options) {
            var _a;
            const {
              el: { content },
              parts: parts,
            } = this._$template;
            const fragment = (
              (_a =
                options === null || options === void 0
                  ? void 0
                  : options.creationScope) !== null && _a !== void 0
                ? _a
                : d
            ).importNode(content, true);
            walker.currentNode = fragment;
            let node = walker.nextNode();
            let nodeIndex = 0;
            let partIndex = 0;
            let templatePart = parts[0];
            while (templatePart !== undefined) {
              if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                  part = new ChildPart(node, node.nextSibling, this, options);
                } else if (templatePart.type === ATTRIBUTE_PART) {
                  part = new templatePart.ctor(
                    node,
                    templatePart.name,
                    templatePart.strings,
                    this,
                    options
                  );
                } else if (templatePart.type === ELEMENT_PART) {
                  part = new ElementPart(node, this, options);
                }
                this._parts.push(part);
                templatePart = parts[++partIndex];
              }
              if (
                nodeIndex !==
                (templatePart === null || templatePart === void 0
                  ? void 0
                  : templatePart.index)
              ) {
                node = walker.nextNode();
                nodeIndex++;
              }
            }
            return fragment;
          }
          _update(values) {
            let i = 0;
            for (const part of this._parts) {
              if (part !== undefined) {
                if (part.strings !== undefined) {
                  part._$setValue(values, part, i);
                  // The number of values the part consumes is part.strings.length - 1
                  // since values are in between template spans. We increment i by 1
                  // later in the loop, so increment it by part.strings.length - 2 here
                  i += part.strings.length - 2;
                } else {
                  part._$setValue(values[i]);
                }
              }
              i++;
            }
          }
        }
        class ChildPart {
          constructor(startNode, endNode, parent, options) {
            var _a;
            this.type = CHILD_PART;
            this._$committedValue = nothing;
            // The following fields will be patched onto ChildParts when required by
            // AsyncDirective
            /** @internal */
            this._$disconnectableChildren = undefined;
            this._$startNode = startNode;
            this._$endNode = endNode;
            this._$parent = parent;
            this.options = options;
            // Note __isConnected is only ever accessed on RootParts (i.e. when there is
            // no _$parent); the value on a non-root-part is "don't care", but checking
            // for parent would be more code
            this.__isConnected =
              (_a =
                options === null || options === void 0
                  ? void 0
                  : options.isConnected) !== null && _a !== void 0
                ? _a
                : true;
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
              // Explicitly initialize for consistent class shape.
              this._textSanitizer = undefined;
            }
          }
          // See comment in Disconnectable interface for why this is a getter
          get _$isConnected() {
            var _a, _b;
            // ChildParts that are not at the root should always be created with a
            // parent; only RootChildNode's won't, so they return the local isConnected
            // state
            return (_b =
              (_a = this._$parent) === null || _a === void 0
                ? void 0
                : _a._$isConnected) !== null && _b !== void 0
              ? _b
              : this.__isConnected;
          }
          /**
           * The parent node into which the part renders its content.
           *
           * A ChildPart's content consists of a range of adjacent child nodes of
           * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
           * `.endNode`).
           *
           * - If both `.startNode` and `.endNode` are non-null, then the part's content
           * consists of all siblings between `.startNode` and `.endNode`, exclusively.
           *
           * - If `.startNode` is non-null but `.endNode` is null, then the part's
           * content consists of all siblings following `.startNode`, up to and
           * including the last child of `.parentNode`. If `.endNode` is non-null, then
           * `.startNode` will always be non-null.
           *
           * - If both `.endNode` and `.startNode` are null, then the part's content
           * consists of all child nodes of `.parentNode`.
           */
          get parentNode() {
            let parentNode = wrap(this._$startNode).parentNode;
            const parent = this._$parent;
            if (
              parent !== undefined &&
              parentNode.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */
            ) {
              // If the parentNode is a DocumentFragment, it may be because the DOM is
              // still in the cloned fragment during initial render; if so, get the real
              // parentNode the part will be committed into by asking the parent.
              parentNode = parent.parentNode;
            }
            return parentNode;
          }
          /**
           * The part's leading marker node, if any. See `.parentNode` for more
           * information.
           */
          get startNode() {
            return this._$startNode;
          }
          /**
           * The part's trailing marker node, if any. See `.parentNode` for more
           * information.
           */
          get endNode() {
            return this._$endNode;
          }
          _$setValue(value, directiveParent = this) {
            if (DEV_MODE && this.parentNode === null) {
              throw new Error(
                `This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`
              );
            }
            value = resolveDirective(this, value, directiveParent);
            if (isPrimitive(value)) {
              // Non-rendering child values. It's important that these do not render
              // empty text nodes to avoid issues with preventing default <slot>
              // fallback content.
              if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                  this._$clear();
                }
                this._$committedValue = nothing;
              } else if (
                value !== this._$committedValue &&
                value !== noChange
              ) {
                this._commitText(value);
              }
              // This property needs to remain unminified.
            } else if (value['_$litType$'] !== undefined) {
              this._commitTemplateResult(value);
            } else if (value.nodeType !== undefined) {
              this._commitNode(value);
            } else if (isIterable(value)) {
              this._commitIterable(value);
            } else {
              // Fallback, will render the string representation
              this._commitText(value);
            }
          }
          _insert(node, ref = this._$endNode) {
            return wrap(wrap(this._$startNode).parentNode).insertBefore(
              node,
              ref
            );
          }
          _commitNode(value) {
            var _a;
            if (this._$committedValue !== value) {
              this._$clear();
              if (
                ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer
              ) {
                const parentNodeName =
                  (_a = this._$startNode.parentNode) === null || _a === void 0
                    ? void 0
                    : _a.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                  let message = 'Forbidden';
                  if (DEV_MODE) {
                    if (parentNodeName === 'STYLE') {
                      message =
                        `Lit does not support binding inside style nodes. ` +
                        `This is a security risk, as style injection attacks can ` +
                        `exfiltrate data and spoof UIs. ` +
                        `Consider instead using css\`...\` literals ` +
                        `to compose styles, and make do dynamic styling with ` +
                        `css custom properties, ::parts, <slot>s, ` +
                        `and by mutating the DOM rather than stylesheets.`;
                    } else {
                      message =
                        `Lit does not support binding inside script nodes. ` +
                        `This is a security risk, as it could allow arbitrary ` +
                        `code execution.`;
                    }
                  }
                  throw new Error(message);
                }
              }
              this._$committedValue = this._insert(value);
            }
          }
          _commitText(value) {
            // If the committed value is a primitive it means we called _commitText on
            // the previous render, and we know that this._$startNode.nextSibling is a
            // Text node. We can now just replace the text content (.data) of the node.
            if (
              this._$committedValue !== nothing &&
              isPrimitive(this._$committedValue)
            ) {
              const node = wrap(this._$startNode).nextSibling;
              if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                  this._textSanitizer = createSanitizer(
                    node,
                    'data',
                    'property'
                  );
                }
                value = this._textSanitizer(value);
              }
              node.data = value;
            } else {
              if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = document.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its contentx.
                if (this._textSanitizer === undefined) {
                  this._textSanitizer = createSanitizer(
                    textNode,
                    'data',
                    'property'
                  );
                }
                value = this._textSanitizer(value);
                textNode.data = value;
              } else {
                this._commitNode(d.createTextNode(value));
              }
            }
            this._$committedValue = value;
          }
          _commitTemplateResult(result) {
            var _a;
            // This property needs to remain unminified.
            const { values, ['_$litType$']: type } = result;
            // If $litType$ is a number, result is a plain TemplateResult and we get
            // the template from the template cache. If not, result is a
            // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
            // to create the <template> element the first time we see it.
            const template =
              typeof type === 'number'
                ? this._$getTemplate(result)
                : (type.el === undefined &&
                    (type.el = Template.createElement(type.h, this.options)),
                  type);
            if (
              ((_a = this._$committedValue) === null || _a === void 0
                ? void 0
                : _a._$template) === template
            ) {
              this._$committedValue._update(values);
            } else {
              const instance = new TemplateInstance(template, this);
              const fragment = instance._clone(this.options);
              instance._update(values);
              this._commitNode(fragment);
              this._$committedValue = instance;
            }
          }
          // Overridden via `litHtmlPolyfillSupport` to provide platform support.
          /** @internal */
          _$getTemplate(result) {
            let template = templateCache.get(result.strings);
            if (template === undefined) {
              templateCache.set(
                result.strings,
                (template = new Template(result))
              );
            }
            return template;
          }
          _commitIterable(value) {
            // For an Iterable, we create a new InstancePart per item, then set its
            // value to the item. This is a little bit of overhead for every item in
            // an Iterable, but it lets us recurse easily and efficiently update Arrays
            // of TemplateResults that will be commonly returned from expressions like:
            // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
            // If value is an array, then the previous render was of an
            // iterable and value will contain the ChildParts from the previous
            // render. If value is not an array, clear this part and make a new
            // array for ChildParts.
            if (!isArray(this._$committedValue)) {
              this._$committedValue = [];
              this._$clear();
            }
            // Lets us keep track of how many items we stamped so we can clear leftover
            // items from a previous render
            const itemParts = this._$committedValue;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
              if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push(
                  (itemPart = new ChildPart(
                    this._insert(createMarker()),
                    this._insert(createMarker()),
                    this,
                    this.options
                  ))
                );
              } else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
              }
              itemPart._$setValue(item);
              partIndex++;
            }
            if (partIndex < itemParts.length) {
              // itemParts always have end nodes
              this._$clear(
                itemPart && wrap(itemPart._$endNode).nextSibling,
                partIndex
              );
              // Truncate the parts array so _value reflects the current state
              itemParts.length = partIndex;
            }
          }
          /**
           * Removes the nodes contained within this Part from the DOM.
           *
           * @param start Start node to clear from, for clearing a subset of the part's
           *     DOM (used when truncating iterables)
           * @param from  When `start` is specified, the index within the iterable from
           *     which ChildParts are being removed, used for disconnecting directives in
           *     those Parts.
           *
           * @internal
           */
          _$clear(start = wrap(this._$startNode).nextSibling, from) {
            var _a;
            (_a = this._$notifyConnectionChanged) === null || _a === void 0
              ? void 0
              : _a.call(this, false, true, from);
            while (start && start !== this._$endNode) {
              const n = wrap(start).nextSibling;
              wrap(start).remove();
              start = n;
            }
          }
          /**
           * Implementation of RootPart's `isConnected`. Note that this metod
           * should only be called on `RootPart`s (the `ChildPart` returned from a
           * top-level `render()` call). It has no effect on non-root ChildParts.
           * @param isConnected Whether to set
           * @internal
           */
          setConnected(isConnected) {
            var _a;
            if (this._$parent === undefined) {
              this.__isConnected = isConnected;
              (_a = this._$notifyConnectionChanged) === null || _a === void 0
                ? void 0
                : _a.call(this, isConnected);
            } else if (DEV_MODE) {
              throw new Error(
                'part.setConnected() may only be called on a ' +
                  'RootPart returned from render().'
              );
            }
          }
        }
        class AttributePart {
          constructor(element, name, strings, parent, options) {
            this.type = ATTRIBUTE_PART;
            /** @internal */
            this._$committedValue = nothing;
            /** @internal */
            this._$disconnectableChildren = undefined;
            this.element = element;
            this.name = name;
            this._$parent = parent;
            this.options = options;
            if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
              this._$committedValue = new Array(strings.length - 1).fill(
                new String()
              );
              this.strings = strings;
            } else {
              this._$committedValue = nothing;
            }
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
              this._sanitizer = undefined;
            }
          }
          get tagName() {
            return this.element.tagName;
          }
          // See comment in Disconnectable interface for why this is a getter
          get _$isConnected() {
            return this._$parent._$isConnected;
          }
          /**
           * Sets the value of this part by resolving the value from possibly multiple
           * values and static strings and committing it to the DOM.
           * If this part is single-valued, `this._strings` will be undefined, and the
           * method will be called with a single value argument. If this part is
           * multi-value, `this._strings` will be defined, and the method is called
           * with the value array of the part's owning TemplateInstance, and an offset
           * into the value array from which the values should be read.
           * This method is overloaded this way to eliminate short-lived array slices
           * of the template instance values, and allow a fast-path for single-valued
           * parts.
           *
           * @param value The part value, or an array of values for multi-valued parts
           * @param valueIndex the index to start reading values from. `undefined` for
           *   single-valued parts
           * @param noCommit causes the part to not commit its value to the DOM. Used
           *   in hydration to prime attribute parts with their first-rendered value,
           *   but not set the attribute, and in SSR to no-op the DOM operation and
           *   capture the value for serialization.
           *
           * @internal
           */
          _$setValue(value, directiveParent = this, valueIndex, noCommit) {
            const strings = this.strings;
            // Whether any of the values has changed, for dirty-checking
            let change = false;
            if (strings === undefined) {
              // Single-value binding case
              value = resolveDirective(this, value, directiveParent, 0);
              change =
                !isPrimitive(value) ||
                (value !== this._$committedValue && value !== noChange);
              if (change) {
                this._$committedValue = value;
              }
            } else {
              // Interpolation case
              const values = value;
              value = strings[0];
              let i, v;
              for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(
                  this,
                  values[valueIndex + i],
                  directiveParent,
                  i
                );
                if (v === noChange) {
                  // If the user-provided value is `noChange`, use the previous value
                  v = this._$committedValue[i];
                }
                change ||
                  (change = !isPrimitive(v) || v !== this._$committedValue[i]);
                if (v === nothing) {
                  value = nothing;
                } else if (value !== nothing) {
                  value +=
                    (v !== null && v !== void 0 ? v : '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
              }
            }
            if (change && !noCommit) {
              this._commitValue(value);
            }
          }
          /** @internal */
          _commitValue(value) {
            if (value === nothing) {
              wrap(this.element).removeAttribute(this.name);
            } else {
              if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                  this._sanitizer = sanitizerFactoryInternal(
                    this.element,
                    this.name,
                    'attribute'
                  );
                }
                value = this._sanitizer(
                  value !== null && value !== void 0 ? value : ''
                );
              }
              wrap(this.element).setAttribute(
                this.name,
                value !== null && value !== void 0 ? value : ''
              );
            }
          }
        }
        class PropertyPart extends AttributePart {
          constructor() {
            super(...arguments);
            this.type = PROPERTY_PART;
          }
          /** @internal */
          _commitValue(value) {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
              if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(
                  this.element,
                  this.name,
                  'property'
                );
              }
              value = this._sanitizer(value);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = value === nothing ? undefined : value;
          }
        }
        class BooleanAttributePart extends AttributePart {
          constructor() {
            super(...arguments);
            this.type = BOOLEAN_ATTRIBUTE_PART;
          }
          /** @internal */
          _commitValue(value) {
            if (value && value !== nothing) {
              wrap(this.element).setAttribute(this.name, '');
            } else {
              wrap(this.element).removeAttribute(this.name);
            }
          }
        }
        class EventPart extends AttributePart {
          constructor(element, name, strings, parent, options) {
            super(element, name, strings, parent, options);
            this.type = EVENT_PART;
            if (DEV_MODE && this.strings !== undefined) {
              throw new Error(
                `A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                  'invalid content. Event listeners in templates must have exactly ' +
                  'one expression and no surrounding text.'
              );
            }
          }
          // EventPart does not use the base _$setValue/_resolveValue implementation
          // since the dirty checking is more complex
          /** @internal */
          _$setValue(newListener, directiveParent = this) {
            var _a;
            newListener =
              (_a = resolveDirective(this, newListener, directiveParent, 0)) !==
                null && _a !== void 0
                ? _a
                : nothing;
            if (newListener === noChange) {
              return;
            }
            const oldListener = this._$committedValue;
            // If the new value is nothing or any options change we have to remove the
            // part as a listener.
            const shouldRemoveListener =
              (newListener === nothing && oldListener !== nothing) ||
              newListener.capture !== oldListener.capture ||
              newListener.once !== oldListener.once ||
              newListener.passive !== oldListener.passive;
            // If the new value is not nothing and we removed the listener, we have
            // to add the part as a listener.
            const shouldAddListener =
              newListener !== nothing &&
              (oldListener === nothing || shouldRemoveListener);
            if (shouldRemoveListener) {
              this.element.removeEventListener(this.name, this, oldListener);
            }
            if (shouldAddListener) {
              // Beware: IE11 and Chrome 41 don't like using the listener as the
              // options object. Figure out how to deal w/ this in IE11 - maybe
              // patch addEventListener?
              this.element.addEventListener(this.name, this, newListener);
            }
            this._$committedValue = newListener;
          }
          handleEvent(event) {
            var _a, _b;
            if (typeof this._$committedValue === 'function') {
              this._$committedValue.call(
                (_b =
                  (_a = this.options) === null || _a === void 0
                    ? void 0
                    : _a.host) !== null && _b !== void 0
                  ? _b
                  : this.element,
                event
              );
            } else {
              this._$committedValue.handleEvent(event);
            }
          }
        }
        class ElementPart {
          constructor(element, parent, options) {
            this.element = element;
            this.type = ELEMENT_PART;
            /** @internal */
            this._$disconnectableChildren = undefined;
            this._$parent = parent;
            this.options = options;
          }
          // See comment in Disconnectable interface for why this is a getter
          get _$isConnected() {
            return this._$parent._$isConnected;
          }
          _$setValue(value) {
            resolveDirective(this, value);
          }
        }
        /**
         * END USERS SHOULD NOT RELY ON THIS OBJECT.
         *
         * Private exports for use by other Lit packages, not intended for use by
         * external users.
         *
         * We currently do not make a mangled rollup build of the lit-ssr code. In order
         * to keep a number of (otherwise private) top-level exports  mangled in the
         * client side code, we export a _$LH object containing those members (or
         * helper methods for accessing private fields of those members), and then
         * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
         * client-side code is being used in `dev` mode or `prod` mode.
         *
         * This has a unique name, to disambiguate it from private exports in
         * lit-element, which re-exports all of lit-html.
         *
         * @private
         */
        const _$LH = {
          // Used in lit-ssr
          _boundAttributeSuffix: boundAttributeSuffix,
          _marker: marker,
          _markerMatch: markerMatch,
          _HTML_RESULT: HTML_RESULT,
          _getTemplateHtml: getTemplateHtml,
          // Used in hydrate
          _TemplateInstance: TemplateInstance,
          _isIterable: isIterable,
          _resolveDirective: resolveDirective,
          // Used in tests and private-ssr-support
          _ChildPart: ChildPart,
          _AttributePart: AttributePart,
          _BooleanAttributePart: BooleanAttributePart,
          _EventPart: EventPart,
          _PropertyPart: PropertyPart,
          _ElementPart: ElementPart,
        };
        // Apply polyfills if available
        const polyfillSupport = DEV_MODE
          ? window.litHtmlPolyfillSupportDevMode
          : window.litHtmlPolyfillSupport;
        polyfillSupport === null || polyfillSupport === void 0
          ? void 0
          : polyfillSupport(Template, ChildPart);
        // IMPORTANT: do not change the property name or the assignment expression.
        // This line will be used in regexes to search for lit-html usage.
        ((_d = globalThis.litHtmlVersions) !== null && _d !== void 0
          ? _d
          : (globalThis.litHtmlVersions = [])
        ).push('2.0.1');
        if (DEV_MODE && globalThis.litHtmlVersions.length > 1) {
          issueWarning(
            'multiple-versions',
            `Multiple versions of Lit loaded. ` +
              `Loading multiple versions is not recommended.`
          );
        }
        //# sourceMappingURL=lit-html.js.map

        /***/
      },

    /***/ './node_modules/lit/directives/class-map.js':
      /*!**************************************************!*\
      !*** ./node_modules/lit/directives/class-map.js ***!
      \**************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ classMap: () =>
            /* reexport safe */ lit_html_directives_class_map_js__WEBPACK_IMPORTED_MODULE_0__.classMap,
          /* harmony export */
        });
        /* harmony import */ var lit_html_directives_class_map_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! lit-html/directives/class-map.js */ './node_modules/lit-html/development/directives/class-map.js'
          );

        //# sourceMappingURL=class-map.js.map

        /***/
      },

    /***/ './node_modules/lit/directives/if-defined.js':
      /*!***************************************************!*\
      !*** ./node_modules/lit/directives/if-defined.js ***!
      \***************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ifDefined: () =>
            /* reexport safe */ lit_html_directives_if_defined_js__WEBPACK_IMPORTED_MODULE_0__.ifDefined,
          /* harmony export */
        });
        /* harmony import */ var lit_html_directives_if_defined_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! lit-html/directives/if-defined.js */ './node_modules/lit-html/development/directives/if-defined.js'
          );

        //# sourceMappingURL=if-defined.js.map

        /***/
      },

    /***/ './node_modules/lit/directives/style-map.js':
      /*!**************************************************!*\
      !*** ./node_modules/lit/directives/style-map.js ***!
      \**************************************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ styleMap: () =>
            /* reexport safe */ lit_html_directives_style_map_js__WEBPACK_IMPORTED_MODULE_0__.styleMap,
          /* harmony export */
        });
        /* harmony import */ var lit_html_directives_style_map_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! lit-html/directives/style-map.js */ './node_modules/lit-html/development/directives/style-map.js'
          );

        //# sourceMappingURL=style-map.js.map

        /***/
      },

    /***/ './node_modules/lit/index.js':
      /*!***********************************!*\
      !*** ./node_modules/lit/index.js ***!
      \***********************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CSSResult: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult,
          /* harmony export */ INTERNAL: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.INTERNAL,
          /* harmony export */ LitElement: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement,
          /* harmony export */ ReactiveElement: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement,
          /* harmony export */ UpdatingElement: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.UpdatingElement,
          /* harmony export */ _$LE: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE,
          /* harmony export */ _$LH: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH,
          /* harmony export */ adoptStyles: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles,
          /* harmony export */ css: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css,
          /* harmony export */ defaultConverter: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter,
          /* harmony export */ getCompatibleStyle: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle,
          /* harmony export */ html: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html,
          /* harmony export */ noChange: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange,
          /* harmony export */ notEqual: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual,
          /* harmony export */ nothing: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing,
          /* harmony export */ render: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render,
          /* harmony export */ supportsAdoptingStyleSheets: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets,
          /* harmony export */ svg: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg,
          /* harmony export */ unsafeCSS: () =>
            /* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS,
          /* harmony export */
        });
        /* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @lit/reactive-element */ './node_modules/@lit/reactive-element/development/reactive-element.js'
          );
        /* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! lit-html */ './node_modules/lit-html/development/lit-html.js'
          );
        /* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! lit-element/lit-element.js */ './node_modules/lit-element/development/lit-element.js'
          );

        //# sourceMappingURL=index.js.map

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
  (() => {
    var __webpack_exports__ = {};
    /*!**********************!*\
      !*** ./src/index.js ***!
      \**********************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _ucd_lib_theme_elements_brand_ucd_theme_header_ucd_theme_header_js__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(
        /*! @ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.js */ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-header/ucd-theme-header.js'
      );
    /* harmony import */ var _ucd_lib_theme_elements_brand_ucd_theme_primary_nav_ucd_theme_primary_nav_js__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(
        /*! @ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.js */ './node_modules/@ucd-lib/theme-elements/brand/ucd-theme-primary-nav/ucd-theme-primary-nav.js'
      );
    // UCD Theme Custom Elements

    //import '@ucd-lib/theme-elements/brand/ucd-theme-search-popup/ucd-theme-search-popup.js';
    // import '@ucd-lib/theme-elements/brand/ucd-theme-quick-links/ucd-theme-quick-links.js';
    // import '@ucd-lib/theme-elements/ucdlib/ucdlib-branding-bar/ucdlib-branding-bar.js';
    // import '@ucd-lib/theme-elements/brand/ucd-theme-subnav/ucd-theme-subnav.js';

    // Custom Libguides Custom Elements
    // import './js/elements/ucdlib-lg-sidenav/ucdlib-lg-sidenav.js';

    // Other Custom JS
    // import './js/app/main.js';
  })();

  // This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
  (() => {
    /*!*****************************!*\
      !*** ./src/scss/style.scss ***!
      \*****************************/
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
  })();

  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWlDO0FBQ3dCOztBQUtQOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFNBQVM7QUFDdkIsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSw2QkFBNkIsMkNBQVU7QUFDdEQ7QUFDQSx5QkFBeUIsMEVBQTBCO0FBQ25ELGFBQWEsOERBQWM7O0FBRTNCO0FBQ0E7QUFDQSxpQkFBaUIscUNBQXFDO0FBQ3RELGVBQWUsYUFBYTtBQUM1QixrQkFBa0Isc0NBQXNDO0FBQ3hELGdCQUFnQixvQ0FBb0M7QUFDcEQsZUFBZSxjQUFjO0FBQzdCLHFCQUFxQiwwQ0FBMEM7QUFDL0QsZUFBZSxvQ0FBb0M7QUFDbkQsdUJBQXVCLDJCQUEyQjtBQUNsRCw0QkFBNEIsMkJBQTJCO0FBQ3ZELHVCQUF1QiwyQkFBMkI7QUFDbEQsbUJBQW1CLDJCQUEyQjtBQUM5QywyQkFBMkI7QUFDM0I7QUFDQTs7QUFFQTtBQUNBLFdBQVcsZ0VBQU07QUFDakI7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixpRUFBVzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsOEVBQThCLFNBQVM7QUFDN0U7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RixjQUFjOztBQUV2Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzUWdDO0FBQ3VCOztBQUVzQjtBQUNIO0FBQ0k7QUFDSTtBQUNEO0FBQ0Q7QUFDSTs7QUFFN0U7QUFDUCx3QkFBd0Isb0NBQUc7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxJQUFJLHVGQUFhO0FBQ2pCLElBQUkscUZBQVk7QUFDaEIsSUFBSSxvRkFBa0I7QUFDdEIsSUFBSSw0RkFBYztBQUNsQixJQUFJLHlGQUFlO0FBQ25CLElBQUkseUZBQWU7QUFDbkIsSUFBSSw2RkFBZTtBQUNuQjtBQUNBO0FBQ0E7O0FBRU87QUFDUCxPQUFPLHFDQUFJO0FBQ1gsRUFBRSxjQUFjLHFDQUFJO0FBQ3BCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsSUFBSSxxQ0FBSTtBQUNSLGdCQUFnQixxRUFBUSwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDRCQUE0Qix3Q0FBd0M7QUFDcEU7QUFDQSx5QkFBeUIsK0JBQStCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGFBQWEsR0FBRyxjQUFjO0FBQ3JGO0FBQ0E7QUFDQSxzREFBc0QsT0FBTyxzQkFBc0I7QUFDbkY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELE9BQU8sZ0JBQWdCO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSwyQkFBMkIscUNBQUk7QUFDdkM7QUFDQSxVQUFVLHFDQUFJO0FBQ2Q7QUFDQSx1REFBdUQsZ0JBQWdCO0FBQ3ZFLHVCQUF1QixhQUFhLHNCQUFzQixnQkFBZ0I7QUFDMUU7QUFDQTtBQUNBLHlEQUF5RCxlQUFlO0FBQ3hFLHNCQUFzQixhQUFhLEdBQUcsY0FBYztBQUNwRDtBQUNBLHVEQUF1RCxhQUFhLEdBQUcsWUFBWTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixxRUFBUSwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBLFVBQVUsa0JBQWtCLHFDQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLFlBQVkscUNBQUk7QUFDaEIsVUFBVSxzQkFBc0IscUNBQUk7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsWUFBWSxxQ0FBSTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSnVDO0FBQ3VCO0FBQ1A7QUFDQTtBQUNFOztBQUVGO0FBQ3FDOztBQUU1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQSxjQUFjLFFBQVE7QUFDdEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLGlDQUFpQyxvREFBSyxDQUFDLDJDQUFVO0FBQ2hFLFFBQVEscURBQVU7O0FBRWxCLHlCQUF5QiwwRUFBMEIsUUFBUSwrQkFBK0I7QUFDMUYsb0JBQW9CLHFFQUFxQjs7QUFFekM7QUFDQTtBQUNBLGdCQUFnQixvQ0FBb0M7QUFDcEQsdUJBQXVCLDJDQUEyQztBQUNsRSxtQkFBbUIsdUNBQXVDO0FBQzFELDBCQUEwQiw4Q0FBOEM7QUFDeEUsaUJBQWlCLFlBQVk7QUFDN0IsaUJBQWlCLHFDQUFxQztBQUN0RCxvQkFBb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBLFdBQVcscUVBQU07QUFDakI7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixzRUFBVztBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVELHNCQUFzQjtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsc0JBQXNCO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYLFNBQVM7QUFDVCxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLGtCQUFrQixJQUFJLElBQUk7QUFDOUY7QUFDQTtBQUNBLGNBQWMsbUJBQW1CLEVBQUUsa0JBQWtCLElBQUksU0FBUyxFQUFFLGdCQUFnQixFQUFFLFdBQVc7QUFDakc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxPQUFPO0FBQ3BCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEscUNBQUk7QUFDakI7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDLGVBQWU7QUFDZixrQkFBa0I7QUFDbEIsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixnQkFBZ0IscUVBQVEsdUNBQXVDO0FBQy9ELDhDQUE4QyxpQkFBaUIsa0JBQWtCLGlCQUFpQjtBQUNsRztBQUNBLG1CQUFtQix1RUFBUztBQUM1Qix1QkFBdUI7QUFDdkIscUJBQXFCLGtCQUFrQjtBQUN2QyxjQUFjLGlCQUFpQixlQUFlLGtCQUFrQjtBQUNoRTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLGtDQUFrQyw2Q0FBNkM7QUFDL0Usc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1DQUFtQyxVQUFVLHFFQUFRLHNDQUFzQztBQUNySCxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLHFDQUFJO0FBQ2YscUJBQXFCLG1CQUFtQixTQUFTLFVBQVUsUUFBUSxxRUFBUSx1Q0FBdUM7QUFDbEgsc0JBQXNCLGlCQUFpQixrQkFBa0IsaUJBQWlCO0FBQzFFLFlBQVksZUFBZSxxQ0FBSTtBQUMvQjtBQUNBLHFCQUFxQjtBQUNyQix1QkFBdUI7QUFDdkIseUJBQXlCLHlCQUF5QjtBQUNsRCxnQkFBZ0IsaUJBQWlCO0FBQ2pDLGNBQWMscUNBQUk7QUFDbEIsMkJBQTJCLGtCQUFrQixZQUFZLGlCQUFpQjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixNQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPOztBQUVQLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPOztBQUVQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNWtCZ0M7O0FBRW1DO0FBQ0k7QUFDQTtBQUNZO0FBQ0s7O0FBRWpGO0FBQ1Asd0JBQXdCLG9DQUFHO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUksNEVBQWU7QUFDbkIsSUFBSSxvRkFBVTtBQUNkLElBQUksb0ZBQVU7QUFDZCxJQUFJLDBGQUFnQjtBQUNwQixJQUFJLDZGQUFrQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRU87QUFDUCxPQUFPLHFDQUFJO0FBQ1g7QUFDQTtBQUNBLDBCQUEwQiw4QkFBOEIsV0FBVztBQUNuRTtBQUNBO0FBQ0EsMEJBQTBCLCtCQUErQixFQUFFLHVCQUF1QixXQUFXO0FBQzdGOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsV0FBVyxzQkFBc0I7QUFDakMsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQixjQUFjO0FBQ2QsYUFBYTtBQUNiO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3pHTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJ1RDtBQUNrQjtBQUNSO0FBQ3pCOzs7Ozs7Ozs7Ozs7Ozs7O0FDSHhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVE7QUFDdEIsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsY0FBYztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCLGNBQWMsUUFBUSxzREFBc0Q7QUFDNUUsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxrQ0FBa0M7QUFDL0Y7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSwrQkFBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGNBQWM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbkRPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUMrQjtBQUN3QjtBQUNUOzs7Ozs7Ozs7Ozs7Ozs7O0FDRjlDO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsS0FBSzs7Ozs7Ozs7Ozs7Ozs7QUNwQnBCO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0IsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR3dCOztBQUV4QixpRUFBZSxvQ0FBRzs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNuRnVCOztBQUV4QixpRUFBZSxvQ0FBRzs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDbkt1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNqQ3VCOztBQUV4QixpRUFBZSxvQ0FBRzs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzdEdUI7O0FBRXhCLGlFQUFlLG9DQUFHOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaEZ1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzdDdUI7O0FBRXhCLGlFQUFlLG9DQUFHOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDOVN1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDNUV1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDM0Z1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0RnVCOztBQUV4QixpRUFBZSxvQ0FBRzs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDeEd1Qjs7QUFFeEIsaUVBQWUsb0NBQUc7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Y0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNnRTtBQUNuQztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsTUFBTTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLEtBQUs7QUFDckM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsZUFBZTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsS0FBSztBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UsS0FBSyw2QkFBNkIsVUFBVTtBQUMzSCxvQ0FBb0MsaUNBQWlDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsK0RBQWtCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwrREFBa0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRixRQUFRLGdGQUFnRjtBQUNuTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRixRQUFRLG1GQUFtRjtBQUN0TDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUZBQXlGLE1BQU07QUFDL0YsNENBQTRDLGVBQWU7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSwyRUFBMkUsZ0JBQWdCO0FBQzNGO0FBQ0EsbUNBQW1DLDhCQUE4QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtR0FBbUcsUUFBUSw2RUFBNkU7QUFDeEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLFFBQVEsOEVBQThFO0FBQ2pMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsZ0JBQWdCO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkMsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0Esb0ZBQW9GLGlCQUFpQjtBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3Y3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDd0Q7QUFDWjtBQUNOO0FBQ2I7QUFDekI7QUFDQTtBQUNPLHdCQUF3QixrRUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLHlCQUF5QixrRUFBZTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnREFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOENBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzR0FBc0csWUFBWTtBQUNsSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRixZQUFZO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixnRkFBNkI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsS0FBSyw2QkFBNkIsU0FBUztBQUN0SCxnQ0FBZ0MsaUNBQWlDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQzBDO0FBQ3dCO0FBQ2xFLGdDQUFnQyxvREFBUztBQUN6QztBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsNkRBQWtCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsa0RBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDTyxpQkFBaUIsd0RBQVM7QUFDakM7Ozs7Ozs7Ozs7Ozs7OztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3lDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLDBFQUEwRSxpREFBTztBQUN4Rjs7Ozs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDMEM7QUFDd0I7QUFDbEUsZ0NBQWdDLG9EQUFTO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qiw2REFBa0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixLQUFLLEdBQUcsT0FBTztBQUM3QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxrREFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDTyxpQkFBaUIsd0RBQVM7QUFDakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxNQUFNO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiwrQkFBK0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFdBQVcsTUFBTSxVQUFVLEtBQUssV0FBVyxJQUFJLFdBQVcsTUFBTSxnQkFBZ0I7QUFDcEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsTUFBTTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxTEFBcUw7QUFDckw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGlCQUFpQjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELGdCQUFnQjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sK0JBQStCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsSUFBSTtBQUNoRiwrRUFBK0UsS0FBSztBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsZUFBZTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsc0NBQXNDO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsb0NBQW9DO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxzQ0FBc0M7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsTUFBTSxTQUFTLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiwrQkFBK0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsRUFBRTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isd0JBQXdCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msa0JBQWtCLGVBQWUsS0FBSztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN6dUM4QztBQUM5Qzs7Ozs7Ozs7Ozs7Ozs7OztBQ0QrQztBQUMvQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0Q4QztBQUM5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRHVGO0FBQ3ZGOzs7Ozs7O1VDREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDNEU7QUFDVTtBQUN0RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUNaQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy9icmFuZC91Y2QtdGhlbWUtaGVhZGVyL3VjZC10aGVtZS1oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL2JyYW5kL3VjZC10aGVtZS1oZWFkZXIvdWNkLXRoZW1lLWhlYWRlci50cGwuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL2JyYW5kL3VjZC10aGVtZS1wcmltYXJ5LW5hdi91Y2QtdGhlbWUtcHJpbWFyeS1uYXYuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL2JyYW5kL3VjZC10aGVtZS1wcmltYXJ5LW5hdi91Y2QtdGhlbWUtcHJpbWFyeS1uYXYudHBsLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy91dGlscy9jb250cm9sbGVycy9icmVhay1wb2ludHMuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL3V0aWxzL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy91dGlscy9jb250cm9sbGVycy9pbnRlcnNlY3Rpb24tb2JzZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL3V0aWxzL2NvbnRyb2xsZXJzL211dGF0aW9uLW9ic2VydmVyLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy91dGlscy9jb250cm9sbGVycy93YWl0LmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy91dGlscy9taXhpbnMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL3V0aWxzL21peGlucy9tYWluLWRvbS1lbGVtZW50LmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1lbGVtZW50cy91dGlscy9taXhpbnMvbWl4aW4uanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL3V0aWxzL21peGlucy9uYXYtZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy8xX2Jhc2VfaHRtbC9fZm9ybXMuY3NzLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1zYXNzLzFfYmFzZV9odG1sL19oZWFkaW5ncy5jc3MuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLXNhc3MvMl9iYXNlX2NsYXNzL19taXNjLmNzcy5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9faGVhZGVyLmNzcy5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fbW9iaWxlLWJhci5jc3MuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLXNhc3MvNF9jb21wb25lbnQvX25hdi1vZmYtY2FudmFzLmNzcy5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fbmF2LXByaW1hcnkuY3NzLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1zYXNzLzRfY29tcG9uZW50L19uYXYtdG9nZ2xlLmNzcy5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fc2l0ZS1icmFuZGluZy5jc3MuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0B1Y2QtbGliL3RoZW1lLXNhc3MvNF9jb21wb25lbnQvX3N1Ym1lbnUtdG9nZ2xlLmNzcy5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvQHVjZC1saWIvdGhlbWUtc2Fzcy81X2xheW91dC9fbC1oZWFkZXIuY3NzLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AdWNkLWxpYi90aGVtZS1zYXNzL25vcm1hbGl6ZS5jc3MuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL0BsaXQvcmVhY3RpdmUtZWxlbWVudC9kZXZlbG9wbWVudC9jc3MtdGFnLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9AbGl0L3JlYWN0aXZlLWVsZW1lbnQvZGV2ZWxvcG1lbnQvcmVhY3RpdmUtZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvbGl0LWVsZW1lbnQvZGV2ZWxvcG1lbnQvbGl0LWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL2xpdC1odG1sL2RldmVsb3BtZW50L2RpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvbGl0LWh0bWwvZGV2ZWxvcG1lbnQvZGlyZWN0aXZlcy9jbGFzcy1tYXAuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL2xpdC1odG1sL2RldmVsb3BtZW50L2RpcmVjdGl2ZXMvaWYtZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvbGl0LWh0bWwvZGV2ZWxvcG1lbnQvZGlyZWN0aXZlcy9zdHlsZS1tYXAuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL2xpdC1odG1sL2RldmVsb3BtZW50L2xpdC1odG1sLmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL25vZGVfbW9kdWxlcy9saXQvZGlyZWN0aXZlcy9jbGFzcy1tYXAuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL2xpdC9kaXJlY3RpdmVzL2lmLWRlZmluZWQuanMiLCJ3ZWJwYWNrOi8vQHVjZC1saWIvbGliZ3VpZGVzLy4vbm9kZV9tb2R1bGVzL2xpdC9kaXJlY3RpdmVzL3N0eWxlLW1hcC5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9ub2RlX21vZHVsZXMvbGl0L2luZGV4LmpzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0B1Y2QtbGliL2xpYmd1aWRlcy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9AdWNkLWxpYi9saWJndWlkZXMvLi9zcmMvc2Nzcy9zdHlsZS5zY3NzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpdEVsZW1lbnQgfSBmcm9tICdsaXQnO1xuaW1wb3J0IHtyZW5kZXIsIHN0eWxlc30gZnJvbSBcIi4vdWNkLXRoZW1lLWhlYWRlci50cGwuanNcIjtcblxuaW1wb3J0IHsgXG4gIEludGVyc2VjdGlvbk9ic2VydmVyQ29udHJvbGxlcixcbiAgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXIsIFxuICBXYWl0Q29udHJvbGxlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnRyb2xsZXJzJztcblxuLyoqXG4gKiBAY2xhc3MgVWNkVGhlbWVIZWFkZXJcbiAqIEBjbGFzc2Rlc2MgQ29tcG9uZW50IGNsYXNzIGZvciBkaXNwbGF5aW5nIHRoZSBzaXRlIGhlYWRlclxuICogXG4gKiAgUGF0dGVybkxhYiBVcmw6XG4gKiAgICAtIGh0dHA6Ly9kZXYud2Vic3R5bGVndWlkZS51Y2RhdmlzLmVkdS9yZWRlc2lnbi8/cD1vcmdhbmlzbXMtaGVhZGVyXG4gKiBcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzaXRlTmFtZSAtIE5hbWUgb2Ygd2Vic2l0ZSB0byBkaXNwbGF5XG4gKiBAcHJvcGVydHkge1N0cmluZ30gc2xvZ2FuIC0gT3B0aW9uYWwgdGV4dCB0byBkaXNwbGF5IGJlbG93IHNpdGUgbmFtZVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGZpZ3VyZVNyYyAtIFNpdGUgbG9nby9pY29uIHRvIGRpc3BsYXkgbmV4dCB0byBzaXRlIG5hbWVcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzaXRlVXJsIC0gVXJsIHRvIHVzZSBmb3IgbGlua3MgYXJvdW5kIHNpdGUgbmFtZSBhbmQgZmlndXJlXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IG9wZW5lZCAtIFdoZXRoZXIgaGVhZGVyIGlzIG9wZW4gaW4gdGhlIG1vYmlsZSB2aWV3XG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZXZlbnRGaXhlZCAtIE5hdmJhciB3aWxsIG5vdCBiZSBmaXhlZCB0byB0b3Agb2Ygc2NyZWVuIGluIGRlc2t0b3Agdmlld1xuICogXG4gKiBAZXhhbXBsZVxuICogIDx1Y2QtdGhlbWUtaGVhZGVyIHNpdGUtbmFtZT1cIkEgVUMgRGF2aXMgV2Vic2l0ZVwiPlxuICogICAgPHVjZC10aGVtZS1wcmltYXJ5LW5hdj5cbiAqICAgICAgPGEgaHJlZj1cIiNcIj5MSU5LIDE8L2E+XG4gKiAgICAgIDxhIGhyZWY9XCIjXCI+TElOSyAyPC9hPlxuICogICAgICA8YSBocmVmPVwiI1wiPkxJTksgMzwvYT5cbiAqICAgIDwvdWNkLXRoZW1lLXByaW1hcnktbmF2PlxuICogICAgPHVjZC10aGVtZS1zZWFyY2gtcG9wdXA+XG4gKiAgICAgIDx1Y2QtdGhlbWUtc2VhcmNoLWZvcm0+XG4gKiAgICAgIDwvdWNkLXRoZW1lLXNlYXJjaC1mb3JtPlxuICogICAgPC91Y2QtdGhlbWUtc2VhcmNoLXBvcHVwPlxuICogICAgPHVjZC10aGVtZS1xdWljay1saW5rcz5cbiAqICAgICAgPGEgaHJlZj1cIiNcIj5MSU5LIDQ8L2E+XG4gKiAgICAgIDxhIGhyZWY9XCIjXCI+TElOSyA1PC9hPlxuICogICAgICA8YSBocmVmPVwiI1wiPkxJTksgNjwvYT5cbiAqICAgIDwvdWNkLXRoZW1lLXF1aWNrLWxpbmtzPlxuICogIDwvdWNkLXRoZW1lLWhlYWRlcj5cbiAqIFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVY2RUaGVtZUhlYWRlciBleHRlbmRzIExpdEVsZW1lbnQge1xuICBcbiAgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyQ29udHJvbGxlcih0aGlzKTtcbiAgd2FpdCA9IG5ldyBXYWl0Q29udHJvbGxlcih0aGlzKTtcblxuICBzdGF0aWMgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpdGVOYW1lOiB7dHlwZTogU3RyaW5nLCBhdHRyaWJ1dGU6IFwic2l0ZS1uYW1lXCJ9LFxuICAgICAgc2xvZ2FuOiB7dHlwZTogU3RyaW5nfSxcbiAgICAgIGZpZ3VyZVNyYzoge3R5cGU6IFN0cmluZywgYXR0cmlidXRlOiBcImZpZ3VyZS1zcmNcIn0sXG4gICAgICBzaXRlVXJsOiB7dHlwZTogU3RyaW5nLCBhdHRyaWJ1dGU6IFwic2l0ZS11cmxcIn0sXG4gICAgICBvcGVuZWQ6IHt0eXBlOiBCb29sZWFufSxcbiAgICAgIHByZXZlbnRGaXhlZDoge3R5cGU6IEJvb2xlYW4sIGF0dHJpYnV0ZTogXCJwcmV2ZW50LWZpeGVkXCJ9LFxuICAgICAgaXNEZW1vOiB7dHlwZTogQm9vbGVhbiwgYXR0cmlidXRlOiBcImlzLWRlbW9cIn0sXG4gICAgICBfdHJhbnNpdGlvbmluZzoge3R5cGU6IEJvb2xlYW4sIHN0YXRlOiB0cnVlfSxcbiAgICAgIF9oYXNTbG90dGVkQnJhbmRpbmc6IHt0eXBlOiBCb29sZWFuLCBzdGF0ZTogdHJ1ZX0sXG4gICAgICBfaGFzUXVpY2tMaW5rczoge3R5cGU6IEJvb2xlYW4sIHN0YXRlOiB0cnVlfSxcbiAgICAgIF9oYXNTZWFyY2g6IHt0eXBlOiBCb29sZWFuLCBzdGF0ZTogdHJ1ZX0sXG4gICAgICBfYnJhbmRpbmdCYXJJblZpZXc6IHt0eXBlOiBCb29sZWFuLCBzdGF0ZTogdHJ1ZX1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldCBzdHlsZXMoKSB7XG4gICAgcmV0dXJuIHN0eWxlcygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlbmRlciA9IHJlbmRlci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zaXRlTmFtZSA9IFwiXCI7XG4gICAgdGhpcy5zaXRlVXJsID0gXCIvXCI7XG4gICAgdGhpcy5zbG9nYW4gPSBcIlwiO1xuICAgIHRoaXMuZmlndXJlU3JjID0gXCJcIjtcbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEZW1vID0gZmFsc2U7XG5cbiAgICB0aGlzLl90cmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faGFzU2xvdHRlZEJyYW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faGFzUXVpY2tMaW5rcyA9IGZhbHNlO1xuICAgIHRoaXMuX2hhc1NlYXJjaCA9IGZhbHNlO1xuICAgIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uID0gNTAwO1xuICAgIHRoaXMuX2JyYW5kaW5nQmFySW5WaWV3ID0gZmFsc2U7XG5cbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCl7XG4gICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICBpZiAoICF0aGlzLnByZXZlbnRGaXhlZCApIHtcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDb250cm9sbGVyKHRoaXMsIHt9LCBcIl9vbkJyYW5kaW5nQmFySW50ZXJzZWN0aW9uXCIsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBmaXJzdFVwZGF0ZWQoKXtcbiAgICBpZiAoICF0aGlzLnByZXZlbnRGaXhlZCApIHtcbiAgICAgIGxldCBhYm92ZU5hdiA9IHRoaXMucmVuZGVyUm9vdC5nZXRFbGVtZW50QnlJZCgnYnJhbmRpbmctYmFyLWNvbnRhaW5lcicpO1xuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlci5vYnNlcnZlci5vYnNlcnZlKGFib3ZlTmF2KTtcbiAgICB9XG4gIH1cblxuICBfb25CcmFuZGluZ0JhckludGVyc2VjdGlvbihlbnRyaWVzKXtcbiAgICBsZXQgb2ZmU2V0VmFsdWUgPSAwO1xuICAgIHRyeSB7XG4gICAgICBvZmZTZXRWYWx1ZSA9IHRoaXMucmVuZGVyUm9vdC5nZXRFbGVtZW50QnlJZCgnbmF2LWJhcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICBpZiAoIG9mZlNldFZhbHVlID4gMTUwICkgb2ZmU2V0VmFsdWUgPSAwO1xuICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICB0aGlzLl9icmFuZGluZ0JhckluVmlldyA9IGVudHJ5LmlzSW50ZXJzZWN0aW5nO1xuICAgICAgaWYgKHRoaXMuX2JyYW5kaW5nQmFySW5WaWV3KSB7XG4gICAgICAgIHRoaXMuc3R5bGUubWFyZ2luQm90dG9tID0gJzBweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0eWxlLm1hcmdpbkJvdHRvbSA9IG9mZlNldFZhbHVlICsgXCJweFwiO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBvcGVuXG4gICAqIEBkZXNjcmlwdGlvbiBPcGVucyBoZWFkZXIgbWVudSBpbiBtb2JpbGVcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBvcGVuKCl7XG4gICAgaWYgKCB0aGlzLl90cmFuc2l0aW9uaW5nIHx8IHRoaXMub3BlbmVkICkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMuX3RyYW5zaXRpb25pbmcgPSB0cnVlO1xuICAgIGF3YWl0IHRoaXMud2FpdC53YWl0KHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICB0aGlzLl90cmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNsb3NlXG4gICAqIEBkZXNjcmlwdGlvbiBDbG9zZXMgaGVhYWRlciBtZW51IGluIG1vYmlsZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGNsb3NlKCl7XG4gICAgaWYgKCB0aGlzLl90cmFuc2l0aW9uaW5nIHx8ICF0aGlzLm9wZW5lZCApIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG4gICAgdGhpcy5fdHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgYXdhaXQgdGhpcy53YWl0LndhaXQodGhpcy5fYW5pbWF0aW9uRHVyYXRpb24pO1xuICAgIHRoaXMuX3RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX29uQnRuQ2xpY2tcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEF0dGFjaGVkIHRvIG1lbnUgb3Blbi9jbG9zZSBidXR0b25cbiAgICovXG4gIGFzeW5jIF9vbkJ0bkNsaWNrKCl7XG4gICAgbGV0IGRpZFRvZ2dsZTtcbiAgICBpZiAoIHRoaXMub3BlbmVkICkge1xuICAgICAgZGlkVG9nZ2xlID0gYXdhaXQgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaWRUb2dnbGUgPSBhd2FpdCB0aGlzLm9wZW4oKTtcbiAgICB9XG4gICAgaWYgKCBkaWRUb2dnbGUgKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0b2dnbGUnLCB7XG4gICAgICAgIGRldGFpbCA6IHtvcGVuOiB0aGlzLm9wZW5lZH1cbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0TmF2YmFyQ2xhc3Nlc1xuICAgKiBAZGVzY3JpcHRpb24gR2V0IGNsYXNzZXMgdG8gYmUgYXNzaWduZWQgdG8gdGhlIG5hdmJhciBjb250YWluZXJcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIF9nZXROYXZiYXJDbGFzc2VzKCl7XG4gICAgbGV0IGNsYXNzZXMgPSB7XG4gICAgICBcImwtbmF2YmFyXCI6IHRydWUsXG4gICAgICBcImhlYWRlcl9fbmF2YmFyXCI6IHRydWVcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICBjbGFzc2VzWydtZW51LS1vcGVuJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoICF0aGlzLl90cmFuc2l0aW9uaW5nICkgY2xhc3Nlc1snbWVudS0taGlkZGVuJ10gPSB0cnVlO1xuICAgICAgY2xhc3Nlc1snbWVudS0tY2xvc2VkJ10gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBjbGFzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldEhlYWRlckNsYXNzZXNcbiAgICogQGRlc2NyaXB0aW9uIEdldCBjbGFzc2VzIHRvIGJlIGFzc2lnbmVkIHRvIHRoZSBoZWFkZXIgZWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgX2dldEhlYWRlckNsYXNzZXMoKXtcbiAgICBsZXQgY2xhc3NlcyA9IHtcbiAgICAgIFwibC1oZWFkZXJcIjogdHJ1ZSxcbiAgICAgIFwiaGVhZGVyXCI6IHRydWVcbiAgICB9O1xuXG4gICAgY2xhc3Nlc1snZml4ZWQtbW9iaWxlJ10gPSAhdGhpcy5wcmV2ZW50Rml4ZWQ7XG4gICAgY2xhc3Nlc1snZml4ZWQtZGVza3RvcCddID0gIXRoaXMucHJldmVudEZpeGVkICYmICF0aGlzLl9icmFuZGluZ0JhckluVmlldztcbiAgICBcbiAgICByZXR1cm4gY2xhc3NlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF91Y2RMb2dvXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIFVSSS1lbmNvZGVkIHN2ZyBzdHJpbmcgb2YgVUMgRGF2aXMgbG9nb1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgLSBDb2xvciBvZiBsb2dvLiAnYmx1ZScgb3IgJ2dvbGQnLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKi9cbiAgX3VjZExvZ28oY29sb3I9XCJibHVlXCIpe1xuICAgIGNvbnN0IGNvbG9ycyA9IHtcbiAgICAgIFwiYmx1ZVwiOiBcIiMwMjI4NTFcIixcbiAgICAgIFwiZ29sZFwiOiBcIiNGRkJGMDBcIlxuICAgIH07XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChcbiAgICAgIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMFwiIGhlaWdodD1cIjE2LjE1N1wiPjxwYXRoIGZpbGw9XCIke2NvbG9yc1tjb2xvcl19XCIgZD1cIk01OC44NjUgNC44NzdjLjEwMS42NjEgMS4xMDEgNS40MDUgMS4xMDEgNS40MDVoLTIuMTk0bDEuMDkzLTUuNDA1em0tOC4zMjggMTEuMDNoNS44MDZsLjQzOC0xLjk0N2g0LjE0NGwuNTU0IDEuOTQ3aDUuODA2TDYxLjg0Ni40MDNoLTYuMDg3bC01LjIyMiAxNS41MDR6TTM2LjI4NC40MDJoNS42MjRjNS4xMDcgMCA5LjAwNyAyLjI3NyA5LjAwNyA3Ljk3NCAwIDQuNTkxLTMuMTggNy41MjktNy42NDUgNy41MjlsLTYuOTg2LS4wMDlWLjQwMnptNS41MjQgMTEuMDUyaC4zNzZjMS44NDMgMCAzLjIwNy0xLjA3MiAzLjIwNy0zLjA5NiAwLTIuMTc5LTEuMjEtMy4zOTUtMy4yMzQtMy4zOTVoLS4zNDl2Ni40OTF6TTMyLjk0MS44ODhsLjI5NiAyLjU0NWMuMDcxLjYwNC40MjYgMi4wNTItLjAxMSAxLjg1OC0uMjc2LS4xMjEtLjUwMi0uNzc2LS43MjYtMS4zNi0uMTE0LS4yOTUtLjY1OC0xLjY5NS0uODAxLTEuNzk5LS42ODUtLjUwMS0yLjQwMS0xLjA2NC0zLjU2MS0xLjA2OS0zLjUyMS0uMDEzLTUuODQ3IDIuNTA5LTUuODQ3IDYuOTgyIDAgMy4yMDggMS41ODIgNy4wNjEgNS42MDcgNy4wNjEgMS40NDEgMCA0LjIwMS0uNDQzIDQuOTUyLTIuNDM2LjMzOS0uOS42NS0xLjcwMy44NzYtMS40NTkuMTY2LjE3Ny0uMDUuODk5LS4xNSAxLjI4OS0uNDc0IDEuODQ3LS41MDEgMi40MDYtLjY1IDIuNDc5LTEuODE4Ljg4NS00LjE1IDEuMTc4LTYuMTkxIDEuMTc4LTYuNDg1IDAtOC43MjYtMy42NzgtOC43MjYtNy4zNTQgMC02LjM3OSA0LjAzMi05LjAyMSAxMC4yODYtOC43OTEgMS41OC4wNTggMy4xNjMuMzM0IDQuNjQ2Ljg3Nk0xMy43ODQgMS4xNzFMMTIuNzQ1LjgxOWMtLjM1LS4zMDYuMDc1LS4zOTEuMDc1LS4zOTFzMS41LjI3MSA1LjI0LS4wMzZjMCAwIC4zMjguMDYyLjEwMy4zMTlsLTEuMjI4LjUxMWMtLjc5OC4zMzgtLjc5OC4xNDMtLjc5OC45OTRsLS4wMDcgNy45MDJjMCA2LjE3OC02LjQ3IDYuMDM5LTcuNzMgNi4wMzktLjYgMC02LjQ4OCAwLTYuNDg4LTQuOTYxVjIuODM0YzAtMS40Ni4xNTktMS40MTktLjMzOC0xLjU5MUwuMDcxLjY5NVMtLjE4My4zNDcuMjY5LjM2OGMxLjIyNy4wNiAzLjAwNC4zMTYgNy4xMzMuMDI0IDAgMCAuMzYyLjA4NS4xMjUuMzQybC0xLjIwMS4zMzljLS45NS40MTQtLjgyNS4wOTgtLjg0OSAxLjA0NWwuMDI4IDguMjQ4YzAgMi4wMjEgMS4wNyA0LjUyNCA0LjM5NSA0LjUyNCA0LjU4NSAwIDQuNjI3LTMuODU0IDQuNjI3LTQuNzFsLjAwOS04LjE2N2MuMDQ5LS43Ny0uMDUyLS41NTEtLjc1Mi0uODQyTTg3LjY1IDE0LjcxNWwxLjYtNC4xMTEuMjgxLjIzYy45ODIuNzgxIDIuMzE2IDEuNDQzIDMuNTc0IDEuNDcxIDEuMTI3LjAyMyAxLjY3Ni0uMjY4IDEuNTI3LTEuMTkxLS4xMTMtLjY5My0uOTE2LS44MTItMS40MTctLjkxbC0xLjEwMy0uMjEzYy0yLjE0My0uMzktMy45NDEtMS42NzMtMy45NDEtNC4xMDQgMC0zLjY3NyAzLjI2Mi01LjczNyA2LjU0NC01LjczNyAxLjcyNiAwIDMuMzA2LjQyNCA0Ljc4NiAxLjM2TDk4LjExIDUuMTU2Yy0uNzYyLS41MzMtMS45MTgtMS4yODUtMy4zNzctMS4zMzctLjQ4Mi0uMDE4LTEuNTguMjI5LTEuMjI5IDEuMzEyLjE1Mi40NjIuODMzLjY1NyAxLjI1Mi43NTVsMS4yNDEuMjkyYzIuMzI1LjUyNiA0LjAwMyAxLjgxIDQuMDAzIDQuNDMyIDAgMy42OTktMy4yODEgNS41MjktNi41NDIgNS41MjktMS45MDEgMC00LjEwNi0uNTI3LTUuODA4LTEuNDI0TTgwLjk3OS40MDNoNS40OTJ2MTUuNTA0aC01LjQ5MnpNNzQuNjg0LjQwMmg1LjcybC01Ljg0MyAxNS41MDNoLTQuNjQ0TDY0LjA5LjQwMmg1LjcwNGwyLjQ0MiA5LjM1NHpcIi8+PC9zdmc+YCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9vbkNoaWxkTGlzdE11dGF0aW9uXG4gICAqIEBkZXNjcmlwdGlvbiBGaXJlcyB3aGVuIHRoZXJlIGFyZSBjaGFuZ2VzIHRvIHRoaXMgZWxlbWVudCdzIG5vbi1zaGFkb3cgRE9NIGNoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25DaGlsZExpc3RNdXRhdGlvbigpe1xuICAgIGxldCBwcmltYXJ5TmF2ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCd1Y2QtdGhlbWUtcHJpbWFyeS1uYXYnKTtcbiAgICBpZiAoIHByaW1hcnlOYXYgKSB7XG4gICAgICBwcmltYXJ5TmF2LnNldEF0dHJpYnV0ZSgnc2xvdCcsICdwcmltYXJ5LW5hdicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJObyAndWNkLXRoZW1lLXByaW1hcnktbmF2JyBjaGlsZCBlbGVtZW50IGZvdW5kIVwiKTtcbiAgICB9XG5cbiAgICBsZXQgcXVpY2tMaW5rcyA9IHRoaXMucXVlcnlTZWxlY3RvcigndWNkLXRoZW1lLXF1aWNrLWxpbmtzJyk7XG4gICAgaWYgKCBxdWlja0xpbmtzICkge1xuICAgICAgcXVpY2tMaW5rcy5zZXRBdHRyaWJ1dGUoJ3Nsb3QnLCAncXVpY2stbGlua3MnKTtcbiAgICAgIHRoaXMuX2hhc1F1aWNrTGlua3MgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9oYXNRdWlja0xpbmtzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHNlYXJjaCA9IHRoaXMucXVlcnlTZWxlY3RvcigndWNkLXRoZW1lLXNlYXJjaC1wb3B1cCcpO1xuICAgIGlmICggc2VhcmNoICkge1xuICAgICAgc2VhcmNoLnNldEF0dHJpYnV0ZSgnc2xvdCcsICdzZWFyY2gnKTtcbiAgICAgIHRoaXMuX2hhc1NlYXJjaCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hhc1NlYXJjaCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBVY2RsaWJCcmFuZGluZ0JhciA9IHRoaXMucXVlcnlTZWxlY3RvcigndWNkbGliLWJyYW5kaW5nLWJhcicpO1xuICAgIGlmICggVWNkbGliQnJhbmRpbmdCYXIgKSB7XG4gICAgICBVY2RsaWJCcmFuZGluZ0Jhci5zZXRBdHRyaWJ1dGUoJ3Nsb3QnLCAnYnJhbmRpbmctYmFyJyk7XG4gICAgICB0aGlzLl9oYXNTbG90dGVkQnJhbmRpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIHRoaXMucXVlcnlTZWxlY3RvcihcIipbc2xvdD0nYnJhbmRpbmctYmFyJ11cIikgKXtcbiAgICAgIHRoaXMuX2hhc1Nsb3R0ZWRCcmFuZGluZyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hhc1Nsb3R0ZWRCcmFuZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndWNkLXRoZW1lLWhlYWRlcicsIFVjZFRoZW1lSGVhZGVyKTsiLCJpbXBvcnQgeyBodG1sLCBjc3MgfSBmcm9tICdsaXQnO1xuaW1wb3J0IHsgY2xhc3NNYXAgfSBmcm9tICdsaXQvZGlyZWN0aXZlcy9jbGFzcy1tYXAuanMnO1xuXG5pbXBvcnQgaGVhZGluZ1N0eWxlcyBmcm9tIFwiQHVjZC1saWIvdGhlbWUtc2Fzcy8xX2Jhc2VfaHRtbC9faGVhZGluZ3MuY3NzLmpzXCI7XG5pbXBvcnQgaGVhZGVyU3R5bGVzIGZyb20gXCJAdWNkLWxpYi90aGVtZS1zYXNzLzRfY29tcG9uZW50L19oZWFkZXIuY3NzLmpzXCI7XG5pbXBvcnQgaGVhZGVyTGF5b3V0U3R5bGVzIGZyb20gXCJAdWNkLWxpYi90aGVtZS1zYXNzLzVfbGF5b3V0L19sLWhlYWRlci5jc3MuanNcIlxuaW1wb3J0IGJyYW5kaW5nU3R5bGVzIGZyb20gXCJAdWNkLWxpYi90aGVtZS1zYXNzLzRfY29tcG9uZW50L19zaXRlLWJyYW5kaW5nLmNzcy5qc1wiXG5pbXBvcnQgbW9iaWxlQmFyU3R5bGVzIGZyb20gXCJAdWNkLWxpYi90aGVtZS1zYXNzLzRfY29tcG9uZW50L19tb2JpbGUtYmFyLmNzcy5qc1wiO1xuaW1wb3J0IG5hdlRvZ2dsZVN0eWxlcyBmcm9tIFwiQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fbmF2LXRvZ2dsZS5jc3MuanNcIlxuaW1wb3J0IG9mZkNhbnZhc1N0eWxlcyBmcm9tIFwiQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fbmF2LW9mZi1jYW52YXMuY3NzLmpzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlcygpIHtcbiAgY29uc3QgZWxlbWVudFN0eWxlcyA9IGNzc2BcbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gICAgW2hpZGRlbl0ge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBidXR0b24ge1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICA6OnNsb3R0ZWQodWNkbGliLWJyYW5kaW5nLWJhcil7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICBAbWVkaWEgKG1heC13aWR0aDogOTkxcHgpIHtcbiAgICAgIC5maXhlZC1tb2JpbGUgLm1vYmlsZS1iYXIge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB6LWluZGV4OiAxMDAwO1xuICAgICAgICB0b3A6IDA7XG4gICAgICB9XG4gICAgICAuZml4ZWQtbW9iaWxlIC5vZmYtY2FudmFzIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgICAgei1pbmRleDogMTAwMDtcbiAgICAgICAgdG9wOiA1NXB4O1xuICAgICAgfVxuICAgICAgLmZpeGVkLW1vYmlsZSAubC1oZWFkZXJfX2JyYW5kaW5nIHtcbiAgICAgICAgbWFyZ2luLXRvcDogNTVweDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBAbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgICAgIC5maXhlZC1kZXNrdG9wIC5sLW5hdmJhciB7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgei1pbmRleDogMTAwMDtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICB9XG4gICAgfVxuXG4gIGA7XG5cbiAgcmV0dXJuIFtcbiAgICBoZWFkaW5nU3R5bGVzLFxuICAgIGhlYWRlclN0eWxlcyxcbiAgICBoZWFkZXJMYXlvdXRTdHlsZXMsXG4gICAgYnJhbmRpbmdTdHlsZXMsXG4gICAgbW9iaWxlQmFyU3R5bGVzLFxuICAgIG5hdlRvZ2dsZVN0eWxlcyxcbiAgICBvZmZDYW52YXNTdHlsZXMsXG4gICAgZWxlbWVudFN0eWxlc1xuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCkgeyBcbnJldHVybiBodG1sYFxuJHt0aGlzLmlzRGVtbyA/IGh0bWxgXG4gIDxzdHlsZT5cbiAgICAubC1uYXZiYXIgeyB0b3A6IGF1dG8gIWltcG9ydGFudH1cbiAgPC9zdHlsZT5cbmAgOiBodG1sYGB9XG48aGVhZGVyIGNsYXNzPSR7Y2xhc3NNYXAodGhpcy5fZ2V0SGVhZGVyQ2xhc3NlcygpKX0+XG4gIDxkaXYgY2xhc3M9XCJtb2JpbGUtYmFyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1vYmlsZS1iYXJfX25hdi10b2dnbGVcIj5cbiAgICAgIDxidXR0b24gXG4gICAgICAgIEBjbGljaz0ke3RoaXMuX29uQnRuQ2xpY2t9XG4gICAgICAgIGNsYXNzPVwibmF2LXRvZ2dsZSAke3RoaXMub3BlbmVkID8gJ25hdi10b2dnbGUtLWFjdGl2ZScgOiAnJ31cIiBcbiAgICAgICAgYXJpYS1jb250cm9scz1cInByaW1hcnktbmF2XCIgXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCIke3RoaXMub3BlbmVkID8gJ3RydWUnIDogJ2ZhbHNlJ31cIiBcbiAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBNYWluIE1lbnVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdG9nZ2xlX19pY29uIG5hdi10b2dnbGVfX2ljb24tLW1lbnVcIj5NZW51PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vYmlsZS1iYXJfX2ZpeGVkLXNpdGUtbmFtZVwiPjxhIGhyZWY9JHt0aGlzLnNpdGVVcmx9PiR7dGhpcy5zaXRlTmFtZX08L2E+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vYmlsZS1iYXJfX3VuaXZlcnNpdHlcIj5cbiAgICAgIDxhIGhyZWY9XCJodHRwczovL3d3dy51Y2RhdmlzLmVkdS9cIj5cbiAgICAgICAgPGltZyBjbGFzcz1cInVjZC1sb2dvXCIgc3JjPSdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwke3RoaXMuX3VjZExvZ28oJ2dvbGQnKX0nPlxuICAgICAgPC9hPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICA8ZGl2IGlkPVwiYnJhbmRpbmctYmFyLWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJfX2JhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyX191bml2ZXJzaXR5XCI+XG4gICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnVjZGF2aXMuZWR1L1wiPlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInVjZC1sb2dvXCIgc3JjPSdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwke3RoaXMuX3VjZExvZ28oKX0nPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImwtaGVhZGVyX19icmFuZGluZ1wiPlxuICAgICAgJHt0aGlzLl9oYXNTbG90dGVkQnJhbmRpbmcgPyBodG1sYFxuICAgICAgICA8c2xvdCBuYW1lPVwiYnJhbmRpbmctYmFyXCI+PC9zbG90PlxuICAgICAgYCA6IGh0bWxgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzaXRlLWJyYW5kaW5nXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNpdGUtYnJhbmRpbmdfX2ZpZ3VyZVwiID9oaWRkZW49JHshdGhpcy5maWd1cmVTcmN9PlxuICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy5zaXRlVXJsfVwiIGNsYXNzPVwiXCI+PGltZyBzcmM9JHt0aGlzLmZpZ3VyZVNyY30gY2xhc3M9XCJzaXRlLWxvZ29cIiBhbHQ9XCJTaXRlIExvZ29cIiAvPjwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2l0ZS1icmFuZGluZ19fYm9keVwiPlxuICAgICAgICAgIDxoMSBjbGFzcz1cInNpdGUtYnJhbmRpbmdfX3NpdGUtbmFtZVwiID9oaWRkZW49JHshdGhpcy5zaXRlTmFtZX0+XG4gICAgICAgICAgICA8YSBocmVmPSR7dGhpcy5zaXRlVXJsfT4ke3RoaXMuc2l0ZU5hbWV9PC9hPlxuICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNpdGUtYnJhbmRpbmdfX3Nsb2dhblwiID9oaWRkZW49JHshdGhpcy5zbG9nYW59PiR7dGhpcy5zbG9nYW59PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgYH1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIiR7Y2xhc3NNYXAodGhpcy5fZ2V0TmF2YmFyQ2xhc3NlcygpKX1cIiBpZD1cIm5hdi1iYXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibC1jb250YWluZXItLW5hdmlnYXRpb24gb2ZmLWNhbnZhcyBvZmYtY2FudmFzLS1sZWZ0XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwib2ZmLWNhbnZhc19fY29udGFpbmVyIGwtbmF2LWhvcml6b250YWxcIj5cbiAgICAgICAgJHt0aGlzLl9oYXNTZWFyY2ggPyBodG1sYFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsLW5hdi1ob3Jpem9udGFsX19zZWFyY2gtcG9wdXBcIj5cbiAgICAgICAgICAgIDxzbG90IG5hbWU9XCJzZWFyY2hcIj48L3Nsb3Q+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGAgOiBodG1sYGB9XG4gICAgICAgICR7dGhpcy5faGFzUXVpY2tMaW5rcyA/IGh0bWxgXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImwtbmF2LWhvcml6b250YWxfX3F1aWNrLWxpbmtzXCI+XG4gICAgICAgICAgICA8c2xvdCBuYW1lPVwicXVpY2stbGlua3NcIj48L3Nsb3Q+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGAgOiBodG1sYGB9XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsLW5hdi1ob3Jpem9udGFsX19wcmltYXJ5LW5hdlwiPlxuICAgICAgICAgIDxzbG90IG5hbWU9XCJwcmltYXJ5LW5hdlwiPjwvc2xvdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2hlYWRlcj5cbiAgXG5cbmA7fSIsImltcG9ydCB7IExpdEVsZW1lbnQsIGh0bWwgfSBmcm9tICdsaXQnO1xuaW1wb3J0IHtyZW5kZXIsIHN0eWxlc30gZnJvbSBcIi4vdWNkLXRoZW1lLXByaW1hcnktbmF2LnRwbC5qc1wiO1xuaW1wb3J0IHsgc3R5bGVNYXAgfSBmcm9tICdsaXQvZGlyZWN0aXZlcy9zdHlsZS1tYXAuanMnO1xuaW1wb3J0IHsgY2xhc3NNYXAgfSBmcm9tICdsaXQvZGlyZWN0aXZlcy9jbGFzcy1tYXAuanMnO1xuaW1wb3J0IHsgaWZEZWZpbmVkIH0gZnJvbSAnbGl0L2RpcmVjdGl2ZXMvaWYtZGVmaW5lZC5qcyc7XG5cbmltcG9ydCB7IE1peGluLCBOYXZFbGVtZW50IH0gZnJvbSBcIi4uLy4uL3V0aWxzL21peGluc1wiO1xuaW1wb3J0IHsgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXIsIEJyZWFrUG9pbnRzQ29udHJvbGxlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnRyb2xsZXJzJztcblxuLyoqXG4gKiBAY2xhc3MgVWNkVGhlbWVQcmltYXJ5TmF2XG4gKiBAY2xhc3NkZXNjIENvbXBvbmVudCBjbGFzcyBmb3IgZGlzcGxheWluZyBhIHByaW1hcnkgc2l0ZSBuYXZcbiAqIFxuICogUGF0dGVybiBMYWIgVXJsOlxuICogIC0gaHR0cDovL2Rldi53ZWJzdHlsZWd1aWRlLnVjZGF2aXMuZWR1L3JlZGVzaWduL3BhdHRlcm5zL21vbGVjdWxlcy1uYXZpZ2F0aW9uLTAwLXByaW1hcnktbmF2L21vbGVjdWxlcy1uYXZpZ2F0aW9uLTAwLXByaW1hcnktbmF2LnJlbmRlcmVkLmh0bWxcbiAqICAtIGh0dHA6Ly9kZXYud2Vic3R5bGVndWlkZS51Y2RhdmlzLmVkdS9yZWRlc2lnbi9wYXR0ZXJucy9tb2xlY3VsZXMtbmF2aWdhdGlvbi0wMC1wcmltYXJ5LW5hdi1tZWdhbWVudS9tb2xlY3VsZXMtbmF2aWdhdGlvbi0wMC1wcmltYXJ5LW5hdi1tZWdhbWVudS5yZW5kZXJlZC5odG1sXG4gKiBcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYXZUeXBlIC0gVGhlIHByaW1hcnkgc3R5bGUgdHlwZSBvZiB0aGUgbmF2OlxuICogICdzdXBlcmZpc2gnIC0gVGhlIGRlZmF1bHRcbiAqICAnbWVnYScgLSBIb3ZlcmluZyBvdmVyIGFueSB0b3AtbGV2ZWwgbGluayBvcGVucyBhIHNpbmdsZSBuYXYgd2l0aCBhbGwgc3VibmF2IGxpbmtzXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc3R5bGVNb2RpZmllcnMgLSBBcHBseSBhbHRlcm5hdGUgc3R5bGVzIHdpdGggYSBzcGFjZS1zZXBhcmF0ZWQgbGlzdC5cbiAqICBlLmcuICdqdXN0aWZ5JyBmb3IgJ3ByaW1hcnktbmF2LS1qdXN0aWZ5J1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IGhvdmVyRGVsYXkgLSBIb3cgbG9uZyAobXMpIGFmdGVyIGhvdmVyIHdpbGwgbWVudSBvcGVuL2Nsb3NlXG4gKiBAcHJvcGVydHkge051bWJlcn0gYW5pbWF0aW9uRHVyYXRpb24gLSBIb3cgbG9uZyAobXMpIGZvciBhIG1lbnUgdG8gZmFkZSBpbi9vdXRcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhEZXB0aCAtIE1heGltdW0gbnVtYmVyIG9mIHN1Ym1lbnVzIHRvIHNob3dcbiAqIFxuICogQGV4YW1wbGVcbiAqICA8dWNkLXRoZW1lLXByaW1hcnktbmF2PlxuICogICAgPGEgaHJlZj1cIiNcIj5saW5rIDE8L2E+XG4gKiAgICA8YSBocmVmPVwiI1wiPmxpbmsgMjwvYT5cbiAqICAgIDx1bCBsaW5rLXRpdGxlPVwibGluayB3aXRoIHN1Ym5hdlwiIGhyZWY9XCIjXCI+XG4gKiAgICAgIDxsaT48YSBocmVmPVwiI1wiPnN1Ym5hdiBsaW5rIDE8L2E+PC9saT5cbiAqICAgIDwvdWw+XG4gKiAgPC91Y2QtdGhlbWUtcHJpbWFyeS1uYXY+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVjZFRoZW1lUHJpbWFyeU5hdiBleHRlbmRzIE1peGluKExpdEVsZW1lbnQpXG4gIC53aXRoKE5hdkVsZW1lbnQpIHtcblxuICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXJDb250cm9sbGVyKHRoaXMsIHtzdWJ0cmVlOiB0cnVlLCBjaGlsZExpc3Q6IHRydWV9KTtcbiAgYnJlYWtQb2ludHMgPSBuZXcgQnJlYWtQb2ludHNDb250cm9sbGVyKHRoaXMpO1xuXG4gIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmF2VHlwZToge3R5cGU6IFN0cmluZywgYXR0cmlidXRlOiBcIm5hdi10eXBlXCJ9LFxuICAgICAgc3R5bGVNb2RpZmllcnM6IHt0eXBlOiBTdHJpbmcsIGF0dHJpYnV0ZTogXCJzdHlsZS1tb2RpZmllcnNcIn0sXG4gICAgICBob3ZlckRlbGF5OiB7dHlwZTogTnVtYmVyLCBhdHRyaWJ1dGU6IFwiaG92ZXItZGVsYXlcIn0sXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjoge3R5cGU6IE51bWJlciwgYXR0cmlidXRlOiBcImFuaW1hdGlvbi1kdXJhdGlvblwifSxcbiAgICAgIG5hdkl0ZW1zOiB7dHlwZTogQXJyYXl9LFxuICAgICAgbWF4RGVwdGg6IHt0eXBlOiBOdW1iZXIsIGF0dHJpYnV0ZTogXCJtYXgtZGVwdGhcIn0sXG4gICAgICBfbWVnYUlzT3Blbjoge3R5cGU6IEJvb2xlYW4sIHN0YXRlOiB0cnVlfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0IHN0eWxlcygpIHtcbiAgICByZXR1cm4gc3R5bGVzKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVuZGVyID0gcmVuZGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5uYXZUeXBlID0gXCJzdXBlcmZpc2hcIjtcbiAgICB0aGlzLnN0eWxlTW9kaWZpZXJzID0gXCJcIjtcbiAgICB0aGlzLmhvdmVyRGVsYXkgPSAzMDA7XG4gICAgdGhpcy5hbmltYXRpb25EdXJhdGlvbiA9IDMwMDtcblxuICAgIHRoaXMuX2NsYXNzUHJlZml4ID0gXCJwcmltYXJ5LW5hdlwiO1xuICAgIHRoaXMuX2FjY2VwdGVkTmF2VHlwZXMgPSBbJ3N1cGVyZmlzaCcsICdtZWdhJ107XG4gICAgdGhpcy5fbWVnYUlzT3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2Qgb3Blbk1lZ2FOYXZcbiAgICogQGRlc2NyaXB0aW9uIE9wZW5zIHRoZSBtZWdhbmF2IG1lbnVcbiAgICovXG4gIG9wZW5NZWdhTmF2KCkge1xuICAgIHRoaXMuX21lZ2FJc09wZW4gPSB0cnVlO1xuICB9XG4gICAgXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNsb3NlTWVnYU5hdlxuICAgKiBAZGVzY3JpcHRpb24gQ2xvc2VzIHRoZSBtZWdhbmF2IG1lbnVcbiAgICovXG4gIGNsb3NlTWVnYU5hdigpe1xuICAgIHRoaXMuX21lZ2FJc09wZW4gPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIG9wZW5TdWJOYXZcbiAgICogQGRlc2NyaXB0aW9uIE9wZW5zIHRoZSBzcGVjaWZpZWQgc3VibmF2XG4gICAqIEBwYXJhbSB7QXJyYXl9IG5hdkxvY2F0aW9uIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGl0ZW0gaW4gdGhlICduYXZJdGVtcycgYXJyYXkuIGkuZS4gWzAsIDEsIDRdLlxuICAgKi9cbiAgYXN5bmMgb3BlblN1Yk5hdihuYXZMb2NhdGlvbil7XG5cbiAgICAvLyBub24tbWVnYSBtZW51XG4gICAgaWYgKCBcbiAgICAgIHR5cGVvZiBuYXZMb2NhdGlvbiAhPT0gJ29iamVjdCcgfHxcbiAgICAgICFBcnJheS5pc0FycmF5KG5hdkxvY2F0aW9uKSB8fFxuICAgICAgbmF2TG9jYXRpb24ubGVuZ3RoID09PSAwXG4gICAgKSByZXR1cm47XG4gICAgbGV0IG5hdkl0ZW0gPSB0aGlzLmdldE5hdkl0ZW0obmF2TG9jYXRpb24pO1xuICAgIGlmICggIW5hdkl0ZW0gKSByZXR1cm47XG5cbiAgICAvLyBPcGVuIG9uIG1vYmlsZVxuICAgIGlmICggdGhpcy5icmVha1BvaW50cy5pc01vYmlsZSgpICkge1xuICAgICAgbGV0IG5hdiA9IHRoaXMucmVuZGVyUm9vdC5nZXRFbGVtZW50QnlJZChgbmF2LS0ke25hdkxvY2F0aW9uLmpvaW4oXCItXCIpfWApO1xuICAgICAgaWYgKCAhbmF2ICkgcmV0dXJuO1xuICAgICAgbGV0IHVsID0gbmF2LnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgICBpZiAoICF1bCApIHJldHVybjtcbiAgICAgIGlmICggbmF2SXRlbS5pc1RyYW5zaXRpb25pbmcgKSByZXR1cm47XG4gICAgICBuYXZJdGVtLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG5cbiAgICAgIC8vIEdldCBleHBhbmRlZCBoZWlnaHRcbiAgICAgIG5hdkl0ZW0uaW5saW5lU3R5bGVzLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBuYXZJdGVtLmlubGluZVN0eWxlcy5oZWlnaHQgPSAwICsgXCJweFwiO1xuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKCk7XG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZUNvbXBsZXRlO1xuICAgICAgY29uc3QgZXhwYW5kZWRIZWlnaHQgPSB1bC5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgIC8vIFNldCBleHBhbmRlZCBoZWlnaHRcbiAgICAgIG5hdkl0ZW0uaW5saW5lU3R5bGVzLmhlaWdodCA9IGV4cGFuZGVkSGVpZ2h0O1xuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKCk7XG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZUNvbXBsZXRlO1xuXG4gICAgICAvLyBSZW1vdmUgdHJhbnNpdGlvbiBzdGF0ZSBhZnRlciBhbmltYXRpb24gZHVyYXRpb25cbiAgICAgIHRoaXMuX2NvbXBsZXRlTW9iaWxlVHJhbnNpdGlvbihuYXZJdGVtKTtcblxuXG4gICAgLy8gT3BlbiBvbiBkZXNrdG9wXG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gbWVnYSBtZW51XG4gICAgICBpZiAoIHRoaXMuaXNNZWdhTWVudSgpICl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGVhckl0ZW1JbmxpbmVTdHlsZXMobmF2SXRlbSk7XG4gICAgICBpZiAoIG5hdkl0ZW0uaXNDbG9zaW5nICkge1xuICAgICAgICBuYXZJdGVtLmlzQ2xvc2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgIH1cbiAgICAgIGlmICggbmF2SXRlbS50aW1lb3V0ICkgY2xlYXJUaW1lb3V0KG5hdkl0ZW0udGltZW91dCk7XG4gICAgICBpZiAoIG5hdkl0ZW0uaXNPcGVuICkgcmV0dXJuO1xuICBcbiAgICAgIG5hdkl0ZW0udGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBuYXZJdGVtLmlzT3BlbiA9IHRydWU7XG4gICAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xuICAgICAgfSwgdGhpcy5ob3ZlckRlbGF5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjbG9zZVN1Yk5hdlxuICAgKiBAZGVzY3JpcHRpb24gQ2xvc2VzIGEgc3VibmF2IGdpdmVuIGl0cyBjb29yZGluYXRlcyBcbiAgICogQHBhcmFtIHtBcnJheX0gbmF2TG9jYXRpb24gLSBDb29yZGluYXRlcyBvZiB0aGUgaXRlbSBpbiB0aGUgJ25hdkl0ZW1zJyBhcnJheS4gaS5lLiBbMCwgMSwgNF0uXG4gICAqL1xuICBhc3luYyBjbG9zZVN1Yk5hdihuYXZMb2NhdGlvbil7XG5cbiAgICBpZiAoIFxuICAgICAgdHlwZW9mIG5hdkxvY2F0aW9uICE9PSAnb2JqZWN0JyB8fFxuICAgICAgIUFycmF5LmlzQXJyYXkobmF2TG9jYXRpb24pIHx8XG4gICAgICBuYXZMb2NhdGlvbi5sZW5ndGggPT09IDBcbiAgICApIHJldHVybjtcbiAgICBsZXQgbmF2SXRlbSA9IHRoaXMuZ2V0TmF2SXRlbShuYXZMb2NhdGlvbik7XG4gICAgaWYgKCAhbmF2SXRlbSApIHJldHVybjtcblxuICAgIC8vIGNsb3NlIG9uIG1vYmlsZVxuICAgIGlmICggdGhpcy5icmVha1BvaW50cy5pc01vYmlsZSgpICkge1xuICAgICAgbGV0IG5hdiA9IHRoaXMucmVuZGVyUm9vdC5nZXRFbGVtZW50QnlJZChgbmF2LS0ke25hdkxvY2F0aW9uLmpvaW4oXCItXCIpfWApO1xuICAgICAgaWYgKCAhbmF2ICkgcmV0dXJuO1xuICAgICAgbGV0IHVsID0gbmF2LnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgICBpZiAoICF1bCApIHJldHVybjtcbiAgICAgIGlmICggbmF2SXRlbS5pc1RyYW5zaXRpb25pbmcgKSByZXR1cm47XG4gICAgICBuYXZJdGVtLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG5cbiAgICAgIC8vIFNldCBleHBhbmRlZCBoZWlnaHRcbiAgICAgIG5hdkl0ZW0uaW5saW5lU3R5bGVzLmhlaWdodCA9IHVsLnNjcm9sbEhlaWdodCArIFwicHhcIjtcbiAgICAgIG5hdkl0ZW0uaW5saW5lU3R5bGVzLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ29tcGxldGU7XG5cbiAgICAgIC8vIFNldCBoZWlnaHQgdG8gMCBieSByZXF1ZXN0aW5nIGFsbCBvZiB0aGUgYW5pbWF0aW9uIGZyYW1lcyA6LShcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgbmF2SXRlbS5pbmxpbmVTdHlsZXMuaGVpZ2h0ID0gXCIwcHhcIjtcbiAgICAgICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFuc2l0aW9uIHN0YXRlIGFmdGVyIGFuaW1hdGlvbiBkdXJhdGlvblxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVNb2JpbGVUcmFuc2l0aW9uKG5hdkl0ZW0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgXG5cbiAgICAvLyBjbG9zZSBvbiBkZXNrdG9wXG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gbWVnYSBtZW51XG4gICAgICBpZiAoIHRoaXMuaXNNZWdhTWVudSgpICl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuXG4gICAgICB0aGlzLmNsZWFySXRlbUlubGluZVN0eWxlcyhuYXZJdGVtKTtcbiAgICAgIGlmICggbmF2SXRlbS50aW1lb3V0ICkgY2xlYXJUaW1lb3V0KG5hdkl0ZW0udGltZW91dCk7XG4gICAgICBpZiAoICFuYXZJdGVtLmlzT3BlbiApIHJldHVybjtcbiAgXG4gICAgICBuYXZJdGVtLmlzQ2xvc2luZyA9IHRydWU7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgIG5hdkl0ZW0udGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBuYXZJdGVtLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICBuYXZJdGVtLmlzQ2xvc2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgIH0sIHRoaXMuaG92ZXJEZWxheSArIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24pO1xuICAgIH1cbiAgICBcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNsb3NlQWxsU3ViTmF2c1xuICAgKiBAZGVzY3JpcHRpb24gUmVjdXJzaXZlbHkgY2xvc2VzIGFsbCBuYXYgc3VibWVudXMgd2l0aGluIHNwZWNpZmllZCBtZW51LlxuICAgKiBAcGFyYW0ge0FycmF5fSBuYXZJdGVtcyAtIFRoZSBzdWJJdGVtcyBwcm9wZXJ0eSBvZiBhbnkgb2JqZWN0IHdpdGhpbiB0aGUgJ25hdkl0ZW1zJyBlbGVtZW50IHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlcXVlc3RVcGRhdGUgLSBTaG91bGQgYW4gdXBkYXRlIGJlIHJlcXVlc3RlZCBhZnRlciBlYWNoIHN1Ym5hdiBjbG9zaW5nP1xuICAgKi9cbiAgY2xvc2VBbGxTdWJOYXZzKG5hdkl0ZW1zLCByZXF1ZXN0VXBkYXRlPXRydWUpe1xuICAgIGlmICggIW5hdkl0ZW1zICkgbmF2SXRlbXMgPSB0aGlzLm5hdkl0ZW1zO1xuICAgIG5hdkl0ZW1zLmZvckVhY2goKG5hdkl0ZW0pID0+IHtcbiAgICAgIGlmICggbmF2SXRlbS5pc09wZW4gKSB7XG4gICAgICAgIG5hdkl0ZW0uaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIGlmICggcmVxdWVzdFVwZGF0ZSApIHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCBuYXZJdGVtLnN1Ykl0ZW1zICkge1xuICAgICAgICB0aGlzLmNsb3NlQWxsU3ViTmF2cyhuYXZJdGVtLnN1Ykl0ZW1zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGlzTWVnYU1lbnVcbiAgICogQGRlc2NyaXB0aW9uIERvZXMgdGhpcyBlbGVtZW50IHVzZSB0aGUgbWVnYSBtZW51P1xuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzTWVnYU1lbnUoKXtcbiAgICBpZiAoIHRoaXMubmF2VHlwZS50b0xvd2VyQ2FzZSgpLnRyaW0oKSA9PT0gJ21lZ2EnKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0TmF2Q2xhc3Nlc1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gR2V0IGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgdG9wLWxldmVsICduYXYnIGVsZW1lbnRcbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICovXG4gIF9nZXROYXZDbGFzc2VzKCl7XG4gICAgbGV0IG5hdlR5cGUgPSB0aGlzLl9hY2NlcHRlZE5hdlR5cGVzWzBdO1xuICAgIGlmICggdGhpcy5fYWNjZXB0ZWROYXZUeXBlcy5pbmNsdWRlcyh0aGlzLm5hdlR5cGUudG9Mb3dlckNhc2UoKSkgKSBuYXZUeXBlID0gdGhpcy5uYXZUeXBlO1xuICAgIFxuICAgIGxldCBzdHlsZU1vZGlmaWVycyA9IFwiXCI7XG4gICAgaWYgKCB0aGlzLnN0eWxlTW9kaWZpZXJzICkge1xuICAgICAgc3R5bGVNb2RpZmllcnMgPSB0aGlzLnN0eWxlTW9kaWZpZXJzLnNwbGl0KFwiIFwiKS5tYXAobW9kID0+IGAke3RoaXMuX2NsYXNzUHJlZml4fS0tJHttb2R9YCkuam9pbihcIiBcIik7XG4gICAgfVxuICAgIGxldCBtZWdhSXNPcGVuID0gdGhpcy5pc01lZ2FNZW51KCkgJiYgdGhpcy5fbWVnYUlzT3BlbiA/ICdpcy1ob3ZlcicgOiAnJztcbiAgICByZXR1cm4gYCR7dGhpcy5fY2xhc3NQcmVmaXh9ICR7dGhpcy5fY2xhc3NQcmVmaXh9LS0ke25hdlR5cGV9ICR7c3R5bGVNb2RpZmllcnN9ICR7bWVnYUlzT3Blbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX29uQ2hpbGRMaXN0TXV0YXRpb25cbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEZpcmVzIHdoZW4gbGlnaHQgZG9tIGNoaWxkIGxpc3QgY2hhbmdlcy4gSW5qZWN0ZWQgYnkgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXIuXG4gICAqICBTZXRzIHRoZSAnbmF2SXRlbXMnIHByb3BlcnR5LlxuICAgKi9cbiAgX29uQ2hpbGRMaXN0TXV0YXRpb24oKXtcbiAgICBsZXQgbmF2SXRlbXMgPSB0aGlzLnBhcnNlTmF2Q2hpbGRyZW4oKTtcbiAgICBpZiAoIG5hdkl0ZW1zLmxlbmd0aCApIHRoaXMubmF2SXRlbXMgPSBuYXZJdGVtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9yZW5kZXJOYXZJdGVtXG4gICAqIEBwcml2YXRlXG4gICAqIEBkZXNjcmlwdGlvbiBSZW5kZXJzIGEgbWVudSBpdGVtIGFuZCBhbGwgaXRzIGNoaWxkcmVuIHRvIHRoZSBzcGVjaWZpZWQgbWF4IGRlcHRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuYXZJdGVtIC0gQW4gaXRlbSBmcm9tIHRoZSAnbmF2SXRlbXMnIGVsZW1lbnQgcHJvcGVydHlcbiAgICogQHBhcmFtIHtBcnJheX0gbG9jYXRpb24gLSBDb29yZGluYXRlcyBvZiB0aGUgaXRlbSBpbiB0aGUgJ25hdkl0ZW1zJyBhcnJheS4gaS5lLiBbMCwgMSwgNF1cbiAgICogQHJldHVybnMge1RlbXBsYXRlUmVzdWx0fVxuICAgKi9cbiAgX3JlbmRlck5hdkl0ZW0obmF2SXRlbSwgbG9jYXRpb24pe1xuICAgIGNvbnN0IGRlcHRoID0gbG9jYXRpb24ubGVuZ3RoIC0gMTtcblxuICAgIC8vIFJlbmRlciBpdGVtIGFuZCBpdHMgc3VibmF2XG4gICAgaWYgKCB0aGlzLml0ZW1IYXNTdWJOYXYobmF2SXRlbSkgJiYgZGVwdGggPCB0aGlzLm1heERlcHRoKSB7XG4gICAgICByZXR1cm4gaHRtbGBcbiAgICAgIDxsaSBcbiAgICAgICAgaWQ9XCJuYXYtLSR7bG9jYXRpb24uam9pbihcIi1cIil9XCJcbiAgICAgICAgLmtleT0ke2xvY2F0aW9ufVxuICAgICAgICAuaGFzbmF2PSR7dHJ1ZX1cbiAgICAgICAgQG1vdXNlZW50ZXI9JHt0aGlzLl9vbkl0ZW1Nb3VzZWVudGVyfSBcbiAgICAgICAgQG1vdXNlbGVhdmU9JHt0aGlzLl9vbkl0ZW1Nb3VzZWxlYXZlfVxuICAgICAgICBjbGFzcz0ke2NsYXNzTWFwKHRoaXMuX21ha2VMaUNsYXNzTWFwKG5hdkl0ZW0sIGRlcHRoKSl9PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3VibWVudS10b2dnbGVfX3dyYXBwZXIgJHtkZXB0aCA9PT0gMCA/IGAke3RoaXMuX2NsYXNzUHJlZml4fV9fdG9wLWxpbmtgIDogJyd9XCI+XG4gICAgICAgICAgPGEgXG4gICAgICAgICAgICBocmVmPSR7aWZEZWZpbmVkKG5hdkl0ZW0uaHJlZiA/IG5hdkl0ZW0uaHJlZiA6IG51bGwpfVxuICAgICAgICAgICAgdGFiaW5kZXg9JHt0aGlzLl9zZXRUYWJJbmRleChkZXB0aCl9XG4gICAgICAgICAgICBAZm9jdXM9JHt0aGlzLl9vbkl0ZW1Gb2N1c30+XG4gICAgICAgICAgICAke25hdkl0ZW0ubGlua1RleHR9PHNwYW4gY2xhc3M9XCIke3RoaXMuX2NsYXNzUHJlZml4fV9fc3VibWVudS1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgQGNsaWNrPSR7KCkgPT4gdGhpcy5fdG9nZ2xlTW9iaWxlTWVudShsb2NhdGlvbil9XG4gICAgICAgICAgY2xhc3M9XCJzdWJtZW51LXRvZ2dsZSAke25hdkl0ZW0uaXNPcGVuID8gJ3N1Ym1lbnUtdG9nZ2xlLS1vcGVuJyA6ICcnfVwiIFxuICAgICAgICAgID9kaXNhYmxlZD0ke25hdkl0ZW0uaXNUcmFuc2l0aW9uaW5nfVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJUb2dnbGUgU3VibWVudVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3VibWVudS10b2dnbGVfX2ljb25cIj48L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzPVwibWVudSAke25hdkl0ZW0uaXNPcGVuID8gXCJtZW51LS1vcGVuXCIgOiBcIlwifVwiIHN0eWxlPSR7c3R5bGVNYXAodGhpcy5fZ2V0SXRlbU1vYmlsZVN0eWxlcyhsb2NhdGlvbikpfT5cbiAgICAgICAgICAke25hdkl0ZW0uc3ViSXRlbXMubWFwKChzdWJJdGVtLCBpKSA9PiB0aGlzLl9yZW5kZXJOYXZJdGVtKHN1Ykl0ZW0sIGxvY2F0aW9uLmNvbmNhdChbaV0pKSl9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIGA7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIGFzIG5vcm1hbCBsaW5rXG4gICAgcmV0dXJuIGh0bWxgXG4gICAgICA8bGkgaWQ9XCJuYXYtLSR7bG9jYXRpb24uam9pbihcIi1cIil9XCIgLmtleT0ke2xvY2F0aW9ufSBjbGFzcz0ke2NsYXNzTWFwKHRoaXMuX21ha2VMaUNsYXNzTWFwKG5hdkl0ZW0sIGRlcHRoKSl9PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtkZXB0aCA9PT0gMCA/IGAke3RoaXMuX2NsYXNzUHJlZml4fV9fdG9wLWxpbmtgOiAnJyB9XCI+XG4gICAgICAgICAgJHtuYXZJdGVtLmhyZWYgPyBodG1sYFxuICAgICAgICAgICAgPGEgXG4gICAgICAgICAgICAgIGhyZWY9JHtuYXZJdGVtLmhyZWZ9IFxuICAgICAgICAgICAgICBAZm9jdXM9JHt0aGlzLl9vbkl0ZW1Gb2N1c31cbiAgICAgICAgICAgICAgdGFiaW5kZXg9JHt0aGlzLl9zZXRUYWJJbmRleChkZXB0aCl9PlxuICAgICAgICAgICAgICAke25hdkl0ZW0ubGlua1RleHR9PC9hPlxuICAgICAgICAgIGAgOiBodG1sYFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3RoaXMuX2NsYXNzUHJlZml4fV9fbm9saW5rXCI+JHtuYXZJdGVtLmxpbmtUZXh0fTwvc3Bhbj5cbiAgICAgICAgICBgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+XG4gICAgYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zZXRUYWJJbmRleFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gU2V0cyB0aGUgdGFiIGluZGV4IG9mIG1lbnUgbGlua3NcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlcHRoIC0gTGV2ZWwgb2YgdGhlIG1lbnUgbGlua1xuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgKi9cbiAgX3NldFRhYkluZGV4KGRlcHRoPTApe1xuICAgIGxldCBpID0gMDtcbiAgICBpZiAoXG4gICAgICB0aGlzLmlzTWVnYU1lbnUoKSAmJiBcbiAgICAgIGRlcHRoID4gMCAmJiBcbiAgICAgICF0aGlzLl9tZWdhSXNPcGVuICYmXG4gICAgICB0aGlzLmJyZWFrUG9pbnRzLmlzRGVza3RvcCgpXG4gICAgKSBpID0gLTE7XG5cbiAgICByZXR1cm4gaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9tYWtlTGlDbGFzc01hcFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gQ2xhc3NlcyB0byBiZSBhc3NpZ25lZCB0byBlYWNoIExJIGVsZW1lbnQgaW4gdGhlIG5hdi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5hdkl0ZW0gLSBBbiBpdGVtIGluIHRoZSBuYXZJdGVtcyBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlcHRoIC0gRGVwdGggb2YgdGhlIG5hdkl0ZW1cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIF9tYWtlTGlDbGFzc01hcChuYXZJdGVtLCBkZXB0aD0wKXtcbiAgICBsZXQgY2xhc3NlcyA9IHt9O1xuICAgIGNsYXNzZXNbYGRlcHRoLSR7ZGVwdGh9YF0gPSB0cnVlO1xuICAgIGlmICggbmF2SXRlbS5pc09wZW4gKSBjbGFzc2VzWydzZi0taG92ZXInXSA9IHRydWU7XG4gICAgaWYgKCBuYXZJdGVtLmlzQ2xvc2luZyApIGNsYXNzZXMuY2xvc2luZyA9IHRydWU7XG4gICAgaWYgKG5hdkl0ZW0ubWVnYUZvY3VzKSBjbGFzc2VzWydtZWdhLWZvY3VzJ10gPSB0cnVlO1xuICAgIHJldHVybiBjbGFzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX3RvZ2dsZU1vYmlsZU1lbnVcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEV4cGFuZHMvY29sbGFwc2VzIG1vYmlsZSBzdWJuYXZzIHdpdGggYW5pbWF0aW9uIG9uIHVzZXIgY2xpY2suXG4gICAqIEBwYXJhbSB7QXJyYXl9IG5hdkxvY2F0aW9uIC0gQXJyYXkgY29vcmRpbmF0ZXMgb2YgY29ycmVzcG9uZGluZyBuYXYgaXRlbVxuICAgKi9cbiAgYXN5bmMgX3RvZ2dsZU1vYmlsZU1lbnUobmF2TG9jYXRpb24pe1xuICAgIGlmICggdGhpcy5icmVha1BvaW50cy5pc0Rlc2t0b3AoKSApIHJldHVybjtcbiAgICBsZXQgbmF2SXRlbSA9IHRoaXMuZ2V0TmF2SXRlbShuYXZMb2NhdGlvbik7XG4gICAgaWYgKCBuYXZJdGVtLmlzT3BlbiApIHtcbiAgICAgIHRoaXMuY2xvc2VTdWJOYXYobmF2TG9jYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW5TdWJOYXYobmF2TG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9vbk5hdk1vdXNlZW50ZXJcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEF0dGFjaGVkIHRvIHRvcC1sZXZlbCBuYXYgZWxlbWVudC4gT3BlbnMgbWVnYSBtZW51IGluIGRlc2t0b3Agdmlld1xuICAgKi9cbiAgX29uTmF2TW91c2VlbnRlcigpe1xuICAgIGlmICggXG4gICAgICB0aGlzLmJyZWFrUG9pbnRzLmlzTW9iaWxlKCkgfHwgXG4gICAgICAhdGhpcy5pc01lZ2FNZW51KCkgKSBcbiAgICAgIHJldHVybjtcblxuICAgIGlmICggdGhpcy5fbWVnYVRpbWVvdXQgKSBjbGVhclRpbWVvdXQodGhpcy5fbWVnYVRpbWVvdXQpO1xuICAgIHRoaXMuX21lZ2FUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLm9wZW5NZWdhTmF2KCk7XG4gICAgfSwgdGhpcy5ob3ZlckRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9vbk5hdk1vdXNlbGVhdmVcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEF0dGFjaGVkIHRvIHRvcC1sZXZlbCBuYXYgZWxlbWVudC4gQ2xvc2VzIG1lZ2EgbWVudSBpbiBkZXNrdG9wIHZpZXdcbiAgICovXG4gIF9vbk5hdk1vdXNlbGVhdmUoKXtcbiAgICBpZiAoIFxuICAgICAgdGhpcy5icmVha1BvaW50cy5pc01vYmlsZSgpIHx8IFxuICAgICAgIXRoaXMuaXNNZWdhTWVudSgpICkgXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoIHRoaXMuX21lZ2FUaW1lb3V0ICkgY2xlYXJUaW1lb3V0KHRoaXMuX21lZ2FUaW1lb3V0KTtcbiAgICBcbiAgICB0aGlzLl9tZWdhVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZU1lZ2FOYXYoKTtcbiAgICB9LCB0aGlzLmhvdmVyRGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX29uTmF2Rm9jdXNpblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gRmlyZXMgd2hlbiBmb2N1cyBlbnRlcnMgdGhlIG1haW4gbmF2IGVsZW1lbnQuIFVzZWQgdG8gb3BlbiB0aGUgbWVnYW5hdlxuICAgKi9cbiAgX29uTmF2Rm9jdXNpbigpe1xuICAgIGlmICggXG4gICAgICB0aGlzLmJyZWFrUG9pbnRzLmlzTW9iaWxlKCkgfHwgXG4gICAgICAhdGhpcy5pc01lZ2FNZW51KCkgKSBcbiAgICAgIHJldHVybjtcbiAgICBcbiAgICBpZiAoIHRoaXMuX21lZ2FJc09wZW4gKSByZXR1cm47XG4gICAgaWYgKCB0aGlzLl9tZWdhVGltZW91dCApIGNsZWFyVGltZW91dCh0aGlzLl9tZWdhVGltZW91dCk7XG4gICAgXG4gICAgdGhpcy5fbWVnYVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMub3Blbk1lZ2FOYXYoKTtcbiAgICB9LCB0aGlzLmhvdmVyRGVsYXkpO1xuXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9vbkl0ZW1Nb3VzZWVudGVyXG4gICAqIEBwcml2YXRlXG4gICAqIEBkZXNjcmlwdGlvbiBCb3VuZCB0byBuYXYgbGkgaXRlbXMgd2l0aCBhIHN1Ym5hdlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIFxuICAgKi9cbiAgX29uSXRlbU1vdXNlZW50ZXIoZSl7XG4gICAgaWYgKCB0aGlzLmJyZWFrUG9pbnRzLmlzTW9iaWxlKCkgKSByZXR1cm47XG4gICAgdGhpcy5vcGVuU3ViTmF2KGUudGFyZ2V0LmtleSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfb25JdGVtRm9jdXNcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEJvdW5kIHRvIG5hdiBhIGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgXG4gICAqL1xuICBfb25JdGVtRm9jdXMoZSl7XG4gICAgaWYgKCB0aGlzLmJyZWFrUG9pbnRzLmlzTW9iaWxlKCkgKSByZXR1cm47XG4gICAgY29uc3QgTEkgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoTEkuaGFzbmF2KSB7XG4gICAgICB0aGlzLm9wZW5TdWJOYXYoTEkua2V5KTtcbiAgICB9XG4gIFxuICAgIGlmICh0aGlzLmlzTWVnYU1lbnUoKSAmJiB0aGlzLl9tZWdhSXNPcGVuKSB7XG4gICAgICB0aGlzLl9zZXRNZWdhRm9jdXMoTEkua2V5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfc2V0TWVnYUZvY3VzXG4gICAqIEBwcml2YXRlXG4gICAqIEBkZXNjcmlwdGlvbiBEaXNwbGF5cyBjdXN0b20gc3R5bGluZyB0byBtZWdhbmF2IGl0ZW0gd2hlbiBmb2N1c2VkIHRvIGZpeCBidWcgaW4gc2l0ZWZhcm0gY29kZS5cbiAgICogQHBhcmFtIHtBcnJheX0gbmF2TG9jYXRpb24gLSBDb29yZGluYXRlcyBvZiB0aGUgaXRlbSBpbiB0aGUgJ25hdkl0ZW1zJyBhcnJheS4gaS5lLiBbMCwgMSwgNF0uXG4gICAqL1xuICBfc2V0TWVnYUZvY3VzKG5hdkxvY2F0aW9uKXtcbiAgICB0aGlzLm5hdkl0ZW1zLmZvckVhY2goKG5hdikgPT4gbmF2Lm1lZ2FGb2N1cyA9IGZhbHNlKTtcbiAgICBpZiAoIFxuICAgICAgdHlwZW9mIG5hdkxvY2F0aW9uICE9PSAnb2JqZWN0JyB8fFxuICAgICAgIUFycmF5LmlzQXJyYXkobmF2TG9jYXRpb24pIHx8XG4gICAgICBuYXZMb2NhdGlvbi5sZW5ndGggPCAxXG4gICAgKSByZXR1cm47XG4gICAgbGV0IG5hdkl0ZW0gPSB0aGlzLmdldE5hdkl0ZW0oW25hdkxvY2F0aW9uWzBdXSk7XG4gICAgbmF2SXRlbS5tZWdhRm9jdXMgPSB0cnVlO1xuICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xuXG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfY29tcGxldGVNb2JpbGVUcmFuc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRpbWVvdXQgdG8gcmVtb3ZlIGFuaW1hdGlvbiBzdHlsZXMgZnJvbSBtb2JpbGUgdHJhbnNpdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gbmF2SXRlbSAtIE1lbWJlciAnbmF2SXRlbXMnIGVsZW1lbnQgcHJvcGVydHkuXG4gICAqL1xuICBfY29tcGxldGVNb2JpbGVUcmFuc2l0aW9uKG5hdkl0ZW0pe1xuICAgIG5hdkl0ZW0udGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbmF2SXRlbS5pbmxpbmVTdHlsZXMgPSB7fTtcbiAgICAgIG5hdkl0ZW0uaXNPcGVuID0gIW5hdkl0ZW0uaXNPcGVuO1xuICAgICAgbmF2SXRlbS5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xuICAgIH0sIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX29uSXRlbU1vdXNlbGVhdmVcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIEJvdW5kIHRvIG5hdiBsaSBpdGVtcyB3aXRoIGEgc3VibmF2XG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgXG4gICAqL1xuICBfb25JdGVtTW91c2VsZWF2ZShlKXtcbiAgICBpZiAoIHRoaXMuYnJlYWtQb2ludHMuaXNNb2JpbGUoKSB8fCB0aGlzLmlzTWVnYU1lbnUoKSApIHJldHVybjtcbiAgICB0aGlzLmNsb3NlU3ViTmF2KGUudGFyZ2V0LmtleSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfb25OYXZGb2N1c291dFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gQXR0YWNoZWQgdG8gdGhlIHRvcC1sZXZlbCBuYXYgZWxlbWVudC4gQ2xvc2VzIHN1Ym5hdiBpZiBpdCBkb2Vzbid0IGNvbnRhaW4gZm9jdXNlZCBsaW5rLlxuICAgKi9cbiAgX29uTmF2Rm9jdXNvdXQoKXtcbiAgICBpZiAoIHRoaXMuYnJlYWtQb2ludHMuaXNNb2JpbGUoKSApIHJldHVybjtcbiAgICBpZiAoIHRoaXMuaXNNZWdhTWVudSgpICkge1xuICAgICAgaWYgKCB0aGlzLl9tZWdhVGltZW91dCApIGNsZWFyVGltZW91dCh0aGlzLl9tZWdhVGltZW91dCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBmb2N1c2VkRWxlID0gdGhpcy5yZW5kZXJSb290LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmICggZm9jdXNlZEVsZSApIHJldHVybjtcbiAgICAgICAgdGhpcy5fbWVnYVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5hdkl0ZW1zLmZvckVhY2goKG5hdikgPT4gbmF2Lm1lZ2FGb2N1cyA9IGZhbHNlKTtcbiAgICAgICAgICB0aGlzLmNsb3NlTWVnYU5hdigpO1xuICAgICAgICB9LCB0aGlzLmhvdmVyRGVsYXkpO1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZm9jdXNlZEVsZSA9IHRoaXMucmVuZGVyUm9vdC5hY3RpdmVFbGVtZW50O1xuICAgICAgICBpZiAoICFmb2N1c2VkRWxlICkge1xuICAgICAgICAgIHRoaXMuY2xvc2VBbGxTdWJOYXZzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgZWxlID0gZm9jdXNlZEVsZTtcbiAgICAgICAgd2hpbGUgKCBcbiAgICAgICAgICBlbGUgJiZcbiAgICAgICAgICBlbGUudGFnTmFtZSAhPT0gdGhpcy50YWdOYW1lICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoZWxlLmtleSkgXG4gICAgICAgICl7XG4gICAgICAgICAgZWxlID0gZWxlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAhZWxlLmtleSApIHJldHVybjtcbiAgICAgICAgbGV0IG5hdkxvY2F0aW9uID0gWy4uLmVsZS5rZXldO1xuICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gbmF2TG9jYXRpb24ucG9wKCk7XG4gICAgICAgIGxldCBuYXZTaWJsaW5ncyA9IG5hdkxvY2F0aW9uLmxlbmd0aCA9PSAwID8gdGhpcy5uYXZJdGVtcyA6IHRoaXMuZ2V0TmF2SXRlbShuYXZMb2NhdGlvbikuc3ViSXRlbXM7XG4gICAgICAgIG5hdlNpYmxpbmdzLmZvckVhY2goKHNpYmxpbmcsIGkpID0+IHtcbiAgICAgICAgICBpZiAoIGkgIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgc2libGluZy5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VBbGxTdWJOYXZzKHNpYmxpbmcuc3ViSXRlbXMsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0SXRlbU1vYmlsZVN0eWxlc1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBpbmxpbmUgc3R5bGVzIG9uIGEgbmF2IGVsZW1lbnQgKHVzZWQgZm9yIG1vYmlsZSB0cmFuc2l0aW9uIGFuaW1hdGlvbilcbiAgICogQHBhcmFtIHtBcnJheX0gbG9jYXRpb24gLSBDb29yZGluYXRlcyBvZiB0aGUgaXRlbSBpbiB0aGUgJ25hdkl0ZW1zJyBhcnJheS4gaS5lLiBbMCwgMSwgNF0uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gU3R5bGUgbWFwXG4gICAqL1xuICBfZ2V0SXRlbU1vYmlsZVN0eWxlcyhsb2NhdGlvbikge1xuICAgIGlmICggdGhpcy5icmVha1BvaW50cy5pc0Rlc2t0b3AoKSApIHJldHVybiB7fTtcbiAgICBsZXQgbmF2SXRlbSA9IHRoaXMuZ2V0TmF2SXRlbShsb2NhdGlvbik7XG4gICAgaWYgKCAhbmF2SXRlbS5pbmxpbmVTdHlsZXMgKSByZXR1cm4ge307XG4gICAgcmV0dXJuIG5hdkl0ZW0uaW5saW5lU3R5bGVzO1xuICB9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd1Y2QtdGhlbWUtcHJpbWFyeS1uYXYnLCBVY2RUaGVtZVByaW1hcnlOYXYpOyIsImltcG9ydCB7IGh0bWwsIGNzcyB9IGZyb20gJ2xpdCc7XG5cbmltcG9ydCBub3JtYWxpemVTdHlsZXMgZnJvbSBcIkB1Y2QtbGliL3RoZW1lLXNhc3Mvbm9ybWFsaXplLmNzcy5qc1wiO1xuaW1wb3J0IGZvcm1TdHlsZXMgZnJvbSBcIkB1Y2QtbGliL3RoZW1lLXNhc3MvMV9iYXNlX2h0bWwvX2Zvcm1zLmNzcy5qc1wiO1xuaW1wb3J0IG1lbnVTdHlsZXMgZnJvbSBcIkB1Y2QtbGliL3RoZW1lLXNhc3MvMl9iYXNlX2NsYXNzL19taXNjLmNzcy5qc1wiO1xuaW1wb3J0IHByaW1hcnlOYXZTdHlsZXMgZnJvbSBcIkB1Y2QtbGliL3RoZW1lLXNhc3MvNF9jb21wb25lbnQvX25hdi1wcmltYXJ5LmNzcy5qc1wiO1xuaW1wb3J0IHN1Yk5hdlRvZ2dsZVN0eWxlcyBmcm9tIFwiQHVjZC1saWIvdGhlbWUtc2Fzcy80X2NvbXBvbmVudC9fc3VibWVudS10b2dnbGUuY3NzLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZXMoKSB7XG4gIGNvbnN0IGVsZW1lbnRTdHlsZXMgPSBjc3NgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuICAgIC5zdWJtZW51LXRvZ2dsZSAqIHtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cbiAgICBidXR0b25bZGlzYWJsZWRdIHtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cbiAgICBAbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgICAgIG5hdi5wcmltYXJ5LW5hdi0tbWVnYSBsaS5kZXB0aC0wID4gdWwubWVudSB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuXG4gICAgICB1bC5tZW51IHVsLm1lbnUge1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgdWwubWVudSBsaS5zZi0taG92ZXIgPiB1bC5tZW51IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICB9XG4gICAgICB1bC5tZW51IGxpLmNsb3NpbmcgPiB1bC5tZW51IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICB9XG4gICAgICAubWVnYS1mb2N1cyAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGEsIFxuICAgICAgLm1lZ2EtZm9jdXMgLnByaW1hcnktbmF2X190b3AtbGluayBhOjpiZWZvcmUsIC5tZWdhLWZvY3VzIFxuICAgICAgLnByaW1hcnktbmF2X190b3AtbGluayBhOjphZnRlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDIyMywgMTI4KTtcbiAgICAgIH1cbiAgICAgIC5tZWdhLWZvY3VzIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYTpmb2N1cywgXG4gICAgICAubWVnYS1mb2N1cyAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6Zm9jdXM6OmJlZm9yZSwgXG4gICAgICAubWVnYS1mb2N1cyAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6Zm9jdXM6OmFmdGVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMTkxLCAwKTtcbiAgICAgIH1cbiAgICAgIC5tZWdhLWZvY3VzID4gdWwge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjU1LCAyNTEsIDIzNyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBAbWVkaWEgKG1heC13aWR0aDogOTkxcHgpIHtcbiAgICAgIHVsLm1lbnUgdWwubWVudSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICBib3JkZXItdG9wLXdpZHRoOiAwcHg7XG4gICAgICAgIGJvcmRlci1ib3R0b20td2lkdGg6IDBweDtcbiAgICAgICAgcGFkZGluZy10b3A6IDBweDtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDBweDtcbiAgICAgIH1cblxuICAgICAgdWwubWVudSB1bC5tZW51Lm1lbnUtLW9wZW4ge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIH1cblxuICAgIH1cbiAgYDtcblxuICByZXR1cm4gW1xuICAgIG5vcm1hbGl6ZVN0eWxlcyxcbiAgICBmb3JtU3R5bGVzLFxuICAgIG1lbnVTdHlsZXMsXG4gICAgcHJpbWFyeU5hdlN0eWxlcyxcbiAgICBzdWJOYXZUb2dnbGVTdHlsZXMsXG4gICAgZWxlbWVudFN0eWxlc1xuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCkgeyBcbnJldHVybiBodG1sYFxuPHN0eWxlPlxuICB1bC5tZW51IHVsLm1lbnUge1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgJHt0aGlzLmFuaW1hdGlvbkR1cmF0aW9uICsgXCJtc1wifSwgaGVpZ2h0ICR7dGhpcy5hbmltYXRpb25EdXJhdGlvbiArIFwibXNcIn07XG4gIH1cbiAgdWwubWVudSBsaS5zZi0taG92ZXIgPiB1bC5tZW51IHtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5ICR7dGhpcy5hbmltYXRpb25EdXJhdGlvbiArIFwibXNcIn0gJHt0aGlzLmhvdmVyRGVsYXkgKyBcIm1zXCJ9LCBoZWlnaHQgJHt0aGlzLmFuaW1hdGlvbkR1cmF0aW9uICsgXCJtc1wifTtcbiAgfVxuXG48L3N0eWxlPlxuPG5hdiBcbiAgaWQ9JHt0aGlzLl9jbGFzc1ByZWZpeH1cbiAgY2xhc3M9XCIke3RoaXMuX2dldE5hdkNsYXNzZXMoKX1cIiBcbiAgQG1vdXNlZW50ZXI9JHt0aGlzLl9vbk5hdk1vdXNlZW50ZXJ9XG4gIEBtb3VzZWxlYXZlPSR7dGhpcy5fb25OYXZNb3VzZWxlYXZlfVxuICBAZm9jdXNvdXQ9JHt0aGlzLl9vbk5hdkZvY3Vzb3V0fVxuICBAZm9jdXNpbj0ke3RoaXMuX29uTmF2Rm9jdXNpbn1cbiAgYXJpYS1sYWJlbD1cIk1haW4gTWVudVwiPlxuICA8dWwgY2xhc3M9XCJtZW51XCI+XG4gICAgJHt0aGlzLm5hdkl0ZW1zLm1hcCgobmF2SXRlbSwgaSkgPT4gdGhpcy5fcmVuZGVyTmF2SXRlbShuYXZJdGVtLCBbaV0pKX1cbiAgPC91bD5cbjwvbmF2PlxuYDt9IiwiZXhwb3J0IGNsYXNzIEJyZWFrUG9pbnRzQ29udHJvbGxlcntcblxuICBtb2JpbGVCcmVha1BvaW50ID0gOTkyO1xuICBcbiAgY29uc3RydWN0b3IoaG9zdCl7XG4gICAgKHRoaXMuaG9zdCA9IGhvc3QpLmFkZENvbnRyb2xsZXIodGhpcyk7XG4gIH1cblxuICAvKipcbiAgKiBAbWV0aG9kIGlzRGVza3RvcFxuICAqIEBkZXNjcmlwdGlvbiBJcyB0aGUgZGVza3RvcCB2aWV3IGN1cnJlbnRseSBhY3RpdmU/XG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICovXG4gICBpc0Rlc2t0b3AoKXtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggPj0gdGhpcy5tb2JpbGVCcmVha1BvaW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgaXNNb2JpbGVcbiAgICogQGRlc2NyaXB0aW9uIElzIHRoZSBtb2JpbGUgdmlldyBjdXJyZW50bHkgYWN0aXZlP1xuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzTW9iaWxlKCl7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVza3RvcCgpO1xuICB9ICBcbn0iLCJpbXBvcnQgeyBCcmVha1BvaW50c0NvbnRyb2xsZXIgfSBmcm9tIFwiLi9icmVhay1wb2ludHNcIjtcbmltcG9ydCB7IEludGVyc2VjdGlvbk9ic2VydmVyQ29udHJvbGxlciB9IGZyb20gXCIuL2ludGVyc2VjdGlvbi1vYnNlcnZlclwiO1xuaW1wb3J0IHsgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9tdXRhdGlvbi1vYnNlcnZlclwiO1xuaW1wb3J0IHsgV2FpdENvbnRyb2xsZXIgfSBmcm9tIFwiLi93YWl0XCI7XG5cbmV4cG9ydCB7XG4gIEJyZWFrUG9pbnRzQ29udHJvbGxlcixcbiAgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDb250cm9sbGVyLFxuICBNdXRhdGlvbk9ic2VydmVyQ29udHJvbGxlcixcbiAgV2FpdENvbnRyb2xsZXIsXG59OyIsIi8qKlxuICogQGNsYXNzIEludGVyc2VjdGlvbk9ic2VydmVyQ29udHJvbGxlclxuICogQGNsYXNzZGVzYyBMaXQgY29udHJvbGxlciB0aGF0IGF0dGFjaGVzIGFuIEludGVyc2VjdGlvbk9ic2VydmVyIHRvIGFuIGVsZW1lbnRcbiAqIFxuICogQHByb3BlcnR5IHtMaXRFbGVtZW50fSBob3N0IC0gJ3RoaXMnIGZyb20gYSBMaXQgZWxlbWVudFxuICogQHByb3BlcnR5IHtPYmplY3R9IG9wdGlvbnMgLSBJbnRlcnNlY3Rpb25PYnNlcnZlciBvcHRpb25zLiBEZWZhdWx0OiB7fVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGNhbGxiYWNrIC0gTmFtZSBvZiBlbGVtZW50IG1ldGhvZCBjYWxsZWQgb24gaW50ZXJzZWN0aW9uLiBEZWZhdWx0OiAnX29uSW50ZXJzZWN0aW9uJ1xuICogQHByb3BlcnR5IHtCb29sZWFufSBvYnNlcnZlU2VsZiAtIEF1dG9tYXRpY2FsbHkgb2JzZXJ2ZXMgaG9zdCBlbGVtZW50IG9uIGNvbm5lY3RlZC4gRGVmYXVsdDogdHJ1ZVxuICogXG4gKiBAZXhhbXBsZXNcbiAqIC8vIFRvIHdhdGNoIGZvciBlbGVtZW50J3MgaW50ZXJzZWN0aW9uIHdpdGggdmlld3BvcnQsIGluc3RhbnRpYXRlIGNsYXNzIGluIGVsZW1lbnQgY29uc3RydWN0b3I6XG4gKiBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDb250cm9sbGVyKHRoaXMpXG4gKiBcbiAqIC8vIE9yIHdhdGNoIGZvciBhIHNwZWNpZmljIGVsZW1lbnQgd2l0aGluIHlvdXIgTGl0IGVsZW1lbnQ6XG4gKiAvLyBJbiBjb25zdHJ1Y3RvcjpcbiAqIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDb250cm9sbGVyKHRoaXMsIHt9LCBcIl9vbk15RGl2SW50ZXJzZWN0aW9uXCIsIGZhbHNlKTtcbiAqIC8vIEluIGZpcnN0VXBkYXRlZDpcbiAqIGxldCBteURpdiA9IHRoaXMucmVuZGVyUm9vdC5nZXRFbGVtZW50QnlJZCgnbXktZGl2Jyk7XG4gKiB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyLm9ic2VydmVyLm9ic2VydmUobXktZGl2KTtcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDb250cm9sbGVye1xuICBob3N0O1xuICBvcHRpb25zO1xuICBjYWxsYmFjaztcbiAgb2JzZXJ2ZXI7XG4gIG9ic2VydmVTZWxmO1xuXG4gIGNvbnN0cnVjdG9yKGhvc3QsIG9wdGlvbnMgPSB7fSwgY2FsbGJhY2sgPSBcIl9vbkludGVyc2VjdGlvblwiLCBvYnNlcnZlU2VsZiA9IHRydWUpe1xuICAgICh0aGlzLmhvc3QgPSBob3N0KS5hZGRDb250cm9sbGVyKHRoaXMpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMub2JzZXJ2ZVNlbGYgPSBvYnNlcnZlU2VsZjtcbiAgfVxuXG4gIGhvc3RDb25uZWN0ZWQoKXtcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKHRoaXMuX2NhbGxiYWNrLmJpbmQodGhpcyksIHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKCB0aGlzLm9ic2VydmVTZWxmICkge1xuICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMuaG9zdCk7XG4gICAgfVxuICB9XG5cbiAgaG9zdERpc2Nvbm5lY3RlZCgpe1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgX2NhbGxiYWNrKGVudHJpZXMsIG9ic2VydmVyKXtcbiAgICBpZiAoICF0aGlzLmhvc3RbdGhpcy5jYWxsYmFja10pe1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgRWxlbWVudCBoYXMgbm8gJyR7dGhpcy5jYWxsYmFja30nIG1ldGhvZC4gXG4gICAgICAgIEVpdGhlciBhZGQgdGhpcyBtZXRob2QsIG9yIGNoYW5nZSB0aGUgJ2NhbGxiYWNrJyBhcmd1bWVudCBvbiBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5ob3N0W3RoaXMuY2FsbGJhY2tdKGVudHJpZXMsIG9ic2VydmVyKTtcblxuICB9XG59IiwiLyoqXG4gKiBAY2xhc3MgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXJcbiAqIEBjbGFzc2Rlc2MgTGl0IGNvbnRyb2xsZXIgdGhhdCBhdHRhY2hlcyBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gYW4gZWxlbWVudFxuICogXG4gKiBAcHJvcGVydHkge0xpdEVsZW1lbnR9IGhvc3QgLSAndGhpcycgZnJvbSBhIExpdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge09iamVjdH0gb3B0aW9ucyAtIE11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSBvcHRpb25zLiBEZWZhdWx0OiB7Y2hpbGRMaXN0OiB0cnVlfVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGNhbGxiYWNrIC0gTmFtZSBvZiBlbGVtZW50IG1ldGhvZCBjYWxsZWQgb24gbXV0YXRpb24uIERlZmF1bHQ6ICdfb25DaGlsZExpc3RNdXRhdGlvbidcbiAqIFxuICogQGV4YW1wbGVzXG4gKiAvLyBGb3IgYSBiYXNpYyBjaGlsZGxpc3Qgb2JzZXJ2ZXIsIGluc3RhbnRpYXRlIHRoaXMgY2xhc3MgaW4geW91ciBlbGVtZW50OlxuICogIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlckNvbnRyb2xsZXIodGhpcyk7XG4gKiBcbiAqIC8vIG9yIGN1c3RvbWl6ZSB0aGUgb3B0aW9ucy9jYWxsYmFjazpcbiAqICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXJDb250cm9sbGVyKHRoaXMsIHtjaGlsZExpc3Q6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWV9LCAnYURpZmZlcmVudENhbGxiYWNrTWV0aG9kJyk7XG4gKi9cbmV4cG9ydCBjbGFzcyBNdXRhdGlvbk9ic2VydmVyQ29udHJvbGxlciB7XG4gIGhvc3Q7XG4gIG9wdGlvbnM7XG4gIGNhbGxiYWNrO1xuXG4gIF9vYnNlcnZlcjtcblxuICBjb25zdHJ1Y3Rvcihob3N0LCBvcHRpb25zID0ge2NoaWxkTGlzdDogdHJ1ZX0sIGNhbGxiYWNrID0gXCJfb25DaGlsZExpc3RNdXRhdGlvblwiKXtcbiAgICAodGhpcy5ob3N0ID0gaG9zdCkuYWRkQ29udHJvbGxlcih0aGlzKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIGhvc3RDb25uZWN0ZWQoKXtcblxuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHRoaXMuX29uTXV0YXRpb24obXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpXG4gICAgKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuaG9zdCwgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLl9vbk11dGF0aW9uKCk7XG4gIH1cblxuICBob3N0RGlzY29ubmVjdGVkKCl7XG4gICAgdGhpcy5fb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgX29uTXV0YXRpb24obXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpe1xuICAgIGlmICggIXRoaXMuaG9zdFt0aGlzLmNhbGxiYWNrXSl7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBFbGVtZW50IGhhcyBubyAnJHt0aGlzLmNhbGxiYWNrfScgbWV0aG9kLiBcbiAgICAgICAgRWl0aGVyIGFkZCB0aGlzIG1ldGhvZCwgb3IgY2hhbmdlIHRoZSAnY2FsbGJhY2snIGFyZ3VtZW50IG9uIGluc3RhbnRpYXRpb24uYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5ob3N0W3RoaXMuY2FsbGJhY2tdKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKTtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBXYWl0Q29udHJvbGxlcntcbiAgaG9zdDtcblxuICBjb25zdHJ1Y3Rvcihob3N0KXtcbiAgICAodGhpcy5ob3N0ID0gaG9zdCkuYWRkQ29udHJvbGxlcih0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHdhaXRcbiAgICogQGRlc2NyaXB0aW9uIFdhaXQgZm9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaW1lIHRvIHdhaXQgKG1zKVxuICAgKiBAcmV0dXJucyBcbiAgICovXG4gIGFzeW5jIHdhaXQodGltZSl7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHdhaXRGb3JVcGRhdGVcbiAgICogQGRlc2NyaXB0aW9uIFJlcXVlc3RzIGFuZCB3YWl0cyBmb3IgTGl0IHVwZGF0ZS5cbiAgICovXG4gICBhc3luYyB3YWl0Rm9yVXBkYXRlKCl7XG4gICAgdGhpcy5ob3N0LnJlcXVlc3RVcGRhdGUoKTtcbiAgICBhd2FpdCB0aGlzLmhvc3QudXBkYXRlQ29tcGxldGU7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCB3YWl0Rm9yRnJhbWVzXG4gICAqIEBkZXNjcmlwdGlvbiBXYWl0IGZvciBzcGVjaWZpZWQgbnVtYmVyIG9mIGFuaW1hdGlvbiBmcmFtZXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN0IE51bWJlciBvZiBmcmFtZXNcbiAgICovXG4gICBhc3luYyB3YWl0Rm9yRnJhbWVzKGN0PTEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0OyBpKyspIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuXG59IiwiaW1wb3J0IE1peGluIGZyb20gJy4vbWl4aW4uanMnO1xuaW1wb3J0IHsgTWFpbkRvbUVsZW1lbnQgfSBmcm9tICcuL21haW4tZG9tLWVsZW1lbnQuanMnO1xuaW1wb3J0IHsgTmF2RWxlbWVudCB9IGZyb20gJy4vbmF2LWVsZW1lbnQuanMnO1xuXG5leHBvcnQge1xuICBNaXhpbiwgXG4gIE1haW5Eb21FbGVtZW50LCBcbiAgTmF2RWxlbWVudH07IiwiLyoqXG4gKiBAZnVuY3Rpb24gTWFpbkRvbUVsZW1lbnRcbiAqIEBwYXJhbSB7Q2xhc3N9IHN1cGVyQ2xhc3MgLSBMaXRFbGVtZW50IG9yIGNoaWxkIGNsYXNzLlxuICogQGRlc2NyaXB0aW9uIHNldCByZW5kZXIgY29udGV4dCBmb3IgbGl0IGVsZW1lbnQgdG8gbWFpbiBET00gaW5zdGVhZCBvZiB0aGVcbiAqIGRlZmF1bHQgc2hhZG93IHJvb3RcbiAqIFxuICogQHJldHVybnMge0NsYXNzfSBMaXRFbGVtZW50IHVwZGF0ZWQgY3JlYXRlUmVuZGVyUm9vdCBmdW5jdGlvbi5cbiAqL1xuY29uc3QgTWFpbkRvbUVsZW1lbnQgPSAoc3VwZXJDbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcblxuICAvKipcbiAgICogQG1ldGhvZCBjcmVhdGVSZW5kZXJSb290XG4gICAqIEBkZXNjcmlwdGlvbiBzZXQgdGhlIHJvb3QgZWxlbWVudCB0byByZW5kZXIgaW50b1xuICAgKiBcbiAgICogQHJldHVybnMge0xpdEVsZW1lbnR9XG4gICAqL1xuICBjcmVhdGVSZW5kZXJSb290KCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn07XG5cbmV4cG9ydCB7TWFpbkRvbUVsZW1lbnR9OyIsIi8qKlxuICogRnJvbTpcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQxODM5MTk4L2FwcGx5aW5nLWJlaGF2aW9ycy13aXRoLWpzLW1peGlucy1pbi1wb2x5bWVyLTJcbiAqKi9cbmNsYXNzIE1peGluQnVpbGRlciB7ICBcbiAgY29uc3RydWN0b3Ioc3VwZXJjbGFzcykge1xuICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3M7XG4gIH1cbiAgd2l0aCguLi5taXhpbnMpIHsgXG4gICAgcmV0dXJuIG1peGlucy5yZWR1Y2UoKGMsIG1peGluKSA9PiBtaXhpbihjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgfVxufVxuY29uc3QgTWl4aW4gPSAoc3VwZXJjbGFzcykgPT4gbmV3IE1peGluQnVpbGRlcihzdXBlcmNsYXNzKTtcblxuLy8gU2V0IGdsb2JhbCBpZiBhdmFpbGFibGVcbi8vIEh1bW1tbS4uLlxuLy8gaWYoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICkgeyBcbi8vICAgd2luZG93Lk1peGluID0gTWl4aW47XG4vLyB9XG4gIFxuZXhwb3J0IGRlZmF1bHQgTWl4aW47IiwiLyoqXG4gKiBAZnVuY3Rpb24gTmF2RWxlbWVudFxuICogQHBhcmFtIHtDbGFzc30gc3VwZXJDbGFzcyAtIExpdEVsZW1lbnQgb3IgY2hpbGQgY2xhc3MuXG4gKiBAZGVzY3JpcHRpb24gQWRkcyB1dGlsaXRpZXMgZm9yIG5hdmlnYXRpb24gdG8gYSBMaXRFbGVtZW50XG4gKiBcbiAqIEByZXR1cm5zIHtDbGFzc30gTGl0RWxlbWVudCB3aXRoIE5hdiB1dGlsaXRpZXMgYXR0YWNoZWRcbiAqL1xuY29uc3QgTmF2RWxlbWVudCA9IChzdXBlckNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyQ2xhc3Mge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYXZJdGVtcyA9IFtdO1xuICAgIHRoaXMubWF4RGVwdGggPSAyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgcGFyc2VDaGlsZHJlblxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIHRyZWUtbGlrZSBuYXYgQXJyYXkgc3RydWN0dXJlIGZyb20gZWxlbWVudCBjaGlsZHJlblxuICAgKiBAcGFyYW0ge0hUTUxDb2xsZWN0aW9ufSBjaGlsZHJlbiAtIEVsZW1lbnQgY2hpbGRyZW4gKG5vbi1zaGFkb3cpXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIHBhcnNlTmF2Q2hpbGRyZW4oIGNoaWxkcmVuPXRoaXMuY2hpbGRyZW4gKXtcbiAgICBpZiAoICFjaGlsZHJlbiApIHJldHVybiBbXTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbik7XG4gICAgbGV0IG5hdkl0ZW1zID0gY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gdGhpcy5fbWFrZU5hdkl0ZW1UcmVlKGNoaWxkKSkuZmlsdGVyKG5hdkl0ZW0gPT4gbmF2SXRlbS5saW5rVGV4dCk7XG4gICAgcmV0dXJuIG5hdkl0ZW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX21ha2VOYXZJdGVtVHJlZVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZGVzY3JpcHRpb24gRXh0cmFjdHMgbWVudSBpdGVtIGRhdGEgZnJvbSBET00gRWxlbWVudFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZSAtIEVsZW1lbnRcbiAgICogQHJldHVybnMge09iamVjdH0gRm9ybWF0dGVkIG9iamVjdCBkZXNjcmliaW5nIHRoZSBtZW51IGl0ZW0gYW5kIGl0cyBjaGlsZHJlblxuICAgKi9cbiAgX21ha2VOYXZJdGVtVHJlZShlbGUpe1xuICAgIGxldCBsaW5rVGV4dCwgaHJlZiwgc3ViSXRlbXMgPSBbXSwgaXNPcGVuPWZhbHNlLCBpbmxpbmVTdHlsZXM9e30sIG5ld1RhYj1mYWxzZTtcbiAgICBpZiAoIGVsZS50YWdOYW1lID09PSAnTEknICYmIGVsZS5jaGlsZHJlbi5sZW5ndGggPiAwKSBlbGUgPSBlbGUuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAoIGVsZS50YWdOYW1lID09PSAnQScgKSB7XG4gICAgICBsaW5rVGV4dCA9IGVsZS5pbm5lclRleHQ7XG4gICAgICBocmVmID0gZWxlLmhyZWY7XG4gICAgfSBlbHNlIGlmICggZWxlLnRhZ05hbWUgPT09ICdMSScgKSB7XG4gICAgICBsaW5rVGV4dCA9IGVsZS5pbm5lclRleHQ7XG4gICAgfSBlbHNlIGlmICggZWxlLnRhZ05hbWUgPT09ICdPTCcgfHwgZWxlLnRhZ05hbWUgPT09ICdVTCcgKSB7XG4gICAgICBsaW5rVGV4dCA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2xpbmstdGV4dCcpO1xuICAgICAgaHJlZiA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgIGlzT3BlbiA9IGVsZS5oYXNBdHRyaWJ1dGUoJ2lzLW9wZW4nKTtcblxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKGVsZS5jaGlsZHJlbikpIHtcbiAgICAgICAgbGV0IGNoaWxkSXRlbSA9IHRoaXMuX21ha2VOYXZJdGVtVHJlZShjaGlsZCk7XG4gICAgICAgIGlmICggY2hpbGRJdGVtLmxpbmtUZXh0ICkgc3ViSXRlbXMucHVzaChjaGlsZEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZWxlLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgPT0gJ19ibGFuaycpIG5ld1RhYiA9IHRydWU7XG5cbiAgICBpZiAoIGxpbmtUZXh0ICkgbGlua1RleHQgPSBsaW5rVGV4dC50cmltKCk7XG4gICAgcmV0dXJuIHtsaW5rVGV4dCwgaHJlZiwgc3ViSXRlbXMsIGlzT3BlbiwgaW5saW5lU3R5bGVzLCBuZXdUYWJ9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgZ2V0TmF2SXRlbVxuICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIGFuIGl0ZW0gZnJvbSB0aGUgbmF2SXRlbXMgYXJyYXkuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxvY2F0aW9uIC0gQ29vcmRpbmF0ZXMgb2YgdGhlIGl0ZW0gaW4gdGhlICduYXZJdGVtcycgYXJyYXkuIGkuZS4gWzAsIDEsIDRdLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0TmF2SXRlbShsb2NhdGlvbil7XG4gICAgbGV0IGFjY2Vzc29yID0gXCJ0aGlzLm5hdkl0ZW1zXCI7XG4gICAgaWYgKCBsb2NhdGlvbiAmJiBsb2NhdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBhY2Nlc3NvciArPSBcIltcIiArIGxvY2F0aW9uLmpvaW4oXCJdLnN1Ykl0ZW1zW1wiKSArIFwiXVwiO1xuICAgIH1cbiAgICByZXR1cm4gZXZhbChhY2Nlc3Nvcik7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBpdGVtSGFzU3ViTmF2XG4gICAqIEBkZXNjcmlwdGlvbiBVdGlsaXR5IGZ1bmN0aW9uIGZvciBkZXRlcm1pbmluZyBpZiBhIG1lbnUgaGFzIHN1Yml0ZW1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuYXZJdGVtIC0gQSBtZW1iZXIgb2YgdGhlIG5hdkl0ZW1zIGFycmF5LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGl0ZW1IYXNTdWJOYXYobmF2SXRlbSl7XG4gICAgaWYgKCBuYXZJdGVtICYmIG5hdkl0ZW0uc3ViSXRlbXMgJiYgbmF2SXRlbS5zdWJJdGVtcy5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGNsZWFyTW9iaWxlQW5pbWF0aW9uU3R5bGVzXG4gICAqIEBkZXNjcmlwdGlvbiBSZW1vdmVzIGlubGluZSBzdHlsZXMgb24gYSBuYXYgZWxlbWVudCAodXNlZCBmb3IgbW9iaWxlIHRyYW5zaXRpb24gYW5pbWF0aW9uKVxuICAgKiBAcGFyYW0ge09iamVjdH0gbmF2SXRlbSAtIE1lbWJlciBvZiB0aGUgdGhpcy5uYXZJdGVtcyBhcnJheVxuICAgKi9cbiAgY2xlYXJJdGVtSW5saW5lU3R5bGVzKG5hdkl0ZW0pe1xuICAgIGlmIChcbiAgICAgIG5hdkl0ZW0gJiZcbiAgICAgIG5hdkl0ZW0uaW5saW5lU3R5bGVzICYmIFxuICAgICAgT2JqZWN0LmtleXMobmF2SXRlbS5pbmxpbmVTdHlsZXMpLmxlbmd0aCA+IDAgXG4gICAgKSB7XG4gICAgICBuYXZJdGVtLmlubGluZVN0eWxlcyA9IHt9O1xuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKCk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge05hdkVsZW1lbnR9OyIsImltcG9ydCB7Y3NzfSBmcm9tICdsaXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG5cbmZpZWxkc2V0IHtcbiAgbWFyZ2luOiAxcmVtIDA7XG4gIHBhZGRpbmc6IDFyZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkICNmN2ZhZmQ7XG4gIGJvcmRlci10b3A6IDNweCBzb2xpZCAjMDIyODUxO1xufVxuZmllbGRzZXQgPiBsZWdlbmQge1xuICBwYWRkaW5nOiAwLjI1cmVtO1xuICBmb250LXNpemU6IDEuMTI1cmVtO1xufVxuXG5sYWJlbCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBwYWRkaW5nLWJvdHRvbTogMC4yNXJlbTtcbiAgY29sb3I6ICMwMjI4NTE7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbmlucHV0LFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDAuMjVyZW0gMC43NXJlbTtcbiAgYm9yZGVyOiAxcHggc29saWQgIzk5OTtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZTtcbiAgYm94LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMCwgMCwgMCwgMC4wNzUpIGluc2V0O1xuICBjb2xvcjogIzEzNjM5ZTtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gIG91dGxpbmU6IDA7XG59XG5pbnB1dDpmb2N1cyxcbnNlbGVjdDpmb2N1cyxcbnRleHRhcmVhOmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiAjZmZiZjAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmYmVkO1xuICBvdXRsaW5lOiBub25lO1xufVxuXG5pbnB1dCxcbnNlbGVjdCB7XG4gIGhlaWdodDogMi41cmVtO1xufVxuXG5pbnB1dCxcbnRleHRhcmVhLFxuc2VsZWN0IHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cblt0eXBlPXRleHRdLFxuW3R5cGU9c2VhcmNoXSxcblt0eXBlPXVybF0sXG5bdHlwZT1udW1iZXJdLFxudGV4dGFyZWEge1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuXG5idXR0b24sXG5bdHlwZT1zdWJtaXRdIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuYnV0dG9uOmZvY3VzLFxuW3R5cGU9c3VibWl0XTpmb2N1cyB7XG4gIGNvbG9yOiAjMDBiMmUzO1xufVxuXG5bdHlwZT1jaGVja2JveF0sXG5bdHlwZT1yYWRpb10ge1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBtYXJnaW4tcmlnaHQ6IDAuM2VtO1xufVxuXG5bdHlwZT1zZWFyY2hdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuYDsiLCJpbXBvcnQge2Nzc30gZnJvbSAnbGl0JztcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuXG5oMSB7XG4gIG1hcmdpbjogMC43NWVtIDAgMC4yNWVtO1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogIzAyMjg1MTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGxpbmUtaGVpZ2h0OiAxLjI7XG4gIGZvbnQtc2l6ZTogMS45MXJlbTtcbn1cbmgxOmZpcnN0LWNoaWxkIHtcbiAgbWFyZ2luLXRvcDogMDtcbn1cbmgxIGEge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5oMSBhOmhvdmVyLCBoMSBhOmZvY3VzIHtcbiAgY29sb3I6ICMwMjI4NTE7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xuICBoMSB7XG4gICAgZm9udC1zaXplOiAyLjk0cmVtO1xuICB9XG59XG5cbmgyIHtcbiAgbWFyZ2luOiAwLjc1ZW0gMCAwLjI1ZW07XG4gIHBhZGRpbmc6IDA7XG4gIGNvbG9yOiAjMDIyODUxO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgY29sb3I6ICMxMzYzOWU7XG4gIGZvbnQtc2l6ZTogMS42MDU1cmVtO1xufVxuaDI6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiAwO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIGgyIHtcbiAgICBmb250LXNpemU6IDIuMDk5NXJlbTtcbiAgfVxufVxuaDIgYSB7XG4gIGNvbG9yOiAjMTM2MzllO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbmgyIGE6aG92ZXIsIGgyIGE6Zm9jdXMge1xuICBjb2xvcjogIzEzNjM5ZTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG5oMyB7XG4gIG1hcmdpbjogMC43NWVtIDAgMC4yNWVtO1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogIzAyMjg1MTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGxpbmUtaGVpZ2h0OiAxLjI7XG4gIGNvbG9yOiAjNjY2O1xuICBmb250LXNpemU6IDEuMzMyNXJlbTtcbn1cbmgzOmZpcnN0LWNoaWxkIHtcbiAgbWFyZ2luLXRvcDogMDtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xuICBoMyB7XG4gICAgZm9udC1zaXplOiAxLjc0MjVyZW07XG4gIH1cbn1cbmgzIGEge1xuICBjb2xvcjogIzY2NjtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5oMyBhOmhvdmVyLCBoMyBhOmZvY3VzIHtcbiAgY29sb3I6ICM2NjY7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cblxuaDQge1xuICBtYXJnaW46IDAuNzVlbSAwIDAuMjVlbTtcbiAgcGFkZGluZzogMDtcbiAgY29sb3I6ICMwMjI4NTE7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogODAwO1xuICBsaW5lLWhlaWdodDogMS4yO1xuICBmb250LXNpemU6IDEuMDkycmVtO1xufVxuaDQ6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiAwO1xufVxuaDQgYSB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbmg0IGE6aG92ZXIsIGg0IGE6Zm9jdXMge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIGg0IHtcbiAgICBmb250LXNpemU6IDEuNDI4cmVtO1xuICB9XG59XG5cbmg1IHtcbiAgbWFyZ2luOiAwLjc1ZW0gMCAwLjI1ZW07XG4gIHBhZGRpbmc6IDA7XG4gIGNvbG9yOiAjMDIyODUxO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgZm9udC1zaXplOiAxcmVtO1xufVxuaDU6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiAwO1xufVxuaDUgYSB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbmg1IGE6aG92ZXIsIGg1IGE6Zm9jdXMge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIGg1IHtcbiAgICBmb250LXNpemU6IDEuMjA3cmVtO1xuICB9XG59XG5cbmg2IHtcbiAgbWFyZ2luOiAwLjc1ZW0gMCAwLjI1ZW07XG4gIHBhZGRpbmc6IDA7XG4gIGNvbG9yOiAjMDIyODUxO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgZm9udC1zaXplOiAxcmVtO1xufVxuaDY6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiAwO1xufVxuaDYgYSB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbmg2IGE6aG92ZXIsIGg2IGE6Zm9jdXMge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG5gOyIsImltcG9ydCB7Y3NzfSBmcm9tICdsaXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG5cbi5tZW51IHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwIDAgMCAxLjI1cmVtO1xuICBwYWRkaW5nLWxlZnQ6IDA7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG4ubWVudSBsaSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG4ubWVudSBsaSB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMCAwIDAgMS4yNXJlbTtcbiAgcGFkZGluZy1sZWZ0OiAwO1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuLm1lbnUgbGkgbGkge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuXG4udmlldy1hbGwge1xuICBkaXNwbGF5OiBibG9jaztcbiAgcGFkZGluZy10b3A6IDAuNXJlbTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNjY2UwZjM7XG59XG5cbi5zZi11bmRlcmxpbmUge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2Y3ZmFmZDtcbn1cblxuYDsiLCJpbXBvcnQge2Nzc30gZnJvbSAnbGl0JztcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuXG4uaGVhZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYm94LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMiwgNDAsIDgxLCAwLjE1KTtcbn1cbi5oZWFkZXJfX2JhciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG1pbi1oZWlnaHQ6IDJyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNkOGQ4ZDg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogOTkxcHgpIHtcbiAgLmhlYWRlcl9fYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4uaGVhZGVyX191bml2ZXJzaXR5IHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAycmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAwLjc1cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1O1xufVxuLmhlYWRlcl9fdW5pdmVyc2l0eTpiZWZvcmUge1xuICB3aWR0aDogMC43NXJlbTtcbiAgaGVpZ2h0OiAycmVtO1xuICBtYXJnaW4tcmlnaHQ6IDAuNzVyZW07XG4gIG1hcmdpbi1sZWZ0OiAtMC43NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTtcbiAgY2xpcC1wYXRoOiBwb2x5Z29uKDkzJSAwLCAxMTAlIDAsIDExMCUgMTAyJSwgMCUgMTAyJSk7XG4gIGNvbnRlbnQ6IFwiXCI7XG59XG4uaGVhZGVyX191bml2ZXJzaXR5IGEge1xuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW4tbGVmdDogMC41cmVtO1xufVxuLmhlYWRlciAudWNkLWxvZ28ge1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiAxLjI1cmVtO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5oZWFkZXIgLnVjZC1sb2dvIHtcbiAgICBoZWlnaHQ6IDAuNzVyZW07XG4gIH1cbn1cbi5oZWFkZXJfX25hdmJhciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMjI4NTE7XG4gIGJveC1zaGFkb3c6IDAgMnB4IDFweCByZ2JhKDIsIDQwLCA4MSwgMC4xNSk7XG59XG4uaGFzLW1lZ2EgLmhlYWRlcl9fbmF2YmFyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbn1cblxuLnNpdGUtbG9nbyB7XG4gIG1heC1oZWlnaHQ6IDYuMjVyZW07XG59XG5cbmA7IiwiaW1wb3J0IHtjc3N9IGZyb20gJ2xpdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcblxuLm1vYmlsZS1iYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtaW4taGVpZ2h0OiAzLjI1cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDIyODUxO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5tb2JpbGUtYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4ubW9iaWxlLWJhcl9fbmF2LXRvZ2dsZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1zaHJpbms6IDA7XG4gIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzEzNjM5ZTtcbn1cbi5tb2JpbGUtYmFyX19uYXYtdG9nZ2xlOmJlZm9yZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IC0xcmVtO1xuICB3aWR0aDogMXJlbTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDIyODUxO1xuICBjb250ZW50OiBcIlwiO1xuICB0cmFuc2Zvcm06IHNrZXdYKDE2ZGVnKTtcbn1cbi5tb2JpbGUtYmFyX19uYXYtdG9nZ2xlOmFmdGVyIHtcbiAgd2lkdGg6IDFyZW07XG4gIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICMxNDQ0N2E7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHRyYW5zZm9ybTogc2tld1goMTZkZWcpO1xufVxuLm1vYmlsZS1iYXJfX2ZpeGVkLXNpdGUtbmFtZSB7XG4gIHotaW5kZXg6IDE7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgd2lkdGg6IDA7XG4gIGhlaWdodDogMDtcbiAgcGFkZGluZy1yaWdodDogMXJlbTtcbiAgY29sb3I6ICNmZmY7XG4gIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiB2aXNpYmlsaXR5IDBzLCBvcGFjaXR5IDAuNXMgbGluZWFyO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIC5tb2JpbGUtYmFyX19maXhlZC1zaXRlLW5hbWUge1xuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgICBsaW5lLWhlaWdodDogMTtcbiAgfVxufVxuLmlzLWZpeGVkIC5tb2JpbGUtYmFyX19maXhlZC1zaXRlLW5hbWUge1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBvcGFjaXR5OiAxO1xufVxuLm1vYmlsZS1iYXJfX2ZpeGVkLXNpdGUtbmFtZSBhIHtcbiAgY29sb3I6ICNmZmY7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbi5tb2JpbGUtYmFyX19maXhlZC1zaXRlLW5hbWUgYTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbi5tb2JpbGUtYmFyX191bml2ZXJzaXR5IHtcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbGluZS1oZWlnaHQ6IDE7XG59XG4uaXMtZml4ZWQgLm1vYmlsZS1iYXJfX3VuaXZlcnNpdHkge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG5gOyIsImltcG9ydCB7Y3NzfSBmcm9tICdsaXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG5cbkBtZWRpYSAobWF4LXdpZHRoOiA5OTFweCkge1xuICAub2ZmLWNhbnZhcyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDgzMDtcbiAgICB3aWR0aDogNzB2dztcbiAgICBtaW4td2lkdGg6IDE1cmVtO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzO1xuICB9XG4gIC5vZmYtY2FudmFzX19jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiBzdGF0aWM7XG4gIH1cbiAgLm1lbnUtLWhpZGRlbiAub2ZmLWNhbnZhc19fY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIC5vZmYtY2FudmFzLS1maXhlZCwgLmwtaGVhZGVyLS1maXhlZCAub2ZmLWNhbnZhcyB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHotaW5kZXg6IDEwMDA7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gIH1cbiAgLm9mZi1jYW52YXMtLWZpeGVkIC5vZmYtY2FudmFzX19jb250YWluZXIsIC5sLWhlYWRlci0tZml4ZWQgLm9mZi1jYW52YXMgLm9mZi1jYW52YXNfX2NvbnRhaW5lciB7XG4gICAgcGFkZGluZy1ib3R0b206IDlyZW07XG4gIH1cbiAgLm9mZi1jYW52YXMtLWxlZnQge1xuICAgIGxlZnQ6IDA7XG4gIH1cbiAgLm1lbnUtLWNsb3NlZCAub2ZmLWNhbnZhcy0tbGVmdCB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDUlKTtcbiAgfVxuICAub2ZmLWNhbnZhcy0tcmlnaHQge1xuICAgIHJpZ2h0OiAwO1xuICB9XG4gIC5tZW51LS1jbG9zZWQgLm9mZi1jYW52YXMtLXJpZ2h0IHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTA1JSk7XG4gIH1cbiAgLm1lbnUtLW9wZW4gLm9mZi1jYW52YXMge1xuICAgIGJveC1zaGFkb3c6IDAgMTBweCAxMHB4IDVweCByZ2JhKDI1LCAyNSwgMjUsIDAuNCk7XG4gIH1cbn1cblxuYDsiLCJpbXBvcnQge2Nzc30gZnJvbSAnbGl0JztcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuXG5AY2hhcnNldCBcIlVURi04XCI7XG4ucHJpbWFyeS1uYXYge1xuICBtaW4taGVpZ2h0OiAzLjI1cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5wcmltYXJ5LW5hdiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICB9XG4gIC5wcmltYXJ5LW5hdiB1bCB1bCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAucHJpbWFyeS1uYXYgbGkge1xuICAgIGZsb2F0OiBsZWZ0O1xuICB9XG4gIC5wcmltYXJ5LW5hdiBsaTpob3ZlciB1bCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmJlZDtcbiAgfVxuICAucHJpbWFyeS1uYXYgbGkgbGkge1xuICAgIGZsb2F0OiBub25lO1xuICB9XG4gIC5wcmltYXJ5LW5hdiBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYSwgLnByaW1hcnktbmF2IGxpOmZvY3VzLXdpdGhpbiA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYSwgLnByaW1hcnktbmF2IGxpOmhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgY29sb3I6ICMwMjI4NTE7XG4gIH1cbiAgLnByaW1hcnktbmF2IC5zdWJtZW51LXRvZ2dsZSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuLnByaW1hcnktbmF2IGEsIC5wcmltYXJ5LW5hdl9fbm9saW5rIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMC43NXJlbTtcbiAgYm9yZGVyLWJvdHRvbTogMC4xNXJlbSBzb2xpZCAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGJlYWY3O1xuICBjb2xvcjogIzAyMjg1MTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5wcmltYXJ5LW5hdiBhLCAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgbWFyZ2luLWxlZnQ6IDFyZW07XG4gICAgcGFkZGluZzogMDtcbiAgICBib3JkZXItYm90dG9tOiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgbGluZS1oZWlnaHQ6IDMuMjVyZW07XG4gIH1cbiAgLnByaW1hcnktbmF2IGE6YmVmb3JlLCAucHJpbWFyeS1uYXZfX25vbGluazpiZWZvcmUge1xuICAgIHdpZHRoOiAxcmVtO1xuICAgIGhlaWdodDogMy4yNXJlbTtcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcbiAgICBtYXJnaW4tbGVmdDogLTFyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgY2xpcC1wYXRoOiBwb2x5Z29uKDkzJSAwLCAxMTAlIDAsIDExMCUgMTAyJSwgMCUgMTAyJSk7XG4gICAgY29udGVudDogXCJcIjtcbiAgfVxuICAucHJpbWFyeS1uYXYgYTpmb2N1czpiZWZvcmUsIC5wcmltYXJ5LW5hdiBhOmhvdmVyOmJlZm9yZSwgLnByaW1hcnktbmF2X19ub2xpbms6Zm9jdXM6YmVmb3JlLCAucHJpbWFyeS1uYXZfX25vbGluazpob3ZlcjpiZWZvcmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG4gIH1cbiAgLnByaW1hcnktbmF2IGE6YWZ0ZXIsIC5wcmltYXJ5LW5hdl9fbm9saW5rOmFmdGVyIHtcbiAgICB6LWluZGV4OiAxO1xuICAgIHdpZHRoOiAxcmVtO1xuICAgIGhlaWdodDogMy4yNXJlbTtcbiAgICBtYXJnaW4tcmlnaHQ6IC0xcmVtO1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgY2xpcC1wYXRoOiBwb2x5Z29uKC0ycHggLTJweCwgMTAwJSAtMnB4LCA3JSAxMDIlLCAtMnB4IDEwMCUpO1xuICAgIGNvbnRlbnQ6IFwiXCI7XG4gIH1cbiAgLnByaW1hcnktbmF2IGE6Zm9jdXM6YWZ0ZXIsIC5wcmltYXJ5LW5hdiBhOmhvdmVyOmFmdGVyLCAucHJpbWFyeS1uYXZfX25vbGluazpmb2N1czphZnRlciwgLnByaW1hcnktbmF2X19ub2xpbms6aG92ZXI6YWZ0ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG4gIH1cbn1cbi5wcmltYXJ5LW5hdiBhOmhvdmVyLCAucHJpbWFyeS1uYXZfX25vbGluazpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG59XG4ucHJpbWFyeS1uYXYgYTpmb2N1cyxcbi5wcmltYXJ5LW5hdiBhIC5hY3RpdmUsIC5wcmltYXJ5LW5hdl9fbm9saW5rOmZvY3VzLFxuLnByaW1hcnktbmF2X19ub2xpbmsgLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLnByaW1hcnktbmF2X190b3AtbGluayBhLCAucHJpbWFyeS1uYXZfX3RvcC1saW5rIC5wcmltYXJ5LW5hdl9fbm9saW5rIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG4gIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYTpob3ZlciwgLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluazpob3ZlciB7XG4gICAgY29sb3I6ICMwMjI4NTE7XG4gIH1cbn1cbi5wcmltYXJ5LW5hdiBsaSBsaSBhLCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gIGZsZXgtZ3JvdzogMTtcbiAgYm9yZGVyLWNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRlOWFjO1xuICBmb250LXdlaWdodDogNDAwO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDk5MXB4KSB7XG4gIC5wcmltYXJ5LW5hdiBsaSBsaSBhLCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB9XG4gIC5wcmltYXJ5LW5hdiBsaSBsaSBhOmJlZm9yZSwgbGkgbGkgLnByaW1hcnktbmF2X19ub2xpbms6YmVmb3JlIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcbiAgICBmb250LWZhbWlseTogXCJGb250IEF3ZXNvbWUgNSBGcmVlXCI7XG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgfVxuICAucHJpbWFyeS1uYXYgbGkgbGkgYTpiZWZvcmUsIGxpIGxpIC5wcmltYXJ5LW5hdl9fbm9saW5rOmJlZm9yZSB7XG4gICAgY29sb3I6ICNmZmJmMDA7XG4gICAgY29udGVudDogXCLvgqlcIjtcbiAgICBmb250LXNpemU6IDEuMjVlbTtcbiAgfVxuICAucHJpbWFyeS1uYXYgbGkgbGkgYTpmb2N1czpiZWZvcmUsIC5wcmltYXJ5LW5hdiBsaSBsaSBhOmhvdmVyOmJlZm9yZSwgbGkgbGkgLnByaW1hcnktbmF2X19ub2xpbms6Zm9jdXM6YmVmb3JlLCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluazpob3ZlcjpiZWZvcmUge1xuICAgIGNvbG9yOiAjMDIyODUxO1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLnByaW1hcnktbmF2IGxpIGxpIGEsIGxpIGxpIC5wcmltYXJ5LW5hdl9fbm9saW5rIHtcbiAgICBtYXJnaW4tbGVmdDogMDtcbiAgICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgICBmb250LXNpemU6IDAuOTM3NWVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM1O1xuICB9XG4gIC5wcmltYXJ5LW5hdiBsaSBsaSBhOmZvY3VzLCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluazpmb2N1cyB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmYmYwMDtcbiAgfVxuICAucHJpbWFyeS1uYXYgbGkgbGkgYTpiZWZvcmUsIC5wcmltYXJ5LW5hdiBsaSBsaSBhOmFmdGVyLCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluazpiZWZvcmUsIGxpIGxpIC5wcmltYXJ5LW5hdl9fbm9saW5rOmFmdGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4ucHJpbWFyeS1uYXYgbGkgbGkgbGkgYSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY5ZTY7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLnByaW1hcnktbmF2LS1qdXN0aWZ5ID4gLm1lbnUge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgfVxuICAucHJpbWFyeS1uYXYtLWp1c3RpZnkgbGkge1xuICAgIGZsb2F0OiBub25lO1xuICAgIGZsZXgtYmFzaXM6IDA7XG4gICAgZmxleC1ncm93OiAxO1xuICAgIHdpZHRoOiBhdXRvO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tanVzdGlmeSBsaTpsYXN0LWNoaWxkIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYSwgLnByaW1hcnktbmF2LS1qdXN0aWZ5IGxpOmxhc3QtY2hpbGQgLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tanVzdGlmeSBhOmFmdGVyLFxuLnByaW1hcnktbmF2LS1qdXN0aWZ5IC5wcmltYXJ5LW5hdl9fbm9saW5rOmFmdGVyIHtcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5wcmltYXJ5LW5hdi0tbWVnYSB7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBtYXgtaGVpZ2h0OiAzLjI1cmVtO1xuICAgIG1hcmdpbi1yaWdodDogLTFyZW07XG4gICAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjNzO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tbWVnYS5pcy1ob3ZlciB7XG4gICAgbWF4LWhlaWdodDogNjAwcHg7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1tZWdhIGE6YWZ0ZXIsXG4ucHJpbWFyeS1uYXYtLW1lZ2EgLnByaW1hcnktbmF2X19ub2xpbms6YWZ0ZXIge1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tbWVnYSA+IC5tZW51IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgfVxuICAucHJpbWFyeS1uYXYtLW1lZ2EgbGkge1xuICAgIGZsb2F0OiBub25lO1xuICAgIHdpZHRoOiBhdXRvO1xuICAgIG1pbi13aWR0aDogOWVtO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tbWVnYSBsaSBsaSBhLFxuLnByaW1hcnktbmF2LS1tZWdhIGxpIGxpIC5wcmltYXJ5LW5hdl9fbm9saW5rIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tbWVnYSBsaTpob3ZlciAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGEsXG4ucHJpbWFyeS1uYXYtLW1lZ2EgbGk6aG92ZXIgLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZGY4MDtcbiAgfVxuICAucHJpbWFyeS1uYXYtLW1lZ2EgbGk6aG92ZXIgLnByaW1hcnktbmF2X190b3AtbGluayBhOmJlZm9yZSwgLnByaW1hcnktbmF2LS1tZWdhIGxpOmhvdmVyIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYTphZnRlcixcbi5wcmltYXJ5LW5hdi0tbWVnYSBsaTpob3ZlciAucHJpbWFyeS1uYXZfX3RvcC1saW5rIC5wcmltYXJ5LW5hdl9fbm9saW5rOmJlZm9yZSxcbi5wcmltYXJ5LW5hdi0tbWVnYSBsaTpob3ZlciAucHJpbWFyeS1uYXZfX3RvcC1saW5rIC5wcmltYXJ5LW5hdl9fbm9saW5rOmFmdGVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZkZjgwO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tbWVnYSBsaSAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1tZWdhIGxpIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYTpob3ZlcjpiZWZvcmUsIC5wcmltYXJ5LW5hdi0tbWVnYSBsaSAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6aG92ZXI6YWZ0ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1tZWdhIC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMjI4NTE7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA5OTJweCkge1xuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCB7XG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAtMXB4IDAgIzE0NDQ3YTtcbiAgfVxuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaSB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIHVsIHVsIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgei1pbmRleDogODQwO1xuICAgIHRvcDogMTAwJTtcbiAgICBsZWZ0OiAwO1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgbWluLXdpZHRoOiAxMmVtO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggdWwgdWwgdWwge1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAxMDAlO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIGxpIGxpIGEsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaSBsaSAucHJpbWFyeS1uYXZfX25vbGluayB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmJlZDtcbiAgfVxuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaSBsaSBsaSBhLFxuLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGkgbGkgbGkgLnByaW1hcnktbmF2X19ub2xpbmsge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZWQ7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGkgbGkgbGkgbGkgYSxcbi5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIGxpIGxpIGxpIGxpIC5wcmltYXJ5LW5hdl9fbm9saW5rIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOWU2O1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3Ige1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMXJlbTtcbiAgICBoZWlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLXJpZ2h0OiAtMC41cmVtO1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgIHBhZGRpbmctdG9wOiAwO1xuICAgIHBhZGRpbmctYm90dG9tOiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3I6YWZ0ZXIge1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgZm9udC1mYW1pbHk6IFwiRm9udCBBd2Vzb21lIDUgRnJlZVwiO1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggLnByaW1hcnktbmF2X19zdWJtZW51LWluZGljYXRvcjpmb2N1cyB7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgfVxuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAucHJpbWFyeS1uYXZfX3N1Ym1lbnUtaW5kaWNhdG9yOmFmdGVyIHtcbiAgICBjb2xvcjogI2ZmYmYwMDtcbiAgICBjb250ZW50OiBcIu+BlFwiO1xuICAgIGZvbnQtc2l6ZTogMC43NWVtO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIGxpIGxpIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3I6YWZ0ZXIge1xuICAgIGNvbG9yOiAjMDIyODUxO1xuICB9XG4gIC5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIGxpIGxpIGxpIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3Ige1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGk6aG92ZXIgPiB1bCxcbi5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIC5zZi0taG92ZXIgPiB1bCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGk6aG92ZXIgPiAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGEsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgLnByaW1hcnktbmF2X19ub2xpbmssXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayBhLFxuLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggLnNmLS1ob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgLnByaW1hcnktbmF2X19ub2xpbmsge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmJmMDA7XG4gIH1cbiAgLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGk6aG92ZXIgPiAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6YmVmb3JlLCAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYTphZnRlcixcbi5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIGxpOmhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluazpiZWZvcmUsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgLnByaW1hcnktbmF2X19ub2xpbms6YWZ0ZXIsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayBhOmJlZm9yZSxcbi5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIC5zZi0taG92ZXIgPiAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGE6YWZ0ZXIsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluazpiZWZvcmUsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluazphZnRlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmYmYwMDtcbiAgfVxuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYSAucHJpbWFyeS1uYXZfX3N1Ym1lbnUtaW5kaWNhdG9yOmFmdGVyLFxuLnByaW1hcnktbmF2LS1zdXBlcmZpc2ggbGk6aG92ZXIgPiAucHJpbWFyeS1uYXZfX3RvcC1saW5rIC5wcmltYXJ5LW5hdl9fbm9saW5rIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3I6YWZ0ZXIsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayBhIC5wcmltYXJ5LW5hdl9fc3VibWVudS1pbmRpY2F0b3I6YWZ0ZXIsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCAuc2YtLWhvdmVyID4gLnByaW1hcnktbmF2X190b3AtbGluayAucHJpbWFyeS1uYXZfX25vbGluayAucHJpbWFyeS1uYXZfX3N1Ym1lbnUtaW5kaWNhdG9yOmFmdGVyIHtcbiAgICBjb2xvcjogIzAyMjg1MTtcbiAgfVxuICAucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgYSxcbi5wcmltYXJ5LW5hdi0tc3VwZXJmaXNoIC5zZi0taG92ZXIgPiAucHJpbWFyeS1uYXZfX3RvcC1saW5rIGEsXG4ucHJpbWFyeS1uYXYtLXN1cGVyZmlzaCBsaTpob3ZlciA+IC5wcmltYXJ5LW5hdl9fdG9wLWxpbmsgLnByaW1hcnktbmF2X19ub2xpbmsge1xuICAgIGNvbG9yOiAjMDIyODUxO1xuICB9XG59XG4ucHJpbWFyeS1uYXYgLnN1Ym1lbnUtdG9nZ2xlOmZvY3VzIHtcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgM3B4ICNmZmJmMDA7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbmA7IiwiaW1wb3J0IHtjc3N9IGZyb20gJ2xpdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcblxuLm5hdi10b2dnbGUge1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LWluZGVudDogMTEwJTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiAzLjc1cmVtO1xuICBoZWlnaHQ6IDMuMjVyZW07XG4gIHBhZGRpbmc6IDA7XG4gIGJvcmRlcjogMDtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHRleHQtaW5kZW50OiAzMDAlO1xufVxuLm5hdi10b2dnbGU6Zm9jdXMge1xuICBvdXRsaW5lOiBkb3R0ZWQgI2ZmYmYwMDtcbiAgb3V0bGluZS1vZmZzZXQ6IC0wLjVyZW07XG59XG4ubmF2LXRvZ2dsZV9faWNvbi0tbWVudSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLXRvcDogOHB4O1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIG1hcmdpbjogMDtcbn1cbi5uYXYtdG9nZ2xlX19pY29uLS1tZW51LCAubmF2LXRvZ2dsZV9faWNvbi0tbWVudTo6YmVmb3JlLCAubmF2LXRvZ2dsZV9faWNvbi0tbWVudTo6YWZ0ZXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEuNDQ0NDQ0NDQ0NHJlbTtcbiAgaGVpZ2h0OiAzcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIG91dGxpbmU6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgLXdlYmtpdC10cmFuc2l0aW9uLXByb3BlcnR5OiBiYWNrZ3JvdW5kLWNvbG9yLCAtd2Via2l0LXRyYW5zZm9ybTtcbiAgLW1vei10cmFuc2l0aW9uLXByb3BlcnR5OiBiYWNrZ3JvdW5kLWNvbG9yLCAtbW96LXRyYW5zZm9ybTtcbiAgLW8tdHJhbnNpdGlvbi1wcm9wZXJ0eTogYmFja2dyb3VuZC1jb2xvciwgLW8tdHJhbnNmb3JtO1xuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBiYWNrZ3JvdW5kLWNvbG9yLCB0cmFuc2Zvcm07XG4gIC13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbjogMC4zcztcbiAgLW1vei10cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjNzO1xuICAtby10cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjNzO1xuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjNzO1xufVxuLm5hdi10b2dnbGVfX2ljb24tLW1lbnU6OmJlZm9yZSwgLm5hdi10b2dnbGVfX2ljb24tLW1lbnU6OmFmdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBjb250ZW50OiBcIlwiO1xufVxuLm5hdi10b2dnbGVfX2ljb24tLW1lbnU6OmJlZm9yZSB7XG4gIHRvcDogLThweDtcbn1cbi5uYXYtdG9nZ2xlX19pY29uLS1tZW51OjphZnRlciB7XG4gIHRvcDogOHB4O1xufVxuLm5hdi10b2dnbGUtLWFjdGl2ZSAubmF2LXRvZ2dsZV9faWNvbi0tbWVudSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuLm5hdi10b2dnbGUtLWFjdGl2ZSAubmF2LXRvZ2dsZV9faWNvbi0tbWVudTo6YmVmb3JlIHtcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KSByb3RhdGUoNDVkZWcpO1xuICAtbW96LXRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpIHJvdGF0ZSg0NWRlZyk7XG4gIC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KSByb3RhdGUoNDVkZWcpO1xuICAtby10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KSByb3RhdGUoNDVkZWcpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KSByb3RhdGUoNDVkZWcpO1xufVxuLm5hdi10b2dnbGUtLWFjdGl2ZSAubmF2LXRvZ2dsZV9faWNvbi0tbWVudTo6YWZ0ZXIge1xuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KSByb3RhdGUoLTQ1ZGVnKTtcbiAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLThweCkgcm90YXRlKC00NWRlZyk7XG4gIC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLThweCkgcm90YXRlKC00NWRlZyk7XG4gIC1vLXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KSByb3RhdGUoLTQ1ZGVnKTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04cHgpIHJvdGF0ZSgtNDVkZWcpO1xufVxuXG5gOyIsImltcG9ydCB7Y3NzfSBmcm9tICdsaXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG5cbi5zaXRlLWJyYW5kaW5nIHtcbiAgLS1vLW1lZGlhLWd1dHRlcjogdmFyKC0tby1tZWRpYS1ndXR0ZXItZGVmYXVsdCwgMXJlbSk7XG4gIC0tby1tZWRpYS1ndXR0ZXItLXJpZ2h0OiB2YXIoLS1vLW1lZGlhLWd1dHRlci1kZWZhdWx0LCAxcmVtKTtcbiAgLS1vLW1lZGlhLWd1dHRlci0tbGVmdDogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uc2l0ZS1icmFuZGluZ19fZmlndXJlIHtcbiAgbWFyZ2luLXJpZ2h0OiB2YXIoLS1vLW1lZGlhLWd1dHRlci0tcmlnaHQpO1xuICBtYXJnaW4tbGVmdDogdmFyKC0tby1tZWRpYS1ndXR0ZXItLWxlZnQpO1xufVxuLnNpdGUtYnJhbmRpbmdfX2JvZHkge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxleDogMTtcbn1cbi5zaXRlLWJyYW5kaW5nX19ib2R5LFxuLnNpdGUtYnJhbmRpbmdfX2JvZHkgPiA6bGFzdC1jaGlsZCB7XG4gIG1hcmdpbi1ib3R0b206IDA7XG59XG4uc2l0ZS1icmFuZGluZy0tc21hbGwge1xuICAtLW8tbWVkaWEtZ3V0dGVyOiAwLjVyZW07XG4gIC0tby1tZWRpYS1ndXR0ZXItLXJpZ2h0OiB2YXIoLS1vLW1lZGlhLWd1dHRlcik7XG59XG4uc2l0ZS1icmFuZGluZy0tbGFyZ2Uge1xuICAtLW8tbWVkaWEtZ3V0dGVyOiAycmVtO1xuICAtLW8tbWVkaWEtZ3V0dGVyLS1yaWdodDogdmFyKC0tby1tZWRpYS1ndXR0ZXIpO1xufVxuLnNpdGUtYnJhbmRpbmctLXJldiB7XG4gIC0tby1tZWRpYS1ndXR0ZXItLXJpZ2h0OiAwO1xuICAtLW8tbWVkaWEtZ3V0dGVyLS1sZWZ0OiB2YXIoLS1vLW1lZGlhLWd1dHRlciwgMXJlbSk7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcbn1cbi5zaXRlLWJyYW5kaW5nLS1mbHVzaCB7XG4gIC0tby1tZWRpYS1ndXR0ZXItLXJpZ2h0OiAwO1xuICAtLW8tbWVkaWEtZ3V0dGVyLS1sZWZ0OiAwO1xufVxuLnNpdGUtYnJhbmRpbmdfX2ZpZ3VyZSB7XG4gIG1hcmdpbi1yaWdodDogdmFyKC0tby1tZWRpYS1ndXR0ZXItLXJpZ2h0KTtcbiAgbWFyZ2luLWxlZnQ6IHZhcigtLW8tbWVkaWEtZ3V0dGVyLS1sZWZ0KTtcbn1cbi5zaXRlLWJyYW5kaW5nX19ib2R5IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZsZXg6IDE7XG59XG4uc2l0ZS1icmFuZGluZ19fYm9keSxcbi5zaXRlLWJyYW5kaW5nX19ib2R5ID4gOmxhc3QtY2hpbGQge1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuLnNpdGUtYnJhbmRpbmdfX3NpdGUtbmFtZSB7XG4gIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gIGNvbG9yOiAjMDIyODUxO1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiA5OTJweCkge1xuICAuc2l0ZS1icmFuZGluZ19fc2l0ZS1uYW1lIHtcbiAgICBmb250LXNpemU6IDJyZW07XG4gIH1cbn1cbi5zaXRlLWJyYW5kaW5nX19zaXRlLW5hbWUgYSB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG4uc2l0ZS1icmFuZGluZ19fc2l0ZS1uYW1lIGE6aG92ZXIsIC5zaXRlLWJyYW5kaW5nX19zaXRlLW5hbWUgYTpmb2N1cyB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbi5zaXRlLWJyYW5kaW5nX19zbG9nYW4ge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgZm9udC1zaXplOiAxLjM3NXJlbTtcbiAgbGluZS1oZWlnaHQ6IDE7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLnNpdGUtYnJhbmRpbmdfX3Nsb2dhbiB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gIH1cbn1cbi5zaXRlLWJyYW5kaW5nIGEge1xuICBjb2xvcjogIzAyMjg1MTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuLnNpdGUtYnJhbmRpbmcgYTpob3ZlciwgLnNpdGUtYnJhbmRpbmcgYTpmb2N1cyB7XG4gIGNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cblxuYDsiLCJpbXBvcnQge2Nzc30gZnJvbSAnbGl0JztcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuXG4uc3VibWVudS10b2dnbGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbG9hdDogcmlnaHQ7XG4gIGZsZXgtc2hyaW5rOiAwO1xuICB3aWR0aDogNTBweDtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIHBhZGRpbmctYm90dG9tOiAxcHg7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLWJvdHRvbTogMC4xNXJlbSBzb2xpZCAjZmZmO1xuICBhcHBlYXJhbmNlOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDIyODUxO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzEwcHgpIHtcbiAgLnN1Ym1lbnUtdG9nZ2xlIHtcbiAgICB3aWR0aDogM3JlbTtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5zdWJtZW51LXRvZ2dsZSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAuc3VibWVudS10b2dnbGVfX2ljb24ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA5OTJweCkge1xuICAuc3VibWVudS10b2dnbGUge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gIH1cbiAgLnN1Ym1lbnUtdG9nZ2xlX19pY29uIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgfVxufVxuLnN1Ym1lbnUtdG9nZ2xlOmZvY3VzIHtcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgM3B4ICMwMjI4NTE7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5hOmhvdmVyIC5zdWJtZW51LXRvZ2dsZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM5OTczMDA7XG59XG4uc3VibWVudS10b2dnbGUtLW9wZW4gLnN1Ym1lbnUtdG9nZ2xlX19pY29uOmJlZm9yZSB7XG4gIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xufVxuLnN1Ym1lbnUtdG9nZ2xlX193cmFwcGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG59XG4uc3VibWVudS10b2dnbGVfX3dyYXBwZXIgYTpmaXJzdC1jaGlsZCxcbi5zdWJtZW51LXRvZ2dsZV9fd3JhcHBlciAubm9saW5rOmZpcnN0LWNoaWxkIHtcbiAgZmxleC1ncm93OiAxO1xufVxuLnN1Ym1lbnUtdG9nZ2xlX19pY29uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0b3A6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICB6LWluZGV4OiA4MzA7XG4gIGxlZnQ6IDMwJTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiA0MCU7XG4gIGhlaWdodDogM3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBmb250LXNpemU6IDA7XG59XG4uc3VibWVudS10b2dnbGVfX2ljb246YmVmb3JlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA4MzA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XG59XG5hOmhvdmVyIC5zdWJtZW51LXRvZ2dsZV9faWNvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG59XG5hOmhvdmVyIC5zdWJtZW51LXRvZ2dsZV9faWNvbjpiZWZvcmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuXG5gOyIsImltcG9ydCB7Y3NzfSBmcm9tICdsaXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG5cbjpob3N0IHtcbiAgLS1maXhlZC1wYWdlLW9mZnNldDogMy4yNXJlbTtcbiAgLS1maXhlZC1oZWFkZXItc2Nyb2xsLW9mZnNldDogNC4wNjI1cmVtO1xufVxuXG4ubC1oZWFkZXJfX2JyYW5kaW5nIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLmwtaGVhZGVyX19icmFuZGluZyB7XG4gICAgbWluLWhlaWdodDogNy41cmVtO1xuICAgIHBhZGRpbmctcmlnaHQ6IDEuNXJlbTtcbiAgICBwYWRkaW5nLWxlZnQ6IDEuNXJlbTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDk5MXB4KSB7XG4gIC5sLWhlYWRlci0tZml4ZWQge1xuICAgIHBhZGRpbmctdG9wOiAzLjI1cmVtO1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLmwtaGVhZGVyLS1maXhlZC5pcy1maXhlZCAubC1tYWluIHtcbiAgICBwYWRkaW5nLXRvcDogdmFyKC0tZml4ZWQtcGFnZS1vZmZzZXQpO1xuICB9XG59XG4ubC1oZWFkZXItLWZpeGVkIC5tb2JpbGUtYmFyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiAxMDAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbn1cbi5sLWhlYWRlci0tZml4ZWQgW2lkXSB7XG4gIHNjcm9sbC1tYXJnaW4tdG9wOiB2YXIoLS1maXhlZC1oZWFkZXItc2Nyb2xsLW9mZnNldCk7XG59XG5cbi5sLW5hdmJhciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogODMwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDMuMjVyZW07XG59XG5AbWVkaWEgKG1heC13aWR0aDogOTkxcHgpIHtcbiAgLmwtbmF2YmFyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAzLjI1cmVtO1xuICAgIGxlZnQ6IDA7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA5OTJweCkge1xuICAubC1uYXZiYXIge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogYXV0bztcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDk5MnB4KSB7XG4gIC5sLWhlYWRlci0tZml4ZWQgLmwtbmF2YmFyLmlzLWZpeGVkIHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgei1pbmRleDogMTAwMDtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgbGVmdDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLmwtbmF2LWhvcml6b250YWwge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1hcmVhczogXCJuYXYgc2VhcmNoIHF1aWNrXCI7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgbWF4LWNvbnRlbnQgbWF4LWNvbnRlbnQ7XG4gIH1cbiAgLmwtbmF2LWhvcml6b250YWxfX3ByaW1hcnktbmF2IHtcbiAgICBncmlkLWFyZWE6IG5hdjtcbiAgfVxuICAubC1uYXYtaG9yaXpvbnRhbF9fc2VhcmNoLXBvcHVwIHtcbiAgICB6LWluZGV4OiAzO1xuICAgIGdyaWQtYXJlYTogc2VhcmNoO1xuICB9XG4gIC5sLW5hdi1ob3Jpem9udGFsX19zZWFyY2gtcG9wdXAgLnNlYXJjaC1wb3B1cF9fb3BlbiB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG4gIC5sLW5hdi1ob3Jpem9udGFsX19xdWljay1saW5rcyB7XG4gICAgei1pbmRleDogMjtcbiAgICBncmlkLWFyZWE6IHF1aWNrO1xuICB9XG59XG5cbi5oYXMtbWVnYSAubC1uYXZiYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTkycHgpIHtcbiAgLmhhcy1tZWdhIC5sLW1haW4ge1xuICAgIHBhZGRpbmctdG9wOiAzLjI1cmVtO1xuICB9XG59XG5cbmA7IiwiaW1wb3J0IHtjc3N9IGZyb20gJ2xpdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcblxuLyohIG5vcm1hbGl6ZS1zY3NzIHwgTUlUL0dQTHYyIExpY2Vuc2UgfCBiaXQubHkvbm9ybWFsaXplLXNjc3MgKi9cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluXG4gKiAgICBJRSBvbiBXaW5kb3dzIFBob25lIGFuZCBpbiBpT1MuXG4gKi9cbmh0bWwge1xuICBsaW5lLWhlaWdodDogMS4xNTtcbiAgLyogMSAqL1xuICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTtcbiAgLyogMiAqL1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7XG4gIC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2VycyAob3BpbmlvbmF0ZWQpLlxuICovXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxuICovXG5hcnRpY2xlLFxuYXNpZGUsXG5mb290ZXIsXG5oZWFkZXIsXG5uYXYsXG5zZWN0aW9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gJ2gxJyBlbGVtZW50cyB3aXRoaW4gJ3NlY3Rpb24nIGFuZFxuICogJ2FydGljbGUnIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXG4gKi9cbmZpZ2NhcHRpb24sXG5maWd1cmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgbWFyZ2luIGluIElFIDguXG4gKi9cbmZpZ3VyZSB7XG4gIG1hcmdpbjogMWVtIDQwcHg7XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5ociB7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICAvKiAxICovXG4gIGhlaWdodDogMDtcbiAgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxuICovXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCAnZW0nIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xucHJlIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlO1xuICAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtO1xuICAvKiAyICovXG59XG5cbi8qIExpbmtzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKiAyLiBSZW1vdmUgZ2FwcyBpbiBsaW5rcyB1bmRlcmxpbmUgaW4gaU9TIDgrIGFuZCBTYWZhcmkgOCsuXG4gKi9cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgLyogMSAqL1xuICAtd2Via2l0LXRleHQtZGVjb3JhdGlvbi1za2lwOiBvYmplY3RzO1xuICAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LSBhbmQgRmlyZWZveCAzOS0uXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5hYmJyW3RpdGxlXSB7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7XG4gIC8qIDEgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIC8qIDIgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xuICAvKiAyICovXG59XG5cbi8qKlxuICogUHJldmVudCB0aGUgZHVwbGljYXRlIGFwcGxpY2F0aW9uIG9mICdib2xkZXInIGJ5IHRoZSBuZXh0IHJ1bGUgaW4gU2FmYXJpIDYuXG4gKi9cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogaW5oZXJpdDtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5iLFxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkICdlbScgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcbiAgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTtcbiAgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHN0eWxlIGluIEFuZHJvaWQgNC4zLS5cbiAqL1xuZGZuIHtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBiYWNrZ3JvdW5kIGFuZCBjb2xvciBpbiBJRSA5LS5cbiAqL1xubWFyayB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjA7XG4gIGNvbG9yOiAjMDAwO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgJ3N1YicgYW5kICdzdXAnIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5zdWIsXG5zdXAge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gIHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cbiAqL1xuYXVkaW8sXG52aWRlbyB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBpT1MgNC03LlxuICovXG5hdWRpbzpub3QoW2NvbnRyb2xzXSkge1xuICBkaXNwbGF5OiBub25lO1xuICBoZWlnaHQ6IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC0uXG4gKi9cbmltZyB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyoqXG4gKiBIaWRlIHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqL1xuc3ZnOm5vdCg6cm9vdCkge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMgKG9waW5pb25hdGVkKS5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlO1xuICAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiAxLjE1O1xuICAvKiAxICovXG4gIG1hcmdpbjogMDtcbiAgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICovXG5idXR0b24ge1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuYnV0dG9uLFxuc2VsZWN0IHtcbiAgLyogMSAqL1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBQcmV2ZW50IGEgV2ViS2l0IGJ1ZyB3aGVyZSAoMikgZGVzdHJveXMgbmF0aXZlICdhdWRpbycgYW5kICd2aWRlbydcbiAqICAgIGNvbnRyb2xzIGluIEFuZHJvaWQgNC5cbiAqIDIuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cbmJ1dHRvbixcbmh0bWwgW3R5cGU9YnV0dG9uXSxcblt0eXBlPXJlc2V0XSxcblt0eXBlPXN1Ym1pdF0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbiAgLyogMiAqL1xufVxuXG5idXR0b24sXG5bdHlwZT1idXR0b25dLFxuW3R5cGU9cmVzZXRdLFxuW3R5cGU9c3VibWl0XSB7XG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICAgKi9cbiAgLyoqXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAgICovXG59XG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1idXR0b25dOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9cmVzZXRdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9c3VibWl0XTo6LW1vei1mb2N1cy1pbm5lciB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbn1cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPWJ1dHRvbl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1yZXNldF06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1zdWJtaXRdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cbmlucHV0IHtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAtLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLS5cbiAqL1xuW3R5cGU9Y2hlY2tib3hdLFxuW3R5cGU9cmFkaW9dIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgLyogMSAqL1xuICBwYWRkaW5nOiAwO1xuICAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5bdHlwZT1udW1iZXJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9bnVtYmVyXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5bdHlwZT1zZWFyY2hdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG4gIC8qIDEgKi9cbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7XG4gIC8qIDIgKi9cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBhbmQgY2FuY2VsIGJ1dHRvbnMgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gICAqL1xufVxuW3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbiwgW3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byAnaW5oZXJpdCcgaW4gU2FmYXJpLlxuICovXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG4gIC8qIDEgKi9cbiAgZm9udDogaW5oZXJpdDtcbiAgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuZmllbGRzZXQge1xuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gJ2ZpZWxkc2V0JyBlbGVtZW50cyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAqICAgICdmaWVsZHNldCcgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5sZWdlbmQge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAvKiAxICovXG4gIGRpc3BsYXk6IHRhYmxlO1xuICAvKiAxICovXG4gIG1heC13aWR0aDogMTAwJTtcbiAgLyogMSAqL1xuICBwYWRkaW5nOiAwO1xuICAvKiAzICovXG4gIGNvbG9yOiBpbmhlcml0O1xuICAvKiAyICovXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gIC8qIDEgKi9cbn1cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cbnByb2dyZXNzIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAvKiAxICovXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbiAgLyogMiAqL1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUuXG4gKi9cbnRleHRhcmVhIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFLCBhbmQgRmlyZWZveC5cbiAqL1xuZGV0YWlscyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXG4gKi9cbm1lbnUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLyogU2NyaXB0aW5nXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cbiAqL1xuY2FudmFzIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxuICovXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qIEhpZGRlblxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAtLlxuICovXG5baGlkZGVuXSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbmA7IiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEJTRC0zLUNsYXVzZVxuICovXG4vKipcbiAqIFdoZXRoZXIgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0cyBgYWRvcHRlZFN0eWxlU2hlZXRzYC5cbiAqL1xuZXhwb3J0IGNvbnN0IHN1cHBvcnRzQWRvcHRpbmdTdHlsZVNoZWV0cyA9IHdpbmRvdy5TaGFkb3dSb290ICYmXG4gICAgKHdpbmRvdy5TaGFkeUNTUyA9PT0gdW5kZWZpbmVkIHx8IHdpbmRvdy5TaGFkeUNTUy5uYXRpdmVTaGFkb3cpICYmXG4gICAgJ2Fkb3B0ZWRTdHlsZVNoZWV0cycgaW4gRG9jdW1lbnQucHJvdG90eXBlICYmXG4gICAgJ3JlcGxhY2UnIGluIENTU1N0eWxlU2hlZXQucHJvdG90eXBlO1xuY29uc3QgY29uc3RydWN0aW9uVG9rZW4gPSBTeW1ib2woKTtcbmNvbnN0IHN0eWxlU2hlZXRDYWNoZSA9IG5ldyBNYXAoKTtcbi8qKlxuICogQSBjb250YWluZXIgZm9yIGEgc3RyaW5nIG9mIENTUyB0ZXh0LCB0aGF0IG1heSBiZSB1c2VkIHRvIGNyZWF0ZSBhIENTU1N0eWxlU2hlZXQuXG4gKlxuICogQ1NTUmVzdWx0IGlzIHRoZSByZXR1cm4gdmFsdWUgb2YgYGNzc2AtdGFnZ2VkIHRlbXBsYXRlIGxpdGVyYWxzIGFuZFxuICogYHVuc2FmZUNTUygpYC4gSW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgQ1NTUmVzdWx0cyBhcmUgb25seSBjcmVhdGVkIHZpYSB0aGVcbiAqIGBjc3NgIHRhZyBhbmQgYHVuc2FmZUNTUygpYCwgQ1NTUmVzdWx0IGNhbm5vdCBiZSBjb25zdHJ1Y3RlZCBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IGNsYXNzIENTU1Jlc3VsdCB7XG4gICAgY29uc3RydWN0b3IoY3NzVGV4dCwgc2FmZVRva2VuKSB7XG4gICAgICAgIC8vIFRoaXMgcHJvcGVydHkgbmVlZHMgdG8gcmVtYWluIHVubWluaWZpZWQuXG4gICAgICAgIHRoaXNbJ18kY3NzUmVzdWx0JCddID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNhZmVUb2tlbiAhPT0gY29uc3RydWN0aW9uVG9rZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ1NTUmVzdWx0IGlzIG5vdCBjb25zdHJ1Y3RhYmxlLiBVc2UgYHVuc2FmZUNTU2Agb3IgYGNzc2AgaW5zdGVhZC4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNzc1RleHQgPSBjc3NUZXh0O1xuICAgIH1cbiAgICAvLyBOb3RlLCB0aGlzIGlzIGEgZ2V0dGVyIHNvIHRoYXQgaXQncyBsYXp5LiBJbiBwcmFjdGljZSwgdGhpcyBtZWFuc1xuICAgIC8vIHN0eWxlc2hlZXRzIGFyZSBub3QgY3JlYXRlZCB1bnRpbCB0aGUgZmlyc3QgZWxlbWVudCBpbnN0YW5jZSBpcyBtYWRlLlxuICAgIGdldCBzdHlsZVNoZWV0KCkge1xuICAgICAgICAvLyBOb3RlLCBpZiBgc3VwcG9ydHNBZG9wdGluZ1N0eWxlU2hlZXRzYCBpcyB0cnVlIHRoZW4gd2UgYXNzdW1lXG4gICAgICAgIC8vIENTU1N0eWxlU2hlZXQgaXMgY29uc3RydWN0YWJsZS5cbiAgICAgICAgbGV0IHN0eWxlU2hlZXQgPSBzdHlsZVNoZWV0Q2FjaGUuZ2V0KHRoaXMuY3NzVGV4dCk7XG4gICAgICAgIGlmIChzdXBwb3J0c0Fkb3B0aW5nU3R5bGVTaGVldHMgJiYgc3R5bGVTaGVldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdHlsZVNoZWV0Q2FjaGUuc2V0KHRoaXMuY3NzVGV4dCwgKHN0eWxlU2hlZXQgPSBuZXcgQ1NTU3R5bGVTaGVldCgpKSk7XG4gICAgICAgICAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKHRoaXMuY3NzVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0eWxlU2hlZXQ7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jc3NUZXh0O1xuICAgIH1cbn1cbmNvbnN0IHRleHRGcm9tQ1NTUmVzdWx0ID0gKHZhbHVlKSA9PiB7XG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICBpZiAodmFsdWVbJ18kY3NzUmVzdWx0JCddID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5jc3NUZXh0O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVmFsdWUgcGFzc2VkIHRvICdjc3MnIGZ1bmN0aW9uIG11c3QgYmUgYSAnY3NzJyBmdW5jdGlvbiByZXN1bHQ6IGAgK1xuICAgICAgICAgICAgYCR7dmFsdWV9LiBVc2UgJ3Vuc2FmZUNTUycgdG8gcGFzcyBub24tbGl0ZXJhbCB2YWx1ZXMsIGJ1dCB0YWtlIGNhcmUgYCArXG4gICAgICAgICAgICBgdG8gZW5zdXJlIHBhZ2Ugc2VjdXJpdHkuYCk7XG4gICAgfVxufTtcbi8qKlxuICogV3JhcCBhIHZhbHVlIGZvciBpbnRlcnBvbGF0aW9uIGluIGEgW1tgY3NzYF1dIHRhZ2dlZCB0ZW1wbGF0ZSBsaXRlcmFsLlxuICpcbiAqIFRoaXMgaXMgdW5zYWZlIGJlY2F1c2UgdW50cnVzdGVkIENTUyB0ZXh0IGNhbiBiZSB1c2VkIHRvIHBob25lIGhvbWVcbiAqIG9yIGV4ZmlsdHJhdGUgZGF0YSB0byBhbiBhdHRhY2tlciBjb250cm9sbGVkIHNpdGUuIFRha2UgY2FyZSB0byBvbmx5IHVzZVxuICogdGhpcyB3aXRoIHRydXN0ZWQgaW5wdXQuXG4gKi9cbmV4cG9ydCBjb25zdCB1bnNhZmVDU1MgPSAodmFsdWUpID0+IG5ldyBDU1NSZXN1bHQodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogU3RyaW5nKHZhbHVlKSwgY29uc3RydWN0aW9uVG9rZW4pO1xuLyoqXG4gKiBBIHRlbXBsYXRlIGxpdGVyYWwgdGFnIHdoaWNoIGNhbiBiZSB1c2VkIHdpdGggTGl0RWxlbWVudCdzXG4gKiBbW0xpdEVsZW1lbnQuc3R5bGVzIHwgYHN0eWxlc2BdXSBwcm9wZXJ0eSB0byBzZXQgZWxlbWVudCBzdHlsZXMuXG4gKlxuICogRm9yIHNlY3VyaXR5IHJlYXNvbnMsIG9ubHkgbGl0ZXJhbCBzdHJpbmcgdmFsdWVzIGFuZCBudW1iZXIgbWF5IGJlIHVzZWQgaW5cbiAqIGVtYmVkZGVkIGV4cHJlc3Npb25zLiBUbyBpbmNvcnBvcmF0ZSBub24tbGl0ZXJhbCB2YWx1ZXMgW1tgdW5zYWZlQ1NTYF1dIG1heVxuICogYmUgdXNlZCBpbnNpZGUgYW4gZXhwcmVzc2lvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGNzcyA9IChzdHJpbmdzLCAuLi52YWx1ZXMpID0+IHtcbiAgICBjb25zdCBjc3NUZXh0ID0gc3RyaW5ncy5sZW5ndGggPT09IDFcbiAgICAgICAgPyBzdHJpbmdzWzBdXG4gICAgICAgIDogdmFsdWVzLnJlZHVjZSgoYWNjLCB2LCBpZHgpID0+IGFjYyArIHRleHRGcm9tQ1NTUmVzdWx0KHYpICsgc3RyaW5nc1tpZHggKyAxXSwgc3RyaW5nc1swXSk7XG4gICAgcmV0dXJuIG5ldyBDU1NSZXN1bHQoY3NzVGV4dCwgY29uc3RydWN0aW9uVG9rZW4pO1xufTtcbi8qKlxuICogQXBwbGllcyB0aGUgZ2l2ZW4gc3R5bGVzIHRvIGEgYHNoYWRvd1Jvb3RgLiBXaGVuIFNoYWRvdyBET00gaXNcbiAqIGF2YWlsYWJsZSBidXQgYGFkb3B0ZWRTdHlsZVNoZWV0c2AgaXMgbm90LCBzdHlsZXMgYXJlIGFwcGVuZGVkIHRvIHRoZVxuICogYHNoYWRvd1Jvb3RgIHRvIFttaW1pYyBzcGVjIGJlaGF2aW9yXShodHRwczovL3dpY2cuZ2l0aHViLmlvL2NvbnN0cnVjdC1zdHlsZXNoZWV0cy8jdXNpbmctY29uc3RydWN0ZWQtc3R5bGVzaGVldHMpLlxuICogTm90ZSwgd2hlbiBzaGltbWluZyBpcyB1c2VkLCBhbnkgc3R5bGVzIHRoYXQgYXJlIHN1YnNlcXVlbnRseSBwbGFjZWQgaW50b1xuICogdGhlIHNoYWRvd1Jvb3Qgc2hvdWxkIGJlIHBsYWNlZCAqYmVmb3JlKiBhbnkgc2hpbW1lZCBhZG9wdGVkIHN0eWxlcy4gVGhpc1xuICogd2lsbCBtYXRjaCBzcGVjIGJlaGF2aW9yIHRoYXQgZ2l2ZXMgYWRvcHRlZCBzaGVldHMgcHJlY2VkZW5jZSBvdmVyIHN0eWxlcyBpblxuICogc2hhZG93Um9vdC5cbiAqL1xuZXhwb3J0IGNvbnN0IGFkb3B0U3R5bGVzID0gKHJlbmRlclJvb3QsIHN0eWxlcykgPT4ge1xuICAgIGlmIChzdXBwb3J0c0Fkb3B0aW5nU3R5bGVTaGVldHMpIHtcbiAgICAgICAgcmVuZGVyUm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBzdHlsZXMubWFwKChzKSA9PiBzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCA/IHMgOiBzLnN0eWxlU2hlZXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3R5bGVzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICBjb25zdCBub25jZSA9IHdpbmRvd1snbGl0Tm9uY2UnXTtcbiAgICAgICAgICAgIGlmIChub25jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdub25jZScsIG5vbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gcy5jc3NUZXh0O1xuICAgICAgICAgICAgcmVuZGVyUm9vdC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5jb25zdCBjc3NSZXN1bHRGcm9tU3R5bGVTaGVldCA9IChzaGVldCkgPT4ge1xuICAgIGxldCBjc3NUZXh0ID0gJyc7XG4gICAgZm9yIChjb25zdCBydWxlIG9mIHNoZWV0LmNzc1J1bGVzKSB7XG4gICAgICAgIGNzc1RleHQgKz0gcnVsZS5jc3NUZXh0O1xuICAgIH1cbiAgICByZXR1cm4gdW5zYWZlQ1NTKGNzc1RleHQpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRDb21wYXRpYmxlU3R5bGUgPSBzdXBwb3J0c0Fkb3B0aW5nU3R5bGVTaGVldHNcbiAgICA/IChzKSA9PiBzXG4gICAgOiAocykgPT4gcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQgPyBjc3NSZXN1bHRGcm9tU3R5bGVTaGVldChzKSA6IHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MtdGFnLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBCU0QtMy1DbGF1c2VcbiAqL1xudmFyIF9hLCBfYiwgX2M7XG52YXIgX2Q7XG4vKipcbiAqIFVzZSB0aGlzIG1vZHVsZSBpZiB5b3Ugd2FudCB0byBjcmVhdGUgeW91ciBvd24gYmFzZSBjbGFzcyBleHRlbmRpbmdcbiAqIFtbUmVhY3RpdmVFbGVtZW50XV0uXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqL1xuaW1wb3J0IHsgZ2V0Q29tcGF0aWJsZVN0eWxlLCBhZG9wdFN0eWxlcywgfSBmcm9tICcuL2Nzcy10YWcuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9jc3MtdGFnLmpzJztcbmNvbnN0IERFVl9NT0RFID0gdHJ1ZTtcbmxldCByZXF1ZXN0VXBkYXRlVGhlbmFibGU7XG5sZXQgaXNzdWVXYXJuaW5nO1xuY29uc3QgcG9seWZpbGxTdXBwb3J0ID0gREVWX01PREVcbiAgICA/IHdpbmRvdy5yZWFjdGl2ZUVsZW1lbnRQb2x5ZmlsbFN1cHBvcnREZXZNb2RlXG4gICAgOiB3aW5kb3cucmVhY3RpdmVFbGVtZW50UG9seWZpbGxTdXBwb3J0O1xuaWYgKERFVl9NT0RFKSB7XG4gICAgLy8gRW5zdXJlIHdhcm5pbmdzIGFyZSBpc3N1ZWQgb25seSAxeCwgZXZlbiBpZiBtdWx0aXBsZSB2ZXJzaW9ucyBvZiBMaXRcbiAgICAvLyBhcmUgbG9hZGVkLlxuICAgIGNvbnN0IGlzc3VlZFdhcm5pbmdzID0gKChfYSA9IGdsb2JhbFRoaXMubGl0SXNzdWVkV2FybmluZ3MpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChnbG9iYWxUaGlzLmxpdElzc3VlZFdhcm5pbmdzID0gbmV3IFNldCgpKSk7XG4gICAgLy8gSXNzdWUgYSB3YXJuaW5nLCBpZiB3ZSBoYXZlbid0IGFscmVhZHkuXG4gICAgaXNzdWVXYXJuaW5nID0gKGNvZGUsIHdhcm5pbmcpID0+IHtcbiAgICAgICAgd2FybmluZyArPSBgIFNlZSBodHRwczovL2xpdC5kZXYvbXNnLyR7Y29kZX0gZm9yIG1vcmUgaW5mb3JtYXRpb24uYDtcbiAgICAgICAgaWYgKCFpc3N1ZWRXYXJuaW5ncy5oYXMod2FybmluZykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbiAgICAgICAgICAgIGlzc3VlZFdhcm5pbmdzLmFkZCh3YXJuaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaXNzdWVXYXJuaW5nKCdkZXYtbW9kZScsIGBMaXQgaXMgaW4gZGV2IG1vZGUuIE5vdCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiFgKTtcbiAgICAvLyBJc3N1ZSBwb2x5ZmlsbCBzdXBwb3J0IHdhcm5pbmcuXG4gICAgaWYgKCgoX2IgPSB3aW5kb3cuU2hhZHlET00pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pblVzZSkgJiYgcG9seWZpbGxTdXBwb3J0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaXNzdWVXYXJuaW5nKCdwb2x5ZmlsbC1zdXBwb3J0LW1pc3NpbmcnLCBgU2hhZG93IERPTSBpcyBiZWluZyBwb2x5ZmlsbGVkIHZpYSBcXGBTaGFkeURPTVxcYCBidXQgYCArXG4gICAgICAgICAgICBgdGhlIFxcYHBvbHlmaWxsLXN1cHBvcnRcXGAgbW9kdWxlIGhhcyBub3QgYmVlbiBsb2FkZWQuYCk7XG4gICAgfVxuICAgIHJlcXVlc3RVcGRhdGVUaGVuYWJsZSA9IChuYW1lKSA9PiAoe1xuICAgICAgICB0aGVuOiAob25mdWxmaWxsZWQsIF9vbnJlamVjdGVkKSA9PiB7XG4gICAgICAgICAgICBpc3N1ZVdhcm5pbmcoJ3JlcXVlc3QtdXBkYXRlLXByb21pc2UnLCBgVGhlIFxcYHJlcXVlc3RVcGRhdGVcXGAgbWV0aG9kIHNob3VsZCBubyBsb25nZXIgcmV0dXJuIGEgUHJvbWlzZSBidXQgYCArXG4gICAgICAgICAgICAgICAgYGRvZXMgc28gb24gXFxgJHtuYW1lfVxcYC4gVXNlIFxcYHVwZGF0ZUNvbXBsZXRlXFxgIGluc3RlYWQuYCk7XG4gICAgICAgICAgICBpZiAob25mdWxmaWxsZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9uZnVsZmlsbGVkKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbi8qXG4gKiBXaGVuIHVzaW5nIENsb3N1cmUgQ29tcGlsZXIsIEpTQ29tcGlsZXJfcmVuYW1lUHJvcGVydHkocHJvcGVydHksIG9iamVjdCkgaXNcbiAqIHJlcGxhY2VkIGF0IGNvbXBpbGUgdGltZSBieSB0aGUgbXVuZ2VkIG5hbWUgZm9yIG9iamVjdFtwcm9wZXJ0eV0uIFdlIGNhbm5vdFxuICogYWxpYXMgdGhpcyBmdW5jdGlvbiwgc28gd2UgaGF2ZSB0byB1c2UgYSBzbWFsbCBzaGltIHRoYXQgaGFzIHRoZSBzYW1lXG4gKiBiZWhhdmlvciB3aGVuIG5vdCBjb21waWxpbmcuXG4gKi9cbi8qQF9fSU5MSU5FX18qL1xuY29uc3QgSlNDb21waWxlcl9yZW5hbWVQcm9wZXJ0eSA9IChwcm9wLCBfb2JqKSA9PiBwcm9wO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gICAgdG9BdHRyaWJ1dGUodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA/ICcnIDogbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgT2JqZWN0OlxuICAgICAgICAgICAgY2FzZSBBcnJheTpcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgIHBhc3MgdGhpcyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgLy8gdG8gYWxsb3cgcmVtb3Zpbmcvbm8gY2hhbmdlIGJlaGF2aW9yLlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT0gbnVsbCA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIGZyb21BdHRyaWJ1dGUodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgbGV0IGZyb21WYWx1ZSA9IHZhbHVlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQm9vbGVhbjpcbiAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSB2YWx1ZSAhPT0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICAgICAgICAgIGZyb21WYWx1ZSA9IHZhbHVlID09PSBudWxsID8gbnVsbCA6IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIE9iamVjdDpcbiAgICAgICAgICAgIGNhc2UgQXJyYXk6XG4gICAgICAgICAgICAgICAgLy8gRG8gKm5vdCogZ2VuZXJhdGUgZXhjZXB0aW9uIHdoZW4gaW52YWxpZCBKU09OIGlzIHNldCBhcyBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IG5vcm1hbGx5IGNvbXBsYWluIG9uIGJlaW5nIG1pcy1jb25maWd1cmVkLlxuICAgICAgICAgICAgICAgIC8vIFRPRE8oc29ydmVsbCk6IERvIGdlbmVyYXRlIGV4Y2VwdGlvbiBpbiAqZGV2IG1vZGUqLlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFzc2VydCB0byBhZGhlcmUgdG8gQmF6ZWwncyBcIm11c3QgdHlwZSBhc3NlcnQgSlNPTiBwYXJzZVwiIHJ1bGUuXG4gICAgICAgICAgICAgICAgICAgIGZyb21WYWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tVmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJvbVZhbHVlO1xuICAgIH0sXG59O1xuLyoqXG4gKiBDaGFuZ2UgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgYHZhbHVlYCBpcyBkaWZmZXJlbnQgZnJvbSBgb2xkVmFsdWVgLlxuICogVGhpcyBtZXRob2QgaXMgdXNlZCBhcyB0aGUgZGVmYXVsdCBmb3IgYSBwcm9wZXJ0eSdzIGBoYXNDaGFuZ2VkYCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IG5vdEVxdWFsID0gKHZhbHVlLCBvbGQpID0+IHtcbiAgICAvLyBUaGlzIGVuc3VyZXMgKG9sZD09TmFOLCB2YWx1ZT09TmFOKSBhbHdheXMgcmV0dXJucyBmYWxzZVxuICAgIHJldHVybiBvbGQgIT09IHZhbHVlICYmIChvbGQgPT09IG9sZCB8fCB2YWx1ZSA9PT0gdmFsdWUpO1xufTtcbmNvbnN0IGRlZmF1bHRQcm9wZXJ0eURlY2xhcmF0aW9uID0ge1xuICAgIGF0dHJpYnV0ZTogdHJ1ZSxcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgY29udmVydGVyOiBkZWZhdWx0Q29udmVydGVyLFxuICAgIHJlZmxlY3Q6IGZhbHNlLFxuICAgIGhhc0NoYW5nZWQ6IG5vdEVxdWFsLFxufTtcbi8qKlxuICogVGhlIENsb3N1cmUgSlMgQ29tcGlsZXIgZG9lc24ndCBjdXJyZW50bHkgaGF2ZSBnb29kIHN1cHBvcnQgZm9yIHN0YXRpY1xuICogcHJvcGVydHkgc2VtYW50aWNzIHdoZXJlIFwidGhpc1wiIGlzIGR5bmFtaWMgKGUuZy5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1jb21waWxlci9pc3N1ZXMvMzE3NyBhbmQgb3RoZXJzKSBzbyB3ZSB1c2VcbiAqIHRoaXMgaGFjayB0byBieXBhc3MgYW55IHJld3JpdGluZyBieSB0aGUgY29tcGlsZXIuXG4gKi9cbmNvbnN0IGZpbmFsaXplZCA9ICdmaW5hbGl6ZWQnO1xuLyoqXG4gKiBCYXNlIGVsZW1lbnQgY2xhc3Mgd2hpY2ggbWFuYWdlcyBlbGVtZW50IHByb3BlcnRpZXMgYW5kIGF0dHJpYnV0ZXMuIFdoZW5cbiAqIHByb3BlcnRpZXMgY2hhbmdlLCB0aGUgYHVwZGF0ZWAgbWV0aG9kIGlzIGFzeW5jaHJvbm91c2x5IGNhbGxlZC4gVGhpcyBtZXRob2RcbiAqIHNob3VsZCBiZSBzdXBwbGllZCBieSBzdWJjbGFzc2VycyB0byByZW5kZXIgdXBkYXRlcyBhcyBkZXNpcmVkLlxuICogQG5vSW5oZXJpdERvY1xuICovXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9faW5zdGFuY2VQcm9wZXJ0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogVHJ1ZSBpZiB0aGVyZSBpcyBhIHBlbmRpbmcgdXBkYXRlIGFzIGEgcmVzdWx0IG9mIGNhbGxpbmcgYHJlcXVlc3RVcGRhdGUoKWAuXG4gICAgICAgICAqIFNob3VsZCBvbmx5IGJlIHJlYWQuXG4gICAgICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlzVXBkYXRlUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogSXMgc2V0IHRvIGB0cnVlYCBhZnRlciB0aGUgZmlyc3QgdXBkYXRlLiBUaGUgZWxlbWVudCBjb2RlIGNhbm5vdCBhc3N1bWVcbiAgICAgICAgICogdGhhdCBgcmVuZGVyUm9vdGAgZXhpc3RzIGJlZm9yZSB0aGUgZWxlbWVudCBgaGFzVXBkYXRlZGAuXG4gICAgICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhhc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5hbWUgb2YgY3VycmVudGx5IHJlZmxlY3RpbmcgcHJvcGVydHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydHkgPSBudWxsO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYW4gaW5pdGlhbGl6ZXIgZnVuY3Rpb24gdG8gdGhlIGNsYXNzIHRoYXQgaXMgY2FsbGVkIGR1cmluZyBpbnN0YW5jZVxuICAgICAqIGNvbnN0cnVjdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdXNlZnVsIGZvciBjb2RlIHRoYXQgcnVucyBhZ2FpbnN0IGEgYFJlYWN0aXZlRWxlbWVudGBcbiAgICAgKiBzdWJjbGFzcywgc3VjaCBhcyBhIGRlY29yYXRvciwgdGhhdCBuZWVkcyB0byBkbyB3b3JrIGZvciBlYWNoXG4gICAgICogaW5zdGFuY2UsIHN1Y2ggYXMgc2V0dGluZyB1cCBhIGBSZWFjdGl2ZUNvbnRyb2xsZXJgLlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjb25zdCBteURlY29yYXRvciA9ICh0YXJnZXQ6IHR5cGVvZiBSZWFjdGl2ZUVsZW1lbnQsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICogICB0YXJnZXQuYWRkSW5pdGlhbGl6ZXIoKGluc3RhbmNlOiBSZWFjdGl2ZUVsZW1lbnQpID0+IHtcbiAgICAgKiAgICAgLy8gVGhpcyBpcyBydW4gZHVyaW5nIGNvbnN0cnVjdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAqICAgICBuZXcgTXlDb250cm9sbGVyKGluc3RhbmNlKTtcbiAgICAgKiAgIH0pO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIERlY29yYXRpbmcgYSBmaWVsZCB3aWxsIHRoZW4gY2F1c2UgZWFjaCBpbnN0YW5jZSB0byBydW4gYW4gaW5pdGlhbGl6ZXJcbiAgICAgKiB0aGF0IGFkZHMgYSBjb250cm9sbGVyOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjbGFzcyBNeUVsZW1lbnQgZXh0ZW5kcyBMaXRFbGVtZW50IHtcbiAgICAgKiAgIEBteURlY29yYXRvciBmb287XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogSW5pdGlhbGl6ZXJzIGFyZSBzdG9yZWQgcGVyLWNvbnN0cnVjdG9yLiBBZGRpbmcgYW4gaW5pdGlhbGl6ZXIgdG8gYVxuICAgICAqIHN1YmNsYXNzIGRvZXMgbm90IGFkZCBpdCB0byBhIHN1cGVyY2xhc3MuIFNpbmNlIGluaXRpYWxpemVycyBhcmUgcnVuIGluXG4gICAgICogY29uc3RydWN0b3JzLCBpbml0aWFsaXplcnMgd2lsbCBydW4gaW4gb3JkZXIgb2YgdGhlIGNsYXNzIGhpZXJhcmNoeSxcbiAgICAgKiBzdGFydGluZyB3aXRoIHN1cGVyY2xhc3NlcyBhbmQgcHJvZ3Jlc3NpbmcgdG8gdGhlIGluc3RhbmNlJ3MgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAbm9jb2xsYXBzZVxuICAgICAqL1xuICAgIHN0YXRpYyBhZGRJbml0aWFsaXplcihpbml0aWFsaXplcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMuX2luaXRpYWxpemVycykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRoaXMuX2luaXRpYWxpemVycyA9IFtdKTtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZXJzLnB1c2goaW5pdGlhbGl6ZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhdHRyaWJ1dGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcy5cbiAgICAgKiBAbm9jb2xsYXBzZVxuICAgICAqIEBjYXRlZ29yeSBhdHRyaWJ1dGVzXG4gICAgICovXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIC8vIG5vdGU6IHBpZ2d5IGJhY2tpbmcgb24gdGhpcyB0byBlbnN1cmUgd2UncmUgZmluYWxpemVkLlxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgLy8gVXNlIGZvckVhY2ggc28gdGhpcyB3b3JrcyBldmVuIGlmIGZvci9vZiBsb29wcyBhcmUgY29tcGlsZWQgdG8gZm9yIGxvb3BzXG4gICAgICAgIC8vIGV4cGVjdGluZyBhcnJheXNcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcGVydGllcy5mb3JFYWNoKCh2LCBwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdGhpcy5fX2F0dHJpYnV0ZU5hbWVGb3JQcm9wZXJ0eShwLCB2KTtcbiAgICAgICAgICAgIGlmIChhdHRyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fYXR0cmlidXRlVG9Qcm9wZXJ0eU1hcC5zZXQoYXR0ciwgcCk7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBwcm9wZXJ0eSBhY2Nlc3NvciBvbiB0aGUgZWxlbWVudCBwcm90b3R5cGUgaWYgb25lIGRvZXMgbm90IGV4aXN0XG4gICAgICogYW5kIHN0b3JlcyBhIGBQcm9wZXJ0eURlY2xhcmF0aW9uYCBmb3IgdGhlIHByb3BlcnR5IHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgICogVGhlIHByb3BlcnR5IHNldHRlciBjYWxscyB0aGUgcHJvcGVydHkncyBgaGFzQ2hhbmdlZGAgcHJvcGVydHkgb3B0aW9uXG4gICAgICogb3IgdXNlcyBhIHN0cmljdCBpZGVudGl0eSBjaGVjayB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gcmVxdWVzdFxuICAgICAqIGFuIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIG1heSBiZSBvdmVycmlkZGVuIHRvIGN1c3RvbWl6ZSBwcm9wZXJ0aWVzOyBob3dldmVyLFxuICAgICAqIHdoZW4gZG9pbmcgc28sIGl0J3MgaW1wb3J0YW50IHRvIGNhbGwgYHN1cGVyLmNyZWF0ZVByb3BlcnR5YCB0byBlbnN1cmVcbiAgICAgKiB0aGUgcHJvcGVydHkgaXMgc2V0dXAgY29ycmVjdGx5LiBUaGlzIG1ldGhvZCBjYWxsc1xuICAgICAqIGBnZXRQcm9wZXJ0eURlc2NyaXB0b3JgIGludGVybmFsbHkgdG8gZ2V0IGEgZGVzY3JpcHRvciB0byBpbnN0YWxsLlxuICAgICAqIFRvIGN1c3RvbWl6ZSB3aGF0IHByb3BlcnRpZXMgZG8gd2hlbiB0aGV5IGFyZSBnZXQgb3Igc2V0LCBvdmVycmlkZVxuICAgICAqIGBnZXRQcm9wZXJ0eURlc2NyaXB0b3JgLiBUbyBjdXN0b21pemUgdGhlIG9wdGlvbnMgZm9yIGEgcHJvcGVydHksXG4gICAgICogaW1wbGVtZW50IGBjcmVhdGVQcm9wZXJ0eWAgbGlrZSB0aGlzOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBzdGF0aWMgY3JlYXRlUHJvcGVydHkobmFtZSwgb3B0aW9ucykge1xuICAgICAqICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywge215T3B0aW9uOiB0cnVlfSk7XG4gICAgICogICBzdXBlci5jcmVhdGVQcm9wZXJ0eShuYW1lLCBvcHRpb25zKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbm9jb2xsYXBzZVxuICAgICAqIEBjYXRlZ29yeSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZVByb3BlcnR5KG5hbWUsIG9wdGlvbnMgPSBkZWZhdWx0UHJvcGVydHlEZWNsYXJhdGlvbikge1xuICAgICAgICAvLyBpZiB0aGlzIGlzIGEgc3RhdGUgcHJvcGVydHksIGZvcmNlIHRoZSBhdHRyaWJ1dGUgdG8gZmFsc2UuXG4gICAgICAgIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgICAgICAgICAvLyBDYXN0IGFzIGFueSBzaW5jZSB0aGlzIGlzIHJlYWRvbmx5LlxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIG9wdGlvbnMuYXR0cmlidXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90ZSwgc2luY2UgdGhpcyBjYW4gYmUgY2FsbGVkIGJ5IHRoZSBgQHByb3BlcnR5YCBkZWNvcmF0b3Igd2hpY2hcbiAgICAgICAgLy8gaXMgY2FsbGVkIGJlZm9yZSBgZmluYWxpemVgLCB3ZSBlbnN1cmUgZmluYWxpemF0aW9uIGhhcyBiZWVuIGtpY2tlZCBvZmYuXG4gICAgICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcGVydGllcy5zZXQobmFtZSwgb3B0aW9ucyk7XG4gICAgICAgIC8vIERvIG5vdCBnZW5lcmF0ZSBhbiBhY2Nlc3NvciBpZiB0aGUgcHJvdG90eXBlIGFscmVhZHkgaGFzIG9uZSwgc2luY2VcbiAgICAgICAgLy8gaXQgd291bGQgYmUgbG9zdCBvdGhlcndpc2UgYW5kIHRoYXQgd291bGQgbmV2ZXIgYmUgdGhlIHVzZXIncyBpbnRlbnRpb247XG4gICAgICAgIC8vIEluc3RlYWQsIHdlIGV4cGVjdCB1c2VycyB0byBjYWxsIGByZXF1ZXN0VXBkYXRlYCB0aGVtc2VsdmVzIGZyb21cbiAgICAgICAgLy8gdXNlci1kZWZpbmVkIGFjY2Vzc29ycy4gTm90ZSB0aGF0IGlmIHRoZSBzdXBlciBoYXMgYW4gYWNjZXNzb3Igd2Ugd2lsbFxuICAgICAgICAvLyBzdGlsbCBvdmVyd3JpdGUgaXRcbiAgICAgICAgaWYgKCFvcHRpb25zLm5vQWNjZXNzb3IgJiYgIXRoaXMucHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0eXBlb2YgbmFtZSA9PT0gJ3N5bWJvbCcgPyBTeW1ib2woKSA6IGBfXyR7bmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IHRoaXMuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG5hbWUsIGtleSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMucHJvdG90eXBlLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcHJvcGVydHkgZGVzY3JpcHRvciB0byBiZSBkZWZpbmVkIG9uIHRoZSBnaXZlbiBuYW1lZCBwcm9wZXJ0eS5cbiAgICAgKiBJZiBubyBkZXNjcmlwdG9yIGlzIHJldHVybmVkLCB0aGUgcHJvcGVydHkgd2lsbCBub3QgYmVjb21lIGFuIGFjY2Vzc29yLlxuICAgICAqIEZvciBleGFtcGxlLFxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjbGFzcyBNeUVsZW1lbnQgZXh0ZW5kcyBMaXRFbGVtZW50IHtcbiAgICAgKiAgIHN0YXRpYyBnZXRQcm9wZXJ0eURlc2NyaXB0b3IobmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgICogICAgIGNvbnN0IGRlZmF1bHREZXNjcmlwdG9yID1cbiAgICAgKiAgICAgICAgIHN1cGVyLmdldFByb3BlcnR5RGVzY3JpcHRvcihuYW1lLCBrZXksIG9wdGlvbnMpO1xuICAgICAqICAgICBjb25zdCBzZXR0ZXIgPSBkZWZhdWx0RGVzY3JpcHRvci5zZXQ7XG4gICAgICogICAgIHJldHVybiB7XG4gICAgICogICAgICAgZ2V0OiBkZWZhdWx0RGVzY3JpcHRvci5nZXQsXG4gICAgICogICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICogICAgICAgICBzZXR0ZXIuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgICogICAgICAgICAvLyBjdXN0b20gYWN0aW9uLlxuICAgICAqICAgICAgIH0sXG4gICAgICogICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAqICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgKiAgICAgfVxuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBub2NvbGxhcHNlXG4gICAgICogQGNhdGVnb3J5IHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RVcGRhdGUobmFtZSwgb2xkVmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHByb3BlcnR5IG9wdGlvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBwcm9wZXJ0eS5cbiAgICAgKiBUaGVzZSBvcHRpb25zIGFyZSBkZWZpbmVkIHdpdGggYSBgUHJvcGVydHlEZWNsYXJhdGlvbmAgdmlhIHRoZSBgcHJvcGVydGllc2BcbiAgICAgKiBvYmplY3Qgb3IgdGhlIGBAcHJvcGVydHlgIGRlY29yYXRvciBhbmQgYXJlIHJlZ2lzdGVyZWQgaW5cbiAgICAgKiBgY3JlYXRlUHJvcGVydHkoLi4uKWAuXG4gICAgICpcbiAgICAgKiBOb3RlLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY29uc2lkZXJlZCBcImZpbmFsXCIgYW5kIG5vdCBvdmVycmlkZGVuLiBUb1xuICAgICAqIGN1c3RvbWl6ZSB0aGUgb3B0aW9ucyBmb3IgYSBnaXZlbiBwcm9wZXJ0eSwgb3ZlcnJpZGUgW1tgY3JlYXRlUHJvcGVydHlgXV0uXG4gICAgICpcbiAgICAgKiBAbm9jb2xsYXBzZVxuICAgICAqIEBmaW5hbFxuICAgICAqIEBjYXRlZ29yeSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgc3RhdGljIGdldFByb3BlcnR5T3B0aW9ucyhuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRQcm9wZXJ0aWVzLmdldChuYW1lKSB8fCBkZWZhdWx0UHJvcGVydHlEZWNsYXJhdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBwcm9wZXJ0eSBhY2Nlc3NvcnMgZm9yIHJlZ2lzdGVyZWQgcHJvcGVydGllcywgc2V0cyB1cCBlbGVtZW50XG4gICAgICogc3R5bGluZywgYW5kIGVuc3VyZXMgYW55IHN1cGVyY2xhc3NlcyBhcmUgYWxzbyBmaW5hbGl6ZWQuIFJldHVybnMgdHJ1ZSBpZlxuICAgICAqIHRoZSBlbGVtZW50IHdhcyBmaW5hbGl6ZWQuXG4gICAgICogQG5vY29sbGFwc2VcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluYWxpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGZpbmFsaXplZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzW2ZpbmFsaXplZF0gPSB0cnVlO1xuICAgICAgICAvLyBmaW5hbGl6ZSBhbnkgc3VwZXJjbGFzc2VzXG4gICAgICAgIGNvbnN0IHN1cGVyQ3RvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAgICAgc3VwZXJDdG9yLmZpbmFsaXplKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudFByb3BlcnRpZXMgPSBuZXcgTWFwKHN1cGVyQ3Rvci5lbGVtZW50UHJvcGVydGllcyk7XG4gICAgICAgIC8vIGluaXRpYWxpemUgTWFwIHBvcHVsYXRlZCBpbiBvYnNlcnZlZEF0dHJpYnV0ZXNcbiAgICAgICAgdGhpcy5fX2F0dHJpYnV0ZVRvUHJvcGVydHlNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8vIG1ha2UgYW55IHByb3BlcnRpZXNcbiAgICAgICAgLy8gTm90ZSwgb25seSBwcm9jZXNzIFwib3duXCIgcHJvcGVydGllcyBzaW5jZSB0aGlzIGVsZW1lbnQgd2lsbCBpbmhlcml0XG4gICAgICAgIC8vIGFueSBwcm9wZXJ0aWVzIGRlZmluZWQgb24gdGhlIHN1cGVyQ2xhc3MsIGFuZCBmaW5hbGl6YXRpb24gZW5zdXJlc1xuICAgICAgICAvLyB0aGUgZW50aXJlIHByb3RvdHlwZSBjaGFpbiBpcyBmaW5hbGl6ZWQuXG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KEpTQ29tcGlsZXJfcmVuYW1lUHJvcGVydHkoJ3Byb3BlcnRpZXMnLCB0aGlzKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgLy8gc3VwcG9ydCBzeW1ib2xzIGluIHByb3BlcnRpZXMgKElFMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGlzKVxuICAgICAgICAgICAgY29uc3QgcHJvcEtleXMgPSBbXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvcHMpLFxuICAgICAgICAgICAgICAgIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocHJvcHMpLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIC8vIFRoaXMgZm9yL29mIGlzIG9rIGJlY2F1c2UgcHJvcEtleXMgaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBwcm9wS2V5cykge1xuICAgICAgICAgICAgICAgIC8vIG5vdGUsIHVzZSBvZiBgYW55YCBpcyBkdWUgdG8gVHlwZVNjcmlwdCBsYWNrIG9mIHN1cHBvcnQgZm9yIHN5bWJvbCBpblxuICAgICAgICAgICAgICAgIC8vIGluZGV4IHR5cGVzXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5KHAsIHByb3BzW3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnRTdHlsZXMgPSB0aGlzLmZpbmFsaXplU3R5bGVzKHRoaXMuc3R5bGVzKTtcbiAgICAgICAgLy8gREVWIG1vZGUgd2FybmluZ3NcbiAgICAgICAgaWYgKERFVl9NT0RFKSB7XG4gICAgICAgICAgICBjb25zdCB3YXJuUmVtb3ZlZE9yUmVuYW1lZCA9IChuYW1lLCByZW5hbWVkID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWVXYXJuaW5nKHJlbmFtZWQgPyAncmVuYW1lZC1hcGknIDogJ3JlbW92ZWQtYXBpJywgYFxcYCR7bmFtZX1cXGAgaXMgaW1wbGVtZW50ZWQgb24gY2xhc3MgJHt0aGlzLm5hbWV9LiBJdCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBoYXMgYmVlbiAke3JlbmFtZWQgPyAncmVuYW1lZCcgOiAncmVtb3ZlZCd9IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGluIHRoaXMgdmVyc2lvbiBvZiBMaXRFbGVtZW50LmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3YXJuUmVtb3ZlZE9yUmVuYW1lZCgnaW5pdGlhbGl6ZScpO1xuICAgICAgICAgICAgd2FyblJlbW92ZWRPclJlbmFtZWQoJ3JlcXVlc3RVcGRhdGVJbnRlcm5hbCcpO1xuICAgICAgICAgICAgd2FyblJlbW92ZWRPclJlbmFtZWQoJ19nZXRVcGRhdGVDb21wbGV0ZScsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUYWtlcyB0aGUgc3R5bGVzIHRoZSB1c2VyIHN1cHBsaWVkIHZpYSB0aGUgYHN0YXRpYyBzdHlsZXNgIHByb3BlcnR5IGFuZFxuICAgICAqIHJldHVybnMgdGhlIGFycmF5IG9mIHN0eWxlcyB0byBhcHBseSB0byB0aGUgZWxlbWVudC5cbiAgICAgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBpbnRlZ3JhdGUgaW50byBhIHN0eWxlIG1hbmFnZW1lbnQgc3lzdGVtLlxuICAgICAqXG4gICAgICogU3R5bGVzIGFyZSBkZWR1cGxpY2F0ZWQgcHJlc2VydmluZyB0aGUgX2xhc3RfIGluc3RhbmNlIGluIHRoZSBsaXN0LiBUaGlzXG4gICAgICogaXMgYSBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24gdG8gYXZvaWQgZHVwbGljYXRlZCBzdHlsZXMgdGhhdCBjYW4gb2NjdXJcbiAgICAgKiBlc3BlY2lhbGx5IHdoZW4gY29tcG9zaW5nIHZpYSBzdWJjbGFzc2luZy4gVGhlIGxhc3QgaXRlbSBpcyBrZXB0IHRvIHRyeVxuICAgICAqIHRvIHByZXNlcnZlIHRoZSBjYXNjYWRlIG9yZGVyIHdpdGggdGhlIGFzc3VtcHRpb24gdGhhdCBpdCdzIG1vc3QgaW1wb3J0YW50XG4gICAgICogdGhhdCBsYXN0IGFkZGVkIHN0eWxlcyBvdmVycmlkZSBwcmV2aW91cyBzdHlsZXMuXG4gICAgICpcbiAgICAgKiBAbm9jb2xsYXBzZVxuICAgICAqIEBjYXRlZ29yeSBzdHlsZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZmluYWxpemVTdHlsZXMoc3R5bGVzKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRTdHlsZXMgPSBbXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGVzKSkge1xuICAgICAgICAgICAgLy8gRGVkdXBlIHRoZSBmbGF0dGVuZWQgYXJyYXkgaW4gcmV2ZXJzZSBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgbGFzdCBpdGVtcy5cbiAgICAgICAgICAgIC8vIENhc3RpbmcgdG8gQXJyYXk8dW5rbm93bj4gd29ya3MgYXJvdW5kIFRTIGVycm9yIHRoYXRcbiAgICAgICAgICAgIC8vIGFwcGVhcnMgdG8gY29tZSBmcm9tIHRyeWluZyB0byBmbGF0dGVuIGEgdHlwZSBDU1NSZXN1bHRBcnJheS5cbiAgICAgICAgICAgIGNvbnN0IHNldCA9IG5ldyBTZXQoc3R5bGVzLmZsYXQoSW5maW5pdHkpLnJldmVyc2UoKSk7XG4gICAgICAgICAgICAvLyBUaGVuIHByZXNlcnZlIG9yaWdpbmFsIG9yZGVyIGJ5IGFkZGluZyB0aGUgc2V0IGl0ZW1zIGluIHJldmVyc2Ugb3JkZXIuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygc2V0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFN0eWxlcy51bnNoaWZ0KGdldENvbXBhdGlibGVTdHlsZShzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3R5bGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZXMucHVzaChnZXRDb21wYXRpYmxlU3R5bGUoc3R5bGVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRTdHlsZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBnaXZlbiBhdHRyaWJ1dGUgYG5hbWVgLlxuICAgICAqIEBub2NvbGxhcHNlXG4gICAgICovXG4gICAgc3RhdGljIF9fYXR0cmlidXRlTmFtZUZvclByb3BlcnR5KG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gb3B0aW9ucy5hdHRyaWJ1dGU7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGUgPT09IGZhbHNlXG4gICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgOiB0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8gYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgOiB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBuYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG9ubHkgb3ZlcnJpZGUgcG9pbnQgZm9yIGN1c3RvbWl6aW5nIHdvcmsgZG9uZSB3aGVuIGVsZW1lbnRzXG4gICAgICogYXJlIGNvbnN0cnVjdGVkLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX2luaXRpYWxpemUoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdGhpcy5fX3VwZGF0ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzKSA9PiAodGhpcy5lbmFibGVVcGRhdGluZyA9IHJlcykpO1xuICAgICAgICB0aGlzLl8kY2hhbmdlZFByb3BlcnRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX19zYXZlSW5zdGFuY2VQcm9wZXJ0aWVzKCk7XG4gICAgICAgIC8vIGVuc3VyZXMgZmlyc3QgdXBkYXRlIHdpbGwgYmUgY2F1Z2h0IGJ5IGFuIGVhcmx5IGFjY2VzcyBvZlxuICAgICAgICAvLyBgdXBkYXRlQ29tcGxldGVgXG4gICAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xuICAgICAgICAoX2EgPSB0aGlzLmNvbnN0cnVjdG9yLl9pbml0aWFsaXplcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JFYWNoKChpKSA9PiBpKHRoaXMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgYFJlYWN0aXZlQ29udHJvbGxlcmAgdG8gcGFydGljaXBhdGUgaW4gdGhlIGVsZW1lbnQncyByZWFjdGl2ZVxuICAgICAqIHVwZGF0ZSBjeWNsZS4gVGhlIGVsZW1lbnQgYXV0b21hdGljYWxseSBjYWxscyBpbnRvIGFueSByZWdpc3RlcmVkXG4gICAgICogY29udHJvbGxlcnMgZHVyaW5nIGl0cyBsaWZlY3ljbGUgY2FsbGJhY2tzLlxuICAgICAqXG4gICAgICogSWYgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHdoZW4gYGFkZENvbnRyb2xsZXIoKWAgaXMgY2FsbGVkLCB0aGVcbiAgICAgKiBjb250cm9sbGVyJ3MgYGhvc3RDb25uZWN0ZWQoKWAgY2FsbGJhY2sgd2lsbCBiZSBpbW1lZGlhdGVseSBjYWxsZWQuXG4gICAgICogQGNhdGVnb3J5IGNvbnRyb2xsZXJzXG4gICAgICovXG4gICAgYWRkQ29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICgoX2EgPSB0aGlzLl9fY29udHJvbGxlcnMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzLl9fY29udHJvbGxlcnMgPSBbXSkpLnB1c2goY29udHJvbGxlcik7XG4gICAgICAgIC8vIElmIGEgY29udHJvbGxlciBpcyBhZGRlZCBhZnRlciB0aGUgZWxlbWVudCBoYXMgYmVlbiBjb25uZWN0ZWQsXG4gICAgICAgIC8vIGNhbGwgaG9zdENvbm5lY3RlZC4gTm90ZSwgcmUtdXNpbmcgZXhpc3RlbmNlIG9mIGByZW5kZXJSb290YCBoZXJlXG4gICAgICAgIC8vICh3aGljaCBpcyBzZXQgaW4gY29ubmVjdGVkQ2FsbGJhY2spIHRvIGF2b2lkIHRoZSBuZWVkIHRvIHRyYWNrIGFcbiAgICAgICAgLy8gZmlyc3QgY29ubmVjdGVkIHN0YXRlLlxuICAgICAgICBpZiAodGhpcy5yZW5kZXJSb290ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgKF9iID0gY29udHJvbGxlci5ob3N0Q29ubmVjdGVkKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChjb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgYFJlYWN0aXZlQ29udHJvbGxlcmAgZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKiBAY2F0ZWdvcnkgY29udHJvbGxlcnNcbiAgICAgKi9cbiAgICByZW1vdmVDb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAvLyBOb3RlLCBpZiB0aGUgaW5kZXhPZiBpcyAtMSwgdGhlID4+PiB3aWxsIGZsaXAgdGhlIHNpZ24gd2hpY2ggbWFrZXMgdGhlXG4gICAgICAgIC8vIHNwbGljZSBkbyBub3RoaW5nLlxuICAgICAgICAoX2EgPSB0aGlzLl9fY29udHJvbGxlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zcGxpY2UodGhpcy5fX2NvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPj4+IDAsIDEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXhlcyBhbnkgcHJvcGVydGllcyBzZXQgb24gdGhlIGluc3RhbmNlIGJlZm9yZSB1cGdyYWRlIHRpbWUuXG4gICAgICogT3RoZXJ3aXNlIHRoZXNlIHdvdWxkIHNoYWRvdyB0aGUgYWNjZXNzb3IgYW5kIGJyZWFrIHRoZXNlIHByb3BlcnRpZXMuXG4gICAgICogVGhlIHByb3BlcnRpZXMgYXJlIHN0b3JlZCBpbiBhIE1hcCB3aGljaCBpcyBwbGF5ZWQgYmFjayBhZnRlciB0aGVcbiAgICAgKiBjb25zdHJ1Y3RvciBydW5zLiBOb3RlLCBvbiB2ZXJ5IG9sZCB2ZXJzaW9ucyBvZiBTYWZhcmkgKDw9OSkgb3IgQ2hyb21lXG4gICAgICogKDw9NDEpLCBwcm9wZXJ0aWVzIGNyZWF0ZWQgZm9yIG5hdGl2ZSBwbGF0Zm9ybSBwcm9wZXJ0aWVzIGxpa2UgKGBpZGAgb3JcbiAgICAgKiBgbmFtZWApIG1heSBub3QgaGF2ZSBkZWZhdWx0IHZhbHVlcyBzZXQgaW4gdGhlIGVsZW1lbnQgY29uc3RydWN0b3IuIE9uXG4gICAgICogdGhlc2UgYnJvd3NlcnMgbmF0aXZlIHByb3BlcnRpZXMgYXBwZWFyIG9uIGluc3RhbmNlcyBhbmQgdGhlcmVmb3JlIHRoZWlyXG4gICAgICogZGVmYXVsdCB2YWx1ZSB3aWxsIG92ZXJ3cml0ZSBhbnkgZWxlbWVudCBkZWZhdWx0IChlLmcuIGlmIHRoZSBlbGVtZW50IHNldHNcbiAgICAgKiB0aGlzLmlkID0gJ2lkJyBpbiB0aGUgY29uc3RydWN0b3IsIHRoZSAnaWQnIHdpbGwgYmVjb21lICcnIHNpbmNlIHRoaXMgaXNcbiAgICAgKiB0aGUgbmF0aXZlIHBsYXRmb3JtIGRlZmF1bHQpLlxuICAgICAqL1xuICAgIF9fc2F2ZUluc3RhbmNlUHJvcGVydGllcygpIHtcbiAgICAgICAgLy8gVXNlIGZvckVhY2ggc28gdGhpcyB3b3JrcyBldmVuIGlmIGZvci9vZiBsb29wcyBhcmUgY29tcGlsZWQgdG8gZm9yIGxvb3BzXG4gICAgICAgIC8vIGV4cGVjdGluZyBhcnJheXNcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5lbGVtZW50UHJvcGVydGllcy5mb3JFYWNoKChfdiwgcCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9faW5zdGFuY2VQcm9wZXJ0aWVzLnNldChwLCB0aGlzW3BdKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1twXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5vZGUgaW50byB3aGljaCB0aGUgZWxlbWVudCBzaG91bGQgcmVuZGVyIGFuZCBieSBkZWZhdWx0XG4gICAgICogY3JlYXRlcyBhbmQgcmV0dXJucyBhbiBvcGVuIHNoYWRvd1Jvb3QuIEltcGxlbWVudCB0byBjdXN0b21pemUgd2hlcmUgdGhlXG4gICAgICogZWxlbWVudCdzIERPTSBpcyByZW5kZXJlZC4gRm9yIGV4YW1wbGUsIHRvIHJlbmRlciBpbnRvIHRoZSBlbGVtZW50J3NcbiAgICAgKiBjaGlsZE5vZGVzLCByZXR1cm4gYHRoaXNgLlxuICAgICAqXG4gICAgICogQHJldHVybiBSZXR1cm5zIGEgbm9kZSBpbnRvIHdoaWNoIHRvIHJlbmRlci5cbiAgICAgKiBAY2F0ZWdvcnkgcmVuZGVyaW5nXG4gICAgICovXG4gICAgY3JlYXRlUmVuZGVyUm9vdCgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCByZW5kZXJSb290ID0gKF9hID0gdGhpcy5zaGFkb3dSb290KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0aGlzLmF0dGFjaFNoYWRvdyh0aGlzLmNvbnN0cnVjdG9yLnNoYWRvd1Jvb3RPcHRpb25zKTtcbiAgICAgICAgYWRvcHRTdHlsZXMocmVuZGVyUm9vdCwgdGhpcy5jb25zdHJ1Y3Rvci5lbGVtZW50U3R5bGVzKTtcbiAgICAgICAgcmV0dXJuIHJlbmRlclJvb3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE9uIGZpcnN0IGNvbm5lY3Rpb24sIGNyZWF0ZXMgdGhlIGVsZW1lbnQncyByZW5kZXJSb290LCBzZXRzIHVwXG4gICAgICogZWxlbWVudCBzdHlsaW5nLCBhbmQgZW5hYmxlcyB1cGRhdGluZy5cbiAgICAgKiBAY2F0ZWdvcnkgbGlmZWN5Y2xlXG4gICAgICovXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gY3JlYXRlIHJlbmRlclJvb3QgYmVmb3JlIGZpcnN0IHVwZGF0ZS5cbiAgICAgICAgaWYgKHRoaXMucmVuZGVyUm9vdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclJvb3QgPSB0aGlzLmNyZWF0ZVJlbmRlclJvb3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuYWJsZVVwZGF0aW5nKHRydWUpO1xuICAgICAgICAoX2EgPSB0aGlzLl9fY29udHJvbGxlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JFYWNoKChjKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGMuaG9zdENvbm5lY3RlZCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoYyk7IH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOb3RlLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY29uc2lkZXJlZCBmaW5hbCBhbmQgbm90IG92ZXJyaWRkZW4uIEl0IGlzXG4gICAgICogb3ZlcnJpZGRlbiBvbiB0aGUgZWxlbWVudCBpbnN0YW5jZSB3aXRoIGEgZnVuY3Rpb24gdGhhdCB0cmlnZ2VycyB0aGUgZmlyc3RcbiAgICAgKiB1cGRhdGUuXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICBlbmFibGVVcGRhdGluZyhfcmVxdWVzdGVkVXBkYXRlKSB7IH1cbiAgICAvKipcbiAgICAgKiBBbGxvd3MgZm9yIGBzdXBlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpYCBpbiBleHRlbnNpb25zIHdoaWxlXG4gICAgICogcmVzZXJ2aW5nIHRoZSBwb3NzaWJpbGl0eSBvZiBtYWtpbmcgbm9uLWJyZWFraW5nIGZlYXR1cmUgYWRkaXRpb25zXG4gICAgICogd2hlbiBkaXNjb25uZWN0aW5nIGF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZS5cbiAgICAgKiBAY2F0ZWdvcnkgbGlmZWN5Y2xlXG4gICAgICovXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gdGhpcy5fX2NvbnRyb2xsZXJzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yRWFjaCgoYykgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBjLmhvc3REaXNjb25uZWN0ZWQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKGMpOyB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemVzIHByb3BlcnR5IHZhbHVlcyB3aGVuIGF0dHJpYnV0ZXMgY2hhbmdlLlxuICAgICAqIEBjYXRlZ29yeSBhdHRyaWJ1dGVzXG4gICAgICovXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIF9vbGQsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuXyRhdHRyaWJ1dGVUb1Byb3BlcnR5KG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gICAgX19wcm9wZXJ0eVRvQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBvcHRpb25zID0gZGVmYXVsdFByb3BlcnR5RGVjbGFyYXRpb24pIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuY29uc3RydWN0b3IuX19hdHRyaWJ1dGVOYW1lRm9yUHJvcGVydHkobmFtZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChhdHRyICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5yZWZsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCB0b0F0dHJpYnV0ZSA9IChfYiA9IChfYSA9IG9wdGlvbnMuY29udmVydGVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9BdHRyaWJ1dGUpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IGRlZmF1bHRDb252ZXJ0ZXIudG9BdHRyaWJ1dGU7XG4gICAgICAgICAgICBjb25zdCBhdHRyVmFsdWUgPSB0b0F0dHJpYnV0ZSh2YWx1ZSwgb3B0aW9ucy50eXBlKTtcbiAgICAgICAgICAgIGlmIChERVZfTU9ERSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuZW5hYmxlZFdhcm5pbmdzLmluZGV4T2YoJ21pZ3JhdGlvbicpID49IDAgJiZcbiAgICAgICAgICAgICAgICBhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlzc3VlV2FybmluZygndW5kZWZpbmVkLWF0dHJpYnV0ZS12YWx1ZScsIGBUaGUgYXR0cmlidXRlIHZhbHVlIGZvciB0aGUgJHtuYW1lfSBwcm9wZXJ0eSBpcyBgICtcbiAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCBvbiBlbGVtZW50ICR7dGhpcy5sb2NhbE5hbWV9LiBUaGUgYXR0cmlidXRlIHdpbGwgYmUgYCArXG4gICAgICAgICAgICAgICAgICAgIGByZW1vdmVkLCBidXQgaW4gdGhlIHByZXZpb3VzIHZlcnNpb24gb2YgXFxgUmVhY3RpdmVFbGVtZW50XFxgLCBgICtcbiAgICAgICAgICAgICAgICAgICAgYHRoZSBhdHRyaWJ1dGUgd291bGQgbm90IGhhdmUgY2hhbmdlZC5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRyYWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyBiZWluZyByZWZsZWN0ZWQgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIHByb3BlcnR5IGFnYWluIHZpYSBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYC4gTm90ZTpcbiAgICAgICAgICAgIC8vIDEuIHRoaXMgdGFrZXMgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoYXQgdGhlIGNhbGxiYWNrIGlzIHN5bmNocm9ub3VzLlxuICAgICAgICAgICAgLy8gMi4gd2lsbCBiZWhhdmUgaW5jb3JyZWN0bHkgaWYgbXVsdGlwbGUgYXR0cmlidXRlcyBhcmUgaW4gdGhlIHJlYWN0aW9uXG4gICAgICAgICAgICAvLyBzdGFjayBhdCB0aW1lIG9mIGNhbGxpbmcuIEhvd2V2ZXIsIHNpbmNlIHdlIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAgICAgICAgLy8gaW4gYHVwZGF0ZWAgdGhpcyBzaG91bGQgbm90IGJlIHBvc3NpYmxlIChvciBhbiBleHRyZW1lIGNvcm5lciBjYXNlXG4gICAgICAgICAgICAvLyB0aGF0IHdlJ2QgbGlrZSB0byBkaXNjb3ZlcikuXG4gICAgICAgICAgICAvLyBtYXJrIHN0YXRlIHJlZmxlY3RpbmdcbiAgICAgICAgICAgIHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydHkgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWFyayBzdGF0ZSBub3QgcmVmbGVjdGluZ1xuICAgICAgICAgICAgdGhpcy5fX3JlZmxlY3RpbmdQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF8kYXR0cmlidXRlVG9Qcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgY29uc3QgY3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIC8vIE5vdGUsIGhpbnQgdGhpcyBhcyBhbiBgQXR0cmlidXRlTWFwYCBzbyBjbG9zdXJlIGNsZWFybHkgdW5kZXJzdGFuZHNcbiAgICAgICAgLy8gdGhlIHR5cGU7IGl0IGhhcyBpc3N1ZXMgd2l0aCB0cmFja2luZyB0eXBlcyB0aHJvdWdoIHN0YXRpY3NcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSBjdG9yLl9fYXR0cmlidXRlVG9Qcm9wZXJ0eU1hcC5nZXQobmFtZSk7XG4gICAgICAgIC8vIFVzZSB0cmFja2luZyBpbmZvIHRvIGF2b2lkIHJlZmxlY3RpbmcgYSBwcm9wZXJ0eSB2YWx1ZSB0byBhbiBhdHRyaWJ1dGVcbiAgICAgICAgLy8gaWYgaXQgd2FzIGp1c3Qgc2V0IGJlY2F1c2UgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VkLlxuICAgICAgICBpZiAocHJvcE5hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9fcmVmbGVjdGluZ1Byb3BlcnR5ICE9PSBwcm9wTmFtZSkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGN0b3IuZ2V0UHJvcGVydHlPcHRpb25zKHByb3BOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlciA9IG9wdGlvbnMuY29udmVydGVyO1xuICAgICAgICAgICAgY29uc3QgZnJvbUF0dHJpYnV0ZSA9IChfYyA9IChfYiA9IChfYSA9IGNvbnZlcnRlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZyb21BdHRyaWJ1dGUpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICh0eXBlb2YgY29udmVydGVyID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgPyBjb252ZXJ0ZXJcbiAgICAgICAgICAgICAgICA6IG51bGwpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBkZWZhdWx0Q29udmVydGVyLmZyb21BdHRyaWJ1dGU7XG4gICAgICAgICAgICAvLyBtYXJrIHN0YXRlIHJlZmxlY3RpbmdcbiAgICAgICAgICAgIHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydHkgPSBwcm9wTmFtZTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICB0aGlzW3Byb3BOYW1lXSA9IGZyb21BdHRyaWJ1dGUodmFsdWUsIG9wdGlvbnMudHlwZSk7XG4gICAgICAgICAgICAvLyBtYXJrIHN0YXRlIG5vdCByZWZsZWN0aW5nXG4gICAgICAgICAgICB0aGlzLl9fcmVmbGVjdGluZ1Byb3BlcnR5ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyBhbiB1cGRhdGUgd2hpY2ggaXMgcHJvY2Vzc2VkIGFzeW5jaHJvbm91c2x5LiBUaGlzIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgKiB3aGVuIGFuIGVsZW1lbnQgc2hvdWxkIHVwZGF0ZSBiYXNlZCBvbiBzb21lIHN0YXRlIG5vdCB0cmlnZ2VyZWQgYnkgc2V0dGluZ1xuICAgICAqIGEgcmVhY3RpdmUgcHJvcGVydHkuIEluIHRoaXMgY2FzZSwgcGFzcyBubyBhcmd1bWVudHMuIEl0IHNob3VsZCBhbHNvIGJlXG4gICAgICogY2FsbGVkIHdoZW4gbWFudWFsbHkgaW1wbGVtZW50aW5nIGEgcHJvcGVydHkgc2V0dGVyLiBJbiB0aGlzIGNhc2UsIHBhc3MgdGhlXG4gICAgICogcHJvcGVydHkgYG5hbWVgIGFuZCBgb2xkVmFsdWVgIHRvIGVuc3VyZSB0aGF0IGFueSBjb25maWd1cmVkIHByb3BlcnR5XG4gICAgICogb3B0aW9ucyBhcmUgaG9ub3JlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIG5hbWUgb2YgcmVxdWVzdGluZyBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBvbGQgdmFsdWUgb2YgcmVxdWVzdGluZyBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSBvcHRpb25zIHByb3BlcnR5IG9wdGlvbnMgdG8gdXNlIGluc3RlYWQgb2YgdGhlIHByZXZpb3VzbHlcbiAgICAgKiAgICAgY29uZmlndXJlZCBvcHRpb25zXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICByZXF1ZXN0VXBkYXRlKG5hbWUsIG9sZFZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBzaG91bGRSZXF1ZXN0VXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIHByb3BlcnR5IGtleSwgcGVyZm9ybSBwcm9wZXJ0eSB1cGRhdGUgc3RlcHMuXG4gICAgICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgICAgICAgIG9wdGlvbnMgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5nZXRQcm9wZXJ0eU9wdGlvbnMobmFtZSk7XG4gICAgICAgICAgICBjb25zdCBoYXNDaGFuZ2VkID0gb3B0aW9ucy5oYXNDaGFuZ2VkIHx8IG5vdEVxdWFsO1xuICAgICAgICAgICAgaWYgKGhhc0NoYW5nZWQodGhpc1tuYW1lXSwgb2xkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl8kY2hhbmdlZFByb3BlcnRpZXMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRjaGFuZ2VkUHJvcGVydGllcy5zZXQobmFtZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gcmVmbGVjdGluZyBwcm9wZXJ0aWVzIHNldC5cbiAgICAgICAgICAgICAgICAvLyBOb3RlLCBpdCdzIGltcG9ydGFudCB0aGF0IGV2ZXJ5IGNoYW5nZSBoYXMgYSBjaGFuY2UgdG8gYWRkIHRoZVxuICAgICAgICAgICAgICAgIC8vIHByb3BlcnR5IHRvIGBfcmVmbGVjdGluZ1Byb3BlcnRpZXNgLiBUaGlzIGVuc3VyZXMgc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGF0dHJpYnV0ZSArIHByb3BlcnR5IHJlZmxlY3RzIGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yZWZsZWN0ID09PSB0cnVlICYmIHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydHkgIT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fcmVmbGVjdGluZ1Byb3BlcnRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3JlZmxlY3RpbmdQcm9wZXJ0aWVzLnNldChuYW1lLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBYm9ydCB0aGUgcmVxdWVzdCBpZiB0aGUgcHJvcGVydHkgc2hvdWxkIG5vdCBiZSBjb25zaWRlcmVkIGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgc2hvdWxkUmVxdWVzdFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1VwZGF0ZVBlbmRpbmcgJiYgc2hvdWxkUmVxdWVzdFVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fX3VwZGF0ZVByb21pc2UgPSB0aGlzLl9fZW5xdWV1ZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGUsIHNpbmNlIHRoaXMgbm8gbG9uZ2VyIHJldHVybnMgYSBwcm9taXNlLCBpbiBkZXYgbW9kZSB3ZSByZXR1cm4gYVxuICAgICAgICAvLyB0aGVuYWJsZSB3aGljaCB3YXJucyBpZiBpdCdzIGNhbGxlZC5cbiAgICAgICAgcmV0dXJuIERFVl9NT0RFXG4gICAgICAgICAgICA/IHJlcXVlc3RVcGRhdGVUaGVuYWJsZSh0aGlzLmxvY2FsTmFtZSlcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIHRoZSBlbGVtZW50IHRvIGFzeW5jaHJvbm91c2x5IHVwZGF0ZS5cbiAgICAgKi9cbiAgICBhc3luYyBfX2VucXVldWVVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuaXNVcGRhdGVQZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBhbnkgcHJldmlvdXMgdXBkYXRlIGhhcyByZXNvbHZlZCBiZWZvcmUgdXBkYXRpbmcuXG4gICAgICAgICAgICAvLyBUaGlzIGBhd2FpdGAgYWxzbyBlbnN1cmVzIHRoYXQgcHJvcGVydHkgY2hhbmdlcyBhcmUgYmF0Y2hlZC5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX191cGRhdGVQcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBSZWZpcmUgYW55IHByZXZpb3VzIGVycm9ycyBhc3luYyBzbyB0aGV5IGRvIG5vdCBkaXNydXB0IHRoZSB1cGRhdGVcbiAgICAgICAgICAgIC8vIGN5Y2xlLiBFcnJvcnMgYXJlIHJlZmlyZWQgc28gZGV2ZWxvcGVycyBoYXZlIGEgY2hhbmNlIHRvIG9ic2VydmVcbiAgICAgICAgICAgIC8vIHRoZW0sIGFuZCB0aGlzIGNhbiBiZSBkb25lIGJ5IGltcGxlbWVudGluZ1xuICAgICAgICAgICAgLy8gYHdpbmRvdy5vbnVuaGFuZGxlZHJlamVjdGlvbmAuXG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgICAgIC8vIElmIGBzY2hlZHVsZVVwZGF0ZWAgcmV0dXJucyBhIFByb21pc2UsIHdlIGF3YWl0IGl0LiBUaGlzIGlzIGRvbmUgdG9cbiAgICAgICAgLy8gZW5hYmxlIGNvb3JkaW5hdGluZyB1cGRhdGVzIHdpdGggYSBzY2hlZHVsZXIuIE5vdGUsIHRoZSByZXN1bHQgaXNcbiAgICAgICAgLy8gY2hlY2tlZCB0byBhdm9pZCBkZWxheWluZyBhbiBhZGRpdGlvbmFsIG1pY3JvdGFzayB1bmxlc3Mgd2UgbmVlZCB0by5cbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhd2FpdCByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICF0aGlzLmlzVXBkYXRlUGVuZGluZztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NoZWR1bGVzIGFuIGVsZW1lbnQgdXBkYXRlLiBZb3UgY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGNoYW5nZSB0aGVcbiAgICAgKiB0aW1pbmcgb2YgdXBkYXRlcyBieSByZXR1cm5pbmcgYSBQcm9taXNlLiBUaGUgdXBkYXRlIHdpbGwgYXdhaXQgdGhlXG4gICAgICogcmV0dXJuZWQgUHJvbWlzZSwgYW5kIHlvdSBzaG91bGQgcmVzb2x2ZSB0aGUgUHJvbWlzZSB0byBhbGxvdyB0aGUgdXBkYXRlXG4gICAgICogdG8gcHJvY2VlZC4gSWYgdGhpcyBtZXRob2QgaXMgb3ZlcnJpZGRlbiwgYHN1cGVyLnNjaGVkdWxlVXBkYXRlKClgXG4gICAgICogbXVzdCBiZSBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBGb3IgaW5zdGFuY2UsIHRvIHNjaGVkdWxlIHVwZGF0ZXMgdG8gb2NjdXIganVzdCBiZWZvcmUgdGhlIG5leHQgZnJhbWU6XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIG92ZXJyaWRlIHByb3RlY3RlZCBhc3luYyBzY2hlZHVsZVVwZGF0ZSgpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICAgKiAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVzb2x2ZSgpKSk7XG4gICAgICogICBzdXBlci5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKiBAY2F0ZWdvcnkgdXBkYXRlc1xuICAgICAqL1xuICAgIHNjaGVkdWxlVXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtVXBkYXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGFuIGVsZW1lbnQgdXBkYXRlLiBOb3RlLCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGR1cmluZyB0aGVcbiAgICAgKiB1cGRhdGUsIGBmaXJzdFVwZGF0ZWRgIGFuZCBgdXBkYXRlZGAgd2lsbCBub3QgYmUgY2FsbGVkLlxuICAgICAqXG4gICAgICogQ2FsbCBgcGVyZm9ybVVwZGF0ZSgpYCB0byBpbW1lZGlhdGVseSBwcm9jZXNzIGEgcGVuZGluZyB1cGRhdGUuIFRoaXMgc2hvdWxkXG4gICAgICogZ2VuZXJhbGx5IG5vdCBiZSBuZWVkZWQsIGJ1dCBpdCBjYW4gYmUgZG9uZSBpbiByYXJlIGNhc2VzIHdoZW4geW91IG5lZWQgdG9cbiAgICAgKiB1cGRhdGUgc3luY2hyb25vdXNseS5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRvIGVuc3VyZSBgcGVyZm9ybVVwZGF0ZSgpYCBzeW5jaHJvbm91c2x5IGNvbXBsZXRlcyBhIHBlbmRpbmcgdXBkYXRlLFxuICAgICAqIGl0IHNob3VsZCBub3QgYmUgb3ZlcnJpZGRlbi4gSW4gTGl0RWxlbWVudCAyLnggaXQgd2FzIHN1Z2dlc3RlZCB0byBvdmVycmlkZVxuICAgICAqIGBwZXJmb3JtVXBkYXRlKClgIHRvIGFsc28gY3VzdG9taXppbmcgdXBkYXRlIHNjaGVkdWxpbmcuIEluc3RlYWQsIHlvdSBzaG91bGQgbm93XG4gICAgICogb3ZlcnJpZGUgYHNjaGVkdWxlVXBkYXRlKClgLiBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBMaXRFbGVtZW50IDIueCxcbiAgICAgKiBzY2hlZHVsaW5nIHVwZGF0ZXMgdmlhIGBwZXJmb3JtVXBkYXRlKClgIGNvbnRpbnVlcyB0byB3b3JrLCBidXQgd2lsbCBtYWtlXG4gICAgICogYWxzbyBjYWxsaW5nIGBwZXJmb3JtVXBkYXRlKClgIHRvIHN5bmNocm9ub3VzbHkgcHJvY2VzcyB1cGRhdGVzIGRpZmZpY3VsdC5cbiAgICAgKlxuICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICovXG4gICAgcGVyZm9ybVVwZGF0ZSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAvLyBBYm9ydCBhbnkgdXBkYXRlIGlmIG9uZSBpcyBub3QgcGVuZGluZyB3aGVuIHRoaXMgaXMgY2FsbGVkLlxuICAgICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgYHBlcmZvcm1VcGRhdGVgIGlzIGNhbGxlZCBlYXJseSB0byBcImZsdXNoXCJcbiAgICAgICAgLy8gdGhlIHVwZGF0ZS5cbiAgICAgICAgaWYgKCF0aGlzLmlzVXBkYXRlUGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSByZW5kZXJSb290IGJlZm9yZSBmaXJzdCB1cGRhdGUuXG4gICAgICAgIGlmICghdGhpcy5oYXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAvLyBQcm9kdWNlIHdhcm5pbmcgaWYgYW55IGNsYXNzIHByb3BlcnRpZXMgYXJlIHNoYWRvd2VkIGJ5IGNsYXNzIGZpZWxkc1xuICAgICAgICAgICAgaWYgKERFVl9NT0RFKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZG93ZWRQcm9wZXJ0aWVzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5lbGVtZW50UHJvcGVydGllcy5mb3JFYWNoKChfdiwgcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHApICYmICEoKF9hID0gdGhpcy5fX2luc3RhbmNlUHJvcGVydGllcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmhhcyhwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd2VkUHJvcGVydGllcy5wdXNoKHApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHNoYWRvd2VkUHJvcGVydGllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZm9sbG93aW5nIHByb3BlcnRpZXMgb24gZWxlbWVudCAke3RoaXMubG9jYWxOYW1lfSB3aWxsIG5vdCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGB0cmlnZ2VyIHVwZGF0ZXMgYXMgZXhwZWN0ZWQgYmVjYXVzZSB0aGV5IGFyZSBzZXQgdXNpbmcgY2xhc3MgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgZmllbGRzOiAke3NoYWRvd2VkUHJvcGVydGllcy5qb2luKCcsICcpfS4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgTmF0aXZlIGNsYXNzIGZpZWxkcyBhbmQgc29tZSBjb21waWxlZCBvdXRwdXQgd2lsbCBvdmVyd3JpdGUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgYWNjZXNzb3JzIHVzZWQgZm9yIGRldGVjdGluZyBjaGFuZ2VzLiBTZWUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgaHR0cHM6Ly9saXQuZGV2L21zZy9jbGFzcy1maWVsZC1zaGFkb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgZm9yIG1vcmUgaW5mb3JtYXRpb24uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE1peGluIGluc3RhbmNlIHByb3BlcnRpZXMgb25jZSwgaWYgdGhleSBleGlzdC5cbiAgICAgICAgaWYgKHRoaXMuX19pbnN0YW5jZVByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIC8vIFVzZSBmb3JFYWNoIHNvIHRoaXMgd29ya3MgZXZlbiBpZiBmb3Ivb2YgbG9vcHMgYXJlIGNvbXBpbGVkIHRvIGZvciBsb29wc1xuICAgICAgICAgICAgLy8gZXhwZWN0aW5nIGFycmF5c1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIHRoaXMuX19pbnN0YW5jZVByb3BlcnRpZXMuZm9yRWFjaCgodiwgcCkgPT4gKHRoaXNbcF0gPSB2KSk7XG4gICAgICAgICAgICB0aGlzLl9faW5zdGFuY2VQcm9wZXJ0aWVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2hhbmdlZFByb3BlcnRpZXMgPSB0aGlzLl8kY2hhbmdlZFByb3BlcnRpZXM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzaG91bGRVcGRhdGUgPSB0aGlzLnNob3VsZFVwZGF0ZShjaGFuZ2VkUHJvcGVydGllcyk7XG4gICAgICAgICAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWxsVXBkYXRlKGNoYW5nZWRQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9fY29udHJvbGxlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JFYWNoKChjKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGMuaG9zdFVwZGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoYyk7IH0pO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGNoYW5nZWRQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX19tYXJrVXBkYXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IGBmaXJzdFVwZGF0ZWRgIGFuZCBgdXBkYXRlZGAgZnJvbSBydW5uaW5nIHdoZW4gdGhlcmUncyBhblxuICAgICAgICAgICAgLy8gdXBkYXRlIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gRW5zdXJlIGVsZW1lbnQgY2FuIGFjY2VwdCBhZGRpdGlvbmFsIHVwZGF0ZXMgYWZ0ZXIgYW4gZXhjZXB0aW9uLlxuICAgICAgICAgICAgdGhpcy5fX21hcmtVcGRhdGVkKCk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSB1cGRhdGUgaXMgbm8gbG9uZ2VyIGNvbnNpZGVyZWQgcGVuZGluZyBhbmQgZnVydGhlciB1cGRhdGVzIGFyZSBub3cgYWxsb3dlZC5cbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fJGRpZFVwZGF0ZShjaGFuZ2VkUHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICB3aWxsVXBkYXRlKF9jaGFuZ2VkUHJvcGVydGllcykgeyB9XG4gICAgLy8gTm90ZSwgdGhpcyBpcyBhbiBvdmVycmlkZSBwb2ludCBmb3IgcG9seWZpbGwtc3VwcG9ydC5cbiAgICAvLyBAaW50ZXJuYWxcbiAgICBfJGRpZFVwZGF0ZShjaGFuZ2VkUHJvcGVydGllcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXMuX19jb250cm9sbGVycykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZvckVhY2goKGMpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gYy5ob3N0VXBkYXRlZCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoYyk7IH0pO1xuICAgICAgICBpZiAoIXRoaXMuaGFzVXBkYXRlZCkge1xuICAgICAgICAgICAgdGhpcy5oYXNVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RVcGRhdGVkKGNoYW5nZWRQcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZWQoY2hhbmdlZFByb3BlcnRpZXMpO1xuICAgICAgICBpZiAoREVWX01PREUgJiZcbiAgICAgICAgICAgIHRoaXMuaXNVcGRhdGVQZW5kaW5nICYmXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmVuYWJsZWRXYXJuaW5ncy5pbmRleE9mKCdjaGFuZ2UtaW4tdXBkYXRlJykgPj0gMCkge1xuICAgICAgICAgICAgaXNzdWVXYXJuaW5nKCdjaGFuZ2UtaW4tdXBkYXRlJywgYEVsZW1lbnQgJHt0aGlzLmxvY2FsTmFtZX0gc2NoZWR1bGVkIGFuIHVwZGF0ZSBgICtcbiAgICAgICAgICAgICAgICBgKGdlbmVyYWxseSBiZWNhdXNlIGEgcHJvcGVydHkgd2FzIHNldCkgYCArXG4gICAgICAgICAgICAgICAgYGFmdGVyIGFuIHVwZGF0ZSBjb21wbGV0ZWQsIGNhdXNpbmcgYSBuZXcgdXBkYXRlIHRvIGJlIHNjaGVkdWxlZC4gYCArXG4gICAgICAgICAgICAgICAgYFRoaXMgaXMgaW5lZmZpY2llbnQgYW5kIHNob3VsZCBiZSBhdm9pZGVkIHVubGVzcyB0aGUgbmV4dCB1cGRhdGUgYCArXG4gICAgICAgICAgICAgICAgYGNhbiBvbmx5IGJlIHNjaGVkdWxlZCBhcyBhIHNpZGUgZWZmZWN0IG9mIHRoZSBwcmV2aW91cyB1cGRhdGUuYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX19tYXJrVXBkYXRlZCgpIHtcbiAgICAgICAgdGhpcy5fJGNoYW5nZWRQcm9wZXJ0aWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmlzVXBkYXRlUGVuZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGVsZW1lbnQgaGFzIGNvbXBsZXRlZCB1cGRhdGluZy5cbiAgICAgKiBUaGUgUHJvbWlzZSB2YWx1ZSBpcyBhIGJvb2xlYW4gdGhhdCBpcyBgdHJ1ZWAgaWYgdGhlIGVsZW1lbnQgY29tcGxldGVkIHRoZVxuICAgICAqIHVwZGF0ZSB3aXRob3V0IHRyaWdnZXJpbmcgYW5vdGhlciB1cGRhdGUuIFRoZSBQcm9taXNlIHJlc3VsdCBpcyBgZmFsc2VgIGlmXG4gICAgICogYSBwcm9wZXJ0eSB3YXMgc2V0IGluc2lkZSBgdXBkYXRlZCgpYC4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGFuXG4gICAgICogZXhjZXB0aW9uIHdhcyB0aHJvd24gZHVyaW5nIHRoZSB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBUbyBhd2FpdCBhZGRpdGlvbmFsIGFzeW5jaHJvbm91cyB3b3JrLCBvdmVycmlkZSB0aGUgYGdldFVwZGF0ZUNvbXBsZXRlYFxuICAgICAqIG1ldGhvZC4gRm9yIGV4YW1wbGUsIGl0IGlzIHNvbWV0aW1lcyB1c2VmdWwgdG8gYXdhaXQgYSByZW5kZXJlZCBlbGVtZW50XG4gICAgICogYmVmb3JlIGZ1bGZpbGxpbmcgdGhpcyBQcm9taXNlLiBUbyBkbyB0aGlzLCBmaXJzdCBhd2FpdFxuICAgICAqIGBzdXBlci5nZXRVcGRhdGVDb21wbGV0ZSgpYCwgdGhlbiBhbnkgc3Vic2VxdWVudCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gQSBwcm9taXNlIG9mIGEgYm9vbGVhbiB0aGF0IHJlc29sdmVzIHRvIHRydWUgaWYgdGhlIHVwZGF0ZSBjb21wbGV0ZWRcbiAgICAgKiAgICAgd2l0aG91dCB0cmlnZ2VyaW5nIGFub3RoZXIgdXBkYXRlLlxuICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICovXG4gICAgZ2V0IHVwZGF0ZUNvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVcGRhdGVDb21wbGV0ZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPdmVycmlkZSBwb2ludCBmb3IgdGhlIGB1cGRhdGVDb21wbGV0ZWAgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEl0IGlzIG5vdCBzYWZlIHRvIG92ZXJyaWRlIHRoZSBgdXBkYXRlQ29tcGxldGVgIGdldHRlciBkaXJlY3RseSBkdWUgdG8gYVxuICAgICAqIGxpbWl0YXRpb24gaW4gVHlwZVNjcmlwdCB3aGljaCBtZWFucyBpdCBpcyBub3QgcG9zc2libGUgdG8gY2FsbCBhXG4gICAgICogc3VwZXJjbGFzcyBnZXR0ZXIgKGUuZy4gYHN1cGVyLnVwZGF0ZUNvbXBsZXRlLnRoZW4oLi4uKWApIHdoZW4gdGhlIHRhcmdldFxuICAgICAqIGxhbmd1YWdlIGlzIEVTNSAoaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMzgpLlxuICAgICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZGVuIGluc3RlYWQuIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBjbGFzcyBNeUVsZW1lbnQgZXh0ZW5kcyBMaXRFbGVtZW50IHtcbiAgICAgKiAgIG92ZXJyaWRlIGFzeW5jIGdldFVwZGF0ZUNvbXBsZXRlKCkge1xuICAgICAqICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzdXBlci5nZXRVcGRhdGVDb21wbGV0ZSgpO1xuICAgICAqICAgICBhd2FpdCB0aGlzLl9teUNoaWxkLnVwZGF0ZUNvbXBsZXRlO1xuICAgICAqICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEByZXR1cm4gQSBwcm9taXNlIG9mIGEgYm9vbGVhbiB0aGF0IHJlc29sdmVzIHRvIHRydWUgaWYgdGhlIHVwZGF0ZSBjb21wbGV0ZWRcbiAgICAgKiAgICAgd2l0aG91dCB0cmlnZ2VyaW5nIGFub3RoZXIgdXBkYXRlLlxuICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICovXG4gICAgZ2V0VXBkYXRlQ29tcGxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdXBkYXRlUHJvbWlzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29udHJvbHMgd2hldGhlciBvciBub3QgYHVwZGF0ZSgpYCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgcmVxdWVzdHNcbiAgICAgKiBhbiB1cGRhdGUuIEJ5IGRlZmF1bHQsIHRoaXMgbWV0aG9kIGFsd2F5cyByZXR1cm5zIGB0cnVlYCwgYnV0IHRoaXMgY2FuIGJlXG4gICAgICogY3VzdG9taXplZCB0byBjb250cm9sIHdoZW4gdG8gdXBkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIF9jaGFuZ2VkUHJvcGVydGllcyBNYXAgb2YgY2hhbmdlZCBwcm9wZXJ0aWVzIHdpdGggb2xkIHZhbHVlc1xuICAgICAqIEBjYXRlZ29yeSB1cGRhdGVzXG4gICAgICovXG4gICAgc2hvdWxkVXBkYXRlKF9jaGFuZ2VkUHJvcGVydGllcykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZWxlbWVudC4gVGhpcyBtZXRob2QgcmVmbGVjdHMgcHJvcGVydHkgdmFsdWVzIHRvIGF0dHJpYnV0ZXMuXG4gICAgICogSXQgY2FuIGJlIG92ZXJyaWRkZW4gdG8gcmVuZGVyIGFuZCBrZWVwIHVwZGF0ZWQgZWxlbWVudCBET00uXG4gICAgICogU2V0dGluZyBwcm9wZXJ0aWVzIGluc2lkZSB0aGlzIG1ldGhvZCB3aWxsICpub3QqIHRyaWdnZXJcbiAgICAgKiBhbm90aGVyIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBfY2hhbmdlZFByb3BlcnRpZXMgTWFwIG9mIGNoYW5nZWQgcHJvcGVydGllcyB3aXRoIG9sZCB2YWx1ZXNcbiAgICAgKiBAY2F0ZWdvcnkgdXBkYXRlc1xuICAgICAqL1xuICAgIHVwZGF0ZShfY2hhbmdlZFByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBVc2UgZm9yRWFjaCBzbyB0aGlzIHdvcmtzIGV2ZW4gaWYgZm9yL29mIGxvb3BzIGFyZSBjb21waWxlZCB0byBmb3JcbiAgICAgICAgICAgIC8vIGxvb3BzIGV4cGVjdGluZyBhcnJheXNcbiAgICAgICAgICAgIHRoaXMuX19yZWZsZWN0aW5nUHJvcGVydGllcy5mb3JFYWNoKCh2LCBrKSA9PiB0aGlzLl9fcHJvcGVydHlUb0F0dHJpYnV0ZShrLCB0aGlzW2tdLCB2KSk7XG4gICAgICAgICAgICB0aGlzLl9fcmVmbGVjdGluZ1Byb3BlcnRpZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fX21hcmtVcGRhdGVkKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbmV2ZXIgdGhlIGVsZW1lbnQgaXMgdXBkYXRlZC4gSW1wbGVtZW50IHRvIHBlcmZvcm1cbiAgICAgKiBwb3N0LXVwZGF0aW5nIHRhc2tzIHZpYSBET00gQVBJcywgZm9yIGV4YW1wbGUsIGZvY3VzaW5nIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHByb3BlcnRpZXMgaW5zaWRlIHRoaXMgbWV0aG9kIHdpbGwgdHJpZ2dlciB0aGUgZWxlbWVudCB0byB1cGRhdGVcbiAgICAgKiBhZ2FpbiBhZnRlciB0aGlzIHVwZGF0ZSBjeWNsZSBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gX2NoYW5nZWRQcm9wZXJ0aWVzIE1hcCBvZiBjaGFuZ2VkIHByb3BlcnRpZXMgd2l0aCBvbGQgdmFsdWVzXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICB1cGRhdGVkKF9jaGFuZ2VkUHJvcGVydGllcykgeyB9XG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSBlbGVtZW50IGlzIGZpcnN0IHVwZGF0ZWQuIEltcGxlbWVudCB0byBwZXJmb3JtIG9uZSB0aW1lXG4gICAgICogd29yayBvbiB0aGUgZWxlbWVudCBhZnRlciB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHByb3BlcnRpZXMgaW5zaWRlIHRoaXMgbWV0aG9kIHdpbGwgdHJpZ2dlciB0aGUgZWxlbWVudCB0byB1cGRhdGVcbiAgICAgKiBhZ2FpbiBhZnRlciB0aGlzIHVwZGF0ZSBjeWNsZSBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gX2NoYW5nZWRQcm9wZXJ0aWVzIE1hcCBvZiBjaGFuZ2VkIHByb3BlcnRpZXMgd2l0aCBvbGQgdmFsdWVzXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICBmaXJzdFVwZGF0ZWQoX2NoYW5nZWRQcm9wZXJ0aWVzKSB7IH1cbn1cbl9kID0gZmluYWxpemVkO1xuLyoqXG4gKiBNYXJrcyBjbGFzcyBhcyBoYXZpbmcgZmluaXNoZWQgY3JlYXRpbmcgcHJvcGVydGllcy5cbiAqL1xuUmVhY3RpdmVFbGVtZW50W19kXSA9IHRydWU7XG4vKipcbiAqIE1lbW9pemVkIGxpc3Qgb2YgYWxsIGVsZW1lbnQgcHJvcGVydGllcywgaW5jbHVkaW5nIGFueSBzdXBlcmNsYXNzIHByb3BlcnRpZXMuXG4gKiBDcmVhdGVkIGxhemlseSBvbiB1c2VyIHN1YmNsYXNzZXMgd2hlbiBmaW5hbGl6aW5nIHRoZSBjbGFzcy5cbiAqIEBub2NvbGxhcHNlXG4gKiBAY2F0ZWdvcnkgcHJvcGVydGllc1xuICovXG5SZWFjdGl2ZUVsZW1lbnQuZWxlbWVudFByb3BlcnRpZXMgPSBuZXcgTWFwKCk7XG4vKipcbiAqIE1lbW9pemVkIGxpc3Qgb2YgYWxsIGVsZW1lbnQgc3R5bGVzLlxuICogQ3JlYXRlZCBsYXppbHkgb24gdXNlciBzdWJjbGFzc2VzIHdoZW4gZmluYWxpemluZyB0aGUgY2xhc3MuXG4gKiBAbm9jb2xsYXBzZVxuICogQGNhdGVnb3J5IHN0eWxlc1xuICovXG5SZWFjdGl2ZUVsZW1lbnQuZWxlbWVudFN0eWxlcyA9IFtdO1xuLyoqXG4gKiBPcHRpb25zIHVzZWQgd2hlbiBjYWxsaW5nIGBhdHRhY2hTaGFkb3dgLiBTZXQgdGhpcyBwcm9wZXJ0eSB0byBjdXN0b21pemVcbiAqIHRoZSBvcHRpb25zIGZvciB0aGUgc2hhZG93Um9vdDsgZm9yIGV4YW1wbGUsIHRvIGNyZWF0ZSBhIGNsb3NlZFxuICogc2hhZG93Um9vdDogYHttb2RlOiAnY2xvc2VkJ31gLlxuICpcbiAqIE5vdGUsIHRoZXNlIG9wdGlvbnMgYXJlIHVzZWQgaW4gYGNyZWF0ZVJlbmRlclJvb3RgLiBJZiB0aGlzIG1ldGhvZFxuICogaXMgY3VzdG9taXplZCwgb3B0aW9ucyBzaG91bGQgYmUgcmVzcGVjdGVkIGlmIHBvc3NpYmxlLlxuICogQG5vY29sbGFwc2VcbiAqIEBjYXRlZ29yeSByZW5kZXJpbmdcbiAqL1xuUmVhY3RpdmVFbGVtZW50LnNoYWRvd1Jvb3RPcHRpb25zID0geyBtb2RlOiAnb3BlbicgfTtcbi8vIEFwcGx5IHBvbHlmaWxscyBpZiBhdmFpbGFibGVcbnBvbHlmaWxsU3VwcG9ydCA9PT0gbnVsbCB8fCBwb2x5ZmlsbFN1cHBvcnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBvbHlmaWxsU3VwcG9ydCh7IFJlYWN0aXZlRWxlbWVudCB9KTtcbi8vIERldiBtb2RlIHdhcm5pbmdzLi4uXG5pZiAoREVWX01PREUpIHtcbiAgICAvLyBEZWZhdWx0IHdhcm5pbmcgc2V0LlxuICAgIFJlYWN0aXZlRWxlbWVudC5lbmFibGVkV2FybmluZ3MgPSBbJ2NoYW5nZS1pbi11cGRhdGUnXTtcbiAgICBjb25zdCBlbnN1cmVPd25XYXJuaW5ncyA9IGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgIGlmICghY3Rvci5oYXNPd25Qcm9wZXJ0eShKU0NvbXBpbGVyX3JlbmFtZVByb3BlcnR5KCdlbmFibGVkV2FybmluZ3MnLCBjdG9yKSkpIHtcbiAgICAgICAgICAgIGN0b3IuZW5hYmxlZFdhcm5pbmdzID0gY3Rvci5lbmFibGVkV2FybmluZ3Muc2xpY2UoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVhY3RpdmVFbGVtZW50LmVuYWJsZVdhcm5pbmcgPSBmdW5jdGlvbiAod2FybmluZykge1xuICAgICAgICBlbnN1cmVPd25XYXJuaW5ncyh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZFdhcm5pbmdzLmluZGV4T2Yod2FybmluZykgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRXYXJuaW5ncy5wdXNoKHdhcm5pbmcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZWFjdGl2ZUVsZW1lbnQuZGlzYWJsZVdhcm5pbmcgPSBmdW5jdGlvbiAod2FybmluZykge1xuICAgICAgICBlbnN1cmVPd25XYXJuaW5ncyh0aGlzKTtcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZW5hYmxlZFdhcm5pbmdzLmluZGV4T2Yod2FybmluZyk7XG4gICAgICAgIGlmIChpID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZFdhcm5pbmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4vLyBJTVBPUlRBTlQ6IGRvIG5vdCBjaGFuZ2UgdGhlIHByb3BlcnR5IG5hbWUgb3IgdGhlIGFzc2lnbm1lbnQgZXhwcmVzc2lvbi5cbi8vIFRoaXMgbGluZSB3aWxsIGJlIHVzZWQgaW4gcmVnZXhlcyB0byBzZWFyY2ggZm9yIFJlYWN0aXZlRWxlbWVudCB1c2FnZS5cbigoX2MgPSBnbG9iYWxUaGlzLnJlYWN0aXZlRWxlbWVudFZlcnNpb25zKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoZ2xvYmFsVGhpcy5yZWFjdGl2ZUVsZW1lbnRWZXJzaW9ucyA9IFtdKSkucHVzaCgnMS4wLjEnKTtcbmlmIChERVZfTU9ERSAmJiBnbG9iYWxUaGlzLnJlYWN0aXZlRWxlbWVudFZlcnNpb25zLmxlbmd0aCA+IDEpIHtcbiAgICBpc3N1ZVdhcm5pbmcoJ211bHRpcGxlLXZlcnNpb25zJywgYE11bHRpcGxlIHZlcnNpb25zIG9mIExpdCBsb2FkZWQuIExvYWRpbmcgbXVsdGlwbGUgdmVyc2lvbnMgYCArXG4gICAgICAgIGBpcyBub3QgcmVjb21tZW5kZWQuYCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWFjdGl2ZS1lbGVtZW50LmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBCU0QtMy1DbGF1c2VcbiAqL1xudmFyIF9hLCBfYiwgX2M7XG4vKipcbiAqIFRoZSBtYWluIExpdEVsZW1lbnQgbW9kdWxlLCB3aGljaCBkZWZpbmVzIHRoZSBbW2BMaXRFbGVtZW50YF1dIGJhc2UgY2xhc3MgYW5kXG4gKiByZWxhdGVkIEFQSXMuXG4gKlxuICogIExpdEVsZW1lbnQgY29tcG9uZW50cyBjYW4gZGVmaW5lIGEgdGVtcGxhdGUgYW5kIGEgc2V0IG9mIG9ic2VydmVkXG4gKiBwcm9wZXJ0aWVzLiBDaGFuZ2luZyBhbiBvYnNlcnZlZCBwcm9wZXJ0eSB0cmlnZ2VycyBhIHJlLXJlbmRlciBvZiB0aGVcbiAqIGVsZW1lbnQuXG4gKlxuICogIEltcG9ydCBbW2BMaXRFbGVtZW50YF1dIGFuZCBbW2BodG1sYF1dIGZyb20gdGhpcyBtb2R1bGUgdG8gY3JlYXRlIGFcbiAqIGNvbXBvbmVudDpcbiAqXG4gKiAgYGBganNcbiAqIGltcG9ydCB7TGl0RWxlbWVudCwgaHRtbH0gZnJvbSAnbGl0LWVsZW1lbnQnO1xuICpcbiAqIGNsYXNzIE15RWxlbWVudCBleHRlbmRzIExpdEVsZW1lbnQge1xuICpcbiAqICAgLy8gRGVjbGFyZSBvYnNlcnZlZCBwcm9wZXJ0aWVzXG4gKiAgIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAqICAgICByZXR1cm4ge1xuICogICAgICAgYWRqZWN0aXZlOiB7fVxuICogICAgIH1cbiAqICAgfVxuICpcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgdGhpcy5hZGplY3RpdmUgPSAnYXdlc29tZSc7XG4gKiAgIH1cbiAqXG4gKiAgIC8vIERlZmluZSB0aGUgZWxlbWVudCdzIHRlbXBsYXRlXG4gKiAgIHJlbmRlcigpIHtcbiAqICAgICByZXR1cm4gaHRtbGA8cD55b3VyICR7YWRqZWN0aXZlfSB0ZW1wbGF0ZSBoZXJlPC9wPmA7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ215LWVsZW1lbnQnLCBNeUVsZW1lbnQpO1xuICogYGBgXG4gKlxuICogYExpdEVsZW1lbnRgIGV4dGVuZHMgW1tgUmVhY3RpdmVFbGVtZW50YF1dIGFuZCBhZGRzIGxpdC1odG1sIHRlbXBsYXRpbmcuXG4gKiBUaGUgYFJlYWN0aXZlRWxlbWVudGAgY2xhc3MgaXMgcHJvdmlkZWQgZm9yIHVzZXJzIHRoYXQgd2FudCB0byBidWlsZFxuICogdGhlaXIgb3duIGN1c3RvbSBlbGVtZW50IGJhc2UgY2xhc3NlcyB0aGF0IGRvbid0IHVzZSBsaXQtaHRtbC5cbiAqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqL1xuaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50IH0gZnJvbSAnQGxpdC9yZWFjdGl2ZS1lbGVtZW50JztcbmltcG9ydCB7IHJlbmRlciwgbm9DaGFuZ2UgfSBmcm9tICdsaXQtaHRtbCc7XG5leHBvcnQgKiBmcm9tICdAbGl0L3JlYWN0aXZlLWVsZW1lbnQnO1xuZXhwb3J0ICogZnJvbSAnbGl0LWh0bWwnO1xuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGV4cG9ydCBSZWFjdGl2ZUVsZW1lbnQgYXMgVXBkYXRpbmdFbGVtZW50LiBOb3RlLFxuLy8gSUUgdHJhbnNwaWxhdGlvbiByZXF1aXJlcyBleHBvcnRpbmcgbGlrZSB0aGlzLlxuZXhwb3J0IGNvbnN0IFVwZGF0aW5nRWxlbWVudCA9IFJlYWN0aXZlRWxlbWVudDtcbmNvbnN0IERFVl9NT0RFID0gdHJ1ZTtcbmxldCBpc3N1ZVdhcm5pbmc7XG5pZiAoREVWX01PREUpIHtcbiAgICAvLyBFbnN1cmUgd2FybmluZ3MgYXJlIGlzc3VlZCBvbmx5IDF4LCBldmVuIGlmIG11bHRpcGxlIHZlcnNpb25zIG9mIExpdFxuICAgIC8vIGFyZSBsb2FkZWQuXG4gICAgY29uc3QgaXNzdWVkV2FybmluZ3MgPSAoKF9hID0gZ2xvYmFsVGhpcy5saXRJc3N1ZWRXYXJuaW5ncykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKGdsb2JhbFRoaXMubGl0SXNzdWVkV2FybmluZ3MgPSBuZXcgU2V0KCkpKTtcbiAgICAvLyBJc3N1ZSBhIHdhcm5pbmcsIGlmIHdlIGhhdmVuJ3QgYWxyZWFkeS5cbiAgICBpc3N1ZVdhcm5pbmcgPSAoY29kZSwgd2FybmluZykgPT4ge1xuICAgICAgICB3YXJuaW5nICs9IGAgU2VlIGh0dHBzOi8vbGl0LmRldi9tc2cvJHtjb2RlfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5gO1xuICAgICAgICBpZiAoIWlzc3VlZFdhcm5pbmdzLmhhcyh3YXJuaW5nKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKHdhcm5pbmcpO1xuICAgICAgICAgICAgaXNzdWVkV2FybmluZ3MuYWRkKHdhcm5pbmcpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8qKlxuICogQmFzZSBlbGVtZW50IGNsYXNzIHRoYXQgbWFuYWdlcyBlbGVtZW50IHByb3BlcnRpZXMgYW5kIGF0dHJpYnV0ZXMsIGFuZFxuICogcmVuZGVycyBhIGxpdC1odG1sIHRlbXBsYXRlLlxuICpcbiAqIFRvIGRlZmluZSBhIGNvbXBvbmVudCwgc3ViY2xhc3MgYExpdEVsZW1lbnRgIGFuZCBpbXBsZW1lbnQgYVxuICogYHJlbmRlcmAgbWV0aG9kIHRvIHByb3ZpZGUgdGhlIGNvbXBvbmVudCdzIHRlbXBsYXRlLiBEZWZpbmUgcHJvcGVydGllc1xuICogdXNpbmcgdGhlIFtbYHByb3BlcnRpZXNgXV0gcHJvcGVydHkgb3IgdGhlIFtbYHByb3BlcnR5YF1dIGRlY29yYXRvci5cbiAqL1xuZXhwb3J0IGNsYXNzIExpdEVsZW1lbnQgZXh0ZW5kcyBSZWFjdGl2ZUVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGNhdGVnb3J5IHJlbmRlcmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zID0geyBob3N0OiB0aGlzIH07XG4gICAgICAgIHRoaXMuX19jaGlsZFBhcnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBjYXRlZ29yeSByZW5kZXJpbmdcbiAgICAgKi9cbiAgICBjcmVhdGVSZW5kZXJSb290KCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgY29uc3QgcmVuZGVyUm9vdCA9IHN1cGVyLmNyZWF0ZVJlbmRlclJvb3QoKTtcbiAgICAgICAgLy8gV2hlbiBhZG9wdGVkU3R5bGVTaGVldHMgYXJlIHNoaW1tZWQsIHRoZXkgYXJlIGluc2VydGVkIGludG8gdGhlXG4gICAgICAgIC8vIHNoYWRvd1Jvb3QgYnkgY3JlYXRlUmVuZGVyUm9vdC4gQWRqdXN0IHRoZSByZW5kZXJCZWZvcmUgbm9kZSBzbyB0aGF0XG4gICAgICAgIC8vIGFueSBzdHlsZXMgaW4gTGl0IGNvbnRlbnQgcmVuZGVyIGJlZm9yZSBhZG9wdGVkU3R5bGVTaGVldHMuIFRoaXMgaXNcbiAgICAgICAgLy8gaW1wb3J0YW50IHNvIHRoYXQgYWRvcHRlZFN0eWxlU2hlZXRzIGhhdmUgcHJlY2VkZW5jZSBvdmVyIHN0eWxlcyBpblxuICAgICAgICAvLyB0aGUgc2hhZG93Um9vdC5cbiAgICAgICAgKF9hID0gKF9iID0gdGhpcy5yZW5kZXJPcHRpb25zKS5yZW5kZXJCZWZvcmUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYi5yZW5kZXJCZWZvcmUgPSByZW5kZXJSb290LmZpcnN0Q2hpbGQpO1xuICAgICAgICByZXR1cm4gcmVuZGVyUm9vdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZWxlbWVudC4gVGhpcyBtZXRob2QgcmVmbGVjdHMgcHJvcGVydHkgdmFsdWVzIHRvIGF0dHJpYnV0ZXNcbiAgICAgKiBhbmQgY2FsbHMgYHJlbmRlcmAgdG8gcmVuZGVyIERPTSB2aWEgbGl0LWh0bWwuIFNldHRpbmcgcHJvcGVydGllcyBpbnNpZGVcbiAgICAgKiB0aGlzIG1ldGhvZCB3aWxsICpub3QqIHRyaWdnZXIgYW5vdGhlciB1cGRhdGUuXG4gICAgICogQHBhcmFtIGNoYW5nZWRQcm9wZXJ0aWVzIE1hcCBvZiBjaGFuZ2VkIHByb3BlcnRpZXMgd2l0aCBvbGQgdmFsdWVzXG4gICAgICogQGNhdGVnb3J5IHVwZGF0ZXNcbiAgICAgKi9cbiAgICB1cGRhdGUoY2hhbmdlZFByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gU2V0dGluZyBwcm9wZXJ0aWVzIGluIGByZW5kZXJgIHNob3VsZCBub3QgdHJpZ2dlciBhbiB1cGRhdGUuIFNpbmNlXG4gICAgICAgIC8vIHVwZGF0ZXMgYXJlIGFsbG93ZWQgYWZ0ZXIgc3VwZXIudXBkYXRlLCBpdCdzIGltcG9ydGFudCB0byBjYWxsIGByZW5kZXJgXG4gICAgICAgIC8vIGJlZm9yZSB0aGF0LlxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucmVuZGVyKCk7XG4gICAgICAgIGlmICghdGhpcy5oYXNVcGRhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck9wdGlvbnMuaXNDb25uZWN0ZWQgPSB0aGlzLmlzQ29ubmVjdGVkO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnVwZGF0ZShjaGFuZ2VkUHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMuX19jaGlsZFBhcnQgPSByZW5kZXIodmFsdWUsIHRoaXMucmVuZGVyUm9vdCwgdGhpcy5yZW5kZXJPcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQgdG8gdGhlIGRvY3VtZW50J3MgRE9NLlxuICAgICAqXG4gICAgICogSW4gYGNvbm5lY3RlZENhbGxiYWNrKClgIHlvdSBzaG91bGQgc2V0dXAgdGFza3MgdGhhdCBzaG91bGQgb25seSBvY2N1ciB3aGVuXG4gICAgICogdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC4gVGhlIG1vc3QgY29tbW9uIG9mIHRoZXNlIGlzXG4gICAgICogYWRkaW5nIGV2ZW50IGxpc3RlbmVycyB0byBub2RlcyBleHRlcm5hbCB0byB0aGUgZWxlbWVudCwgbGlrZSBhIGtleWRvd25cbiAgICAgKiBldmVudCBoYW5kbGVyIGFkZGVkIHRvIHRoZSB3aW5kb3cuXG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAqICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgKiAgIGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9oYW5kbGVLZXlkb3duKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUeXBpY2FsbHksIGFueXRoaW5nIGRvbmUgaW4gYGNvbm5lY3RlZENhbGxiYWNrKClgIHNob3VsZCBiZSB1bmRvbmUgd2hlbiB0aGVcbiAgICAgKiBlbGVtZW50IGlzIGRpc2Nvbm5lY3RlZCwgaW4gYGRpc2Nvbm5lY3RlZENhbGxiYWNrKClgLlxuICAgICAqXG4gICAgICogQGNhdGVnb3J5IGxpZmVjeWNsZVxuICAgICAqL1xuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICAgIChfYSA9IHRoaXMuX19jaGlsZFBhcnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZXRDb25uZWN0ZWQodHJ1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgZG9jdW1lbnQncyBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIGNhbGxiYWNrIGlzIHRoZSBtYWluIHNpZ25hbCB0byB0aGUgZWxlbWVudCB0aGF0IGl0IG1heSBubyBsb25nZXIgYmVcbiAgICAgKiB1c2VkLiBgZGlzY29ubmVjdGVkQ2FsbGJhY2soKWAgc2hvdWxkIGVuc3VyZSB0aGF0IG5vdGhpbmcgaXMgaG9sZGluZyBhXG4gICAgICogcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IChzdWNoIGFzIGV2ZW50IGxpc3RlbmVycyBhZGRlZCB0byBub2RlcyBleHRlcm5hbFxuICAgICAqIHRvIHRoZSBlbGVtZW50KSwgc28gdGhhdCBpdCBpcyBmcmVlIHRvIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgKiAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICogICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2hhbmRsZUtleWRvd24pO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEFuIGVsZW1lbnQgbWF5IGJlIHJlLWNvbm5lY3RlZCBhZnRlciBiZWluZyBkaXNjb25uZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAY2F0ZWdvcnkgbGlmZWN5Y2xlXG4gICAgICovXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgICAgKF9hID0gdGhpcy5fX2NoaWxkUGFydCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNldENvbm5lY3RlZChmYWxzZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEludm9rZWQgb24gZWFjaCB1cGRhdGUgdG8gcGVyZm9ybSByZW5kZXJpbmcgdGFza3MuIFRoaXMgbWV0aG9kIG1heSByZXR1cm5cbiAgICAgKiBhbnkgdmFsdWUgcmVuZGVyYWJsZSBieSBsaXQtaHRtbCdzIGBDaGlsZFBhcnRgIC0gdHlwaWNhbGx5IGFcbiAgICAgKiBgVGVtcGxhdGVSZXN1bHRgLiBTZXR0aW5nIHByb3BlcnRpZXMgaW5zaWRlIHRoaXMgbWV0aG9kIHdpbGwgKm5vdCogdHJpZ2dlclxuICAgICAqIHRoZSBlbGVtZW50IHRvIHVwZGF0ZS5cbiAgICAgKiBAY2F0ZWdvcnkgcmVuZGVyaW5nXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gbm9DaGFuZ2U7XG4gICAgfVxufVxuLyoqXG4gKiBFbnN1cmUgdGhpcyBjbGFzcyBpcyBtYXJrZWQgYXMgYGZpbmFsaXplZGAgYXMgYW4gb3B0aW1pemF0aW9uIGVuc3VyaW5nXG4gKiBpdCB3aWxsIG5vdCBuZWVkbGVzc2x5IHRyeSB0byBgZmluYWxpemVgLlxuICpcbiAqIE5vdGUgdGhpcyBwcm9wZXJ0eSBuYW1lIGlzIGEgc3RyaW5nIHRvIHByZXZlbnQgYnJlYWtpbmcgQ2xvc3VyZSBKUyBDb21waWxlclxuICogb3B0aW1pemF0aW9ucy4gU2VlIEBsaXQvcmVhY3RpdmUtZWxlbWVudCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuTGl0RWxlbWVudFsnZmluYWxpemVkJ10gPSB0cnVlO1xuLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbkxpdEVsZW1lbnRbJ18kbGl0RWxlbWVudCQnXSA9IHRydWU7XG4vLyBJbnN0YWxsIGh5ZHJhdGlvbiBpZiBhdmFpbGFibGVcbihfYiA9IGdsb2JhbFRoaXMubGl0RWxlbWVudEh5ZHJhdGVTdXBwb3J0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChnbG9iYWxUaGlzLCB7IExpdEVsZW1lbnQgfSk7XG4vLyBBcHBseSBwb2x5ZmlsbHMgaWYgYXZhaWxhYmxlXG5jb25zdCBwb2x5ZmlsbFN1cHBvcnQgPSBERVZfTU9ERVxuICAgID8gZ2xvYmFsVGhpcy5saXRFbGVtZW50UG9seWZpbGxTdXBwb3J0RGV2TW9kZVxuICAgIDogZ2xvYmFsVGhpcy5saXRFbGVtZW50UG9seWZpbGxTdXBwb3J0O1xucG9seWZpbGxTdXBwb3J0ID09PSBudWxsIHx8IHBvbHlmaWxsU3VwcG9ydCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcG9seWZpbGxTdXBwb3J0KHsgTGl0RWxlbWVudCB9KTtcbi8vIERFViBtb2RlIHdhcm5pbmdzXG5pZiAoREVWX01PREUpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4gICAgLy8gTm90ZSwgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBjbG9zdXJlIGNvbXBpbGF0aW9uLCB0aGlzIGFjY2Vzc1xuICAgIC8vIG5lZWRzIHRvIGJlIGFzIGEgc3RyaW5nIHByb3BlcnR5IGluZGV4LlxuICAgIExpdEVsZW1lbnRbJ2ZpbmFsaXplJ10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGZpbmFsaXplZCA9IFJlYWN0aXZlRWxlbWVudC5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgICAgICBpZiAoIWZpbmFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdhcm5SZW1vdmVkT3JSZW5hbWVkID0gKG9iaiwgbmFtZSwgcmVuYW1lZCA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3Rvck5hbWUgPSAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyA/IG9iaiA6IG9iai5jb25zdHJ1Y3RvcilcbiAgICAgICAgICAgICAgICAgICAgLm5hbWU7XG4gICAgICAgICAgICAgICAgaXNzdWVXYXJuaW5nKHJlbmFtZWQgPyAncmVuYW1lZC1hcGknIDogJ3JlbW92ZWQtYXBpJywgYFxcYCR7bmFtZX1cXGAgaXMgaW1wbGVtZW50ZWQgb24gY2xhc3MgJHtjdG9yTmFtZX0uIEl0IGAgK1xuICAgICAgICAgICAgICAgICAgICBgaGFzIGJlZW4gJHtyZW5hbWVkID8gJ3JlbmFtZWQnIDogJ3JlbW92ZWQnfSBgICtcbiAgICAgICAgICAgICAgICAgICAgYGluIHRoaXMgdmVyc2lvbiBvZiBMaXRFbGVtZW50LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB3YXJuUmVtb3ZlZE9yUmVuYW1lZCh0aGlzLCAncmVuZGVyJyk7XG4gICAgICAgIHdhcm5SZW1vdmVkT3JSZW5hbWVkKHRoaXMsICdnZXRTdHlsZXMnLCB0cnVlKTtcbiAgICAgICAgd2FyblJlbW92ZWRPclJlbmFtZWQodGhpcy5wcm90b3R5cGUsICdhZG9wdFN0eWxlcycpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIC8qIGVzbGludC1lbmFibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xufVxuLyoqXG4gKiBFTkQgVVNFUlMgU0hPVUxEIE5PVCBSRUxZIE9OIFRISVMgT0JKRUNULlxuICpcbiAqIFByaXZhdGUgZXhwb3J0cyBmb3IgdXNlIGJ5IG90aGVyIExpdCBwYWNrYWdlcywgbm90IGludGVuZGVkIGZvciB1c2UgYnlcbiAqIGV4dGVybmFsIHVzZXJzLlxuICpcbiAqIFdlIGN1cnJlbnRseSBkbyBub3QgbWFrZSBhIG1hbmdsZWQgcm9sbHVwIGJ1aWxkIG9mIHRoZSBsaXQtc3NyIGNvZGUuIEluIG9yZGVyXG4gKiB0byBrZWVwIGEgbnVtYmVyIG9mIChvdGhlcndpc2UgcHJpdmF0ZSkgdG9wLWxldmVsIGV4cG9ydHMgIG1hbmdsZWQgaW4gdGhlXG4gKiBjbGllbnQgc2lkZSBjb2RlLCB3ZSBleHBvcnQgYSBfJExFIG9iamVjdCBjb250YWluaW5nIHRob3NlIG1lbWJlcnMgKG9yXG4gKiBoZWxwZXIgbWV0aG9kcyBmb3IgYWNjZXNzaW5nIHByaXZhdGUgZmllbGRzIG9mIHRob3NlIG1lbWJlcnMpLCBhbmQgdGhlblxuICogcmUtZXhwb3J0IHRoZW0gZm9yIHVzZSBpbiBsaXQtc3NyLiBUaGlzIGtlZXBzIGxpdC1zc3IgYWdub3N0aWMgdG8gd2hldGhlciB0aGVcbiAqIGNsaWVudC1zaWRlIGNvZGUgaXMgYmVpbmcgdXNlZCBpbiBgZGV2YCBtb2RlIG9yIGBwcm9kYCBtb2RlLlxuICpcbiAqIFRoaXMgaGFzIGEgdW5pcXVlIG5hbWUsIHRvIGRpc2FtYmlndWF0ZSBpdCBmcm9tIHByaXZhdGUgZXhwb3J0cyBpblxuICogbGl0LWh0bWwsIHNpbmNlIHRoaXMgbW9kdWxlIHJlLWV4cG9ydHMgYWxsIG9mIGxpdC1odG1sLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBfJExFID0ge1xuICAgIF8kYXR0cmlidXRlVG9Qcm9wZXJ0eTogKGVsLCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgZWwuXyRhdHRyaWJ1dGVUb1Byb3BlcnR5KG5hbWUsIHZhbHVlKTtcbiAgICB9LFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIF8kY2hhbmdlZFByb3BlcnRpZXM6IChlbCkgPT4gZWwuXyRjaGFuZ2VkUHJvcGVydGllcyxcbn07XG4vLyBJTVBPUlRBTlQ6IGRvIG5vdCBjaGFuZ2UgdGhlIHByb3BlcnR5IG5hbWUgb3IgdGhlIGFzc2lnbm1lbnQgZXhwcmVzc2lvbi5cbi8vIFRoaXMgbGluZSB3aWxsIGJlIHVzZWQgaW4gcmVnZXhlcyB0byBzZWFyY2ggZm9yIExpdEVsZW1lbnQgdXNhZ2UuXG4oKF9jID0gZ2xvYmFsVGhpcy5saXRFbGVtZW50VmVyc2lvbnMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IChnbG9iYWxUaGlzLmxpdEVsZW1lbnRWZXJzaW9ucyA9IFtdKSkucHVzaCgnMy4wLjEnKTtcbmlmIChERVZfTU9ERSAmJiBnbG9iYWxUaGlzLmxpdEVsZW1lbnRWZXJzaW9ucy5sZW5ndGggPiAxKSB7XG4gICAgaXNzdWVXYXJuaW5nKCdtdWx0aXBsZS12ZXJzaW9ucycsIGBNdWx0aXBsZSB2ZXJzaW9ucyBvZiBMaXQgbG9hZGVkLiBMb2FkaW5nIG11bHRpcGxlIHZlcnNpb25zIGAgK1xuICAgICAgICBgaXMgbm90IHJlY29tbWVuZGVkLmApO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGl0LWVsZW1lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEJTRC0zLUNsYXVzZVxuICovXG5leHBvcnQgY29uc3QgUGFydFR5cGUgPSB7XG4gICAgQVRUUklCVVRFOiAxLFxuICAgIENISUxEOiAyLFxuICAgIFBST1BFUlRZOiAzLFxuICAgIEJPT0xFQU5fQVRUUklCVVRFOiA0LFxuICAgIEVWRU5UOiA1LFxuICAgIEVMRU1FTlQ6IDYsXG59O1xuLyoqXG4gKiBDcmVhdGVzIGEgdXNlci1mYWNpbmcgZGlyZWN0aXZlIGZ1bmN0aW9uIGZyb20gYSBEaXJlY3RpdmUgY2xhc3MuIFRoaXNcbiAqIGZ1bmN0aW9uIGhhcyB0aGUgc2FtZSBwYXJhbWV0ZXJzIGFzIHRoZSBkaXJlY3RpdmUncyByZW5kZXIoKSBtZXRob2QuXG4gKi9cbmV4cG9ydCBjb25zdCBkaXJlY3RpdmUgPSAoYykgPT4gKC4uLnZhbHVlcykgPT4gKHtcbiAgICAvLyBUaGlzIHByb3BlcnR5IG5lZWRzIHRvIHJlbWFpbiB1bm1pbmlmaWVkLlxuICAgIFsnXyRsaXREaXJlY3RpdmUkJ106IGMsXG4gICAgdmFsdWVzLFxufSk7XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNyZWF0aW5nIGN1c3RvbSBkaXJlY3RpdmVzLiBVc2VycyBzaG91bGQgZXh0ZW5kIHRoaXMgY2xhc3MsXG4gKiBpbXBsZW1lbnQgYHJlbmRlcmAgYW5kL29yIGB1cGRhdGVgLCBhbmQgdGhlbiBwYXNzIHRoZWlyIHN1YmNsYXNzIHRvXG4gKiBgZGlyZWN0aXZlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoX3BhcnRJbmZvKSB7IH1cbiAgICAvLyBTZWUgY29tbWVudCBpbiBEaXNjb25uZWN0YWJsZSBpbnRlcmZhY2UgZm9yIHdoeSB0aGlzIGlzIGEgZ2V0dGVyXG4gICAgZ2V0IF8kaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kcGFyZW50Ll8kaXNDb25uZWN0ZWQ7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfJGluaXRpYWxpemUocGFydCwgcGFyZW50LCBhdHRyaWJ1dGVJbmRleCkge1xuICAgICAgICB0aGlzLl9fcGFydCA9IHBhcnQ7XG4gICAgICAgIHRoaXMuXyRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX19hdHRyaWJ1dGVJbmRleCA9IGF0dHJpYnV0ZUluZGV4O1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgXyRyZXNvbHZlKHBhcnQsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShwYXJ0LCBwcm9wcyk7XG4gICAgfVxuICAgIHVwZGF0ZShfcGFydCwgcHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKC4uLnByb3BzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXJlY3RpdmUuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEJTRC0zLUNsYXVzZVxuICovXG5pbXBvcnQgeyBub0NoYW5nZSB9IGZyb20gJy4uL2xpdC1odG1sLmpzJztcbmltcG9ydCB7IGRpcmVjdGl2ZSwgRGlyZWN0aXZlLCBQYXJ0VHlwZSwgfSBmcm9tICcuLi9kaXJlY3RpdmUuanMnO1xuY2xhc3MgQ2xhc3NNYXBEaXJlY3RpdmUgZXh0ZW5kcyBEaXJlY3RpdmUge1xuICAgIGNvbnN0cnVjdG9yKHBhcnRJbmZvKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgc3VwZXIocGFydEluZm8pO1xuICAgICAgICBpZiAocGFydEluZm8udHlwZSAhPT0gUGFydFR5cGUuQVRUUklCVVRFIHx8XG4gICAgICAgICAgICBwYXJ0SW5mby5uYW1lICE9PSAnY2xhc3MnIHx8XG4gICAgICAgICAgICAoKF9hID0gcGFydEluZm8uc3RyaW5ncykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BjbGFzc01hcCgpYCBjYW4gb25seSBiZSB1c2VkIGluIHRoZSBgY2xhc3NgIGF0dHJpYnV0ZSAnICtcbiAgICAgICAgICAgICAgICAnYW5kIG11c3QgYmUgdGhlIG9ubHkgcGFydCBpbiB0aGUgYXR0cmlidXRlLicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjbGFzc0luZm8pIHtcbiAgICAgICAgLy8gQWRkIHNwYWNlcyB0byBlbnN1cmUgc2VwYXJhdGlvbiBmcm9tIHN0YXRpYyBjbGFzc2VzXG4gICAgICAgIHJldHVybiAoJyAnICtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGNsYXNzSW5mbylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChrZXkpID0+IGNsYXNzSW5mb1trZXldKVxuICAgICAgICAgICAgICAgIC5qb2luKCcgJykgK1xuICAgICAgICAgICAgJyAnKTtcbiAgICB9XG4gICAgdXBkYXRlKHBhcnQsIFtjbGFzc0luZm9dKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIC8vIFJlbWVtYmVyIGR5bmFtaWMgY2xhc3NlcyBvbiB0aGUgZmlyc3QgcmVuZGVyXG4gICAgICAgIGlmICh0aGlzLl9wcmV2aW91c0NsYXNzZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNDbGFzc2VzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgaWYgKHBhcnQuc3RyaW5ncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGljQ2xhc3NlcyA9IG5ldyBTZXQocGFydC5zdHJpbmdzXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcgJylcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMvKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChzKSA9PiBzICE9PSAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIGNsYXNzSW5mbykge1xuICAgICAgICAgICAgICAgIGlmIChjbGFzc0luZm9bbmFtZV0gJiYgISgoX2EgPSB0aGlzLl9zdGF0aWNDbGFzc2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaGFzKG5hbWUpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0NsYXNzZXMuYWRkKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihjbGFzc0luZm8pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IHBhcnQuZWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICAgIC8vIFJlbW92ZSBvbGQgY2xhc3NlcyB0aGF0IG5vIGxvbmdlciBhcHBseVxuICAgICAgICAvLyBXZSB1c2UgZm9yRWFjaCgpIGluc3RlYWQgb2YgZm9yLW9mIHNvIHRoYXQgd2UgZG9uJ3QgcmVxdWlyZSBkb3duLWxldmVsXG4gICAgICAgIC8vIGl0ZXJhdGlvbi5cbiAgICAgICAgdGhpcy5fcHJldmlvdXNDbGFzc2VzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmICghKG5hbWUgaW4gY2xhc3NJbmZvKSkge1xuICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNDbGFzc2VzLmRlbGV0ZShuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFkZCBvciByZW1vdmUgY2xhc3NlcyBiYXNlZCBvbiB0aGVpciBjbGFzc01hcCB2YWx1ZVxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gY2xhc3NJbmZvKSB7XG4gICAgICAgICAgICAvLyBXZSBleHBsaWNpdGx5IHdhbnQgYSBsb29zZSB0cnV0aHkgY2hlY2sgb2YgYHZhbHVlYCBiZWNhdXNlIGl0IHNlZW1zXG4gICAgICAgICAgICAvLyBtb3JlIGNvbnZlbmllbnQgdGhhdCAnJyBhbmQgMCBhcmUgc2tpcHBlZC5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gISFjbGFzc0luZm9bbmFtZV07XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX3ByZXZpb3VzQ2xhc3Nlcy5oYXMobmFtZSkgJiZcbiAgICAgICAgICAgICAgICAhKChfYiA9IHRoaXMuX3N0YXRpY0NsYXNzZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5oYXMobmFtZSkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzQ2xhc3Nlcy5hZGQobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0NsYXNzZXMuZGVsZXRlKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9DaGFuZ2U7XG4gICAgfVxufVxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFwcGxpZXMgZHluYW1pYyBDU1MgY2xhc3Nlcy5cbiAqXG4gKiBUaGlzIG11c3QgYmUgdXNlZCBpbiB0aGUgYGNsYXNzYCBhdHRyaWJ1dGUgYW5kIG11c3QgYmUgdGhlIG9ubHkgcGFydCB1c2VkIGluXG4gKiB0aGUgYXR0cmlidXRlLiBJdCB0YWtlcyBlYWNoIHByb3BlcnR5IGluIHRoZSBgY2xhc3NJbmZvYCBhcmd1bWVudCBhbmQgYWRkc1xuICogdGhlIHByb3BlcnR5IG5hbWUgdG8gdGhlIGVsZW1lbnQncyBgY2xhc3NMaXN0YCBpZiB0aGUgcHJvcGVydHkgdmFsdWUgaXNcbiAqIHRydXRoeTsgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGZhbHNleSwgdGhlIHByb3BlcnR5IG5hbWUgaXMgcmVtb3ZlZCBmcm9tXG4gKiB0aGUgZWxlbWVudCdzIGBjbGFzc2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYHtmb286IGJhcn1gIGFwcGxpZXMgdGhlIGNsYXNzIGBmb29gIGlmIHRoZSB2YWx1ZSBvZiBgYmFyYCBpc1xuICogdHJ1dGh5LlxuICpcbiAqIEBwYXJhbSBjbGFzc0luZm9cbiAqL1xuZXhwb3J0IGNvbnN0IGNsYXNzTWFwID0gZGlyZWN0aXZlKENsYXNzTWFwRGlyZWN0aXZlKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsYXNzLW1hcC5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQlNELTMtQ2xhdXNlXG4gKi9cbmltcG9ydCB7IG5vdGhpbmcgfSBmcm9tICcuLi9saXQtaHRtbC5qcyc7XG4vKipcbiAqIEZvciBBdHRyaWJ1dGVQYXJ0cywgc2V0cyB0aGUgYXR0cmlidXRlIGlmIHRoZSB2YWx1ZSBpcyBkZWZpbmVkIGFuZCByZW1vdmVzXG4gKiB0aGUgYXR0cmlidXRlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQuXG4gKlxuICogRm9yIG90aGVyIHBhcnQgdHlwZXMsIHRoaXMgZGlyZWN0aXZlIGlzIGEgbm8tb3AuXG4gKi9cbmV4cG9ydCBjb25zdCBpZkRlZmluZWQgPSAodmFsdWUpID0+IHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDAgPyB2YWx1ZSA6IG5vdGhpbmc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pZi1kZWZpbmVkLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBCU0QtMy1DbGF1c2VcbiAqL1xuaW1wb3J0IHsgbm9DaGFuZ2UgfSBmcm9tICcuLi9saXQtaHRtbC5qcyc7XG5pbXBvcnQgeyBkaXJlY3RpdmUsIERpcmVjdGl2ZSwgUGFydFR5cGUsIH0gZnJvbSAnLi4vZGlyZWN0aXZlLmpzJztcbmNsYXNzIFN0eWxlTWFwRGlyZWN0aXZlIGV4dGVuZHMgRGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJ0SW5mbykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHN1cGVyKHBhcnRJbmZvKTtcbiAgICAgICAgaWYgKHBhcnRJbmZvLnR5cGUgIT09IFBhcnRUeXBlLkFUVFJJQlVURSB8fFxuICAgICAgICAgICAgcGFydEluZm8ubmFtZSAhPT0gJ3N0eWxlJyB8fFxuICAgICAgICAgICAgKChfYSA9IHBhcnRJbmZvLnN0cmluZ3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHN0eWxlTWFwYCBkaXJlY3RpdmUgbXVzdCBiZSB1c2VkIGluIHRoZSBgc3R5bGVgIGF0dHJpYnV0ZSAnICtcbiAgICAgICAgICAgICAgICAnYW5kIG11c3QgYmUgdGhlIG9ubHkgcGFydCBpbiB0aGUgYXR0cmlidXRlLicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihzdHlsZUluZm8pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlSW5mbykucmVkdWNlKChzdHlsZSwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZUluZm9bcHJvcF07XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENvbnZlcnQgcHJvcGVydHkgbmFtZXMgZnJvbSBjYW1lbC1jYXNlIHRvIGRhc2gtY2FzZSwgaS5lLjpcbiAgICAgICAgICAgIC8vICBgYmFja2dyb3VuZENvbG9yYCAtPiBgYmFja2dyb3VuZC1jb2xvcmBcbiAgICAgICAgICAgIC8vIFZlbmRvci1wcmVmaXhlZCBuYW1lcyBuZWVkIGFuIGV4dHJhIGAtYCBhcHBlbmRlZCB0byBmcm9udDpcbiAgICAgICAgICAgIC8vICBgd2Via2l0QXBwZWFyYW5jZWAgLT4gYC13ZWJraXQtYXBwZWFyYW5jZWBcbiAgICAgICAgICAgIC8vIEV4Y2VwdGlvbiBpcyBhbnkgcHJvcGVydHkgbmFtZSBjb250YWluaW5nIGEgZGFzaCwgaW5jbHVkaW5nXG4gICAgICAgICAgICAvLyBjdXN0b20gcHJvcGVydGllczsgd2UgYXNzdW1lIHRoZXNlIGFyZSBhbHJlYWR5IGRhc2gtY2FzZWQgaS5lLjpcbiAgICAgICAgICAgIC8vICBgLS1teS1idXR0b24tY29sb3JgIC0tPiBgLS1teS1idXR0b24tY29sb3JgXG4gICAgICAgICAgICBwcm9wID0gcHJvcFxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpeKHdlYmtpdHxtb3p8bXN8byl8KSg/PVtBLVpdKS9nLCAnLSQmJylcbiAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZSArIGAke3Byb3B9OiR7dmFsdWV9O2A7XG4gICAgICAgIH0sICcnKTtcbiAgICB9XG4gICAgdXBkYXRlKHBhcnQsIFtzdHlsZUluZm9dKSB7XG4gICAgICAgIGNvbnN0IHsgc3R5bGUgfSA9IHBhcnQuZWxlbWVudDtcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzU3R5bGVQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGVQcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlSW5mbykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGVQcm9wZXJ0aWVzLmFkZChuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihzdHlsZUluZm8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBvbGQgcHJvcGVydGllcyB0aGF0IG5vIGxvbmdlciBleGlzdCBpbiBzdHlsZUluZm9cbiAgICAgICAgLy8gV2UgdXNlIGZvckVhY2goKSBpbnN0ZWFkIG9mIGZvci1vZiBzbyB0aGF0IHJlIGRvbid0IHJlcXVpcmUgZG93bi1sZXZlbFxuICAgICAgICAvLyBpdGVyYXRpb24uXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGVQcm9wZXJ0aWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBuYW1lIGlzbid0IGluIHN0eWxlSW5mbyBvciBpdCdzIG51bGwvdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAoc3R5bGVJbmZvW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c1N0eWxlUHJvcGVydGllcy5kZWxldGUobmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJy0nKSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgcmVzZXQgdXNpbmcgZW1wdHkgc3RyaW5nICh2cyBudWxsKSBhcyBJRTExIGRvZXMgbm90IGFsd2F5c1xuICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB2aWEgbnVsbCAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnRDU1NJbmxpbmVTdHlsZS9zdHlsZSNzZXR0aW5nX3N0eWxlcylcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVbbmFtZV0gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBBZGQgb3IgdXBkYXRlIHByb3BlcnRpZXNcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlSW5mbykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZUluZm9bbmFtZV07XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGVQcm9wZXJ0aWVzLmFkZChuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcygnLScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0NoYW5nZTtcbiAgICB9XG59XG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYXBwbGllcyBDU1MgcHJvcGVydGllcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIGBzdHlsZU1hcGAgY2FuIG9ubHkgYmUgdXNlZCBpbiB0aGUgYHN0eWxlYCBhdHRyaWJ1dGUgYW5kIG11c3QgYmUgdGhlIG9ubHlcbiAqIGV4cHJlc3Npb24gaW4gdGhlIGF0dHJpYnV0ZS4gSXQgdGFrZXMgdGhlIHByb3BlcnR5IG5hbWVzIGluIHRoZSBgc3R5bGVJbmZvYFxuICogb2JqZWN0IGFuZCBhZGRzIHRoZSBwcm9wZXJ0eSB2YWx1ZXMgYXMgQ1NTIHByb3BlcnRpZXMuIFByb3BlcnR5IG5hbWVzIHdpdGhcbiAqIGRhc2hlcyAoYC1gKSBhcmUgYXNzdW1lZCB0byBiZSB2YWxpZCBDU1MgcHJvcGVydHkgbmFtZXMgYW5kIHNldCBvbiB0aGVcbiAqIGVsZW1lbnQncyBzdHlsZSBvYmplY3QgdXNpbmcgYHNldFByb3BlcnR5KClgLiBOYW1lcyB3aXRob3V0IGRhc2hlcyBhcmVcbiAqIGFzc3VtZWQgdG8gYmUgY2FtZWxDYXNlZCBKYXZhU2NyaXB0IHByb3BlcnR5IG5hbWVzIGFuZCBzZXQgb24gdGhlIGVsZW1lbnQnc1xuICogc3R5bGUgb2JqZWN0IHVzaW5nIHByb3BlcnR5IGFzc2lnbm1lbnQsIGFsbG93aW5nIHRoZSBzdHlsZSBvYmplY3QgdG9cbiAqIHRyYW5zbGF0ZSBKYXZhU2NyaXB0LXN0eWxlIG5hbWVzIHRvIENTUyBwcm9wZXJ0eSBuYW1lcy5cbiAqXG4gKiBGb3IgZXhhbXBsZSBgc3R5bGVNYXAoe2JhY2tncm91bmRDb2xvcjogJ3JlZCcsICdib3JkZXItdG9wJzogJzVweCcsICctLXNpemUnOlxuICogJzAnfSlgIHNldHMgdGhlIGBiYWNrZ3JvdW5kLWNvbG9yYCwgYGJvcmRlci10b3BgIGFuZCBgLS1zaXplYCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBzdHlsZUluZm9cbiAqL1xuZXhwb3J0IGNvbnN0IHN0eWxlTWFwID0gZGlyZWN0aXZlKFN0eWxlTWFwRGlyZWN0aXZlKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlLW1hcC5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQlNELTMtQ2xhdXNlXG4gKi9cbnZhciBfYSwgX2IsIF9jLCBfZDtcbmNvbnN0IERFVl9NT0RFID0gdHJ1ZTtcbmNvbnN0IEVOQUJMRV9FWFRSQV9TRUNVUklUWV9IT09LUyA9IHRydWU7XG5jb25zdCBFTkFCTEVfU0hBRFlET01fTk9QQVRDSCA9IHRydWU7XG4vKipcbiAqIGB0cnVlYCBpZiB3ZSdyZSBidWlsZGluZyBmb3IgZ29vZ2xlMyB3aXRoIHRlbXBvcmFyeSBiYWNrLWNvbXBhdCBoZWxwZXJzLlxuICogVGhpcyBleHBvcnQgaXMgbm90IHByZXNlbnQgaW4gcHJvZCBidWlsZHMuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IElOVEVSTkFMID0gdHJ1ZTtcbmxldCBpc3N1ZVdhcm5pbmc7XG5pZiAoREVWX01PREUpIHtcbiAgICAoX2EgPSBnbG9iYWxUaGlzLmxpdElzc3VlZFdhcm5pbmdzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoZ2xvYmFsVGhpcy5saXRJc3N1ZWRXYXJuaW5ncyA9IG5ldyBTZXQoKSk7XG4gICAgLy8gSXNzdWUgYSB3YXJuaW5nLCBpZiB3ZSBoYXZlbid0IGFscmVhZHkuXG4gICAgaXNzdWVXYXJuaW5nID0gKGNvZGUsIHdhcm5pbmcpID0+IHtcbiAgICAgICAgd2FybmluZyArPSBjb2RlXG4gICAgICAgICAgICA/IGAgU2VlIGh0dHBzOi8vbGl0LmRldi9tc2cvJHtjb2RlfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5gXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICBpZiAoIWdsb2JhbFRoaXMubGl0SXNzdWVkV2FybmluZ3MuaGFzKHdhcm5pbmcpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4od2FybmluZyk7XG4gICAgICAgICAgICBnbG9iYWxUaGlzLmxpdElzc3VlZFdhcm5pbmdzLmFkZCh3YXJuaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaXNzdWVXYXJuaW5nKCdkZXYtbW9kZScsIGBMaXQgaXMgaW4gZGV2IG1vZGUuIE5vdCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiFgKTtcbn1cbmNvbnN0IHdyYXAgPSBFTkFCTEVfU0hBRFlET01fTk9QQVRDSCAmJlxuICAgICgoX2IgPSB3aW5kb3cuU2hhZHlET00pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pblVzZSkgJiZcbiAgICAoKF9jID0gd2luZG93LlNoYWR5RE9NKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Mubm9QYXRjaCkgPT09IHRydWVcbiAgICA/IHdpbmRvdy5TaGFkeURPTS53cmFwXG4gICAgOiAobm9kZSkgPT4gbm9kZTtcbmNvbnN0IHRydXN0ZWRUeXBlcyA9IGdsb2JhbFRoaXMudHJ1c3RlZFR5cGVzO1xuLyoqXG4gKiBPdXIgVHJ1c3RlZFR5cGVQb2xpY3kgZm9yIEhUTUwgd2hpY2ggaXMgZGVjbGFyZWQgdXNpbmcgdGhlIGh0bWwgdGVtcGxhdGVcbiAqIHRhZyBmdW5jdGlvbi5cbiAqXG4gKiBUaGF0IEhUTUwgaXMgYSBkZXZlbG9wZXItYXV0aG9yZWQgY29uc3RhbnQsIGFuZCBpcyBwYXJzZWQgd2l0aCBpbm5lckhUTUxcbiAqIGJlZm9yZSBhbnkgdW50cnVzdGVkIGV4cHJlc3Npb25zIGhhdmUgYmVlbiBtaXhlZCBpbi4gVGhlcmVmb3IgaXQgaXNcbiAqIGNvbnNpZGVyZWQgc2FmZSBieSBjb25zdHJ1Y3Rpb24uXG4gKi9cbmNvbnN0IHBvbGljeSA9IHRydXN0ZWRUeXBlc1xuICAgID8gdHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeSgnbGl0LWh0bWwnLCB7XG4gICAgICAgIGNyZWF0ZUhUTUw6IChzKSA9PiBzLFxuICAgIH0pXG4gICAgOiB1bmRlZmluZWQ7XG5jb25zdCBpZGVudGl0eUZ1bmN0aW9uID0gKHZhbHVlKSA9PiB2YWx1ZTtcbmNvbnN0IG5vb3BTYW5pdGl6ZXIgPSAoX25vZGUsIF9uYW1lLCBfdHlwZSkgPT4gaWRlbnRpdHlGdW5jdGlvbjtcbi8qKiBTZXRzIHRoZSBnbG9iYWwgc2FuaXRpemVyIGZhY3RvcnkuICovXG5jb25zdCBzZXRTYW5pdGl6ZXIgPSAobmV3U2FuaXRpemVyKSA9PiB7XG4gICAgaWYgKCFFTkFCTEVfRVhUUkFfU0VDVVJJVFlfSE9PS1MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2FuaXRpemVyRmFjdG9yeUludGVybmFsICE9PSBub29wU2FuaXRpemVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0ZW1wdGVkIHRvIG92ZXJ3cml0ZSBleGlzdGluZyBsaXQtaHRtbCBzZWN1cml0eSBwb2xpY3kuYCArXG4gICAgICAgICAgICBgIHNldFNhbml0aXplRE9NVmFsdWVGYWN0b3J5IHNob3VsZCBiZSBjYWxsZWQgYXQgbW9zdCBvbmNlLmApO1xuICAgIH1cbiAgICBzYW5pdGl6ZXJGYWN0b3J5SW50ZXJuYWwgPSBuZXdTYW5pdGl6ZXI7XG59O1xuLyoqXG4gKiBPbmx5IHVzZWQgaW4gaW50ZXJuYWwgdGVzdHMsIG5vdCBhIHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkuXG4gKi9cbmNvbnN0IF90ZXN0T25seUNsZWFyU2FuaXRpemVyRmFjdG9yeURvTm90Q2FsbE9yRWxzZSA9ICgpID0+IHtcbiAgICBzYW5pdGl6ZXJGYWN0b3J5SW50ZXJuYWwgPSBub29wU2FuaXRpemVyO1xufTtcbmNvbnN0IGNyZWF0ZVNhbml0aXplciA9IChub2RlLCBuYW1lLCB0eXBlKSA9PiB7XG4gICAgcmV0dXJuIHNhbml0aXplckZhY3RvcnlJbnRlcm5hbChub2RlLCBuYW1lLCB0eXBlKTtcbn07XG4vLyBBZGRlZCB0byBhbiBhdHRyaWJ1dGUgbmFtZSB0byBtYXJrIHRoZSBhdHRyaWJ1dGUgYXMgYm91bmQgc28gd2UgY2FuIGZpbmRcbi8vIGl0IGVhc2lseS5cbmNvbnN0IGJvdW5kQXR0cmlidXRlU3VmZml4ID0gJyRsaXQkJztcbi8vIFRoaXMgbWFya2VyIGlzIHVzZWQgaW4gbWFueSBzeW50YWN0aWMgcG9zaXRpb25zIGluIEhUTUwsIHNvIGl0IG11c3QgYmVcbi8vIGEgdmFsaWQgZWxlbWVudCBuYW1lIGFuZCBhdHRyaWJ1dGUgbmFtZS4gV2UgZG9uJ3Qgc3VwcG9ydCBkeW5hbWljIG5hbWVzICh5ZXQpXG4vLyBidXQgdGhpcyBhdCBsZWFzdCBlbnN1cmVzIHRoYXQgdGhlIHBhcnNlIHRyZWUgaXMgY2xvc2VyIHRvIHRoZSB0ZW1wbGF0ZVxuLy8gaW50ZW50aW9uLlxuY29uc3QgbWFya2VyID0gYGxpdCQke1N0cmluZyhNYXRoLnJhbmRvbSgpKS5zbGljZSg5KX0kYDtcbi8vIFN0cmluZyB1c2VkIHRvIHRlbGwgaWYgYSBjb21tZW50IGlzIGEgbWFya2VyIGNvbW1lbnRcbmNvbnN0IG1hcmtlck1hdGNoID0gJz8nICsgbWFya2VyO1xuLy8gVGV4dCB1c2VkIHRvIGluc2VydCBhIGNvbW1lbnQgbWFya2VyIG5vZGUuIFdlIHVzZSBwcm9jZXNzaW5nIGluc3RydWN0aW9uXG4vLyBzeW50YXggYmVjYXVzZSBpdCdzIHNsaWdodGx5IHNtYWxsZXIsIGJ1dCBwYXJzZXMgYXMgYSBjb21tZW50IG5vZGUuXG5jb25zdCBub2RlTWFya2VyID0gYDwke21hcmtlck1hdGNofT5gO1xuY29uc3QgZCA9IGRvY3VtZW50O1xuLy8gQ3JlYXRlcyBhIGR5bmFtaWMgbWFya2VyLiBXZSBuZXZlciBoYXZlIHRvIHNlYXJjaCBmb3IgdGhlc2UgaW4gdGhlIERPTS5cbmNvbnN0IGNyZWF0ZU1hcmtlciA9ICh2ID0gJycpID0+IGQuY3JlYXRlQ29tbWVudCh2KTtcbmNvbnN0IGlzUHJpbWl0aXZlID0gKHZhbHVlKSA9PiB2YWx1ZSA9PT0gbnVsbCB8fCAodHlwZW9mIHZhbHVlICE9ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZSAhPSAnZnVuY3Rpb24nKTtcbmNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuY29uc3QgaXNJdGVyYWJsZSA9ICh2YWx1ZSkgPT4ge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgfHxcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgdHlwZW9mICgoX2EgPSB2YWx1ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW1N5bWJvbC5pdGVyYXRvcl0pID09PSAnZnVuY3Rpb24nO1xufTtcbmNvbnN0IFNQQUNFX0NIQVIgPSBgWyBcXHRcXG5cXGZcXHJdYDtcbmNvbnN0IEFUVFJfVkFMVUVfQ0hBUiA9IGBbXiBcXHRcXG5cXGZcXHJcIidcXGA8Pj1dYDtcbmNvbnN0IE5BTUVfQ0hBUiA9IGBbXlxcXFxzXCInPj0vXWA7XG4vLyBUaGVzZSByZWdleGVzIHJlcHJlc2VudCB0aGUgZml2ZSBwYXJzaW5nIHN0YXRlcyB0aGF0IHdlIGNhcmUgYWJvdXQgaW4gdGhlXG4vLyBUZW1wbGF0ZSdzIEhUTUwgc2Nhbm5lci4gVGhleSBtYXRjaCB0aGUgKmVuZCogb2YgdGhlIHN0YXRlIHRoZXkncmUgbmFtZWRcbi8vIGFmdGVyLlxuLy8gRGVwZW5kaW5nIG9uIHRoZSBtYXRjaCwgd2UgdHJhbnNpdGlvbiB0byBhIG5ldyBzdGF0ZS4gSWYgdGhlcmUncyBubyBtYXRjaCxcbi8vIHdlIHN0YXkgaW4gdGhlIHNhbWUgc3RhdGUuXG4vLyBOb3RlIHRoYXQgdGhlIHJlZ2V4ZXMgYXJlIHN0YXRlZnVsLiBXZSB1dGlsaXplIGxhc3RJbmRleCBhbmQgc3luYyBpdFxuLy8gYWNyb3NzIHRoZSBtdWx0aXBsZSByZWdleGVzIHVzZWQuIEluIGFkZGl0aW9uIHRvIHRoZSBmaXZlIHJlZ2V4ZXMgYmVsb3dcbi8vIHdlIGFsc28gZHluYW1pY2FsbHkgY3JlYXRlIGEgcmVnZXggdG8gZmluZCB0aGUgbWF0Y2hpbmcgZW5kIHRhZ3MgZm9yIHJhd1xuLy8gdGV4dCBlbGVtZW50cy5cbi8qKlxuICogRW5kIG9mIHRleHQgaXM6IGA8YCBmb2xsb3dlZCBieTpcbiAqICAgKGNvbW1lbnQgc3RhcnQpIG9yICh0YWcpIG9yIChkeW5hbWljIHRhZyBiaW5kaW5nKVxuICovXG5jb25zdCB0ZXh0RW5kUmVnZXggPSAvPCg/OighLS18XFwvW15hLXpBLVpdKXwoXFwvP1thLXpBLVpdW14+XFxzXSopfChcXC8/JCkpL2c7XG5jb25zdCBDT01NRU5UX1NUQVJUID0gMTtcbmNvbnN0IFRBR19OQU1FID0gMjtcbmNvbnN0IERZTkFNSUNfVEFHX05BTUUgPSAzO1xuY29uc3QgY29tbWVudEVuZFJlZ2V4ID0gLy0tPi9nO1xuLyoqXG4gKiBDb21tZW50cyBub3Qgc3RhcnRlZCB3aXRoIDwhLS0sIGxpa2UgPC97LCBjYW4gYmUgZW5kZWQgYnkgYSBzaW5nbGUgYD5gXG4gKi9cbmNvbnN0IGNvbW1lbnQyRW5kUmVnZXggPSAvPi9nO1xuLyoqXG4gKiBUaGUgdGFnRW5kIHJlZ2V4IG1hdGNoZXMgdGhlIGVuZCBvZiB0aGUgXCJpbnNpZGUgYW4gb3BlbmluZ1wiIHRhZyBzeW50YXhcbiAqIHBvc2l0aW9uLiBJdCBlaXRoZXIgbWF0Y2hlcyBhIGA+YCwgYW4gYXR0cmlidXRlLWxpa2Ugc2VxdWVuY2UsIG9yIHRoZSBlbmRcbiAqIG9mIHRoZSBzdHJpbmcgYWZ0ZXIgYSBzcGFjZSAoYXR0cmlidXRlLW5hbWUgcG9zaXRpb24gZW5kaW5nKS5cbiAqXG4gKiBTZWUgYXR0cmlidXRlcyBpbiB0aGUgSFRNTCBzcGVjOlxuICogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L3N5bnRheC5odG1sI2VsZW1lbnRzLWF0dHJpYnV0ZXNcbiAqXG4gKiBcIiBcXHRcXG5cXGZcXHJcIiBhcmUgSFRNTCBzcGFjZSBjaGFyYWN0ZXJzOlxuICogaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI2FzY2lpLXdoaXRlc3BhY2VcbiAqXG4gKiBTbyBhbiBhdHRyaWJ1dGUgaXM6XG4gKiAgKiBUaGUgbmFtZTogYW55IGNoYXJhY3RlciBleGNlcHQgYSB3aGl0ZXNwYWNlIGNoYXJhY3RlciwgKFwiKSwgKCcpLCBcIj5cIixcbiAqICAgIFwiPVwiLCBvciBcIi9cIi4gTm90ZTogdGhpcyBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgSFRNTCBzcGVjIHdoaWNoIGFsc28gZXhjbHVkZXMgY29udHJvbCBjaGFyYWN0ZXJzLlxuICogICogRm9sbG93ZWQgYnkgemVybyBvciBtb3JlIHNwYWNlIGNoYXJhY3RlcnNcbiAqICAqIEZvbGxvd2VkIGJ5IFwiPVwiXG4gKiAgKiBGb2xsb3dlZCBieSB6ZXJvIG9yIG1vcmUgc3BhY2UgY2hhcmFjdGVyc1xuICogICogRm9sbG93ZWQgYnk6XG4gKiAgICAqIEFueSBjaGFyYWN0ZXIgZXhjZXB0IHNwYWNlLCAoJyksIChcIiksIFwiPFwiLCBcIj5cIiwgXCI9XCIsIChgKSwgb3JcbiAqICAgICogKFwiKSB0aGVuIGFueSBub24tKFwiKSwgb3JcbiAqICAgICogKCcpIHRoZW4gYW55IG5vbi0oJylcbiAqL1xuY29uc3QgdGFnRW5kUmVnZXggPSBuZXcgUmVnRXhwKGA+fCR7U1BBQ0VfQ0hBUn0oPzooJHtOQU1FX0NIQVJ9KykoJHtTUEFDRV9DSEFSfSo9JHtTUEFDRV9DSEFSfSooPzoke0FUVFJfVkFMVUVfQ0hBUn18KFwifCcpfCkpfCQpYCwgJ2cnKTtcbmNvbnN0IEVOVElSRV9NQVRDSCA9IDA7XG5jb25zdCBBVFRSSUJVVEVfTkFNRSA9IDE7XG5jb25zdCBTUEFDRVNfQU5EX0VRVUFMUyA9IDI7XG5jb25zdCBRVU9URV9DSEFSID0gMztcbmNvbnN0IHNpbmdsZVF1b3RlQXR0ckVuZFJlZ2V4ID0gLycvZztcbmNvbnN0IGRvdWJsZVF1b3RlQXR0ckVuZFJlZ2V4ID0gL1wiL2c7XG4vKipcbiAqIE1hdGNoZXMgdGhlIHJhdyB0ZXh0IGVsZW1lbnRzLlxuICpcbiAqIENvbW1lbnRzIGFyZSBub3QgcGFyc2VkIHdpdGhpbiByYXcgdGV4dCBlbGVtZW50cywgc28gd2UgbmVlZCB0byBzZWFyY2ggdGhlaXJcbiAqIHRleHQgY29udGVudCBmb3IgbWFya2VyIHN0cmluZ3MuXG4gKi9cbmNvbnN0IHJhd1RleHRFbGVtZW50ID0gL14oPzpzY3JpcHR8c3R5bGV8dGV4dGFyZWEpJC9pO1xuLyoqIFRlbXBsYXRlUmVzdWx0IHR5cGVzICovXG5jb25zdCBIVE1MX1JFU1VMVCA9IDE7XG5jb25zdCBTVkdfUkVTVUxUID0gMjtcbi8vIFRlbXBsYXRlUGFydCB0eXBlc1xuLy8gSU1QT1JUQU5UOiB0aGVzZSBtdXN0IG1hdGNoIHRoZSB2YWx1ZXMgaW4gUGFydFR5cGVcbmNvbnN0IEFUVFJJQlVURV9QQVJUID0gMTtcbmNvbnN0IENISUxEX1BBUlQgPSAyO1xuY29uc3QgUFJPUEVSVFlfUEFSVCA9IDM7XG5jb25zdCBCT09MRUFOX0FUVFJJQlVURV9QQVJUID0gNDtcbmNvbnN0IEVWRU5UX1BBUlQgPSA1O1xuY29uc3QgRUxFTUVOVF9QQVJUID0gNjtcbmNvbnN0IENPTU1FTlRfUEFSVCA9IDc7XG4vKipcbiAqIEdlbmVyYXRlcyBhIHRlbXBsYXRlIGxpdGVyYWwgdGFnIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFRlbXBsYXRlUmVzdWx0IHdpdGhcbiAqIHRoZSBnaXZlbiByZXN1bHQgdHlwZS5cbiAqL1xuY29uc3QgdGFnID0gKHR5cGUpID0+IChzdHJpbmdzLCAuLi52YWx1ZXMpID0+IHtcbiAgICAvLyBXYXJuIGFnYWluc3QgdGVtcGxhdGVzIG9jdGFsIGVzY2FwZSBzZXF1ZW5jZXNcbiAgICAvLyBXZSBkbyB0aGlzIGhlcmUgcmF0aGVyIHRoYW4gaW4gcmVuZGVyIHNvIHRoYXQgdGhlIHdhcm5pbmcgaXMgY2xvc2VyIHRvIHRoZVxuICAgIC8vIHRlbXBsYXRlIGRlZmluaXRpb24uXG4gICAgaWYgKERFVl9NT0RFICYmIHN0cmluZ3Muc29tZSgocykgPT4gcyA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1NvbWUgdGVtcGxhdGUgc3RyaW5ncyBhcmUgdW5kZWZpbmVkLlxcbicgK1xuICAgICAgICAgICAgJ1RoaXMgaXMgcHJvYmFibHkgY2F1c2VkIGJ5IGlsbGVnYWwgb2N0YWwgZXNjYXBlIHNlcXVlbmNlcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICAgICAgWydfJGxpdFR5cGUkJ106IHR5cGUsXG4gICAgICAgIHN0cmluZ3MsXG4gICAgICAgIHZhbHVlcyxcbiAgICB9O1xufTtcbi8qKlxuICogSW50ZXJwcmV0cyBhIHRlbXBsYXRlIGxpdGVyYWwgYXMgYW4gSFRNTCB0ZW1wbGF0ZSB0aGF0IGNhbiBlZmZpY2llbnRseVxuICogcmVuZGVyIHRvIGFuZCB1cGRhdGUgYSBjb250YWluZXIuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGhlYWRlciA9ICh0aXRsZTogc3RyaW5nKSA9PiBodG1sYDxoMT4ke3RpdGxlfTwvaDE+YDtcbiAqIGBgYFxuICpcbiAqIFRoZSBgaHRtbGAgdGFnIHJldHVybnMgYSBkZXNjcmlwdGlvbiBvZiB0aGUgRE9NIHRvIHJlbmRlciBhcyBhIHZhbHVlLiBJdCBpc1xuICogbGF6eSwgbWVhbmluZyBubyB3b3JrIGlzIGRvbmUgdW50aWwgdGhlIHRlbXBsYXRlIGlzIHJlbmRlcmVkLiBXaGVuIHJlbmRlcmluZyxcbiAqIGlmIGEgdGVtcGxhdGUgY29tZXMgZnJvbSB0aGUgc2FtZSBleHByZXNzaW9uIGFzIGEgcHJldmlvdXNseSByZW5kZXJlZCByZXN1bHQsXG4gKiBpdCdzIGVmZmljaWVudGx5IHVwZGF0ZWQgaW5zdGVhZCBvZiByZXBsYWNlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGh0bWwgPSB0YWcoSFRNTF9SRVNVTFQpO1xuLyoqXG4gKiBJbnRlcnByZXRzIGEgdGVtcGxhdGUgbGl0ZXJhbCBhcyBhbiBTVkcgdGVtcGxhdGUgdGhhdCBjYW4gZWZmaWNpZW50bHlcbiAqIHJlbmRlciB0byBhbmQgdXBkYXRlIGEgY29udGFpbmVyLlxuICovXG5leHBvcnQgY29uc3Qgc3ZnID0gdGFnKFNWR19SRVNVTFQpO1xuLyoqXG4gKiBBIHNlbnRpbmVsIHZhbHVlIHRoYXQgc2lnbmFscyB0aGF0IGEgdmFsdWUgd2FzIGhhbmRsZWQgYnkgYSBkaXJlY3RpdmUgYW5kXG4gKiBzaG91bGQgbm90IGJlIHdyaXR0ZW4gdG8gdGhlIERPTS5cbiAqL1xuZXhwb3J0IGNvbnN0IG5vQ2hhbmdlID0gU3ltYm9sLmZvcignbGl0LW5vQ2hhbmdlJyk7XG4vKipcbiAqIEEgc2VudGluZWwgdmFsdWUgdGhhdCBzaWduYWxzIGEgQ2hpbGRQYXJ0IHRvIGZ1bGx5IGNsZWFyIGl0cyBjb250ZW50LlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBidXR0b24gPSBodG1sYCR7XG4gKiAgdXNlci5pc0FkbWluXG4gKiAgICA/IGh0bWxgPGJ1dHRvbj5ERUxFVEU8L2J1dHRvbj5gXG4gKiAgICA6IG5vdGhpbmdcbiAqIH1gO1xuICogYGBgXG4gKlxuICogUHJlZmVyIHVzaW5nIGBub3RoaW5nYCBvdmVyIG90aGVyIGZhbHN5IHZhbHVlcyBhcyBpdCBwcm92aWRlcyBhIGNvbnNpc3RlbnRcbiAqIGJlaGF2aW9yIGJldHdlZW4gdmFyaW91cyBleHByZXNzaW9uIGJpbmRpbmcgY29udGV4dHMuXG4gKlxuICogSW4gY2hpbGQgZXhwcmVzc2lvbnMsIGB1bmRlZmluZWRgLCBgbnVsbGAsIGAnJ2AsIGFuZCBgbm90aGluZ2AgYWxsIGJlaGF2ZSB0aGVcbiAqIHNhbWUgYW5kIHJlbmRlciBubyBub2Rlcy4gSW4gYXR0cmlidXRlIGV4cHJlc3Npb25zLCBgbm90aGluZ2AgX3JlbW92ZXNfIHRoZVxuICogYXR0cmlidXRlLCB3aGlsZSBgdW5kZWZpbmVkYCBhbmQgYG51bGxgIHdpbGwgcmVuZGVyIGFuIGVtcHR5IHN0cmluZy4gSW5cbiAqIHByb3BlcnR5IGV4cHJlc3Npb25zIGBub3RoaW5nYCBiZWNvbWVzIGB1bmRlZmluZWRgLlxuICovXG5leHBvcnQgY29uc3Qgbm90aGluZyA9IFN5bWJvbC5mb3IoJ2xpdC1ub3RoaW5nJyk7XG4vKipcbiAqIFRoZSBjYWNoZSBvZiBwcmVwYXJlZCB0ZW1wbGF0ZXMsIGtleWVkIGJ5IHRoZSB0YWdnZWQgVGVtcGxhdGVTdHJpbmdzQXJyYXlcbiAqIGFuZCBfbm90XyBhY2NvdW50aW5nIGZvciB0aGUgc3BlY2lmaWMgdGVtcGxhdGUgdGFnIHVzZWQuIFRoaXMgbWVhbnMgdGhhdFxuICogdGVtcGxhdGUgdGFncyBjYW5ub3QgYmUgZHluYW1pYyAtIHRoZSBtdXN0IHN0YXRpY2FsbHkgYmUgb25lIG9mIGh0bWwsIHN2ZyxcbiAqIG9yIGF0dHIuIFRoaXMgcmVzdHJpY3Rpb24gc2ltcGxpZmllcyB0aGUgY2FjaGUgbG9va3VwLCB3aGljaCBpcyBvbiB0aGUgaG90XG4gKiBwYXRoIGZvciByZW5kZXJpbmcuXG4gKi9cbmNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBSZW5kZXJzIGEgdmFsdWUsIHVzdWFsbHkgYSBsaXQtaHRtbCBUZW1wbGF0ZVJlc3VsdCwgdG8gdGhlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIGNvbnRhaW5lclxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlciA9ICh2YWx1ZSwgY29udGFpbmVyLCBvcHRpb25zKSA9PiB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcGFydE93bmVyTm9kZSA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5yZW5kZXJCZWZvcmUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGNvbnRhaW5lcjtcbiAgICAvLyBUaGlzIHByb3BlcnR5IG5lZWRzIHRvIHJlbWFpbiB1bm1pbmlmaWVkLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgbGV0IHBhcnQgPSBwYXJ0T3duZXJOb2RlWydfJGxpdFBhcnQkJ107XG4gICAgaWYgKHBhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBlbmROb2RlID0gKF9iID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnJlbmRlckJlZm9yZSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbDtcbiAgICAgICAgLy8gSW50ZXJuYWwgbW9kaWZpY2F0aW9uOiBkb24ndCBjbGVhciBjb250YWluZXIgdG8gbWF0Y2ggbGl0LWh0bWwgMi4wXG4gICAgICAgIGlmIChJTlRFUk5BTCAmJlxuICAgICAgICAgICAgKChfYyA9IG9wdGlvbnMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5jbGVhckNvbnRhaW5lckZvckxpdDJNaWdyYXRpb25Pbmx5KSA9PT1cbiAgICAgICAgICAgICAgICB0cnVlKSB7XG4gICAgICAgICAgICBsZXQgbiA9IGNvbnRhaW5lci5maXJzdENoaWxkO1xuICAgICAgICAgICAgLy8gQ2xlYXIgb25seSB1cCB0byB0aGUgYGVuZE5vZGVgIGFrYSBgcmVuZGVyQmVmb3JlYCBub2RlLlxuICAgICAgICAgICAgd2hpbGUgKG4gJiYgbiAhPT0gZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBuLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIG4ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgbiA9IG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgcGFydE93bmVyTm9kZVsnXyRsaXRQYXJ0JCddID0gcGFydCA9IG5ldyBDaGlsZFBhcnQoY29udGFpbmVyLmluc2VydEJlZm9yZShjcmVhdGVNYXJrZXIoKSwgZW5kTm9kZSksIGVuZE5vZGUsIHVuZGVmaW5lZCwgb3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgPyBvcHRpb25zIDoge30pO1xuICAgIH1cbiAgICBwYXJ0Ll8kc2V0VmFsdWUodmFsdWUpO1xuICAgIHJldHVybiBwYXJ0O1xufTtcbmlmIChFTkFCTEVfRVhUUkFfU0VDVVJJVFlfSE9PS1MpIHtcbiAgICByZW5kZXIuc2V0U2FuaXRpemVyID0gc2V0U2FuaXRpemVyO1xuICAgIHJlbmRlci5jcmVhdGVTYW5pdGl6ZXIgPSBjcmVhdGVTYW5pdGl6ZXI7XG4gICAgaWYgKERFVl9NT0RFKSB7XG4gICAgICAgIHJlbmRlci5fdGVzdE9ubHlDbGVhclNhbml0aXplckZhY3RvcnlEb05vdENhbGxPckVsc2UgPVxuICAgICAgICAgICAgX3Rlc3RPbmx5Q2xlYXJTYW5pdGl6ZXJGYWN0b3J5RG9Ob3RDYWxsT3JFbHNlO1xuICAgIH1cbn1cbmNvbnN0IHdhbGtlciA9IGQuY3JlYXRlVHJlZVdhbGtlcihkLCAxMjkgLyogTm9kZUZpbHRlci5TSE9XX3tFTEVNRU5UfENPTU1FTlR9ICovLCBudWxsLCBmYWxzZSk7XG5sZXQgc2FuaXRpemVyRmFjdG9yeUludGVybmFsID0gbm9vcFNhbml0aXplcjtcbi8qKlxuICogUmV0dXJucyBhbiBIVE1MIHN0cmluZyBmb3IgdGhlIGdpdmVuIFRlbXBsYXRlU3RyaW5nc0FycmF5IGFuZCByZXN1bHQgdHlwZVxuICogKEhUTUwgb3IgU1ZHKSwgYWxvbmcgd2l0aCB0aGUgY2FzZS1zZW5zaXRpdmUgYm91bmQgYXR0cmlidXRlIG5hbWVzIGluXG4gKiB0ZW1wbGF0ZSBvcmRlci4gVGhlIEhUTUwgY29udGFpbnMgY29tbWVudCBjb21tZW50IG1hcmtlcnMgZGVub3RpbmcgdGhlXG4gKiBgQ2hpbGRQYXJ0YHMgYW5kIHN1ZmZpeGVzIG9uIGJvdW5kIGF0dHJpYnV0ZXMgZGVub3RpbmcgdGhlIGBBdHRyaWJ1dGVQYXJ0c2AuXG4gKlxuICogQHBhcmFtIHN0cmluZ3MgdGVtcGxhdGUgc3RyaW5ncyBhcnJheVxuICogQHBhcmFtIHR5cGUgSFRNTCBvciBTVkdcbiAqIEByZXR1cm4gQXJyYXkgY29udGFpbmluZyBgW2h0bWwsIGF0dHJOYW1lc11gIChhcnJheSByZXR1cm5lZCBmb3IgdGVyc2VuZXNzLFxuICogICAgIHRvIGF2b2lkIG9iamVjdCBmaWVsZHMgc2luY2UgdGhpcyBjb2RlIGlzIHNoYXJlZCB3aXRoIG5vbi1taW5pZmllZCBTU1JcbiAqICAgICBjb2RlKVxuICovXG5jb25zdCBnZXRUZW1wbGF0ZUh0bWwgPSAoc3RyaW5ncywgdHlwZSkgPT4ge1xuICAgIC8vIEluc2VydCBtYWtlcnMgaW50byB0aGUgdGVtcGxhdGUgSFRNTCB0byByZXByZXNlbnQgdGhlIHBvc2l0aW9uIG9mXG4gICAgLy8gYmluZGluZ3MuIFRoZSBmb2xsb3dpbmcgY29kZSBzY2FucyB0aGUgdGVtcGxhdGUgc3RyaW5ncyB0byBkZXRlcm1pbmUgdGhlXG4gICAgLy8gc3ludGFjdGljIHBvc2l0aW9uIG9mIHRoZSBiaW5kaW5ncy4gVGhleSBjYW4gYmUgaW4gdGV4dCBwb3NpdGlvbiwgd2hlcmVcbiAgICAvLyB3ZSBpbnNlcnQgYW4gSFRNTCBjb21tZW50LCBhdHRyaWJ1dGUgdmFsdWUgcG9zaXRpb24sIHdoZXJlIHdlIGluc2VydCBhXG4gICAgLy8gc2VudGluZWwgc3RyaW5nIGFuZCByZS13cml0ZSB0aGUgYXR0cmlidXRlIG5hbWUsIG9yIGluc2lkZSBhIHRhZyB3aGVyZVxuICAgIC8vIHdlIGluc2VydCB0aGUgc2VudGluZWwgc3RyaW5nLlxuICAgIGNvbnN0IGwgPSBzdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgLy8gU3RvcmVzIHRoZSBjYXNlLXNlbnNpdGl2ZSBib3VuZCBhdHRyaWJ1dGUgbmFtZXMgaW4gdGhlIG9yZGVyIG9mIHRoZWlyXG4gICAgLy8gcGFydHMuIEVsZW1lbnRQYXJ0cyBhcmUgYWxzbyByZWZsZWN0ZWQgaW4gdGhpcyBhcnJheSBhcyB1bmRlZmluZWRcbiAgICAvLyByYXRoZXIgdGhhbiBhIHN0cmluZywgdG8gZGlzYW1iaWd1YXRlIGZyb20gYXR0cmlidXRlIGJpbmRpbmdzLlxuICAgIGNvbnN0IGF0dHJOYW1lcyA9IFtdO1xuICAgIGxldCBodG1sID0gdHlwZSA9PT0gU1ZHX1JFU1VMVCA/ICc8c3ZnPicgOiAnJztcbiAgICAvLyBXaGVuIHdlJ3JlIGluc2lkZSBhIHJhdyB0ZXh0IHRhZyAobm90IGl0J3MgdGV4dCBjb250ZW50KSwgdGhlIHJlZ2V4XG4gICAgLy8gd2lsbCBzdGlsbCBiZSB0YWdSZWdleCBzbyB3ZSBjYW4gZmluZCBhdHRyaWJ1dGVzLCBidXQgd2lsbCBzd2l0Y2ggdG9cbiAgICAvLyB0aGlzIHJlZ2V4IHdoZW4gdGhlIHRhZyBlbmRzLlxuICAgIGxldCByYXdUZXh0RW5kUmVnZXg7XG4gICAgLy8gVGhlIGN1cnJlbnQgcGFyc2luZyBzdGF0ZSwgcmVwcmVzZW50ZWQgYXMgYSByZWZlcmVuY2UgdG8gb25lIG9mIHRoZVxuICAgIC8vIHJlZ2V4ZXNcbiAgICBsZXQgcmVnZXggPSB0ZXh0RW5kUmVnZXg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcyA9IHN0cmluZ3NbaV07XG4gICAgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgZW5kIG9mIHRoZSBsYXN0IGF0dHJpYnV0ZSBuYW1lLiBXaGVuIHRoaXMgaXNcbiAgICAgICAgLy8gcG9zaXRpdmUgYXQgZW5kIG9mIGEgc3RyaW5nLCBpdCBtZWFucyB3ZSdyZSBpbiBhbiBhdHRyaWJ1dGUgdmFsdWVcbiAgICAgICAgLy8gcG9zaXRpb24gYW5kIG5lZWQgdG8gcmV3cml0ZSB0aGUgYXR0cmlidXRlIG5hbWUuXG4gICAgICAgIC8vIFdlIGFsc28gdXNlIGEgc3BlY2lhbCB2YWx1ZSBvZiAtMiB0byBpbmRpY2F0ZSB0aGF0IHdlIGVuY291bnRlcmVkXG4gICAgICAgIC8vIHRoZSBlbmQgb2YgYSBzdHJpbmcgaW4gYXR0cmlidXRlIG5hbWUgcG9zaXRpb24uXG4gICAgICAgIGxldCBhdHRyTmFtZUVuZEluZGV4ID0gLTE7XG4gICAgICAgIGxldCBhdHRyTmFtZTtcbiAgICAgICAgbGV0IGxhc3RJbmRleCA9IDA7XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgLy8gVGhlIGNvbmRpdGlvbnMgaW4gdGhpcyBsb29wIGhhbmRsZSB0aGUgY3VycmVudCBwYXJzZSBzdGF0ZSwgYW5kIHRoZVxuICAgICAgICAvLyBhc3NpZ25tZW50cyB0byB0aGUgYHJlZ2V4YCB2YXJpYWJsZSBhcmUgdGhlIHN0YXRlIHRyYW5zaXRpb25zLlxuICAgICAgICB3aGlsZSAobGFzdEluZGV4IDwgcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBzdGFydCBzZWFyY2hpbmcgZnJvbSB3aGVyZSB3ZSBwcmV2aW91c2x5IGxlZnQgb2ZmXG4gICAgICAgICAgICByZWdleC5sYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMocyk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RJbmRleCA9IHJlZ2V4Lmxhc3RJbmRleDtcbiAgICAgICAgICAgIGlmIChyZWdleCA9PT0gdGV4dEVuZFJlZ2V4KSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoW0NPTU1FTlRfU1RBUlRdID09PSAnIS0tJykge1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9IGNvbW1lbnRFbmRSZWdleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobWF0Y2hbQ09NTUVOVF9TVEFSVF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBzdGFydGVkIGEgd2VpcmQgY29tbWVudCwgbGlrZSA8L3tcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSBjb21tZW50MkVuZFJlZ2V4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRjaFtUQUdfTkFNRV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmF3VGV4dEVsZW1lbnQudGVzdChtYXRjaFtUQUdfTkFNRV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWNvcmQgaWYgd2UgZW5jb3VudGVyIGEgcmF3LXRleHQgZWxlbWVudC4gV2UnbGwgc3dpdGNoIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHJlZ2V4IGF0IHRoZSBlbmQgb2YgdGhlIHRhZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhd1RleHRFbmRSZWdleCA9IG5ldyBSZWdFeHAoYDwvJHttYXRjaFtUQUdfTkFNRV19YCwgJ2cnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZWdleCA9IHRhZ0VuZFJlZ2V4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRjaFtEWU5BTUlDX1RBR19OQU1FXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChERVZfTU9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCaW5kaW5ncyBpbiB0YWcgbmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQuIFBsZWFzZSB1c2Ugc3RhdGljIHRlbXBsYXRlcyBpbnN0ZWFkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHBzOi8vbGl0LmRldi9kb2NzL3RlbXBsYXRlcy9leHByZXNzaW9ucy8jc3RhdGljLWV4cHJlc3Npb25zJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSB0YWdFbmRSZWdleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZWdleCA9PT0gdGFnRW5kUmVnZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbRU5USVJFX01BVENIXSA9PT0gJz4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVuZCBvZiBhIHRhZy4gSWYgd2UgaGFkIHN0YXJ0ZWQgYSByYXctdGV4dCBlbGVtZW50LCB1c2UgdGhhdFxuICAgICAgICAgICAgICAgICAgICAvLyByZWdleFxuICAgICAgICAgICAgICAgICAgICByZWdleCA9IHJhd1RleHRFbmRSZWdleCAhPT0gbnVsbCAmJiByYXdUZXh0RW5kUmVnZXggIT09IHZvaWQgMCA/IHJhd1RleHRFbmRSZWdleCA6IHRleHRFbmRSZWdleDtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbWF5IGJlIGVuZGluZyBhbiB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUsIHNvIG1ha2Ugc3VyZSB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyBjbGVhciBhbnkgcGVuZGluZyBhdHRyTmFtZUVuZEluZGV4XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lRW5kSW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobWF0Y2hbQVRUUklCVVRFX05BTUVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXR0cmlidXRlIG5hbWUgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWVFbmRJbmRleCA9IC0yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWVFbmRJbmRleCA9IHJlZ2V4Lmxhc3RJbmRleCAtIG1hdGNoW1NQQUNFU19BTkRfRVFVQUxTXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gbWF0Y2hbQVRUUklCVVRFX05BTUVdO1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFtRVU9URV9DSEFSXSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0YWdFbmRSZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbWF0Y2hbUVVPVEVfQ0hBUl0gPT09ICdcIidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBkb3VibGVRdW90ZUF0dHJFbmRSZWdleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNpbmdsZVF1b3RlQXR0ckVuZFJlZ2V4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZ2V4ID09PSBkb3VibGVRdW90ZUF0dHJFbmRSZWdleCB8fFxuICAgICAgICAgICAgICAgIHJlZ2V4ID09PSBzaW5nbGVRdW90ZUF0dHJFbmRSZWdleCkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gdGFnRW5kUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZWdleCA9PT0gY29tbWVudEVuZFJlZ2V4IHx8IHJlZ2V4ID09PSBjb21tZW50MkVuZFJlZ2V4KSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSB0ZXh0RW5kUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOb3Qgb25lIG9mIHRoZSBmaXZlIHN0YXRlIHJlZ2V4ZXMsIHNvIGl0IG11c3QgYmUgdGhlIGR5bmFtaWNhbGx5XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlZCByYXcgdGV4dCByZWdleCBhbmQgd2UncmUgYXQgdGhlIGNsb3NlIG9mIHRoYXQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICByZWdleCA9IHRhZ0VuZFJlZ2V4O1xuICAgICAgICAgICAgICAgIHJhd1RleHRFbmRSZWdleCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoREVWX01PREUpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBhdHRyTmFtZUVuZEluZGV4LCB3aGljaCBpbmRpY2F0ZXMgdGhhdCB3ZSBzaG91bGRcbiAgICAgICAgICAgIC8vIHJld3JpdGUgdGhlIGF0dHJpYnV0ZSBuYW1lLCBhc3NlcnQgdGhhdCB3ZSdyZSBpbiBhIHZhbGlkIGF0dHJpYnV0ZVxuICAgICAgICAgICAgLy8gcG9zaXRpb24gLSBlaXRoZXIgaW4gYSB0YWcsIG9yIGEgcXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGF0dHJOYW1lRW5kSW5kZXggPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgcmVnZXggPT09IHRhZ0VuZFJlZ2V4IHx8XG4gICAgICAgICAgICAgICAgcmVnZXggPT09IHNpbmdsZVF1b3RlQXR0ckVuZFJlZ2V4IHx8XG4gICAgICAgICAgICAgICAgcmVnZXggPT09IGRvdWJsZVF1b3RlQXR0ckVuZFJlZ2V4LCAndW5leHBlY3RlZCBwYXJzZSBzdGF0ZSBCJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UgaGF2ZSBmb3VyIGNhc2VzOlxuICAgICAgICAvLyAgMS4gV2UncmUgaW4gdGV4dCBwb3NpdGlvbiwgYW5kIG5vdCBpbiBhIHJhdyB0ZXh0IGVsZW1lbnRcbiAgICAgICAgLy8gICAgIChyZWdleCA9PT0gdGV4dEVuZFJlZ2V4KTogaW5zZXJ0IGEgY29tbWVudCBtYXJrZXIuXG4gICAgICAgIC8vICAyLiBXZSBoYXZlIGEgbm9uLW5lZ2F0aXZlIGF0dHJOYW1lRW5kSW5kZXggd2hpY2ggbWVhbnMgd2UgbmVlZCB0b1xuICAgICAgICAvLyAgICAgcmV3cml0ZSB0aGUgYXR0cmlidXRlIG5hbWUgdG8gYWRkIGEgYm91bmQgYXR0cmlidXRlIHN1ZmZpeC5cbiAgICAgICAgLy8gIDMuIFdlJ3JlIGF0IHRoZSBub24tZmlyc3QgYmluZGluZyBpbiBhIG11bHRpLWJpbmRpbmcgYXR0cmlidXRlLCB1c2UgYVxuICAgICAgICAvLyAgICAgcGxhaW4gbWFya2VyLlxuICAgICAgICAvLyAgNC4gV2UncmUgc29tZXdoZXJlIGVsc2UgaW5zaWRlIHRoZSB0YWcuIElmIHdlJ3JlIGluIGF0dHJpYnV0ZSBuYW1lXG4gICAgICAgIC8vICAgICBwb3NpdGlvbiAoYXR0ck5hbWVFbmRJbmRleCA9PT0gLTIpLCBhZGQgYSBzZXF1ZW50aWFsIHN1ZmZpeCB0b1xuICAgICAgICAvLyAgICAgZ2VuZXJhdGUgYSB1bmlxdWUgYXR0cmlidXRlIG5hbWUuXG4gICAgICAgIC8vIERldGVjdCBhIGJpbmRpbmcgbmV4dCB0byBzZWxmLWNsb3NpbmcgdGFnIGVuZCBhbmQgaW5zZXJ0IGEgc3BhY2UgdG9cbiAgICAgICAgLy8gc2VwYXJhdGUgdGhlIG1hcmtlciBmcm9tIHRoZSB0YWcgZW5kOlxuICAgICAgICBjb25zdCBlbmQgPSByZWdleCA9PT0gdGFnRW5kUmVnZXggJiYgc3RyaW5nc1tpICsgMV0uc3RhcnRzV2l0aCgnLz4nKSA/ICcgJyA6ICcnO1xuICAgICAgICBodG1sICs9XG4gICAgICAgICAgICByZWdleCA9PT0gdGV4dEVuZFJlZ2V4XG4gICAgICAgICAgICAgICAgPyBzICsgbm9kZU1hcmtlclxuICAgICAgICAgICAgICAgIDogYXR0ck5hbWVFbmRJbmRleCA+PSAwXG4gICAgICAgICAgICAgICAgICAgID8gKGF0dHJOYW1lcy5wdXNoKGF0dHJOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuc2xpY2UoMCwgYXR0ck5hbWVFbmRJbmRleCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kQXR0cmlidXRlU3VmZml4ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnNsaWNlKGF0dHJOYW1lRW5kSW5kZXgpKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kXG4gICAgICAgICAgICAgICAgICAgIDogcyArXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGF0dHJOYW1lRW5kSW5kZXggPT09IC0yID8gKGF0dHJOYW1lcy5wdXNoKHVuZGVmaW5lZCksIGkpIDogZW5kKTtcbiAgICB9XG4gICAgY29uc3QgaHRtbFJlc3VsdCA9IGh0bWwgKyAoc3RyaW5nc1tsXSB8fCAnPD8+JykgKyAodHlwZSA9PT0gU1ZHX1JFU1VMVCA/ICc8L3N2Zz4nIDogJycpO1xuICAgIC8vIFJldHVybmVkIGFzIGFuIGFycmF5IGZvciB0ZXJzZW5lc3NcbiAgICByZXR1cm4gW1xuICAgICAgICBwb2xpY3kgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBwb2xpY3kuY3JlYXRlSFRNTChodG1sUmVzdWx0KVxuICAgICAgICAgICAgOiBodG1sUmVzdWx0LFxuICAgICAgICBhdHRyTmFtZXMsXG4gICAgXTtcbn07XG5jbGFzcyBUZW1wbGF0ZSB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICB7IHN0cmluZ3MsIFsnXyRsaXRUeXBlJCddOiB0eXBlIH0sIG9wdGlvbnMpIHtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLnBhcnRzID0gW107XG4gICAgICAgIGxldCBub2RlO1xuICAgICAgICBsZXQgbm9kZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IGF0dHJOYW1lSW5kZXggPSAwO1xuICAgICAgICBjb25zdCBwYXJ0Q291bnQgPSBzdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgICAgICAgLy8gQ3JlYXRlIHRlbXBsYXRlIGVsZW1lbnRcbiAgICAgICAgY29uc3QgW2h0bWwsIGF0dHJOYW1lc10gPSBnZXRUZW1wbGF0ZUh0bWwoc3RyaW5ncywgdHlwZSk7XG4gICAgICAgIHRoaXMuZWwgPSBUZW1wbGF0ZS5jcmVhdGVFbGVtZW50KGh0bWwsIG9wdGlvbnMpO1xuICAgICAgICB3YWxrZXIuY3VycmVudE5vZGUgPSB0aGlzLmVsLmNvbnRlbnQ7XG4gICAgICAgIC8vIFJlcGFyZW50IFNWRyBub2RlcyBpbnRvIHRlbXBsYXRlIHJvb3RcbiAgICAgICAgaWYgKHR5cGUgPT09IFNWR19SRVNVTFQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLmNvbnRlbnQ7XG4gICAgICAgICAgICBjb25zdCBzdmdFbGVtZW50ID0gY29udGVudC5maXJzdENoaWxkO1xuICAgICAgICAgICAgc3ZnRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNvbnRlbnQuYXBwZW5kKC4uLnN2Z0VsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FsayB0aGUgdGVtcGxhdGUgdG8gZmluZCBiaW5kaW5nIG1hcmtlcnMgYW5kIGNyZWF0ZSBUZW1wbGF0ZVBhcnRzXG4gICAgICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSAhPT0gbnVsbCAmJiBwYXJ0cy5sZW5ndGggPCBwYXJ0Q291bnQpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKERFVl9NT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhZyA9IG5vZGUubG9jYWxOYW1lO1xuICAgICAgICAgICAgICAgICAgICAvLyBXYXJuIGlmIGB0ZXh0YXJlYWAgaW5jbHVkZXMgYW4gZXhwcmVzc2lvbiBhbmQgdGhyb3cgaWYgYHRlbXBsYXRlYFxuICAgICAgICAgICAgICAgICAgICAvLyBkb2VzIHNpbmNlIHRoZXNlIGFyZSBub3Qgc3VwcG9ydGVkLiBXZSBkbyB0aGlzIGJ5IGNoZWNraW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGlubmVySFRNTCBmb3IgYW55dGhpbmcgdGhhdCBsb29rcyBsaWtlIGEgbWFya2VyLiBUaGlzIGNhdGNoZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FzZXMgbGlrZSBiaW5kaW5ncyBpbiB0ZXh0YXJlYSB0aGVyZSBtYXJrZXJzIHR1cm4gaW50byB0ZXh0IG5vZGVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoL14oPzp0ZXh0YXJlYXx0ZW1wbGF0ZSkkL2kudGVzdCh0YWcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTC5pbmNsdWRlcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtID0gYEV4cHJlc3Npb25zIGFyZSBub3Qgc3VwcG9ydGVkIGluc2lkZSBcXGAke3RhZ31cXGAgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYGVsZW1lbnRzLiBTZWUgaHR0cHM6Ly9saXQuZGV2L21zZy9leHByZXNzaW9uLWluLSR7dGFnfSBmb3IgbW9yZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgaW5mb3JtYXRpb24uYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWcgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVXYXJuaW5nKCcnLCBtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUT0RPIChqdXN0aW5mYWduYW5pKTogZm9yIGF0dGVtcHRlZCBkeW5hbWljIHRhZyBuYW1lcywgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAvLyBpbmNyZW1lbnQgdGhlIGJpbmRpbmdJbmRleCwgYW5kIGl0J2xsIGJlIG9mZiBieSAxIGluIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gYW5kIG9mZiBieSB0d28gYWZ0ZXIgaXQuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGRlZmVyIHJlbW92aW5nIGJvdW5kIGF0dHJpYnV0ZXMgYmVjYXVzZSBvbiBJRSB3ZSBtaWdodCBub3QgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0aW5nIGF0dHJpYnV0ZXMgaW4gdGhlaXIgdGVtcGxhdGUgb3JkZXIsIGFuZCB3b3VsZCBzb21ldGltZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFuIGF0dHJpYnV0ZSB0aGF0IHdlIHN0aWxsIG5lZWQgdG8gY3JlYXRlIGEgcGFydCBmb3IuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJzVG9SZW1vdmUgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgd2UncmUgaXRlcmF0aW5nIG92ZXIsIGJ1dCBub3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIF9uZWNjZXNzYXJpbHlfIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgd2Ugd2lsbCBjcmVhdGUgYSBwYXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3IuIFRoZXkgY2FuIGJlIGRpZmZlcmVudCBpbiBicm93c2VycyB0aGF0IGRvbid0IGl0ZXJhdGUgb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgaW4gc291cmNlIG9yZGVyLiBJbiB0aGF0IGNhc2UgdGhlIGF0dHJOYW1lcyBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGF0dHJpYnV0ZSBuYW1lIHdlJ2xsIHByb2Nlc3MgbmV4dC4gV2Ugb25seSBuZWVkIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXR0cmlidXRlIG5hbWUgaGVyZSB0byBrbm93IGlmIHdlIHNob3VsZCBwcm9jZXNzIGEgYm91bmQgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvbiB0aGlzIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5lbmRzV2l0aChib3VuZEF0dHJpYnV0ZVN1ZmZpeCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgobWFya2VyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxOYW1lID0gYXR0ck5hbWVzW2F0dHJOYW1lSW5kZXgrK107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNUb1JlbW92ZS5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvd2VyY2FzZSBmb3IgY2FzZS1zZW5zaXRpdmUgU1ZHIGF0dHJpYnV0ZXMgbGlrZSB2aWV3Qm94XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUocmVhbE5hbWUudG9Mb3dlckNhc2UoKSArIGJvdW5kQXR0cmlidXRlU3VmZml4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdGljcyA9IHZhbHVlLnNwbGl0KG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG0gPSAvKFsuP0BdKT8oLiopLy5leGVjKHJlYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBVFRSSUJVVEVfUEFSVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBub2RlSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nczogc3RhdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0b3I6IG1bMV0gPT09ICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gUHJvcGVydHlQYXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtWzFdID09PSAnPydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBCb29sZWFuQXR0cmlidXRlUGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1bMV0gPT09ICdAJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBFdmVudFBhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogQXR0cmlidXRlUGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEVMRU1FTlRfUEFSVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBub2RlSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgYXR0cnNUb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVE9ETyAoanVzdGluZmFnbmFuaSk6IGJlbmNobWFyayB0aGUgcmVnZXggYWdhaW5zdCB0ZXN0aW5nIGZvciBlYWNoXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIDMgcmF3IHRleHQgZWxlbWVudCBuYW1lcy5cbiAgICAgICAgICAgICAgICBpZiAocmF3VGV4dEVsZW1lbnQudGVzdChub2RlLnRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciByYXcgdGV4dCBlbGVtZW50cyB3ZSBuZWVkIHRvIHNwbGl0IHRoZSB0ZXh0IGNvbnRlbnQgb25cbiAgICAgICAgICAgICAgICAgICAgLy8gbWFya2VycywgY3JlYXRlIGEgVGV4dCBub2RlIGZvciBlYWNoIHNlZ21lbnQsIGFuZCBjcmVhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBUZW1wbGF0ZVBhcnQgZm9yIGVhY2ggbWFya2VyLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJpbmdzID0gbm9kZS50ZXh0Q29udGVudC5zcGxpdChtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSBzdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gdHJ1c3RlZFR5cGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0cnVzdGVkVHlwZXMuZW1wdHlTY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSBuZXcgdGV4dCBub2RlIGZvciBlYWNoIGxpdGVyYWwgc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlc2Ugbm9kZXMgYXJlIGFsc28gdXNlZCBhcyB0aGUgbWFya2VycyBmb3Igbm9kZSBwYXJ0c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuJ3QgdXNlIGVtcHR5IHRleHQgbm9kZXMgYXMgbWFya2VycyBiZWNhdXNlIHRoZXkncmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZWQgd2hlbiBjbG9uaW5nIGluIElFIChjb3VsZCBzaW1wbGlmeSB3aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJRSBpcyBubyBsb25nZXIgc3VwcG9ydGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0SW5kZXg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kKHN0cmluZ3NbaV0sIGNyZWF0ZU1hcmtlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXYWxrIHBhc3QgdGhlIG1hcmtlciBub2RlIHdlIGp1c3QgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrZXIubmV4dE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKHsgdHlwZTogQ0hJTERfUEFSVCwgaW5kZXg6ICsrbm9kZUluZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBiZWNhdXNlIHRoaXMgbWFya2VyIGlzIGFkZGVkIGFmdGVyIHRoZSB3YWxrZXIncyBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub2RlLCBpdCB3aWxsIGJlIHdhbGtlZCB0byBpbiB0aGUgb3V0ZXIgbG9vcCAoYW5kIGlnbm9yZWQpLCBzb1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBhZGp1c3Qgbm9kZUluZGV4IGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kKHN0cmluZ3NbbGFzdEluZGV4XSwgY3JlYXRlTWFya2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG1hcmtlck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goeyB0eXBlOiBDSElMRF9QQVJULCBpbmRleDogbm9kZUluZGV4IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChpID0gbm9kZS5kYXRhLmluZGV4T2YobWFya2VyLCBpICsgMSkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tbWVudCBub2RlIGhhcyBhIGJpbmRpbmcgbWFya2VyIGluc2lkZSwgbWFrZSBhbiBpbmFjdGl2ZSBwYXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYmluZGluZyB3b24ndCB3b3JrLCBidXQgc3Vic2VxdWVudCBiaW5kaW5ncyB3aWxsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKHsgdHlwZTogQ09NTUVOVF9QQVJULCBpbmRleDogbm9kZUluZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSB0byB0aGUgZW5kIG9mIHRoZSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBtYXJrZXIubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE92ZXJyaWRkZW4gdmlhIGBsaXRIdG1sUG9seWZpbGxTdXBwb3J0YCB0byBwcm92aWRlIHBsYXRmb3JtIHN1cHBvcnQuXG4gICAgLyoqIEBub2NvbGxhcHNlICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQoaHRtbCwgX29wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9XG59XG5mdW5jdGlvbiByZXNvbHZlRGlyZWN0aXZlKHBhcnQsIHZhbHVlLCBwYXJlbnQgPSBwYXJ0LCBhdHRyaWJ1dGVJbmRleCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIHZhciBfZDtcbiAgICAvLyBCYWlsIGVhcmx5IGlmIHRoZSB2YWx1ZSBpcyBleHBsaWNpdGx5IG5vQ2hhbmdlLiBOb3RlLCB0aGlzIG1lYW5zIGFueVxuICAgIC8vIG5lc3RlZCBkaXJlY3RpdmUgaXMgc3RpbGwgYXR0YWNoZWQgYW5kIGlzIG5vdCBydW4uXG4gICAgaWYgKHZhbHVlID09PSBub0NoYW5nZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGxldCBjdXJyZW50RGlyZWN0aXZlID0gYXR0cmlidXRlSW5kZXggIT09IHVuZGVmaW5lZFxuICAgICAgICA/IChfYSA9IHBhcmVudC5fX2RpcmVjdGl2ZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVthdHRyaWJ1dGVJbmRleF1cbiAgICAgICAgOiBwYXJlbnQuX19kaXJlY3RpdmU7XG4gICAgY29uc3QgbmV4dERpcmVjdGl2ZUNvbnN0cnVjdG9yID0gaXNQcmltaXRpdmUodmFsdWUpXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICAgICAgICAgIHZhbHVlWydfJGxpdERpcmVjdGl2ZSQnXTtcbiAgICBpZiAoKGN1cnJlbnREaXJlY3RpdmUgPT09IG51bGwgfHwgY3VycmVudERpcmVjdGl2ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudERpcmVjdGl2ZS5jb25zdHJ1Y3RvcikgIT09IG5leHREaXJlY3RpdmVDb25zdHJ1Y3Rvcikge1xuICAgICAgICAvLyBUaGlzIHByb3BlcnR5IG5lZWRzIHRvIHJlbWFpbiB1bm1pbmlmaWVkLlxuICAgICAgICAoX2IgPSBjdXJyZW50RGlyZWN0aXZlID09PSBudWxsIHx8IGN1cnJlbnREaXJlY3RpdmUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnREaXJlY3RpdmVbJ18kbm90aWZ5RGlyZWN0aXZlQ29ubmVjdGlvbkNoYW5nZWQnXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoY3VycmVudERpcmVjdGl2ZSwgZmFsc2UpO1xuICAgICAgICBpZiAobmV4dERpcmVjdGl2ZUNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN1cnJlbnREaXJlY3RpdmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50RGlyZWN0aXZlID0gbmV3IG5leHREaXJlY3RpdmVDb25zdHJ1Y3RvcihwYXJ0KTtcbiAgICAgICAgICAgIGN1cnJlbnREaXJlY3RpdmUuXyRpbml0aWFsaXplKHBhcnQsIHBhcmVudCwgYXR0cmlidXRlSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAoKF9jID0gKF9kID0gcGFyZW50KS5fX2RpcmVjdGl2ZXMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IChfZC5fX2RpcmVjdGl2ZXMgPSBbXSkpW2F0dHJpYnV0ZUluZGV4XSA9XG4gICAgICAgICAgICAgICAgY3VycmVudERpcmVjdGl2ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5fX2RpcmVjdGl2ZSA9IGN1cnJlbnREaXJlY3RpdmU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGN1cnJlbnREaXJlY3RpdmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZSA9IHJlc29sdmVEaXJlY3RpdmUocGFydCwgY3VycmVudERpcmVjdGl2ZS5fJHJlc29sdmUocGFydCwgdmFsdWUudmFsdWVzKSwgY3VycmVudERpcmVjdGl2ZSwgYXR0cmlidXRlSW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG4vKipcbiAqIEFuIHVwZGF0ZWFibGUgaW5zdGFuY2Ugb2YgYSBUZW1wbGF0ZS4gSG9sZHMgcmVmZXJlbmNlcyB0byB0aGUgUGFydHMgdXNlZCB0b1xuICogdXBkYXRlIHRoZSB0ZW1wbGF0ZSBpbnN0YW5jZS5cbiAqL1xuY2xhc3MgVGVtcGxhdGVJbnN0YW5jZSB7XG4gICAgY29uc3RydWN0b3IodGVtcGxhdGUsIHBhcmVudCkge1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuX3BhcnRzID0gW107XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fJGRpc2Nvbm5lY3RhYmxlQ2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuXyR0ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICB0aGlzLl8kcGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgICAvLyBDYWxsZWQgYnkgQ2hpbGRQYXJ0IHBhcmVudE5vZGUgZ2V0dGVyXG4gICAgZ2V0IHBhcmVudE5vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kcGFyZW50LnBhcmVudE5vZGU7XG4gICAgfVxuICAgIC8vIFNlZSBjb21tZW50IGluIERpc2Nvbm5lY3RhYmxlIGludGVyZmFjZSBmb3Igd2h5IHRoaXMgaXMgYSBnZXR0ZXJcbiAgICBnZXQgXyRpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuXyRwYXJlbnQuXyRpc0Nvbm5lY3RlZDtcbiAgICB9XG4gICAgLy8gVGhpcyBtZXRob2QgaXMgc2VwYXJhdGUgZnJvbSB0aGUgY29uc3RydWN0b3IgYmVjYXVzZSB3ZSBuZWVkIHRvIHJldHVybiBhXG4gICAgLy8gRG9jdW1lbnRGcmFnbWVudCBhbmQgd2UgZG9uJ3Qgd2FudCB0byBob2xkIG9udG8gaXQgd2l0aCBhbiBpbnN0YW5jZSBmaWVsZC5cbiAgICBfY2xvbmUob3B0aW9ucykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHsgZWw6IHsgY29udGVudCB9LCBwYXJ0czogcGFydHMsIH0gPSB0aGlzLl8kdGVtcGxhdGU7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gKChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jcmVhdGlvblNjb3BlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBkKS5pbXBvcnROb2RlKGNvbnRlbnQsIHRydWUpO1xuICAgICAgICB3YWxrZXIuY3VycmVudE5vZGUgPSBmcmFnbWVudDtcbiAgICAgICAgbGV0IG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKTtcbiAgICAgICAgbGV0IG5vZGVJbmRleCA9IDA7XG4gICAgICAgIGxldCBwYXJ0SW5kZXggPSAwO1xuICAgICAgICBsZXQgdGVtcGxhdGVQYXJ0ID0gcGFydHNbMF07XG4gICAgICAgIHdoaWxlICh0ZW1wbGF0ZVBhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gdGVtcGxhdGVQYXJ0LmluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcnQ7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlUGFydC50eXBlID09PSBDSElMRF9QQVJUKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnQgPSBuZXcgQ2hpbGRQYXJ0KG5vZGUsIG5vZGUubmV4dFNpYmxpbmcsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0ZW1wbGF0ZVBhcnQudHlwZSA9PT0gQVRUUklCVVRFX1BBUlQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IG5ldyB0ZW1wbGF0ZVBhcnQuY3Rvcihub2RlLCB0ZW1wbGF0ZVBhcnQubmFtZSwgdGVtcGxhdGVQYXJ0LnN0cmluZ3MsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0ZW1wbGF0ZVBhcnQudHlwZSA9PT0gRUxFTUVOVF9QQVJUKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnQgPSBuZXcgRWxlbWVudFBhcnQobm9kZSwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRzLnB1c2gocGFydCk7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVQYXJ0ID0gcGFydHNbKytwYXJ0SW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGVJbmRleCAhPT0gKHRlbXBsYXRlUGFydCA9PT0gbnVsbCB8fCB0ZW1wbGF0ZVBhcnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRlbXBsYXRlUGFydC5pbmRleCkpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gd2Fsa2VyLm5leHROb2RlKCk7XG4gICAgICAgICAgICAgICAgbm9kZUluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xuICAgIH1cbiAgICBfdXBkYXRlKHZhbHVlcykge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgcGFydCBvZiB0aGlzLl9wYXJ0cykge1xuICAgICAgICAgICAgaWYgKHBhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0LnN0cmluZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0Ll8kc2V0VmFsdWUodmFsdWVzLCBwYXJ0LCBpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiB2YWx1ZXMgdGhlIHBhcnQgY29uc3VtZXMgaXMgcGFydC5zdHJpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgdmFsdWVzIGFyZSBpbiBiZXR3ZWVuIHRlbXBsYXRlIHNwYW5zLiBXZSBpbmNyZW1lbnQgaSBieSAxXG4gICAgICAgICAgICAgICAgICAgIC8vIGxhdGVyIGluIHRoZSBsb29wLCBzbyBpbmNyZW1lbnQgaXQgYnkgcGFydC5zdHJpbmdzLmxlbmd0aCAtIDIgaGVyZVxuICAgICAgICAgICAgICAgICAgICBpICs9IHBhcnQuc3RyaW5ncy5sZW5ndGggLSAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydC5fJHNldFZhbHVlKHZhbHVlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgQ2hpbGRQYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydE5vZGUsIGVuZE5vZGUsIHBhcmVudCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHRoaXMudHlwZSA9IENISUxEX1BBUlQ7XG4gICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9IG5vdGhpbmc7XG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZmllbGRzIHdpbGwgYmUgcGF0Y2hlZCBvbnRvIENoaWxkUGFydHMgd2hlbiByZXF1aXJlZCBieVxuICAgICAgICAvLyBBc3luY0RpcmVjdGl2ZVxuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuXyRkaXNjb25uZWN0YWJsZUNoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl8kc3RhcnROb2RlID0gc3RhcnROb2RlO1xuICAgICAgICB0aGlzLl8kZW5kTm9kZSA9IGVuZE5vZGU7XG4gICAgICAgIHRoaXMuXyRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIC8vIE5vdGUgX19pc0Nvbm5lY3RlZCBpcyBvbmx5IGV2ZXIgYWNjZXNzZWQgb24gUm9vdFBhcnRzIChpLmUuIHdoZW4gdGhlcmUgaXNcbiAgICAgICAgLy8gbm8gXyRwYXJlbnQpOyB0aGUgdmFsdWUgb24gYSBub24tcm9vdC1wYXJ0IGlzIFwiZG9uJ3QgY2FyZVwiLCBidXQgY2hlY2tpbmdcbiAgICAgICAgLy8gZm9yIHBhcmVudCB3b3VsZCBiZSBtb3JlIGNvZGVcbiAgICAgICAgdGhpcy5fX2lzQ29ubmVjdGVkID0gKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlzQ29ubmVjdGVkKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlO1xuICAgICAgICBpZiAoRU5BQkxFX0VYVFJBX1NFQ1VSSVRZX0hPT0tTKSB7XG4gICAgICAgICAgICAvLyBFeHBsaWNpdGx5IGluaXRpYWxpemUgZm9yIGNvbnNpc3RlbnQgY2xhc3Mgc2hhcGUuXG4gICAgICAgICAgICB0aGlzLl90ZXh0U2FuaXRpemVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFNlZSBjb21tZW50IGluIERpc2Nvbm5lY3RhYmxlIGludGVyZmFjZSBmb3Igd2h5IHRoaXMgaXMgYSBnZXR0ZXJcbiAgICBnZXQgXyRpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgLy8gQ2hpbGRQYXJ0cyB0aGF0IGFyZSBub3QgYXQgdGhlIHJvb3Qgc2hvdWxkIGFsd2F5cyBiZSBjcmVhdGVkIHdpdGggYVxuICAgICAgICAvLyBwYXJlbnQ7IG9ubHkgUm9vdENoaWxkTm9kZSdzIHdvbid0LCBzbyB0aGV5IHJldHVybiB0aGUgbG9jYWwgaXNDb25uZWN0ZWRcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuXyRwYXJlbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5fJGlzQ29ubmVjdGVkKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB0aGlzLl9faXNDb25uZWN0ZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBwYXJlbnQgbm9kZSBpbnRvIHdoaWNoIHRoZSBwYXJ0IHJlbmRlcnMgaXRzIGNvbnRlbnQuXG4gICAgICpcbiAgICAgKiBBIENoaWxkUGFydCdzIGNvbnRlbnQgY29uc2lzdHMgb2YgYSByYW5nZSBvZiBhZGphY2VudCBjaGlsZCBub2RlcyBvZlxuICAgICAqIGAucGFyZW50Tm9kZWAsIHBvc3NpYmx5IGJvcmRlcmVkIGJ5ICdtYXJrZXIgbm9kZXMnIChgLnN0YXJ0Tm9kZWAgYW5kXG4gICAgICogYC5lbmROb2RlYCkuXG4gICAgICpcbiAgICAgKiAtIElmIGJvdGggYC5zdGFydE5vZGVgIGFuZCBgLmVuZE5vZGVgIGFyZSBub24tbnVsbCwgdGhlbiB0aGUgcGFydCdzIGNvbnRlbnRcbiAgICAgKiBjb25zaXN0cyBvZiBhbGwgc2libGluZ3MgYmV0d2VlbiBgLnN0YXJ0Tm9kZWAgYW5kIGAuZW5kTm9kZWAsIGV4Y2x1c2l2ZWx5LlxuICAgICAqXG4gICAgICogLSBJZiBgLnN0YXJ0Tm9kZWAgaXMgbm9uLW51bGwgYnV0IGAuZW5kTm9kZWAgaXMgbnVsbCwgdGhlbiB0aGUgcGFydCdzXG4gICAgICogY29udGVudCBjb25zaXN0cyBvZiBhbGwgc2libGluZ3MgZm9sbG93aW5nIGAuc3RhcnROb2RlYCwgdXAgdG8gYW5kXG4gICAgICogaW5jbHVkaW5nIHRoZSBsYXN0IGNoaWxkIG9mIGAucGFyZW50Tm9kZWAuIElmIGAuZW5kTm9kZWAgaXMgbm9uLW51bGwsIHRoZW5cbiAgICAgKiBgLnN0YXJ0Tm9kZWAgd2lsbCBhbHdheXMgYmUgbm9uLW51bGwuXG4gICAgICpcbiAgICAgKiAtIElmIGJvdGggYC5lbmROb2RlYCBhbmQgYC5zdGFydE5vZGVgIGFyZSBudWxsLCB0aGVuIHRoZSBwYXJ0J3MgY29udGVudFxuICAgICAqIGNvbnNpc3RzIG9mIGFsbCBjaGlsZCBub2RlcyBvZiBgLnBhcmVudE5vZGVgLlxuICAgICAqL1xuICAgIGdldCBwYXJlbnROb2RlKCkge1xuICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHdyYXAodGhpcy5fJHN0YXJ0Tm9kZSkucGFyZW50Tm9kZTtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fJHBhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBwYXJlbnROb2RlLm5vZGVUeXBlID09PSAxMSAvKiBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UICovKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgcGFyZW50Tm9kZSBpcyBhIERvY3VtZW50RnJhZ21lbnQsIGl0IG1heSBiZSBiZWNhdXNlIHRoZSBET00gaXNcbiAgICAgICAgICAgIC8vIHN0aWxsIGluIHRoZSBjbG9uZWQgZnJhZ21lbnQgZHVyaW5nIGluaXRpYWwgcmVuZGVyOyBpZiBzbywgZ2V0IHRoZSByZWFsXG4gICAgICAgICAgICAvLyBwYXJlbnROb2RlIHRoZSBwYXJ0IHdpbGwgYmUgY29tbWl0dGVkIGludG8gYnkgYXNraW5nIHRoZSBwYXJlbnQuXG4gICAgICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBwYXJ0J3MgbGVhZGluZyBtYXJrZXIgbm9kZSwgaWYgYW55LiBTZWUgYC5wYXJlbnROb2RlYCBmb3IgbW9yZVxuICAgICAqIGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIGdldCBzdGFydE5vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kc3RhcnROb2RlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcGFydCdzIHRyYWlsaW5nIG1hcmtlciBub2RlLCBpZiBhbnkuIFNlZSBgLnBhcmVudE5vZGVgIGZvciBtb3JlXG4gICAgICogaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgZ2V0IGVuZE5vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kZW5kTm9kZTtcbiAgICB9XG4gICAgXyRzZXRWYWx1ZSh2YWx1ZSwgZGlyZWN0aXZlUGFyZW50ID0gdGhpcykge1xuICAgICAgICBpZiAoREVWX01PREUgJiYgdGhpcy5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoaXMgXFxgQ2hpbGRQYXJ0XFxgIGhhcyBubyBcXGBwYXJlbnROb2RlXFxgIGFuZCB0aGVyZWZvcmUgY2Fubm90IGFjY2VwdCBhIHZhbHVlLiBUaGlzIGxpa2VseSBtZWFucyB0aGUgZWxlbWVudCBjb250YWluaW5nIHRoZSBwYXJ0IHdhcyBtYW5pcHVsYXRlZCBpbiBhbiB1bnN1cHBvcnRlZCB3YXkgb3V0c2lkZSBvZiBMaXQncyBjb250cm9sIHN1Y2ggdGhhdCB0aGUgcGFydCdzIG1hcmtlciBub2RlcyB3ZXJlIGVqZWN0ZWQgZnJvbSBET00uIEZvciBleGFtcGxlLCBzZXR0aW5nIHRoZSBlbGVtZW50J3MgXFxgaW5uZXJIVE1MXFxgIG9yIFxcYHRleHRDb250ZW50XFxgIGNhbiBkbyB0aGlzLmApO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gcmVzb2x2ZURpcmVjdGl2ZSh0aGlzLCB2YWx1ZSwgZGlyZWN0aXZlUGFyZW50KTtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gTm9uLXJlbmRlcmluZyBjaGlsZCB2YWx1ZXMuIEl0J3MgaW1wb3J0YW50IHRoYXQgdGhlc2UgZG8gbm90IHJlbmRlclxuICAgICAgICAgICAgLy8gZW1wdHkgdGV4dCBub2RlcyB0byBhdm9pZCBpc3N1ZXMgd2l0aCBwcmV2ZW50aW5nIGRlZmF1bHQgPHNsb3Q+XG4gICAgICAgICAgICAvLyBmYWxsYmFjayBjb250ZW50LlxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBub3RoaW5nIHx8IHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuXyRjb21taXR0ZWRWYWx1ZSAhPT0gbm90aGluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fJGNvbW1pdHRlZFZhbHVlID0gbm90aGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlICE9PSB0aGlzLl8kY29tbWl0dGVkVmFsdWUgJiYgdmFsdWUgIT09IG5vQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tbWl0VGV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGlzIHByb3BlcnR5IG5lZWRzIHRvIHJlbWFpbiB1bm1pbmlmaWVkLlxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlWydfJGxpdFR5cGUkJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fY29tbWl0VGVtcGxhdGVSZXN1bHQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlLm5vZGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbW1pdE5vZGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzSXRlcmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21taXRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFjaywgd2lsbCByZW5kZXIgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvblxuICAgICAgICAgICAgdGhpcy5fY29tbWl0VGV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2luc2VydChub2RlLCByZWYgPSB0aGlzLl8kZW5kTm9kZSkge1xuICAgICAgICByZXR1cm4gd3JhcCh3cmFwKHRoaXMuXyRzdGFydE5vZGUpLnBhcmVudE5vZGUpLmluc2VydEJlZm9yZShub2RlLCByZWYpO1xuICAgIH1cbiAgICBfY29tbWl0Tm9kZSh2YWx1ZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0aGlzLl8kY29tbWl0dGVkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl8kY2xlYXIoKTtcbiAgICAgICAgICAgIGlmIChFTkFCTEVfRVhUUkFfU0VDVVJJVFlfSE9PS1MgJiZcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZXJGYWN0b3J5SW50ZXJuYWwgIT09IG5vb3BTYW5pdGl6ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnROb2RlTmFtZSA9IChfYSA9IHRoaXMuXyRzdGFydE5vZGUucGFyZW50Tm9kZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnROb2RlTmFtZSA9PT0gJ1NUWUxFJyB8fCBwYXJlbnROb2RlTmFtZSA9PT0gJ1NDUklQVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnRm9yYmlkZGVuJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKERFVl9NT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50Tm9kZU5hbWUgPT09ICdTVFlMRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYExpdCBkb2VzIG5vdCBzdXBwb3J0IGJpbmRpbmcgaW5zaWRlIHN0eWxlIG5vZGVzLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUaGlzIGlzIGEgc2VjdXJpdHkgcmlzaywgYXMgc3R5bGUgaW5qZWN0aW9uIGF0dGFja3MgY2FuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGV4ZmlsdHJhdGUgZGF0YSBhbmQgc3Bvb2YgVUlzLiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBDb25zaWRlciBpbnN0ZWFkIHVzaW5nIGNzc1xcYC4uLlxcYCBsaXRlcmFscyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0byBjb21wb3NlIHN0eWxlcywgYW5kIG1ha2UgZG8gZHluYW1pYyBzdHlsaW5nIHdpdGggYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgY3NzIGN1c3RvbSBwcm9wZXJ0aWVzLCA6OnBhcnRzLCA8c2xvdD5zLCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhbmQgYnkgbXV0YXRpbmcgdGhlIERPTSByYXRoZXIgdGhhbiBzdHlsZXNoZWV0cy5gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBMaXQgZG9lcyBub3Qgc3VwcG9ydCBiaW5kaW5nIGluc2lkZSBzY3JpcHQgbm9kZXMuIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFRoaXMgaXMgYSBzZWN1cml0eSByaXNrLCBhcyBpdCBjb3VsZCBhbGxvdyBhcmJpdHJhcnkgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgY29kZSBleGVjdXRpb24uYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fJGNvbW1pdHRlZFZhbHVlID0gdGhpcy5faW5zZXJ0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfY29tbWl0VGV4dCh2YWx1ZSkge1xuICAgICAgICAvLyBJZiB0aGUgY29tbWl0dGVkIHZhbHVlIGlzIGEgcHJpbWl0aXZlIGl0IG1lYW5zIHdlIGNhbGxlZCBfY29tbWl0VGV4dCBvblxuICAgICAgICAvLyB0aGUgcHJldmlvdXMgcmVuZGVyLCBhbmQgd2Uga25vdyB0aGF0IHRoaXMuXyRzdGFydE5vZGUubmV4dFNpYmxpbmcgaXMgYVxuICAgICAgICAvLyBUZXh0IG5vZGUuIFdlIGNhbiBub3cganVzdCByZXBsYWNlIHRoZSB0ZXh0IGNvbnRlbnQgKC5kYXRhKSBvZiB0aGUgbm9kZS5cbiAgICAgICAgaWYgKHRoaXMuXyRjb21taXR0ZWRWYWx1ZSAhPT0gbm90aGluZyAmJlxuICAgICAgICAgICAgaXNQcmltaXRpdmUodGhpcy5fJGNvbW1pdHRlZFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHdyYXAodGhpcy5fJHN0YXJ0Tm9kZSkubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoRU5BQkxFX0VYVFJBX1NFQ1VSSVRZX0hPT0tTKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHRTYW5pdGl6ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0U2FuaXRpemVyID0gY3JlYXRlU2FuaXRpemVyKG5vZGUsICdkYXRhJywgJ3Byb3BlcnR5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fdGV4dFNhbml0aXplcih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLmRhdGEgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChFTkFCTEVfRVhUUkFfU0VDVVJJVFlfSE9PS1MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21taXROb2RlKHRleHROb2RlKTtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIHNldHRpbmcgdGV4dCBjb250ZW50LCBmb3Igc2VjdXJpdHkgcHVycG9zZXMgaXQgbWF0dGVycyBhIGxvdFxuICAgICAgICAgICAgICAgIC8vIHdoYXQgdGhlIHBhcmVudCBpcy4gRm9yIGV4YW1wbGUsIDxzdHlsZT4gYW5kIDxzY3JpcHQ+IG5lZWQgdG8gYmVcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGVkIHdpdGggY2FyZSwgd2hpbGUgPHNwYW4+IGRvZXMgbm90LiBTbyBmaXJzdCB3ZSBuZWVkIHRvIHB1dCBhXG4gICAgICAgICAgICAgICAgLy8gdGV4dCBub2RlIGludG8gdGhlIGRvY3VtZW50LCB0aGVuIHdlIGNhbiBzYW5pdGl6ZSBpdHMgY29udGVudHguXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHRTYW5pdGl6ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0U2FuaXRpemVyID0gY3JlYXRlU2FuaXRpemVyKHRleHROb2RlLCAnZGF0YScsICdwcm9wZXJ0eScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3RleHRTYW5pdGl6ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlLmRhdGEgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1pdE5vZGUoZC5jcmVhdGVUZXh0Tm9kZSh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBfY29tbWl0VGVtcGxhdGVSZXN1bHQocmVzdWx0KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gVGhpcyBwcm9wZXJ0eSBuZWVkcyB0byByZW1haW4gdW5taW5pZmllZC5cbiAgICAgICAgY29uc3QgeyB2YWx1ZXMsIFsnXyRsaXRUeXBlJCddOiB0eXBlIH0gPSByZXN1bHQ7XG4gICAgICAgIC8vIElmICRsaXRUeXBlJCBpcyBhIG51bWJlciwgcmVzdWx0IGlzIGEgcGxhaW4gVGVtcGxhdGVSZXN1bHQgYW5kIHdlIGdldFxuICAgICAgICAvLyB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgdGVtcGxhdGUgY2FjaGUuIElmIG5vdCwgcmVzdWx0IGlzIGFcbiAgICAgICAgLy8gQ29tcGlsZWRUZW1wbGF0ZVJlc3VsdCBhbmQgXyRsaXRUeXBlJCBpcyBhIENvbXBpbGVkVGVtcGxhdGUgYW5kIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gY3JlYXRlIHRoZSA8dGVtcGxhdGU+IGVsZW1lbnQgdGhlIGZpcnN0IHRpbWUgd2Ugc2VlIGl0LlxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHR5cGVvZiB0eXBlID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyB0aGlzLl8kZ2V0VGVtcGxhdGUocmVzdWx0KVxuICAgICAgICAgICAgOiAodHlwZS5lbCA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgKHR5cGUuZWwgPSBUZW1wbGF0ZS5jcmVhdGVFbGVtZW50KHR5cGUuaCwgdGhpcy5vcHRpb25zKSksXG4gICAgICAgICAgICAgICAgdHlwZSk7XG4gICAgICAgIGlmICgoKF9hID0gdGhpcy5fJGNvbW1pdHRlZFZhbHVlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuXyR0ZW1wbGF0ZSkgPT09IHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUuX3VwZGF0ZSh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgVGVtcGxhdGVJbnN0YW5jZSh0ZW1wbGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IGluc3RhbmNlLl9jbG9uZSh0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgaW5zdGFuY2UuX3VwZGF0ZSh2YWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5fY29tbWl0Tm9kZShmcmFnbWVudCk7XG4gICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUgPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBPdmVycmlkZGVuIHZpYSBgbGl0SHRtbFBvbHlmaWxsU3VwcG9ydGAgdG8gcHJvdmlkZSBwbGF0Zm9ybSBzdXBwb3J0LlxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfJGdldFRlbXBsYXRlKHJlc3VsdCkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZUNhY2hlLmdldChyZXN1bHQuc3RyaW5ncyk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUNhY2hlLnNldChyZXN1bHQuc3RyaW5ncywgKHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKHJlc3VsdCkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuICAgIF9jb21taXRJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgICAvLyBGb3IgYW4gSXRlcmFibGUsIHdlIGNyZWF0ZSBhIG5ldyBJbnN0YW5jZVBhcnQgcGVyIGl0ZW0sIHRoZW4gc2V0IGl0c1xuICAgICAgICAvLyB2YWx1ZSB0byB0aGUgaXRlbS4gVGhpcyBpcyBhIGxpdHRsZSBiaXQgb2Ygb3ZlcmhlYWQgZm9yIGV2ZXJ5IGl0ZW0gaW5cbiAgICAgICAgLy8gYW4gSXRlcmFibGUsIGJ1dCBpdCBsZXRzIHVzIHJlY3Vyc2UgZWFzaWx5IGFuZCBlZmZpY2llbnRseSB1cGRhdGUgQXJyYXlzXG4gICAgICAgIC8vIG9mIFRlbXBsYXRlUmVzdWx0cyB0aGF0IHdpbGwgYmUgY29tbW9ubHkgcmV0dXJuZWQgZnJvbSBleHByZXNzaW9ucyBsaWtlOlxuICAgICAgICAvLyBhcnJheS5tYXAoKGkpID0+IGh0bWxgJHtpfWApLCBieSByZXVzaW5nIGV4aXN0aW5nIFRlbXBsYXRlSW5zdGFuY2VzLlxuICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhbiBhcnJheSwgdGhlbiB0aGUgcHJldmlvdXMgcmVuZGVyIHdhcyBvZiBhblxuICAgICAgICAvLyBpdGVyYWJsZSBhbmQgdmFsdWUgd2lsbCBjb250YWluIHRoZSBDaGlsZFBhcnRzIGZyb20gdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIHJlbmRlci4gSWYgdmFsdWUgaXMgbm90IGFuIGFycmF5LCBjbGVhciB0aGlzIHBhcnQgYW5kIG1ha2UgYSBuZXdcbiAgICAgICAgLy8gYXJyYXkgZm9yIENoaWxkUGFydHMuXG4gICAgICAgIGlmICghaXNBcnJheSh0aGlzLl8kY29tbWl0dGVkVmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuXyRjbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIExldHMgdXMga2VlcCB0cmFjayBvZiBob3cgbWFueSBpdGVtcyB3ZSBzdGFtcGVkIHNvIHdlIGNhbiBjbGVhciBsZWZ0b3ZlclxuICAgICAgICAvLyBpdGVtcyBmcm9tIGEgcHJldmlvdXMgcmVuZGVyXG4gICAgICAgIGNvbnN0IGl0ZW1QYXJ0cyA9IHRoaXMuXyRjb21taXR0ZWRWYWx1ZTtcbiAgICAgICAgbGV0IHBhcnRJbmRleCA9IDA7XG4gICAgICAgIGxldCBpdGVtUGFydDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAocGFydEluZGV4ID09PSBpdGVtUGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbm8gZXhpc3RpbmcgcGFydCwgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICAgICAgICAgIC8vIFRPRE8gKGp1c3RpbmZhZ25hbmkpOiB0ZXN0IHBlcmYgaW1wYWN0IG9mIGFsd2F5cyBjcmVhdGluZyB0d28gcGFydHNcbiAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHNoYXJpbmcgcGFydHMgYmV0d2VlbiBub2Rlc1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9saXQvbGl0L2lzc3Vlcy8xMjY2XG4gICAgICAgICAgICAgICAgaXRlbVBhcnRzLnB1c2goKGl0ZW1QYXJ0ID0gbmV3IENoaWxkUGFydCh0aGlzLl9pbnNlcnQoY3JlYXRlTWFya2VyKCkpLCB0aGlzLl9pbnNlcnQoY3JlYXRlTWFya2VyKCkpLCB0aGlzLCB0aGlzLm9wdGlvbnMpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZXVzZSBhbiBleGlzdGluZyBwYXJ0XG4gICAgICAgICAgICAgICAgaXRlbVBhcnQgPSBpdGVtUGFydHNbcGFydEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW1QYXJ0Ll8kc2V0VmFsdWUoaXRlbSk7XG4gICAgICAgICAgICBwYXJ0SW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydEluZGV4IDwgaXRlbVBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gaXRlbVBhcnRzIGFsd2F5cyBoYXZlIGVuZCBub2Rlc1xuICAgICAgICAgICAgdGhpcy5fJGNsZWFyKGl0ZW1QYXJ0ICYmIHdyYXAoaXRlbVBhcnQuXyRlbmROb2RlKS5uZXh0U2libGluZywgcGFydEluZGV4KTtcbiAgICAgICAgICAgIC8vIFRydW5jYXRlIHRoZSBwYXJ0cyBhcnJheSBzbyBfdmFsdWUgcmVmbGVjdHMgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgIGl0ZW1QYXJ0cy5sZW5ndGggPSBwYXJ0SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbm9kZXMgY29udGFpbmVkIHdpdGhpbiB0aGlzIFBhcnQgZnJvbSB0aGUgRE9NLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IG5vZGUgdG8gY2xlYXIgZnJvbSwgZm9yIGNsZWFyaW5nIGEgc3Vic2V0IG9mIHRoZSBwYXJ0J3NcbiAgICAgKiAgICAgRE9NICh1c2VkIHdoZW4gdHJ1bmNhdGluZyBpdGVyYWJsZXMpXG4gICAgICogQHBhcmFtIGZyb20gIFdoZW4gYHN0YXJ0YCBpcyBzcGVjaWZpZWQsIHRoZSBpbmRleCB3aXRoaW4gdGhlIGl0ZXJhYmxlIGZyb21cbiAgICAgKiAgICAgd2hpY2ggQ2hpbGRQYXJ0cyBhcmUgYmVpbmcgcmVtb3ZlZCwgdXNlZCBmb3IgZGlzY29ubmVjdGluZyBkaXJlY3RpdmVzIGluXG4gICAgICogICAgIHRob3NlIFBhcnRzLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgXyRjbGVhcihzdGFydCA9IHdyYXAodGhpcy5fJHN0YXJ0Tm9kZSkubmV4dFNpYmxpbmcsIGZyb20pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzLl8kbm90aWZ5Q29ubmVjdGlvbkNoYW5nZWQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMsIGZhbHNlLCB0cnVlLCBmcm9tKTtcbiAgICAgICAgd2hpbGUgKHN0YXJ0ICYmIHN0YXJ0ICE9PSB0aGlzLl8kZW5kTm9kZSkge1xuICAgICAgICAgICAgY29uc3QgbiA9IHdyYXAoc3RhcnQpLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgd3JhcChzdGFydCkucmVtb3ZlKCk7XG4gICAgICAgICAgICBzdGFydCA9IG47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgUm9vdFBhcnQncyBgaXNDb25uZWN0ZWRgLiBOb3RlIHRoYXQgdGhpcyBtZXRvZFxuICAgICAqIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbiBgUm9vdFBhcnRgcyAodGhlIGBDaGlsZFBhcnRgIHJldHVybmVkIGZyb20gYVxuICAgICAqIHRvcC1sZXZlbCBgcmVuZGVyKClgIGNhbGwpLiBJdCBoYXMgbm8gZWZmZWN0IG9uIG5vbi1yb290IENoaWxkUGFydHMuXG4gICAgICogQHBhcmFtIGlzQ29ubmVjdGVkIFdoZXRoZXIgdG8gc2V0XG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgc2V0Q29ubmVjdGVkKGlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHRoaXMuXyRwYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fX2lzQ29ubmVjdGVkID0gaXNDb25uZWN0ZWQ7XG4gICAgICAgICAgICAoX2EgPSB0aGlzLl8kbm90aWZ5Q29ubmVjdGlvbkNoYW5nZWQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMsIGlzQ29ubmVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChERVZfTU9ERSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJ0LnNldENvbm5lY3RlZCgpIG1heSBvbmx5IGJlIGNhbGxlZCBvbiBhICcgK1xuICAgICAgICAgICAgICAgICdSb290UGFydCByZXR1cm5lZCBmcm9tIHJlbmRlcigpLicpO1xuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgQXR0cmlidXRlUGFydCB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgbmFtZSwgc3RyaW5ncywgcGFyZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IEFUVFJJQlVURV9QQVJUO1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9IG5vdGhpbmc7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fJGRpc2Nvbm5lY3RhYmxlQ2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuXyRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGlmIChzdHJpbmdzLmxlbmd0aCA+IDIgfHwgc3RyaW5nc1swXSAhPT0gJycgfHwgc3RyaW5nc1sxXSAhPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9IG5ldyBBcnJheShzdHJpbmdzLmxlbmd0aCAtIDEpLmZpbGwobmV3IFN0cmluZygpKTtcbiAgICAgICAgICAgIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUgPSBub3RoaW5nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChFTkFCTEVfRVhUUkFfU0VDVVJJVFlfSE9PS1MpIHtcbiAgICAgICAgICAgIHRoaXMuX3Nhbml0aXplciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgdGFnTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC50YWdOYW1lO1xuICAgIH1cbiAgICAvLyBTZWUgY29tbWVudCBpbiBEaXNjb25uZWN0YWJsZSBpbnRlcmZhY2UgZm9yIHdoeSB0aGlzIGlzIGEgZ2V0dGVyXG4gICAgZ2V0IF8kaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kcGFyZW50Ll8kaXNDb25uZWN0ZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoaXMgcGFydCBieSByZXNvbHZpbmcgdGhlIHZhbHVlIGZyb20gcG9zc2libHkgbXVsdGlwbGVcbiAgICAgKiB2YWx1ZXMgYW5kIHN0YXRpYyBzdHJpbmdzIGFuZCBjb21taXR0aW5nIGl0IHRvIHRoZSBET00uXG4gICAgICogSWYgdGhpcyBwYXJ0IGlzIHNpbmdsZS12YWx1ZWQsIGB0aGlzLl9zdHJpbmdzYCB3aWxsIGJlIHVuZGVmaW5lZCwgYW5kIHRoZVxuICAgICAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlIHZhbHVlIGFyZ3VtZW50LiBJZiB0aGlzIHBhcnQgaXNcbiAgICAgKiBtdWx0aS12YWx1ZSwgYHRoaXMuX3N0cmluZ3NgIHdpbGwgYmUgZGVmaW5lZCwgYW5kIHRoZSBtZXRob2QgaXMgY2FsbGVkXG4gICAgICogd2l0aCB0aGUgdmFsdWUgYXJyYXkgb2YgdGhlIHBhcnQncyBvd25pbmcgVGVtcGxhdGVJbnN0YW5jZSwgYW5kIGFuIG9mZnNldFxuICAgICAqIGludG8gdGhlIHZhbHVlIGFycmF5IGZyb20gd2hpY2ggdGhlIHZhbHVlcyBzaG91bGQgYmUgcmVhZC5cbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBvdmVybG9hZGVkIHRoaXMgd2F5IHRvIGVsaW1pbmF0ZSBzaG9ydC1saXZlZCBhcnJheSBzbGljZXNcbiAgICAgKiBvZiB0aGUgdGVtcGxhdGUgaW5zdGFuY2UgdmFsdWVzLCBhbmQgYWxsb3cgYSBmYXN0LXBhdGggZm9yIHNpbmdsZS12YWx1ZWRcbiAgICAgKiBwYXJ0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgcGFydCB2YWx1ZSwgb3IgYW4gYXJyYXkgb2YgdmFsdWVzIGZvciBtdWx0aS12YWx1ZWQgcGFydHNcbiAgICAgKiBAcGFyYW0gdmFsdWVJbmRleCB0aGUgaW5kZXggdG8gc3RhcnQgcmVhZGluZyB2YWx1ZXMgZnJvbS4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICogICBzaW5nbGUtdmFsdWVkIHBhcnRzXG4gICAgICogQHBhcmFtIG5vQ29tbWl0IGNhdXNlcyB0aGUgcGFydCB0byBub3QgY29tbWl0IGl0cyB2YWx1ZSB0byB0aGUgRE9NLiBVc2VkXG4gICAgICogICBpbiBoeWRyYXRpb24gdG8gcHJpbWUgYXR0cmlidXRlIHBhcnRzIHdpdGggdGhlaXIgZmlyc3QtcmVuZGVyZWQgdmFsdWUsXG4gICAgICogICBidXQgbm90IHNldCB0aGUgYXR0cmlidXRlLCBhbmQgaW4gU1NSIHRvIG5vLW9wIHRoZSBET00gb3BlcmF0aW9uIGFuZFxuICAgICAqICAgY2FwdHVyZSB0aGUgdmFsdWUgZm9yIHNlcmlhbGl6YXRpb24uXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfJHNldFZhbHVlKHZhbHVlLCBkaXJlY3RpdmVQYXJlbnQgPSB0aGlzLCB2YWx1ZUluZGV4LCBub0NvbW1pdCkge1xuICAgICAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5zdHJpbmdzO1xuICAgICAgICAvLyBXaGV0aGVyIGFueSBvZiB0aGUgdmFsdWVzIGhhcyBjaGFuZ2VkLCBmb3IgZGlydHktY2hlY2tpbmdcbiAgICAgICAgbGV0IGNoYW5nZSA9IGZhbHNlO1xuICAgICAgICBpZiAoc3RyaW5ncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBTaW5nbGUtdmFsdWUgYmluZGluZyBjYXNlXG4gICAgICAgICAgICB2YWx1ZSA9IHJlc29sdmVEaXJlY3RpdmUodGhpcywgdmFsdWUsIGRpcmVjdGl2ZVBhcmVudCwgMCk7XG4gICAgICAgICAgICBjaGFuZ2UgPVxuICAgICAgICAgICAgICAgICFpc1ByaW1pdGl2ZSh2YWx1ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlICE9PSB0aGlzLl8kY29tbWl0dGVkVmFsdWUgJiYgdmFsdWUgIT09IG5vQ2hhbmdlKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEludGVycG9sYXRpb24gY2FzZVxuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gdmFsdWU7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0cmluZ3NbMF07XG4gICAgICAgICAgICBsZXQgaSwgdjtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdHJpbmdzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHYgPSByZXNvbHZlRGlyZWN0aXZlKHRoaXMsIHZhbHVlc1t2YWx1ZUluZGV4ICsgaV0sIGRpcmVjdGl2ZVBhcmVudCwgaSk7XG4gICAgICAgICAgICAgICAgaWYgKHYgPT09IG5vQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyLXByb3ZpZGVkIHZhbHVlIGlzIGBub0NoYW5nZWAsIHVzZSB0aGUgcHJldmlvdXMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdiA9IHRoaXMuXyRjb21taXR0ZWRWYWx1ZVtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hhbmdlIHx8IChjaGFuZ2UgPSAhaXNQcmltaXRpdmUodikgfHwgdiAhPT0gdGhpcy5fJGNvbW1pdHRlZFZhbHVlW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAodiA9PT0gbm90aGluZykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5vdGhpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlICE9PSBub3RoaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICs9ICh2ICE9PSBudWxsICYmIHYgIT09IHZvaWQgMCA/IHYgOiAnJykgKyBzdHJpbmdzW2kgKyAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgYWx3YXlzIHJlY29yZCBlYWNoIHZhbHVlLCBldmVuIGlmIG9uZSBpcyBgbm90aGluZ2AsIGZvciBmdXR1cmVcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAgICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZVtpXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZSAmJiAhbm9Db21taXQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbW1pdFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2NvbW1pdFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbm90aGluZykge1xuICAgICAgICAgICAgd3JhcCh0aGlzLmVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKEVOQUJMRV9FWFRSQV9TRUNVUklUWV9IT09LUykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zYW5pdGl6ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zYW5pdGl6ZXIgPSBzYW5pdGl6ZXJGYWN0b3J5SW50ZXJuYWwodGhpcy5lbGVtZW50LCB0aGlzLm5hbWUsICdhdHRyaWJ1dGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9zYW5pdGl6ZXIodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCA/IHZhbHVlIDogJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd3JhcCh0aGlzLmVsZW1lbnQpLnNldEF0dHJpYnV0ZSh0aGlzLm5hbWUsICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwID8gdmFsdWUgOiAnJykpO1xuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgUHJvcGVydHlQYXJ0IGV4dGVuZHMgQXR0cmlidXRlUGFydCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudHlwZSA9IFBST1BFUlRZX1BBUlQ7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfY29tbWl0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKEVOQUJMRV9FWFRSQV9TRUNVUklUWV9IT09LUykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Nhbml0aXplciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2FuaXRpemVyID0gc2FuaXRpemVyRmFjdG9yeUludGVybmFsKHRoaXMuZWxlbWVudCwgdGhpcy5uYW1lLCAncHJvcGVydHknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fc2FuaXRpemVyKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICB0aGlzLmVsZW1lbnRbdGhpcy5uYW1lXSA9IHZhbHVlID09PSBub3RoaW5nID8gdW5kZWZpbmVkIDogdmFsdWU7XG4gICAgfVxufVxuY2xhc3MgQm9vbGVhbkF0dHJpYnV0ZVBhcnQgZXh0ZW5kcyBBdHRyaWJ1dGVQYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy50eXBlID0gQk9PTEVBTl9BVFRSSUJVVEVfUEFSVDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9jb21taXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgIT09IG5vdGhpbmcpIHtcbiAgICAgICAgICAgIHdyYXAodGhpcy5lbGVtZW50KS5zZXRBdHRyaWJ1dGUodGhpcy5uYW1lLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3cmFwKHRoaXMuZWxlbWVudCkucmVtb3ZlQXR0cmlidXRlKHRoaXMubmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBFdmVudFBhcnQgZXh0ZW5kcyBBdHRyaWJ1dGVQYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBuYW1lLCBzdHJpbmdzLCBwYXJlbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgbmFtZSwgc3RyaW5ncywgcGFyZW50LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy50eXBlID0gRVZFTlRfUEFSVDtcbiAgICAgICAgaWYgKERFVl9NT0RFICYmIHRoaXMuc3RyaW5ncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgXFxgPCR7ZWxlbWVudC5sb2NhbE5hbWV9PlxcYCBoYXMgYSBcXGBAJHtuYW1lfT0uLi5cXGAgbGlzdGVuZXIgd2l0aCBgICtcbiAgICAgICAgICAgICAgICAnaW52YWxpZCBjb250ZW50LiBFdmVudCBsaXN0ZW5lcnMgaW4gdGVtcGxhdGVzIG11c3QgaGF2ZSBleGFjdGx5ICcgK1xuICAgICAgICAgICAgICAgICdvbmUgZXhwcmVzc2lvbiBhbmQgbm8gc3Vycm91bmRpbmcgdGV4dC4nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBFdmVudFBhcnQgZG9lcyBub3QgdXNlIHRoZSBiYXNlIF8kc2V0VmFsdWUvX3Jlc29sdmVWYWx1ZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIHNpbmNlIHRoZSBkaXJ0eSBjaGVja2luZyBpcyBtb3JlIGNvbXBsZXhcbiAgICAvKiogQGludGVybmFsICovXG4gICAgXyRzZXRWYWx1ZShuZXdMaXN0ZW5lciwgZGlyZWN0aXZlUGFyZW50ID0gdGhpcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIG5ld0xpc3RlbmVyID1cbiAgICAgICAgICAgIChfYSA9IHJlc29sdmVEaXJlY3RpdmUodGhpcywgbmV3TGlzdGVuZXIsIGRpcmVjdGl2ZVBhcmVudCwgMCkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5vdGhpbmc7XG4gICAgICAgIGlmIChuZXdMaXN0ZW5lciA9PT0gbm9DaGFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMaXN0ZW5lciA9IHRoaXMuXyRjb21taXR0ZWRWYWx1ZTtcbiAgICAgICAgLy8gSWYgdGhlIG5ldyB2YWx1ZSBpcyBub3RoaW5nIG9yIGFueSBvcHRpb25zIGNoYW5nZSB3ZSBoYXZlIHRvIHJlbW92ZSB0aGVcbiAgICAgICAgLy8gcGFydCBhcyBhIGxpc3RlbmVyLlxuICAgICAgICBjb25zdCBzaG91bGRSZW1vdmVMaXN0ZW5lciA9IChuZXdMaXN0ZW5lciA9PT0gbm90aGluZyAmJiBvbGRMaXN0ZW5lciAhPT0gbm90aGluZykgfHxcbiAgICAgICAgICAgIG5ld0xpc3RlbmVyLmNhcHR1cmUgIT09XG4gICAgICAgICAgICAgICAgb2xkTGlzdGVuZXIuY2FwdHVyZSB8fFxuICAgICAgICAgICAgbmV3TGlzdGVuZXIub25jZSAhPT1cbiAgICAgICAgICAgICAgICBvbGRMaXN0ZW5lci5vbmNlIHx8XG4gICAgICAgICAgICBuZXdMaXN0ZW5lci5wYXNzaXZlICE9PVxuICAgICAgICAgICAgICAgIG9sZExpc3RlbmVyLnBhc3NpdmU7XG4gICAgICAgIC8vIElmIHRoZSBuZXcgdmFsdWUgaXMgbm90IG5vdGhpbmcgYW5kIHdlIHJlbW92ZWQgdGhlIGxpc3RlbmVyLCB3ZSBoYXZlXG4gICAgICAgIC8vIHRvIGFkZCB0aGUgcGFydCBhcyBhIGxpc3RlbmVyLlxuICAgICAgICBjb25zdCBzaG91bGRBZGRMaXN0ZW5lciA9IG5ld0xpc3RlbmVyICE9PSBub3RoaW5nICYmXG4gICAgICAgICAgICAob2xkTGlzdGVuZXIgPT09IG5vdGhpbmcgfHwgc2hvdWxkUmVtb3ZlTGlzdGVuZXIpO1xuICAgICAgICBpZiAoc2hvdWxkUmVtb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcywgb2xkTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG91bGRBZGRMaXN0ZW5lcikge1xuICAgICAgICAgICAgLy8gQmV3YXJlOiBJRTExIGFuZCBDaHJvbWUgNDEgZG9uJ3QgbGlrZSB1c2luZyB0aGUgbGlzdGVuZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBvcHRpb25zIG9iamVjdC4gRmlndXJlIG91dCBob3cgdG8gZGVhbCB3LyB0aGlzIGluIElFMTEgLSBtYXliZVxuICAgICAgICAgICAgLy8gcGF0Y2ggYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcywgbmV3TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9IG5ld0xpc3RlbmVyO1xuICAgIH1cbiAgICBoYW5kbGVFdmVudChldmVudCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuXyRjb21taXR0ZWRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5fJGNvbW1pdHRlZFZhbHVlLmNhbGwoKF9iID0gKF9hID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaG9zdCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdGhpcy5lbGVtZW50LCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl8kY29tbWl0dGVkVmFsdWUuaGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgRWxlbWVudFBhcnQge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnR5cGUgPSBFTEVNRU5UX1BBUlQ7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5fJGRpc2Nvbm5lY3RhYmxlQ2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuXyRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIC8vIFNlZSBjb21tZW50IGluIERpc2Nvbm5lY3RhYmxlIGludGVyZmFjZSBmb3Igd2h5IHRoaXMgaXMgYSBnZXR0ZXJcbiAgICBnZXQgXyRpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuXyRwYXJlbnQuXyRpc0Nvbm5lY3RlZDtcbiAgICB9XG4gICAgXyRzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlRGlyZWN0aXZlKHRoaXMsIHZhbHVlKTtcbiAgICB9XG59XG4vKipcbiAqIEVORCBVU0VSUyBTSE9VTEQgTk9UIFJFTFkgT04gVEhJUyBPQkpFQ1QuXG4gKlxuICogUHJpdmF0ZSBleHBvcnRzIGZvciB1c2UgYnkgb3RoZXIgTGl0IHBhY2thZ2VzLCBub3QgaW50ZW5kZWQgZm9yIHVzZSBieVxuICogZXh0ZXJuYWwgdXNlcnMuXG4gKlxuICogV2UgY3VycmVudGx5IGRvIG5vdCBtYWtlIGEgbWFuZ2xlZCByb2xsdXAgYnVpbGQgb2YgdGhlIGxpdC1zc3IgY29kZS4gSW4gb3JkZXJcbiAqIHRvIGtlZXAgYSBudW1iZXIgb2YgKG90aGVyd2lzZSBwcml2YXRlKSB0b3AtbGV2ZWwgZXhwb3J0cyAgbWFuZ2xlZCBpbiB0aGVcbiAqIGNsaWVudCBzaWRlIGNvZGUsIHdlIGV4cG9ydCBhIF8kTEggb2JqZWN0IGNvbnRhaW5pbmcgdGhvc2UgbWVtYmVycyAob3JcbiAqIGhlbHBlciBtZXRob2RzIGZvciBhY2Nlc3NpbmcgcHJpdmF0ZSBmaWVsZHMgb2YgdGhvc2UgbWVtYmVycyksIGFuZCB0aGVuXG4gKiByZS1leHBvcnQgdGhlbSBmb3IgdXNlIGluIGxpdC1zc3IuIFRoaXMga2VlcHMgbGl0LXNzciBhZ25vc3RpYyB0byB3aGV0aGVyIHRoZVxuICogY2xpZW50LXNpZGUgY29kZSBpcyBiZWluZyB1c2VkIGluIGBkZXZgIG1vZGUgb3IgYHByb2RgIG1vZGUuXG4gKlxuICogVGhpcyBoYXMgYSB1bmlxdWUgbmFtZSwgdG8gZGlzYW1iaWd1YXRlIGl0IGZyb20gcHJpdmF0ZSBleHBvcnRzIGluXG4gKiBsaXQtZWxlbWVudCwgd2hpY2ggcmUtZXhwb3J0cyBhbGwgb2YgbGl0LWh0bWwuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IF8kTEggPSB7XG4gICAgLy8gVXNlZCBpbiBsaXQtc3NyXG4gICAgX2JvdW5kQXR0cmlidXRlU3VmZml4OiBib3VuZEF0dHJpYnV0ZVN1ZmZpeCxcbiAgICBfbWFya2VyOiBtYXJrZXIsXG4gICAgX21hcmtlck1hdGNoOiBtYXJrZXJNYXRjaCxcbiAgICBfSFRNTF9SRVNVTFQ6IEhUTUxfUkVTVUxULFxuICAgIF9nZXRUZW1wbGF0ZUh0bWw6IGdldFRlbXBsYXRlSHRtbCxcbiAgICAvLyBVc2VkIGluIGh5ZHJhdGVcbiAgICBfVGVtcGxhdGVJbnN0YW5jZTogVGVtcGxhdGVJbnN0YW5jZSxcbiAgICBfaXNJdGVyYWJsZTogaXNJdGVyYWJsZSxcbiAgICBfcmVzb2x2ZURpcmVjdGl2ZTogcmVzb2x2ZURpcmVjdGl2ZSxcbiAgICAvLyBVc2VkIGluIHRlc3RzIGFuZCBwcml2YXRlLXNzci1zdXBwb3J0XG4gICAgX0NoaWxkUGFydDogQ2hpbGRQYXJ0LFxuICAgIF9BdHRyaWJ1dGVQYXJ0OiBBdHRyaWJ1dGVQYXJ0LFxuICAgIF9Cb29sZWFuQXR0cmlidXRlUGFydDogQm9vbGVhbkF0dHJpYnV0ZVBhcnQsXG4gICAgX0V2ZW50UGFydDogRXZlbnRQYXJ0LFxuICAgIF9Qcm9wZXJ0eVBhcnQ6IFByb3BlcnR5UGFydCxcbiAgICBfRWxlbWVudFBhcnQ6IEVsZW1lbnRQYXJ0LFxufTtcbi8vIEFwcGx5IHBvbHlmaWxscyBpZiBhdmFpbGFibGVcbmNvbnN0IHBvbHlmaWxsU3VwcG9ydCA9IERFVl9NT0RFXG4gICAgPyB3aW5kb3cubGl0SHRtbFBvbHlmaWxsU3VwcG9ydERldk1vZGVcbiAgICA6IHdpbmRvdy5saXRIdG1sUG9seWZpbGxTdXBwb3J0O1xucG9seWZpbGxTdXBwb3J0ID09PSBudWxsIHx8IHBvbHlmaWxsU3VwcG9ydCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcG9seWZpbGxTdXBwb3J0KFRlbXBsYXRlLCBDaGlsZFBhcnQpO1xuLy8gSU1QT1JUQU5UOiBkbyBub3QgY2hhbmdlIHRoZSBwcm9wZXJ0eSBuYW1lIG9yIHRoZSBhc3NpZ25tZW50IGV4cHJlc3Npb24uXG4vLyBUaGlzIGxpbmUgd2lsbCBiZSB1c2VkIGluIHJlZ2V4ZXMgdG8gc2VhcmNoIGZvciBsaXQtaHRtbCB1c2FnZS5cbigoX2QgPSBnbG9iYWxUaGlzLmxpdEh0bWxWZXJzaW9ucykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogKGdsb2JhbFRoaXMubGl0SHRtbFZlcnNpb25zID0gW10pKS5wdXNoKCcyLjAuMScpO1xuaWYgKERFVl9NT0RFICYmIGdsb2JhbFRoaXMubGl0SHRtbFZlcnNpb25zLmxlbmd0aCA+IDEpIHtcbiAgICBpc3N1ZVdhcm5pbmcoJ211bHRpcGxlLXZlcnNpb25zJywgYE11bHRpcGxlIHZlcnNpb25zIG9mIExpdCBsb2FkZWQuIGAgK1xuICAgICAgICBgTG9hZGluZyBtdWx0aXBsZSB2ZXJzaW9ucyBpcyBub3QgcmVjb21tZW5kZWQuYCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXQtaHRtbC5qcy5tYXAiLCJleHBvcnQqZnJvbVwibGl0LWh0bWwvZGlyZWN0aXZlcy9jbGFzcy1tYXAuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsYXNzLW1hcC5qcy5tYXBcbiIsImV4cG9ydCpmcm9tXCJsaXQtaHRtbC9kaXJlY3RpdmVzL2lmLWRlZmluZWQuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlmLWRlZmluZWQuanMubWFwXG4iLCJleHBvcnQqZnJvbVwibGl0LWh0bWwvZGlyZWN0aXZlcy9zdHlsZS1tYXAuanNcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlLW1hcC5qcy5tYXBcbiIsImltcG9ydFwiQGxpdC9yZWFjdGl2ZS1lbGVtZW50XCI7aW1wb3J0XCJsaXQtaHRtbFwiO2V4cG9ydCpmcm9tXCJsaXQtZWxlbWVudC9saXQtZWxlbWVudC5qc1wiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIFVDRCBUaGVtZSBDdXN0b20gRWxlbWVudHNcbmltcG9ydCAnQHVjZC1saWIvdGhlbWUtZWxlbWVudHMvYnJhbmQvdWNkLXRoZW1lLWhlYWRlci91Y2QtdGhlbWUtaGVhZGVyLmpzJztcbmltcG9ydCAnQHVjZC1saWIvdGhlbWUtZWxlbWVudHMvYnJhbmQvdWNkLXRoZW1lLXByaW1hcnktbmF2L3VjZC10aGVtZS1wcmltYXJ5LW5hdi5qcyc7XG4vL2ltcG9ydCAnQHVjZC1saWIvdGhlbWUtZWxlbWVudHMvYnJhbmQvdWNkLXRoZW1lLXNlYXJjaC1wb3B1cC91Y2QtdGhlbWUtc2VhcmNoLXBvcHVwLmpzJztcbi8vIGltcG9ydCAnQHVjZC1saWIvdGhlbWUtZWxlbWVudHMvYnJhbmQvdWNkLXRoZW1lLXF1aWNrLWxpbmtzL3VjZC10aGVtZS1xdWljay1saW5rcy5qcyc7XG4vLyBpbXBvcnQgJ0B1Y2QtbGliL3RoZW1lLWVsZW1lbnRzL3VjZGxpYi91Y2RsaWItYnJhbmRpbmctYmFyL3VjZGxpYi1icmFuZGluZy1iYXIuanMnO1xuLy8gaW1wb3J0ICdAdWNkLWxpYi90aGVtZS1lbGVtZW50cy9icmFuZC91Y2QtdGhlbWUtc3VibmF2L3VjZC10aGVtZS1zdWJuYXYuanMnO1xuXG4vLyBDdXN0b20gTGliZ3VpZGVzIEN1c3RvbSBFbGVtZW50c1xuLy8gaW1wb3J0ICcuL2pzL2VsZW1lbnRzL3VjZGxpYi1sZy1zaWRlbmF2L3VjZGxpYi1sZy1zaWRlbmF2LmpzJztcblxuLy8gT3RoZXIgQ3VzdG9tIEpTXG4vLyBpbXBvcnQgJy4vanMvYXBwL21haW4uanMnO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
