var Mad = (function($){
    'use strict';

    var App = {},
        DOMDfd = $.Deferred(),
        $body = $('body'),
        $doc = $(document);

    App.modules = {};
    App.helpers = {};
    App._localCache = {};

    App.ISTOUCH = Modernizr.touchevents;
    App.ANIMATIONDURATION = 500;
    App.ANIMATIONEASING = 'easeOutQuart';
    App.ANIMATIONSUPPORTED = Modernizr.cssanimations;
    App.ANIMATIONEND = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    App.RTL = getComputedStyle(document.body).direction === 'rtl';
    App.ISLEGACYBROWSER = !Modernizr.flexbox;
    App.ISFIREFOX = window.navigator.userAgent.indexOf('Firefox') != -1;

    App.afterDOMReady = function() {
        var self = this;

        if (this.ISFIREFOX) window.onunload = function(){};

        // Show message to update legacy browser
        if(this.ISLEGACYBROWSER) {
            if(this.helpers.showCriticalFullScreenMessage) {
                this.helpers.showCriticalFullScreenMessage({
                    before: '<i class="icon icon-sad"></i>',
                    content: 'Your browser does not support some technologies this site use. Please update your browser or visit the site using more modern browser.'
                });
            }

            // Anyway preloader must be used
            if(this.modules.preloader) this.modules.preloader();

            return;
        }

        if(this.modules.backToTop) {
			this.modules.backToTop({
				easing: 'easeOutQuint',
				speed: 550,
				cssPrefix: 'mad-'
			});
        }

        if(this.helpers.toggledFields) this.helpers.toggledFields();

        if(window.MadEventsCalendar) window.MadEventsCalendar.init($('.mad-events-calendar'), {
            isTouch: self.ISTOUCH,
            cssPrefix: 'mad-',
            breakpoint: 768
        });

        if(window.MadSidebarHidden) {
            new window.MadSidebarHidden({
                cssPrefix: 'mad-'
            });
        }

        if(window.MadStickyHeaderSection) {
            var $stickySections = $('[class*="mad-header-section--sticky"]:not([class*="mad-header-section--sticky-hidden"])');

            if($stickySections.length) {
                new window.MadStickyHeaderSection($stickySections, {
                    animationEasing: self.ANIMATIONEASING,
                    animationDuration: self.ANIMATIONDURATION
                });
            }
        }

        if(this.modules.dropdown) this.modules.dropdown.init();

        if(this.modules.closeBtn) this.modules.closeBtn();

        if(this.modules.hiddenSections) this.modules.hiddenSections();

        if(this.modules.viewTypes) this.modules.viewTypes();

        if(this.helpers.calendarWidget) this.helpers.calendarWidget();

        /* ------------------------------------------------
			Range Slider
		------------------------------------------------ */

            var $rangeSliders = $('.mad-range-slider');

            if ($.fn.slider && $rangeSliders.length) {
                $rangeSliders.slider({
                    range: "min"
                });
            }

            var $rangeSliders2 = $('.mad-range-slider.range-scale.range-2');

            if ($.fn.slider && $rangeSliders2.length) {
                $rangeSliders2.slider({
                    min: 0,
                    max: 7,
                    value: 3,
                    slide: function (event, ui) {
                        var $range = $(ui.handle).closest('.mad-range-slider'),
                            $input = $range.siblings('.mad-range-slider-input');

                        if ($range.length && $input.length) {
                            $input.attr('value', + $range.slider('values', 1) + ' - ' + '$' + $range.slider('values', 0))
                                .val('$' + $range.slider('values', 1) + ',999,000');
                        }
                    }
                });
            }

            var $rangeSliders3 = $('.mad-range-slider.range-scale.range-3');

            if ($.fn.slider && $rangeSliders3.length) {
                $rangeSliders3.slider({
                    min: 100,
                    max: 600,
                    value: 300,
                    slide: function (event, ui) {
                        var $range = $(ui.handle).closest('.mad-range-slider'),
                            $input = $range.siblings('.mad-range-slider-input');

                        if ($range.length && $input.length) {
                            $input.attr('value', + $range.slider('values', 1) + ' - ' + '$' + $range.slider('values', 0))
                                .val('$' + $range.slider('values', 1) + ',880');
                        }
                    }
                });
            }

             var $rangeSliders4 = $('.mad-range-slider.range-scale.range-4');

            if ($.fn.slider && $rangeSliders4.length) {
                $rangeSliders4.slider({
                    min: 0,
                    max: 6,
                    value: 4,
                    slide: function (event, ui) {
                        var $range = $(ui.handle).closest('.mad-range-slider'),
                            $input = $range.siblings('.mad-range-slider-input');

                        if ($range.length && $input.length) {
                            $input.attr('value', + $range.slider('values', 1) + ' - ' + 'km' + $range.slider('values', 0))
                                .val($range.slider('values', 1) + '%');
                        }
                    }
                });
            }

        /* ------------------------------------------------
			End of Range Slider
		------------------------------------------------ */

        /* ------------------------------------------------
			Twitter
		------------------------------------------------ */

            var $twitterFeed = $('.mad-twitter-feed');

            if ($twitterFeed.length && $.fn.tweetie) {
                $twitterFeed.tweetie({
                    url: 'http://velikorodnov.com/html/ewent/vendors/tweetie/api/php/server.php',
                    type: 'timeline',
                    template: '<li>\
                            <div class="mad-tweet">\
                                <div class="mad-tweet-content">{{tweet.text}}</div>\
                                \
                            </div>\
                        </li>',
                    dateFormat: '%B %d, %Y',
                    params: {
                        count: 2,
                        screen_name: null,
                        list_id: null,
                        slug: null,
                        q: null,
                        exclude_replies: false,
                        include_rts: false
                    }
                })
            }

        /* ------------------------------------------------
			End of Twitter
		------------------------------------------------ */


        /* ------------------------------------------------
			Custom Select
		------------------------------------------------ */

            var $selects = $('.mad-custom-select');

            if($selects.length){
                $selects.MadCustomSelect({
                    cssPrefix: 'mad-'
                });
            }

		/* ------------------------------------------------
			End of Custom Select
		------------------------------------------------ */

        /* ------------------------------------------------
            Newsletter Form
        ------------------------------------------------ */

            var newsletterForm = $('.mad-newsletter-form');

            if(newsletterForm.length && window.MadNewsletter) {
                window.MadNewsletter(newsletterForm);
            }

        /* ------------------------------------------------
            End of Newsletter Form
        ------------------------------------------------ */

        /* ------------------------------------------------
            Contact Form
        ------------------------------------------------ */

            var contactForm = $('.mad-contact-form');

            if(contactForm.length && window.MadContactForm) {
                MadContactForm.init(contactForm);
            }

        /* ------------------------------------------------
            End of Contact Form
        ------------------------------------------------ */

        /* ----------------------------------------
            Fancybox
         ---------------------------------------- */

            if($.fancybox && $.fancybox.defaults) {
                $.extend($.fancybox.defaults, {
                    transitionEffect: "slide",
                    transitionDuration: self.ANIMATIONDURATION,
                    animationDuration: self.ANIMATIONDURATION
                });
            }

        /* ----------------------------------------
            End of Fancybox
         ---------------------------------------- */

        if(this.modules.arcticModals) this.modules.arcticModals.init( $('[data-arctic-modal]') );

        /* ------------------------------------------------
            Navigation
		------------------------------------------------ */

        var $nav = $('.mad-navigation'),
            $verticalNav = $('.mad-navigation-vertical');

        if($nav.length){
            $nav.MonkeysanNav({
                cssPrefix: 'mad-',
                mobileBreakpoint: 769
            });
        }

        if($verticalNav.length){
            $verticalNav.MonkeysanNav({
                cssPrefix: 'mad-',
                mobileBreakpoint: 10000
            });
        }

        $('.mad-navigation > li > a').on('click', function (e) {

            e.preventDefault;

        })

        /* ------------------------------------------------
            End of Navigation
		------------------------------------------------ */

        /* ------------------------------------------------
            Countdown
		------------------------------------------------ */

			var $countdown = $('.mad-countdown');

			if($countdown.length){
				$countdown.each(function(){
					var $this = $(this),
						endDate = $this.data(),
						until = new Date(
							endDate.year,
							endDate.month || 0,
							endDate.day || 1,
							endDate.hours || 0,
							endDate.minutes || 0,
							endDate.seconds || 0
						);

					$this.countdown({
						until : until,
						padZeroes: true,
						format : 'dHMS',
						labels : ['Years', 'Month', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
						labels1 : ['Years', 'Month', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds']
					});
				});
			}

		/* ------------------------------------------------
            End countdown
		------------------------------------------------ */

        /* ------------------------------------------------
            Instagram
		------------------------------------------------ */

            if (window.InstafeedWrapper) {
                var instafeeds = document.querySelectorAll('.mad-instafeed > .mad-grid'),
                    galleryInstafeeds = document.querySelectorAll('.mad-instafeed-gallery');

                InstafeedWrapper.setUsersSecureOptions({
                    'customer': {
                        userId: 8253949243,
                        accessToken: '8253949243.1677ed0.92a1c427f7274134a812ee9b13038e10',
                        clientId: 'a17ccf850aae43a0805c00ac4792a3b9'
                    }
                });

                if (instafeeds) {
                    InstafeedWrapper.init(instafeeds, {
                        resolution: 'standard_resolution',
                        template: '<div class="mad-grid-item"><div class="mad-square-image" data-bg-image-src="{{image}}"><a rel="instagram" href="{{link}}" target="_blank" title="{{caption}}"></a></div></div>',
                        after: function () {
                            var $target = $('#' + this.options.target),
                                size = $target.data('images-y-size'),
                                posX = $target.data('images-pos-x') || 'center',
                                posY = $target.data('images-pos-y') || 'center',
                                $items = $target.find('.mad-square-image');

                            if ($items.length) {

                                $items.addClass('mad-square-image--position-' + posX + '-' + posY);

                                if (size) $items.addClass('mad-square-image--size-' + size);
                            }

                            self.helpers.dynamicBgImage($target.find('[data-bg-image-src]'));
                        }
                    });
                }
            };

        /* ------------------------------------------------
            End of Instagram
		------------------------------------------------ */

        /* ------------------------------------------------
            Revolution slider
		------------------------------------------------ */

            var $revSlider1 = $('#rev-slider-1'),
                $revSlider2 = $('#rev-slider-2'),
                revApi1,
                revApi2;

            if($revSlider1.length && $.fn.revolution) {
                revApi1 = $revSlider1.show().revolution({
                    dottedOverlay: 'mad',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    gridheight: [1080, 1080, 980, 980],
                    gridwidth: [1580, 1024, 1024, 520],
                    responsiveLevels: [1440, 1024, 813, 520],
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: true,
                            style: 'mad',
                            hide_onleave: false,
                            h_align: 'left',
                            v_align: 'bottom',
                            direction: 'horisontal',
                            h_offset: 180,
                            v_offset: 64                        
                        }
                    }
                });
            }

            if ($revSlider2.length && $.fn.revolution) {
                revApi2 = $revSlider2.show().revolution({
                    dottedOverlay: 'mad',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    gridheight: [1080, 1024, 1024, 780],
                    gridwidth: [1580, 1024, 1024, 680],
                    responsiveLevels: [1440, 1024, 813, 680],
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: true,
                            style: 'mad',
                            hide_onleave: false,
                            h_align: 'center',
                            v_align: 'bottom',
                            direction: 'horisontal',
                            h_offset: 0,
                            v_offset: 64
                        }
                    }
                });
            }
        
            if(this.helpers.revArrowsOutside) this.helpers.revArrowsOutside();

            if($('#rev-slider-1').length) {
                var api = revApi1;

                /* no need to edit below */
                var divider = ' / ',
                    totalSlides,
                    numberText;

                api.one('revolution.slide.onloaded', function () {

                    totalSlides = api.revmaxslide();
                    numberText = api.find('.slide-status-numbers').text('0' + '1' + divider + '0' + totalSlides);

                    api.on('revolution.slide.onbeforeswap', function (e, data) {

                        numberText.text('0' + (data.nextslide.index() + 1) + divider + '0' + totalSlides);

                    });

                });
            }

        /* ------------------------------------------------
            End of Revolution slider
        ------------------------------------------------ */
        
        /* ------------------------------------------------
            Accordions & Toggles
		------------------------------------------------ */

            var $accordions = $('.mad-panels--accordion'),
                $toggles = $('.mad-panels--toggles');

            if($accordions.length) {
                $accordions.MonkeysanAccordion({
                    easing: self.ANIMATIONEASING,
					speed: self.ANIMATIONDURATION,
					cssPrefix: 'mad-'
                });
            }

            if($toggles.length) {
                $toggles.MonkeysanAccordion({
                    easing: self.ANIMATIONEASING,
					speed: self.ANIMATIONDURATION,
                    toggle: true,
					cssPrefix: 'mad-'
                });
            }

        /* ------------------------------------------------
            End of Accordions & Toggles
		------------------------------------------------ */

            /* ----------------------------------------
                Alert Boxes
            ---------------------------------------- */

                var $alertBoxes = $('.mad-alert-box');

                if($alertBoxes.filter('.mad-alert-box--success').length) {
                    MadAlertBox.init($alertBoxes.filter('.mad-alert-box--success'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'mad-',
                        easing: self.ANIMATIONEASING,
                        type: 'success'
                    });
                }

                if($alertBoxes.filter('.mad-alert-box--warning').length) {
                    MadAlertBox.init($alertBoxes.filter('.mad-alert-box--warning'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'mad-',
                        easing: self.ANIMATIONEASING,
                        type: 'warning'
                    });
                }

                if($alertBoxes.filter('.mad-alert-box--info').length) {
                    MadAlertBox.init($alertBoxes.filter('.mad-alert-box--info'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'mad-',
                        easing: self.ANIMATIONEASING,
                        type: 'info'
                    });
                }

                if($alertBoxes.filter('.mad-alert-box--error').length) {
                    MadAlertBox.init($alertBoxes.filter('.mad-alert-box--error'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'mad-',
                        easing: self.ANIMATIONEASING,
                        type: 'error'
                    });
                }

            /* ----------------------------------------
                End of Alert Boxes
            ---------------------------------------- */

            /* ----------------------------------------
                Tooltips
            ---------------------------------------- */

                if( $('[data-tooltip]').length && $.fn.MonkeysanTooltip ) {
                    $('[data-tooltip]').MonkeysanTooltip({
                        animationIn: 'fadeInDown',
                        animationOut: 'fadeOutUp',
                        tooltipPosition: 'top',
                        jQueryAnimationEasing: self.ANIMATIONEASING,
                        jQueryAnimationDuration: self.ANIMATIONDURATION,
                        skin: 'mad'
                    });
                }

            /* ----------------------------------------
                End of Tooltips
            ---------------------------------------- */

            /* ----------------------------------------
                IsotopeWrapper
            ---------------------------------------- */

                $(window).on('load resize', function () {

                    var $isotope = $('.mad-grid--isotope:not(.mad-sponsors)');

                    if ($isotope.length && window.MadIsotopeWrapper) {
                        $isotope.each(function (index, container) {
                            var $container = $(container),
                                $stretchedSection = $container.closest('.mad-section--stretched-content, .mad-section--stretched-content-no-px');

                            if ($stretchedSection.length) {
                                $stretchedSection.on('stretched.mad.Section', function () {
                                    if ($container.data('IsotopeWrapper')) return;

                                    MadIsotopeWrapper.init($container, {
                                        itemSelector: '.mad-grid-item',
                                        transitionDuration: self.ANIMATIONDURATION
                                    });
                                });
                            }
                            else {
                                MadIsotopeWrapper.init($container, {
                                    itemSelector: '.mad-grid-item',
                                    transitionDuration: self.ANIMATIONDURATION
                                });
                            }
                        });
                    }

                    if ($isotope.length && window.MadIsotopeWrapper) {
                        $isotope.each(function (index, container) {
                            var $container = $(container),
                                $stretchedSection = $container.closest('.mad-section--stretched-content, .mad-section--stretched-content-no-px');

                            if ($stretchedSection.length) {
                                $stretchedSection.on('stretched.mad.Section', function () {
                                    if ($container.data('IsotopeWrapper')) return;

                                    MadIsotopeWrapper.init($container, {
                                        itemSelector: '.mad-grid-item',
                                        transitionDuration: self.ANIMATIONDURATION
                                    });
                                });
                            }
                            else {
                                MadIsotopeWrapper.init($container, {
                                    itemSelector: '.mad-grid-item',
                                    transitionDuration: self.ANIMATIONDURATION
                                });
                            }
                        });
                    }

                });
                

            /* ----------------------------------------
                End of IsotopeWrapper
            ---------------------------------------- */

            /* ----------------------------------------
                Dynamic background image
            ---------------------------------------- */

                var $backgrounds = $('[data-bg-image-src]:not([class*="mad-colorizer--scheme-"])');

                if($backgrounds.length && this.helpers.dynamicBgImage) {
                    this.helpers.dynamicBgImage($backgrounds);
                }

            /* ----------------------------------------
                End of Dynamic background image
            ---------------------------------------- */

            /* ----------------------------------------
                Owl Carousel
            ---------------------------------------- */

                // owl carousel adaptive
                if($('.owl-carousel').length) this.helpers.owlAdaptive();

                var $simpleSlideshow = $('.mad-simple-slideshow'),
                    $testimonialsCarousel = $('.mad-testimonials-inner.owl-carousel');
                    
                if($simpleSlideshow.length && $.fn.owlCarousel) {
                    $simpleSlideshow.each(function(index, carousel){
                        var $carousel = $(carousel),
                            $stretchedSection = $carousel.closest('.mad-section--stretched-content, .mad-section--stretched-content-no-px');

                        if($stretchedSection.length) {
                            $stretchedSection.each(function(scindex, scelement){
                                $(scelement).on('stretched.mad.Section', function() {
                                    $carousel.owlCarousel(self.helpers.owlSettings({
                                        margin: 1,
                                        loop: true,
                                        autoplay: $carousel.hasClass('mad-simple-slideshow--autoplay')
                                    }));
                                });
                            });
                        }
                        else {

                            $carousel.owlCarousel(self.helpers.owlSettings({
                                margin: 1,
                                animateOut: 'fadeOut',
                                loop: true,
                                autoplay: $carousel.hasClass('mad-simple-slideshow--autoplay')
                            }));
                        }
                    });
                }

                if($testimonialsCarousel.length && $.fn.owlCarousel) {
                    $testimonialsCarousel.each(function(index, carousel) {
                        var $carousel = $(carousel),
                            $stretchedSection = $carousel.closest('.mad-section--stretched-content, .mad-section--stretched-content-no-px');

                        if($stretchedSection.length) {
                            $stretchedSection.on('stretched.mad.Section', function() {
                                if($carousel.data('owl.carousel')) return;
                                $carousel.owlCarousel(self.helpers.owlSettings({
                                    margin: 0,
                                    loop: true,
                                    nav: true,
                                    dots: true
                                }));
                            });
                        }
                        else {
                            $carousel.owlCarousel(self.helpers.owlSettings({
                                margin: 0,
                                loop: true,
                                nav: true,
                                dots: true
                            }));
                        }
                    });
                }

                this.helpers.gridOwl.extendConfigFor('.with-dots', {
                    nav: true,
                    dots: true,
                    startPosition: 1,
                    loop: true
                });

                this.helpers.gridOwl.extendConfigFor('.mad-testimonials', {
                    nav: true,
                    dots: true,
                    startPosition: 1,
                    autoplay: true,
                    loop: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 1
                        },
                        780: {
                            items: 1
                        },
                        1200: {
                            items: 2
                        },
                        1300: {
                            items: 2
                        }
                    },
                });

                this.helpers.gridOwl.extendConfigFor('.mad-testimonials .mad-grid--cols-1', {
                    nav: true,
                    dots: true,
                    startPosition: 1,
                    autoplay: true,
                    loop: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 1
                        },
                        780: {
                            items: 1
                        },
                        1200: {
                            items: 1
                        },
                        1300: {
                            items: 1
                        }
                    },
                });

                this.helpers.gridOwl.extendConfigFor('.mad-products.owl-carousel', {
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 1
                        },
                        780: {
                            items: 1
                        },
                        1200: {
                            items: 2
                        },
                        1380: {
                            items: 4
                        }
                    }
                });

                this.helpers.gridOwl.extendConfigFor('.mad-tabs--tour-sections .mad-products.owl-carousel', {
                    nav: false,
                    dots: false,
                    startPosition: 1,
                    autoplay: true,
                    loop: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 2
                        },
                        780: {
                            items: 1
                        },
                        1200: {
                            items: 2
                        },
                        1300: {
                            items: 2
                        }
                    }
                });

                // Initialization owl carousels placed in the stretched sections
                $('[class*="mad-section--stretched-content"]').on('stretched.mad.Section', function(event, $section) {
                    var $gridOwlCarousels = $section.find('.mad-grid.owl-carousel'),
                        $simpleThumbs = $section.find('.mad-simple-slideshow-thumbs.owl-carousel');

                    if($gridOwlCarousels.length) self.helpers.gridOwl.add($gridOwlCarousels);

                    if($simpleThumbs.length) {
                        $simpleThumbs.owlCarousel(self.helpers.owlSettings({
                            responsive: {
                                0: {
                                    items: 2
                                },
                                380: {
                                    items: 3
                                },
                                992: {
                                    items: 4
                                },
                                1200: {
                                    items: 6
                                }
                            },
                            margin: 10,
                            loop: false
                        }));
                    }
                });

                // Initialization owl carousels placed in the normal sections
                var $simpleThumbs = $('.mad-simple-slideshow-thumbs.owl-carousel').filter(function(index, element){
                    return !$(element).closest('[class*="mad-section--stretched-content"]').length;
                });

                if($simpleThumbs.length) {
                    $simpleThumbs.owlCarousel(self.helpers.owlSettings({
                        responsive: {
                            0: {
                                items: 2
                            },
                            380: {
                                items: 3
                            },
                            992: {
                                items: 4
                            },
                            1200: {
                                items: 6
                            }
                        },
                        margin: 10,
                        dots: true,
                        loop: false
                    }));
                }

                this.helpers.gridOwl.add($('.mad-grid.owl-carousel').filter(function(index, element){
                    return !$(element).closest('[class*="mad-section--stretched-content"]').length;
                }));

                this.helpers.owlSync.init();

            /* ----------------------------------------
                End of Owl Carousel
            ---------------------------------------- */

            /* ----------------------------------------
                Rating
            ---------------------------------------- */

                var $ratingFields = $('.mad-rating-field'),
                    $ratings;

                if($ratingFields.length) {
                    $ratings = $ratingFields.find('.mad-rating');

                    if($ratings.length) {
                        $ratings.on('built.mad.Rating', function(event, $rating) {
                            var $tabs = $rating.closest('.mad-tabs'),
                                Tabs;

                            if($tabs.length) {
                                Tabs = $tabs.data('tabs');

                                if(Tabs) Tabs.updateContainer();
                            }
                        });
                    }
                }

                if (this.helpers.rating) this.helpers.rating($('.mad-rating:not(.mad-rating--independent)'), {
                    topLevelElements: '<i class="material-icons active">star</i>',
                    bottomLevelElements: '<i class="material-icons">star_border</i>'
                });

                if (this.helpers.rating) this.helpers.rating($('.mad-rating--independent'), {
                    topLevelElements: '<i class="material-icons active">star</i>',
                    bottomLevelElements: '<i class="material-icons">star_border</i>'
                });

                if (this.helpers.ratingField) this.helpers.ratingField($('.mad-rating-field'));

            /* ----------------------------------------
                End of Rating
            ---------------------------------------- */

        DOMDfd.resolve();
        
    };

    App.afterOuterResourcesLoaded = function() {

        var self = this;

        // Stop initializing any modules in case legacy browser is using
        if(this.ISLEGACYBROWSER) return;

        var $sections = $('.mad-section');

        if(this.helpers.Colorizer) this.helpers.Colorizer.init($('[class*="mad-colorizer--scheme-"]'));

        if(this.modules.Section && $sections.length) {
            this.modules.Section.init($sections);
        }

        if(this.helpers.Breadcrumb) this.helpers.Breadcrumb.init($('.mad-header--transparent + .mad-breadcrumb[data-bg-image-src]'));

        if(this.helpers.fullScreenArea) this.helpers.fullScreenArea.init({
            except: $('#mad-header:not(.mad-header--transparent)').add($('#mad-footer'))
        });

        /* ----------------------------------------
            SameHeight
        ---------------------------------------- */

        if ($.fn.MonkeysanSameHeight) {

            var $sameheightContainers = $('.mad-entities--style-6 .mad-grid:not([data-isotope-layout="masonry"]):not(.mad-grid--cols-1), .mad-entities--style-7 .mad-grid:not([data-isotope-layout="masonry"]):not(.mad-grid--cols-1), .mad-entities--style-8 .mad-grid:not([data-isotope-layout="masonry"]):not(.mad-grid--cols-1)').not('.mad-shortcode-container'),
                $pricingTables = $('.mad-portfolio');

            if ($sameheightContainers.length) {

                $sameheightContainers.each(function (index, container) {
                    var $container = $(container),
                        $items = $container.find('.mad-grid-item');

                    if ($items.length) {
                        $container.MonkeysanSameHeight({
                            target: $container.closest('.mad-entities--style-7').length ? '.mad-entity' : '.mad-entity-content .mad-aligner-inner',
                            isIsotope: $container.find('.mad-grid--isotope').length,
                            columns: $items.length ? Math.floor($container.outerWidth() / $items.first().outerWidth()) : null
                        });
                    }
                });
            }

            if ($pricingTables.length) {

                $pricingTables.each(function (index, container) {
                    var $container = $(container),
                        $items = $container.find('.mad-grid-item');

                    if ($items.length) {
                        $container.MonkeysanSameHeight({
                            target: '.mad-gallery-item',
                            isIsotope: $container.find('.mad-grid--isotope').length,
                            columns: $items.length ? Math.ceil($container.outerWidth() / $items.first().outerWidth()) : null
                        });
                    }
                });
            }
        }

        /* ----------------------------------------
            End of SameHeight
        ---------------------------------------- */

        /* ----------------------------------------
            Tabs & Tour Sections
        ---------------------------------------- */

            var $tabs = $('.mad-tabs');
    
            if($tabs.length) {
                $tabs.MonkeysanTabs({
					speed: self.ANIMATIONDURATION,
                    easing: self.ANIMATIONEASING,
                    cssPrefix: 'mad-'
                });
                $('.mad-tabs-nav .mad-tab-link').on('click', function () {
                    $('.owl-carousel').trigger('refresh.owl.carousel');
                    $('.inner-container').css({ 'height': ($(".inner-container .mad-tab.mad-active").height() + 'px') });
                });
                var $utabs = $('.mad-tabs').data('tabs');
                $('.mad-iso-tabs .mad-tabs-nav .mad-tab-link').on('click', function () {
                    setTimeout(function () {
                        $utabs.updateContainer();
                    }, 300);
                });
            }

            var tabs = $('.tabs-section');
            if (tabs.length) {
                tabs.tabs({
                    active: 0,
                    beforeActivate: function (event, ui) {
                        var hash = ui.newTab.find("li a").attr("href");
                    },
                    hide: {
                        effect: "fadeOut",
                        duration: 450
                    },
                    show: {
                        effect: "fadeIn",
                        duration: 450
                    },
                    updateHash: false
                });
            }

        /* ----------------------------------------
            End of Tabs & Tour Sections
        ---------------------------------------- */

        if(this.modules.preloader) this.modules.preloader();

        var $parallaxSections = $('.mad-colorizer--parallax .mad-colorizer-bg-image');

        if($parallaxSections.length) {
            $parallaxSections.parallax("50%",.4);
        }
    };

    /* ----------------------------------------
        Back to top
    ---------------------------------------- */

        App.modules.backToTop = function(config) {

            var backToTop = {

                init: function(config){

                    var self = this;

                    if(config) this.config = $.extend(this.config, config);

                    this.btn = $('<button></button>', {
                        class: self.config.cssPrefix+'back-to-top animated stealthy',
                        html: '<span class="icon material-icons">expand_less</span>'
                    });

                    this.bindEvents();

                    $body.append(this.btn);

                },

                config: {
                    breakpoint: 700,
                    showClass: 'zoomIn',
                    hideClass: 'zoomOut',
                    easing: 'linear',
                    speed: 500,
                    cssPrefix: ''
                },

                bindEvents: function(){

                    var page = $('html, body'),
                        self = this;

                    this.btn.on('click', function(e){

                        page.stop().animate({

                            scrollTop: 0

                        }, {
                            easing: self.config.easing,
                            duration: self.config.speed
                        });

                    });

                    this.btn.on(App.ANIMATIONEND, function(e){

                        e.preventDefault();

                        var $this = $(this);

                        if($this.hasClass(self.config.hideClass)){

                            $this
                                .addClass('stealthy')
                                .removeClass(self.config.hideClass + " " + self.config.cssPrefix + "inview");

                        }

                    });

                    $(window).on('scroll.backtotop', { self: this}, this.toggleBtn);

                },

                toggleBtn: function(e){

                    var $this = $(this),
                        self = e.data.self;

                    if($this.scrollTop() > self.config.breakpoint && !self.btn.hasClass(self.config.cssPrefix + 'inview')){

                        self.btn
                                .addClass(self.config.cssPrefix + 'inview')
                                .removeClass('stealthy');

                        if(App.ANIMATIONSUPPORTED){
                            self.btn.addClass(self.config.showClass);
                        }

                    }
                    else if($this.scrollTop() < self.config.breakpoint && self.btn.hasClass(self.config.cssPrefix + 'inview')){

                        self.btn.removeClass(self.config.cssPrefix + 'inview');

                        if(!App.ANIMATIONSUPPORTED){
                            self.btn.addClass('stealthy');
                        }
                        else{
                            self.btn.removeClass(self.config.showClass)
                                    .addClass(self.config.hideClass);
                        }

                    }

                }

            };

            backToTop.init(config);

            return this;

        };

    /* ----------------------------------------
        End of Back to top
    ---------------------------------------- */

    /* ----------------------------------------
        Preloader
    ---------------------------------------- */

        App.modules.preloader = function() {
            var $preloader = $('.mad-preloader'),
                leftPos = parseInt($preloader.css('margin-left'), 10),
                topPos = parseInt($preloader.css('margin-top'), 10),
                $w = $(window),
                $nav = $('.mad-navigation, .mad-navigation-vertical');

            if($nav.length) {
                $nav.off('click.MadPreloader').on('click.MadPreloader', 'a', function(event){

                    var $this = $(this),
                        $circle = $('<div></div>', {
                            style: 'left: '+ event.clientX +'px; top: '+ event.clientY +'px;',
                            class: 'mad-preloader-circle'
                        });

                    if($body.hasClass('mad-body--moving-to-another-page')) {
                        $circle.appendTo($body);

                        setTimeout(function(){
                            $circle.addClass('mad-preloader-circle--appearing');
                        }, 20);
                    }
                });
            }

            if(!$preloader.length) return;

            $body.off('mousemove.MadPreloader').on('mousemove.MadPreloader', function(event) {
                $preloader.css({
                    'margin-left': leftPos - ($w.width() / 2 - event.pageX),
                    'margin-top': topPos - ($w.height() / 2 - (event.pageY - $w.scrollTop())),
                });
            }).jQueryImagesLoaded().then(function(){

                $preloader.addClass('mad-preloader--disappearing');
                setTimeout(function() {
                    $preloader.remove();
                    $body.off('mousemove.MadPreloader');
                }, 700);
                // can be removed in production (demo only):
                if(window.location.hash == '#mad-footer') {
                    $('html, body').stop().animate({
                        scrollTop: $doc.height()
                    }, {
                        duration: self.ANIMATIONDURATION,
                        easing: self.ANIMATIONEASING
                    });
                }
            });
        };

    /* ----------------------------------------
        End of Preloader
    ---------------------------------------- */

    /* ----------------------------------------
        Dropdown
    ---------------------------------------- */

        App.modules.dropdown = {};

        App.modules.dropdown.config = {
            uncloseable: '.mad-dropdown, .select2-container--mad',
            cssPrefix: 'mad-',
            availableError: 30,
            rtl: App.RTL,
            classMap: {
                active: 'dropdown--opened',
                container: 'dropdown',
                title: 'dropdown-title',
                element: 'dropdown-element',
                leftPlaced: 'dropdown-element--x-left',
                rightPlaced: 'dropdown-element--x-right',
                topPlaced: 'dropdown-element--y-top'
            }
        };

        App.modules.dropdown.init = function(config) {
            if(this._initialized) return;

            if($.isPlainObject(config)) $.extend(true, this.config, config);

            Object.defineProperties(this, {
                activeClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.active;
                    }
                },
                containerClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.container;
                    }
                },
                titleClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.title;
                    }
                },
                elementClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.element;
                    }
                },
                rightPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.rightPlaced;
                    }
                },
                leftPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.leftPlaced;
                    }
                },
                topPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.topPlaced;
                    }
                },
                $dropdowns: {
                    get: function() {
                        return $('.' + this.containerClass);
                    }
                }
            });

            this._bindEvents();
        };

        App.modules.dropdown._bindEvents = function() {
            var self = this;

            $doc.off('click.MadDropdown').on('click.MadDropdown', function(e) {
                var $target = $(e.target);

                if(!$target.closest(self.config.uncloseable).length) {
                    self.close(self.$dropdowns);
                }
            }).on('keydown.MadDropdown', function(event) {
                if(event.keyCode && event.keyCode == 27) {
                    self.close(self.$dropdowns);
                }
            });

            $body.off('click.MadDropdown').on('click.MadDropdown', '.' + self.titleClass, function(e) {
                var $dropdown = $(this).closest('.' + self.containerClass),
                    $others = self.$dropdowns.not($dropdown);

                if($dropdown.length) {
                    self.toggle($dropdown);
                    e.preventDefault();
                }

                self.close($others);
            });

            this._initialized = true;
        };

        App.modules.dropdown.close = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;

            $dropdowns.removeClass(this.activeClass)
                      .find('.' + this.elementClass)
                      .attr('aria-hidden', 'true')
                      .end()
                      .find('.' + this.titleClass)
                      .attr('aria-expanded', 'false');
        };

        App.modules.dropdown.open = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;

            this.fixPosition($dropdowns);

            $dropdowns.addClass(this.activeClass)
                      .find('.' + this.elementClass)
                      .attr('aria-hidden', 'false')
                      .end()
                      .find('.' + this.titleClass)
                      .attr('aria-expanded', 'true');
        };

        App.modules.dropdown.fixPosition = function($dropdowns) {
            var self = this,
                $w = $(window);

            if(!$.isjQuery($dropdowns, true)) return;

            return $dropdowns.each(function(index, dropdown) {
                var $dropdown = $(dropdown),
                    $element = $dropdown.find('.' + self.elementClass),
                    dOffset;

                $element.removeClass(self.leftPlacedClass)
                        .removeClass(self.rightPlacedClass)
                        .removeClass(self.topPlacedClass);

                dOffset = $element.offset();

                // x
                if(dOffset.left - self.config.availableError < 0) {
                    $element.addClass(self.leftPlacedClass);
                }
                else if(dOffset.left + $element.outerWidth() + self.config.availableError > $w.width()) {
                    $element.addClass(self.rightPlacedClass);
                }

                // y
                if(dOffset.top + $element.outerHeight() + self.config.availableError > $w.scrollTop() + $w.height()) {
                    $element.addClass(self.topPlacedClass);
                }
            });
        };

        App.modules.dropdown.toggle = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;
            var self = this;

            return $dropdowns.each(function(index, dropdown){
                var $dropdown = $(dropdown);

                if($dropdown.hasClass(self.activeClass)) self.close($dropdown);
                else self.open($dropdown);
            });
        };

    /* ----------------------------------------
        End of Dropdown
    ---------------------------------------- */

    /* ----------------------------------------
        Arctic Modal
    ---------------------------------------- */

        App.modules.arcticModals = {
             _config: {
                 type: 'html',
                 closeOnOverlayClick: true,
                 overlay: {
                    css: {
                        backgroundColor: '#000000'
                    }
                 },
                 clickableElements: null
             },
             _collection: $(),
             init: function( collection, config ) {

                 if( !collection || !collection.length ) return;

                 config = $.isPlainObject( config ) ? $.extend(true, {}, this._config, config) : this._config;

                 config = this._prepareCallbacks( config );

                 if( config && config.clickableElements ) {
                     $body.on('click.MadArcticModals', '.arcticmodal-container', function(e){
                         var $target = $(e.target);
                         if( !$target.closest( config.clickableElements ).length ) {
                            $.arcticmodal('close');
                         }
                     });
                 }

                 collection.on('click.MadArcticModals', function(e) {

                     var $this = $(this);

                     if( $this.data('arctic-modal-type') == 'ajax' ) {
                         if(!$this.data('arctic-modal-ajax-action')) {
                             return;
                         }

                         $.arcticmodal($.extend(true, {}, config, {
                             type: 'ajax',
                             url: MadAJAXData.url,
                             ajax: {
                                 cache: false,
                                 dataType: 'html',
                                 data: {
                                     action: $this.data('arctic-modal-ajax-action'),
                                     data: $this.data('arctic-modal-ajax-data'),
                                     AJAX_token: MadAJAXData.AJAX_token
                                 },
                                 success: function(data, el, response) {
                                     data.body.html( response );
                                 }
                             }
                         }));
                     }
                     else {
                         $($this.data('arctic-modal')).arcticmodal(config);
                     }

                     e.preventDefault();
                 });
             },
             _prepareCallbacks: function(config) {
                var beforeOpenCallback = config.beforeOpen || function(){},
                	beforeCloseCallback = config.beforeClose || function(){},
                	afterOpenCallback = config.afterOpen || function(){},
                	afterCloseCallback = config.afterClose || function(){};

                config.beforeOpen = function() {

                	beforeOpenCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.afterOpen = function () {
                	afterOpenCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.beforeClose = function(event) {

                	beforeCloseCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.afterClose = function(event) {
                    $body.css('overflow', '');

                	afterCloseCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                return config;

			}
        };

    /* ----------------------------------------
        End of Arctic Modal
    ---------------------------------------- */

    /* ----------------------------------------
        Alert Message Module
    ---------------------------------------- */

        App.modules.alertMessage = function(options) {
            if(!('Handlebars' in window)) return;
            var config = {
                target: $body.children().last(),
                type: 'info',
                timeout: 4000
            };
            config = options && $.isPlainObject(options) ? $.extend(true, {}, config, options) : config;

            var template =
                '<div class="mad-alert-box mad-alert-box--{{type}}" style="display: none;">\
                    <div class="mad-alert-box-inner">\
                        {{message}}\
                    </div>\
                </div>';

            var messageBox = $(Handlebars.compile(template)(config));
            messageBox.data('timeOut', setTimeout(function(){
                messageBox.stop().slideUp({
                    duration: 350,
                    easing: 'linear',
                    complete: function() {
                        $(this).remove();
                    }
                });
            }, config.timeout)).insertAfter(config.target).stop().slideDown({
                duration: 350,
                easing: 'linear'
            });
        };

    /* ----------------------------------------
        End of Alert Message Module
    ---------------------------------------- */

    /* ----------------------------------------
        Section Module
    ---------------------------------------- */

        App.modules.Section = {};
        App.modules.Section._$collection = $();
        App.modules.Section.config = {
            cssPrefix: 'mad-',
            resizeDelay: 10,
            boddyPaddings: false,
            classMap: {
                loading: 'section--loading',
                stretched: 'section--stretched',
                stretchedContent: 'section--stretched-content',
                stretchedContentNoPadding: 'section--stretched-content-no-px',
                bgColorElementClass: 'colorizer-bg-color',
                bgImageElementClass: 'colorizer-bg-image'
            }
        };

        Object.defineProperties(App.modules.Section, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElementClass;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElementClass;
                }
            },
            stretchedClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretched;
                }
            },
            stretchedContentClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretchedContent;
                }
            },
            stretchedContentNoPaddingClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretchedContentNoPadding;
                }
            },
            loadingClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.loading;
                }
            }
        });

        App.modules.Section.changeConfig = function(config) {
            return $.extend(true, this.config, config);
        };

        App.modules.Section.init = function($collection) {
            var self = this;

            if(!$.isjQuery($collection, true)) return;

            if(!this._bindedGlobalEvents) this._bindGlobalEvents();

            return $collection.each(function(index, section){
                var $section = $(section);

                if(self._$collection.filter($section).length) return;

                self.build($section);
                self._$collection = self._$collection.add($section);
            });
        };

        App.modules.Section._bindGlobalEvents = function () {
            var self = this;

            $(window).on('resize.App.modules.Section', function() {
                if(self._resizeTimeOutId) clearTimeout(self._resizeTimeOutId);

                self._resizeTimeOutId = setTimeout(function(){
                    self.rebuild();
                }, self.config.resizeDelay);
            });
        };

        App.modules.Section.rebuild = function() {
            var self = this;

            return this._$collection.each(function(index, section){
                var $section = $(section);

                self.reset($section).build($section);
            });
        };

        App.modules.Section.reset = function($section) {
            if(!$.isjQuery($section, true)) return;

            $section.css({
                'margin-left': '',
                'margin-right': ''
            });

            return this;
        };

        App.modules.Section.build = function($section) {
            if(!$.isjQuery($section, true)) return;

            if($section.hasClass(this.stretchedClass)) {
                this.stretch($section);
            }
            else if($section.hasClass(this.stretchedContentClass) || $section.hasClass(this.stretchedContentNoPaddingClass)) {
                this.stretchContent($section);
            }

            return this;
        };

        App.modules.Section.getDocumentGeometry = function() {
            return {
                'padding-left': parseInt($body.css('padding-left'), 10),
                'padding-right': parseInt($body.css('padding-right'), 10)
            };
        };

        App.modules.Section.stretch = function($section) {
            var $bgs, xOffsetDiff, documentGeometry;

            if(!$.isjQuery($section, true)) return;

            $bgs = $section.find('.' + this.bgColorElementClass + ', .' + this.bgImageElementClass);

            if(!$bgs.length) return;

            xOffsetDiff = $section.offset().left;
            documentGeometry = this.getDocumentGeometry();

            if(xOffsetDiff > 0) {
                $bgs.css({
                    left: (xOffsetDiff - documentGeometry['padding-left']) / -1,
                    right: (xOffsetDiff - documentGeometry['padding-right']) / -1
                });
            }

            $section.removeClass(this.loadingClass).trigger('stretched.mad.Section', [$section]);

            return $section;
        };

        App.modules.Section.stretchContent = function($section) {
            var xOffsetDiff, documentGeometry;

            if(!$.isjQuery($section) || !$section.length) return;

            xOffsetDiff = $section.offset().left;
            documentGeometry = this.getDocumentGeometry();

            if(xOffsetDiff > 0) {
                $section.css({
                    'margin-left': (xOffsetDiff - documentGeometry['padding-left']) / -1,
                    'margin-right': (xOffsetDiff - documentGeometry['padding-right']) / -1
                });
            }

            $section.removeClass(this.loadingClass).trigger('stretched.mad.Section', [$section]);

            return $section;
        };

    /* ----------------------------------------
        End of Section Module
    ---------------------------------------- */


    /* ----------------------------------------
        Colorizer
     ---------------------------------------- */

        App.helpers.Colorizer = {};
        App.helpers.Colorizer.config = {
            cssPrefix: 'mad-',
            classMap: {
                bgColorElement: 'colorizer-bg-color',
                bgImageElement: 'colorizer-bg-image',
                parallax: 'colorizer--parallax'
            },
            afterInit: function() {}
        };

        Object.defineProperties(App.helpers.Colorizer, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElement;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElement;
                }
            },
            parallaxClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.parallax;
                }
            }
        });

        /**
         *
         * @param {jQuery} $collection - collection of elements to colorize
         * @returns {jQuery} $collection
         */
        App.helpers.Colorizer.init = function($collection, config) {
            var self = this;

            if(!$.isjQuery($collection, true)) return $collection;

            this.config = $.extend(true, {}, this.config, config);

            $collection.each(function(index, element) {
                var $element = $(element);

                if(!self.hasBGColorElement($element)) {
                    self.appendBGColorElement($element);
                }

                if(!self.hasBGImageElement($element) && $element.data('bg-image-src')) {
                    self.appendBGImageElement($element);
                }
            });

            this.config.afterInit.call(this);

            return $collection;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {Boolean}
         */
        App.helpers.Colorizer.hasBGColorElement = function($element) {
            return $element.children('.' + this.bgColorElementClass).length;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {Boolean}
         */
        App.helpers.Colorizer.hasBGImageElement = function($element) {
            return $element.children('.' + this.bgImageElementClass).length;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {jQuery}
         */
        App.helpers.Colorizer.appendBGColorElement = function($element) {
            var self = this,
                $bgColorElement = $('<div></div>', {
                    class: self.bgColorElementClass
                });

            return $element.prepend($bgColorElement);
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {jQuery}
         */
        App.helpers.Colorizer.appendBGImageElement = function($element) {
            var self = this,
                src = $element.data('bg-image-src'),
                $bgImageElement = $('<div></div>', {
                    class: self.bgImageElementClass
                });

            $bgImageElement.css('background-image',  'url("'+src+'")');
            $element.prepend($bgImageElement);

            return $element;
        };

    /* ----------------------------------------
        End of Colorizer
    ---------------------------------------- */


    /* ----------------------------------------
        Breadcrumb
    ---------------------------------------- */

        App.helpers.Breadcrumb = {};
        App.helpers.Breadcrumb.$collection = $();
        App.helpers.Breadcrumb.$w = $(window);

        App.helpers.Breadcrumb.config = {
            until: 767,
            cssPrefix: 'mad-',
            resizeTimeoutDelay: 10,
            classMap: {
                bgColorElement: 'colorizer-bg-color',
                bgImageElement: 'colorizer-bg-image'
            }
        };

        Object.defineProperties(App.helpers.Breadcrumb, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElement;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElement;
                }
            },
            bgsSelectors: {
                get: function() {
                    return '.' + this.bgColorElementClass + ', .' + this.bgImageElementClass;
                }
            }
        });

        App.helpers.Breadcrumb.init = function($breadcrumbs) {
            var self = this;

            if(!$.isjQuery($breadcrumbs, true)) return;

            this._bindEvents();

            $breadcrumbs.each(function(index, element) {
                var $element = $(element);

                if(self.$collection.filter($element).length) return;

                self.initCertainElement($element);
            });
        };

        App.helpers.Breadcrumb._bindEvents = function() {
            var self = this;

            if(!this._eventsBinded) {
                $body.on('spaceremoved.mad.stickysection', function() {
                    self.$collection.each(function(index, element){
                        self.stretch($(element));
                    });
                });

                this.$w.on('resize', function() {
                    if(self._resizeTimeOutId) clearTimeout(self._resizeTimeOutId);

                    self._resizeTimeOutId = setTimeout(function(){
                        self.$collection.each(function(index, element){
                            self.stretch($(element));
                        });
                    }, self.config.resizeTimeoutDelay);
                });
            }
        };

        App.helpers.Breadcrumb.initCertainElement = function($breadcrumb) {
            this.$collection = this.$collection.add($breadcrumb);

            this.stretch($breadcrumb);
        };

        App.helpers.Breadcrumb.stretch = function($breadcrumb) {
            var $prev = $breadcrumb.prev(),
                prevOH,
                $bgs,
                $stickedSections;

            if($.isjQuery($prev, true)) {
                prevOH = $prev.outerHeight();
                $bgs = $breadcrumb.find(this.bgsSelectors);
                $stickedSections = $('.mad-header-section--sticked');

                if($bgs.length) {
                    $bgs.css({
                        top: -prevOH
                    });
                }
                if($stickedSections.length) {
                    $bgs.css({
                        top: $stickedSections.outerHeight() * -1
                    });
                }
            }

            return $breadcrumb;
        };

    /* ----------------------------------------
        End of Breadcrumb
    ---------------------------------------- */

    /* ----------------------------------------
        Critical Error
    ---------------------------------------- */

        App.helpers.showCriticalFullScreenMessage = function(config) {
            var _config = {
                after: '',
                before: '',
                content: '',
                cssPrefix: 'mad-',
                cssClass: ''
            },
            template = '<div class="%cssPrefix%fullscreen-message %cssClass% %cssPrefix%aligner">\
                            <div class="%cssPrefix%aligner-outer">\
                                <div class="%cssPrefix%aligner-inner">\
                                    <div class="%cssPrefix%fullscreen-message-before">%before%</div>\
                                    <div class="%cssPrefix%fullscreen-message-content">%content%</div>\
                                    <div class="%cssPrefix%fullscreen-message-after">%after%</div>\
                                </div>\
                            </div>\
                        </div>';


            config = $.extend(_config, config);

            for(var option in config) {
                template = template.replace(new RegExp('%' + option + '%', 'g'), config[option]);
            }

            $body.html('').addClass(config.cssPrefix + 'body--has-critical-fullscreen-message').append(template);
        };

    /* ----------------------------------------
        End of Critical Error
    ---------------------------------------- */

        /* ----------------------------------------
            Dynamic background image
        ---------------------------------------- */

            App.helpers.dynamicBgImage = function(collection) {
                collection = $.isjQuery(collection) ? collection : $('[data-bg-image-src]');
                if(!collection.length) return;

                return collection.each(function(i, el){
                    var $this = $(el);
                    if( !$this.data('bg-image-src') ) return;

                    $this.css('background-image', 'url("'+ $this.data('bg-image-src') +'")');
                });
            },

        /* ----------------------------------------
            End of Dynamic background image
        ---------------------------------------- */

        /* ----------------------------------------
            Toggled fields
        ---------------------------------------- */

            App.helpers.toggledFields = function() {
                $body.off('click.MadToggledFields').on('click.MadToggledFields', '.mad-toggled-fields-invoker', function(event) {
                    var $this = $(this),
                        $fields = $this.siblings('.mad-toggled-fields');

                    $this.toggleClass('mad-toggled-fields-invoker--opened');

                    if($fields.length) {
                        $fields.stop().slideToggle({
                            duration: App.ANIMATIONDURATION,
                            easing: App.ANIMATIONEASING,
                        });
                    }
                });
            };

        /* ----------------------------------------
            End of Toggled fields
        ---------------------------------------- */

        /* ----------------------------------------
            Calendar Widget
        ---------------------------------------- */

            App.helpers.calendarWidget = function() {
                var $calendar = $('.calendar_wrap'),
                    $caption,
                    $prev,
                    $next;
                if(!$calendar.length || $calendar.hasClass('mad-calendar-rendered')) return;

                $caption = $calendar.find('caption');

                if(!$caption.length) return;

                $prev = $calendar.find('#prev > a');
                $next = $calendar.find('#next > a');

                if($prev.length) {
                    $('<a></a>', {
                        class: 'calendar-caption-prev mad-ln--independent',
                        html: App.RTL ? '<i class="icon licon-arrow-right"></i>' : '<i class="icon licon-arrow-left"></i>',
                        href: $prev.attr('href')
                    }).appendTo($caption);
                }

                if($next.length) {
                    $('<a></a>', {
                        class: 'calendar-caption-next mad-ln--independent',
                        html: App.RTL ? '<i class="icon licon-arrow-left"></i>' : '<i class="icon licon-arrow-right"></i>',
                        href: $next.attr('href')
                    }).appendTo($caption);
                }

                $calendar.addClass('mad-calendar-rendered');
            };

        /* ----------------------------------------
            End of Calendar Widget
        ---------------------------------------- */

        /* ----------------------------------------
            Owl Carousel helpers
        ---------------------------------------- */

            App.baseOwlSettings = {
                items: 1,
                margin: 32,
                nav: true,
                rtl: App.RTL,
                navText: App.RTL ? ['<i class="icon licon-chevron-left"></i>', '<i class="icon licon-chevron-right"></i>'] : ['<i class="icon licon-chevron-left"></i>', '<i class="icon licon-chevron-right"></i>'],
                dots: false,
                loop: true,
                autoplayHoverPause: true,
                smartSpeed: App.ANIMATIONDURATION,
                fluidSpeed: App.ANIMATIONDURATION,
                autoplaySpeed: App.ANIMATIONDURATION,
                navSpeed: App.ANIMATIONDURATION,
                dotsSpeed: App.ANIMATIONDURATION,
                dragEndSpeed: App.ANIMATIONDURATION
            };

            App.helpers.owlAdaptive = function(collection) {

                collection = collection ? collection : $('.owl-carousel');
                if(!collection.length) return;

            };

            App.helpers.owlContainerHeight = function(owl, resized) {

                if(owl.hasClass('owl-carousel--vadaptive')) return;

                setTimeout(function(){

                    var max = 0,
                        items = owl.find('.owl-item'),
                        activeItems = items.filter('.active').children();

                    items.children().css('height', 'auto');

                    activeItems.each(function(i, el){

                        var $this = $(el),
                            height = $this.outerHeight();

                        if(height > max) max = height;

                    });

                    owl.find('.owl-stage-outer').stop().animate({
                        height: max
                    }, {
                        duration: 150,
                        complete: function() {
                        if(!resized) return;
                        App.helpers.owlUpdateIsotopeParent($(this));
                        }
                    });

                }, 1);

            };

            App.helpers.owlUpdateIsotopeParent = function($owl) {
                var $isotope = $owl.closest('.mad-grid--isotope');
                if($isotope.length) $isotope.isotope('layout');
            };

            App.helpers.owlNav = function(owl) {

                setTimeout(function(){

                    var settings = owl.data('owl.carousel').settings;
                    if(settings.autoplay || settings.loop) return;

                    var prev = owl.find('.owl-prev'),
                        next = owl.find('.owl-next');

                    if(owl.find('.owl-item').first().hasClass('active')) prev.addClass('mad-disabled');
                    else prev.removeClass('mad-disabled');

                    if(owl.find('.owl-item').last().hasClass('active')) next.addClass('mad-disabled');
                    else next.removeClass('mad-disabled');

                }, 100);

            };

            App.helpers.owlSettings = function(settings) {

                return $.extend(true, {}, App.baseOwlSettings, settings);

            };

            App.helpers.owlSync = {

				init: function() {

					this.collection = $('.owl-carousel[data-sync]');
					if(!this.collection.length) return;

					this.prepare();
				},

				prepare: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							sync = $($this.data('sync'));

						sync.on('changed.owl.carousel', function(e){

							var index = e.item.index;

							if(!sync.data('afterClicked')) $this.trigger('to.owl.carousel', [index, 350, true]);

							sync.data('afterClicked', false);

						});

						$this.on('prev.owl.carousel', function(){

							sync.trigger('prev.owl.carousel');

						});

						$this.on('next.owl.carousel', function(){

							sync.trigger('next.owl.carousel');

						});

						$this.on('click.owlSync', '.owl-item', function(e){

							e.preventDefault();

							var index = $(this).index();

							sync.data('afterClicked', true);

							sync.trigger('to.owl.carousel', [index, 350, true]);

						});

					});

				}

            };

        /* ----------------------------------------
            End of Owl Carousel helpers
        ---------------------------------------- */

        /* ----------------------------------------
            Rating
        ---------------------------------------- */

            function MadRating($element, config) {
                this.$element = $element;
                this.config = $.extend(MadRating.config, config);

                Object.defineProperties(this, {
                    bottomLevelElementClass: {
                        get: function() {
                            return this.config.cssPrefix + this.config.classMap.bottomLevelElement;
                        }
                    },
                    topLevelElementClass: {
                        get: function() {
                            return this.config.cssPrefix + this.config.classMap.topLevelElement;
                        }
                    }
                });
            };

            MadRating.config = {
                cssPrefix: 'mad-',
                bottomLevelElements: '<i class="icon licon-star"></i>',
                topLevelElements: '<i class="icon licon-star"></i>',
                estimate: 5,
                rtl: App.RTL,
                classMap: {
                    bottomLevelElement: 'rating-bottom-level',
                    topLevelElement: 'rating-top-level'
                }
            };

            MadRating.prototype.init = function() {
                this._buildMarkup();

                return this;
            };

            MadRating.prototype._buildMarkup = function() {
                var _self = this;

                if(this._markupBuilded) return;

                this.$element.css({
                    'position': 'relative',
                    'display': 'inline-block'
                });

                if(this.config.topLevelElements) {
                    this.$topLevelEl = $('<div></div>', {
                        class: _self.topLevelElementClass,
                        style: 'position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 2; white-space: nowrap; overflow: hidden;'
                    });

                    for(var i = 0; i < 5; i++) this.$topLevelEl.append(this.config.topLevelElements);

                    this.$element.append(this.$topLevelEl);
                }

                if(this.config.bottomLevelElements) {
                    this.$bottomLevelEl = $('<div></div>', {
                        class: _self.bottomLevelElementClass,
                        style: 'position: relative; z-index: 1;'
                    });

                    for(var i = 0; i < 5; i++) this.$bottomLevelEl.append(this.config.bottomLevelElements);

                    this.$element.append(this.$bottomLevelEl);
                }


                this.update(this.config.estimate);

                this._markupBuilded = true;

                this.$element.trigger('built.mad.Rating', [this.$element]);
            };

            MadRating.prototype.update = function(estimate) {
                if(this.config.topLevelElements) {
                    this.$topLevelEl.css('width', (estimate / 5 * 100) + '%');
                }
                else {
                    if(this.config.bottomLevelElements) {
                        this.$bottomLevelEl.html('');
                        for(var i = 0; i < Math.round(estimate); i++) this.$bottomLevelEl.append(this.config.bottomLevelElements);
                    }
                }
            };

            App.helpers.rating = function($collection, config) {
                config = config || {};

                if(!$.isjQuery($collection) || !$collection.length) return $collection;

                return $collection.each(function(index, element) {
                    var $element = $(element),
                        elementConfig = $.extend(true, {}, config, {estimate: $element.data('estimate')});

                    if(!$element.data('Rating')) $element.data('Rating', new MadRating($element, elementConfig).init());
                });
            };



            App.helpers.ratingField = function($collection) {
                if(!$.isjQuery($collection)) return;

                $collection.on('click.MadRatingField', '.icon', function(event) {
                    var $icon = $(this),
                        $rating = $icon.closest('[data-estimate]'),
                        index = $icon.index() + 1,
                        Rating = $rating.data('Rating'),
                        $field = $rating.siblings('input[type="hidden"]');

                    if(Rating) {
                        Rating.update( App.RTL ? 6 - index : index);

                        if($field.length) {
                            $field.val(index);
                        }
                    }

                    event.preventDefault();
                    event.stopPropagation();
                });
            };

        /* ----------------------------------------
            End of Rating
        ---------------------------------------- */

        /* ----------------------------------------
            gridOwl
        ---------------------------------------- */

            App.helpers.gridOwl = {
                _commonLayoutConfig: {
                    'columns-4': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            },
                            1200: {
                                items: 4
                            }
                        }
                    },
                    'columns-4-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-3': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-3-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-2': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            }
                        }
                    },
                    'columns-2-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            }
                        }
                    }
                },
                _$collection: $(),
                _individualConfigs: {}
            };

            /**
             * Initializes the gridOwl helper
             * @param {jQuery} $collection
             *
             * @returns {jQuery}
             */
            App.helpers.gridOwl.init = function($collection) {
                var self = this;

                $collection = $.isjQuery($collection) ? $collection : $('.mad-grid.owl-carousel');

                 $collection.each(function(index, element){
                    var $element = $(element);

                    if(self._$collection.filter($element).length) return;

                    self._$collection = self._$collection.add($element);
                });

                this.update();

                return $collection;
            };

            /**
             * Modifies config for the elements with parents that match specified selector.
             * @param {String} selector
             * @param {Object} config
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.extendConfigFor = function(selector, config) {
                this._individualConfigs[selector] = config;

                return this;
            };

            /**
             * Adds new carousel to the collection
             *
             * @param {jQuery} $carousel
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.add = function($carousel) {
                if($.isjQuery($carousel) && !this._$collection.filter($carousel).length) {
                    this._$collection = this._$collection.add($carousel);
                    this.update();
                }

                return this;
            };

            /**
             * Initializes not initialized carousels.
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.update = function() {
                var self = this;

                this._$collection.each(function(index, element){
                    var $element = $(element),
                        config = {},
                        columnsCount,
                        layoutConfigProp;

                    if($element.data('owl.carousel')) return;

                    // detect layout settings
                    columnsCount = self._getColumnsCount($element);

                    if(columnsCount > 1) {
                        // check if sidebar
                        if($element.closest('.mad-has-sidebar').length) {
                            layoutConfigProp = 'columns-' + columnsCount + '-sidebar';
                        }
                        else {
                            layoutConfigProp = 'columns-' + columnsCount;
                        }

                        $.extend(config, self._commonLayoutConfig[layoutConfigProp]);
                    }

                    for(var selector in self._individualConfigs) {
                        if($element.closest(selector).length) {
                            $.extend(config, self._individualConfigs[selector]);

                            if($element.closest('.mad-has-sidebar').length) {
                                config.responsive = config.responsiveWithSidebar;
                            }
                        }
                    }


                    $element.owlCarousel(App.helpers.owlSettings(config));
                });

                return this;
            };

            /**
             * Returns amount of columns in the specified element.
             *
             * @param {jQuery} $element
             * @returns {Number}
             */
            App.helpers.gridOwl._getColumnsCount = function($element) {
                if($element.hasClass('mad-grid--cols-4')) return 4;
                else if($element.hasClass('mad-grid--cols-3')) return 3;
                else if($element.hasClass('mad-grid--cols-2')) return 2;
                else if($element.hasClass('mad-grid--cols-5')) return 5;

                return 1;
            };

        /* ----------------------------------------
            End of gridOwl
        ---------------------------------------- */

        /* ----------------------------------------
            Full Screen Area
        ---------------------------------------- */

            App.helpers.fullScreenArea = {
            	init: function(config){

            		var self = this;

            		this.collection = $('.mad-fullscreen-area');
            		if(!this.collection.length) return;

                    this.config = config || {};
            		this.defPaddingTop = parseInt(this.collection.css('padding-top'), 10);
            		this.defPaddingBottom = parseInt(this.collection.css('padding-bottom'), 10);

            		this.w = $(window);
                    this.$body = $body;

            		this.run();

            		this.w.on('resize.fullscreen', function() {
                        self.run();
                    });

            		return this.collection;

            	},

            	reset: function(){

            		if(!this.collection) return;

            		this.run();

            	},

            	updateDocumentState: function(){

            		var self = this;

            		this.collection.css({
            			'padding-top': self.defPaddingTop,
            			'padding-bottom': self.defPaddingBottom
            		});

            		this.cH = this.collection.outerHeight();

                    this.eH = this.config.except && this.config.except.length ? this.getTotalHeightOfExceptedElements() : 0;
                    this.documentPadding = parseInt(this.$body.css('padding-top'), 10) + parseInt(this.$body.css('padding-bottom'), 10);

                    this.wH = this.w.height();

            	},

                getTotalHeightOfExceptedElements: function() {
                    return this.config.except.toArray().reduce(function(accumulator, currentValue, index, array){
                        return accumulator + $(currentValue).outerHeight();
                    }, 0);
                },

            	run: function(){

            		var self = this;

            		this.updateDocumentState();

            		if(this.timeoutId) clearTimeout(this.timeoutId);

            		this.timeoutId = setTimeout(function(){

            			if(self.cH < self.wH){

            				var diff = (self.wH - self.cH) / 2;

            				self.collection.css({
            					'padding-top': diff + self.defPaddingTop - ((self.eH + self.documentPadding)/2),
            					'padding-bottom': diff + self.defPaddingBottom - ((self.eH + self.documentPadding)/2)
            				});

            			}

                        self.collection.addClass('mad-fullscreen-area--ready');

            		}, 100);

            	}

            };

        /* ----------------------------------------
            End of Full Screen Area
        ---------------------------------------- */

        /* ----------------------------------------
            Google Maps
        ---------------------------------------- */

            if ($('#googleMap').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        styles: [{ featureType: 'all', stylers: [{ saturation: -100 }, { gamma: 0.0 }] }]
                    };

                    var map = document.getElementById('googleMap');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 47.0239064, lng: -4.8380426 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap3').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap3');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap3"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap4').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap4');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap4"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap5').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap5');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap5"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap6').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap6');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap6"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap7').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap7');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap7"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap8').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap8');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap8"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap9').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap9');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap9"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap10').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap10');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap10"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap11').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap11');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap11"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap12').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap12');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap12"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap13').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = document.getElementById('googleMap13');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap13"), mapProp);

                    }

                    var marker = new google.maps.Marker({
                        position: { lat: 51.503454, lng: -0.124755 },
                        map: map,
                        icon: 'images/map_marker.png'
                    });

                    marker.setMap(map);

                    //Zoom to 7 when clicked on marker
                    google.maps.event.addListener(marker, 'click', function () {
                        map.setZoom(9);
                        map.setCenter(marker.getPosition());
                    });

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

            if ($('#googleMap14').length) {

                function loadMap() {
                    var mapProp = {
                        center: { lat: 51.503454, lng: -0.124755 },
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP

                    };

                    var map = document.getElementById('googleMap14');

                    if (map !== null) {

                        var map = new google.maps.Map(document.getElementById("googleMap14"), mapProp);

                    }

                    setMarkers(map);

                }
                var marks = [
                    ['first', 51.501454, -0.144755],
                    ['second', 51.497454, -0.184755],
                    ['third', 51.511454, -0.104755],
                    ['forth', 51.498454, -0.095755]
                ];

                function setMarkers(map) {

                    for (var i = 0; i < marks.length; i++) {
                        var mark = marks[i];
                        var marker = new google.maps.Marker({
                            position: { lat: mark[1], lng: mark[2] },
                            map: map,
                            icon: 'images/map_marker.png',
                            title: mark[0],
                            zIndex: mark[3]
                        });
                    }

                }

                google.maps.event.addDomListener(window, 'load', loadMap);

            }

        /* ----------------------------------------
            End of Google Maps
        ---------------------------------------- */

        /* ----------------------------------------
            Bg move
        ---------------------------------------- */

            App.modules.bgMove = function () {

                var lFollowX = 0,
                    lFollowY = 0,
                    x = 0,
                    y = 0,
                    friction = 1 / 30;

                function moveBackground() {
                    x += (lFollowX - x) * friction;
                    y += (lFollowY - y) * friction;

                    var translate = 'translate(' + x + 'px, ' + y + 'px) scale(1)';

                    $('.bg-move').css({
                        '-webit-transform': translate,
                        '-moz-transform': translate,
                        'transform': translate
                    });

                    window.requestAnimationFrame(moveBackground);
                }

                $(window).on('mousemove click', function (e) {

                    var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
                    var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
                    lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
                    lFollowY = (10 * lMouseY) / 100;

                });

                moveBackground();
            }

        /* ----------------------------------------
            Bg move
        ---------------------------------------- */

        /* ----------------------------------------
            Shop item close
        ---------------------------------------- */

        /**
         * Initialize global close event
         * @return Object Core;
         **/
        App.modules.closeBtn = function() {
            $('body').on('click.globalclose', '.mad-close-item:not(.shopping-cart-full .mad-close-item)', function (e) {
                e.preventDefault();
                $(this).parent().stop().animate({
                    opacity: 0
                }, function () {
                    $(this).stop().slideUp(function () {
                        $(this).remove();
                    });
                });
            });
            var c = $('.shopping-cart-full');
            c.on('click.removeProduct', '.mad-close-item', function (e) {
                e.preventDefault();
                $(this).closest('tr').stop().fadeOut(function () {
                    $(this).remove();
                });
            });
            return this;
        }

        /* ----------------------------------------
            Shop item close
        ---------------------------------------- */

        /* ----------------------------------------
            View Types
        ---------------------------------------- */

        App.modules.viewTypes = function() {

            var collection = $('[data-view]');
            if (!collection.length) return;

            if ($('.mad-full-page-wrap').length) {
                $('.toggle-map').on('click', function (e) {
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $('body').toggleClass('mad-full-page');
                });
                $('.toggle-list').on('click', function (e) {
                    e.preventDefault();
                    $('.toggle-map').addClass('active not-active');
                    $('body').addClass('mad-full-page');
                });
                $('.toggle-grid').on('click', function (e) {
                    e.preventDefault();
                    $('.toggle-map').removeClass('not-active');
                });
            } else {
                $('.toggle-map').on('click', function (e) {
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $('.gmap-toggle').slideToggle();
                });
            }

            collection.on('click', function (e) {

                e.preventDefault();
                var $this = $(this),
                    target = $($this.data('target'));

                $this
                    .addClass('active')
                    .siblings("a:not('.toggle-map')")
                    .removeClass('active');

                target
                    .removeClass('mad-entity-hr mad-entity-vr mad-entity-ar')
                    .addClass('mad-entity-' + $this.data('view'));

                target
                    .removeClass('style-2 style-4 mad-entity-2 mad-entity-4')
                    .addClass('style-' + $this.data('view'));

                $('.owl-carousel').trigger('refresh.owl.carousel');

            });

            $('.view-type a').on('click', function () {
                $('.owl-carousel').trigger('refresh.owl.carousel');
            });

            return collection;

        }

        /* ----------------------------------------
            View Types
        ---------------------------------------- */

        /**
         * Emulates single accordion item
         * @param Function callback
         * @return jQuery collection;
         **/
        App.modules.hiddenSections = function(callback) {

            var collection = $('.hidden-section');
            if (!collection.length) return;

            collection.each(function (i, el) {
                $(el).find('.content').hide();
            });

            collection.on('click.hidden', '.invoker', function (e) {

                e.preventDefault();

                var content = $(this).closest('.hidden-section').find('.content');

                content.slideToggle({
                    duration: 500,
                    easing: 'easeOutQuint',
                    complete: callback ? callback : function () { }
                });

            });

            return collection;

        },
        
    $.extend({
        isjQuery: function(element, elementExists) {
			if(element === undefined || element === null) return false;

			if(elementExists === undefined) {
				return element instanceof jQuery;
			}
			else {
				return $.isjQuery(element) && element.length;
			}
		}
    });

    $.fn.extend({
        jQueryImagesLoaded : function () {
		    var $imgs = this.find('img[src!=""]');

		    if (!$imgs.length) {return $.Deferred().resolve().promise();}

		    var dfds = [];

		    $imgs.each(function(){
		        var dfd = $.Deferred();
		        dfds.push(dfd);
		        var img = new Image();
		        img.onload = function(){dfd.resolve();};
		        img.onerror = function(){dfd.resolve();};
		        img.src = this.src;
		    });

		    return $.when.apply($,dfds);
		}
    });

    $doc.on('beforeClose', function(event) {
        if($(event.target).hasClass('mad-modal')) {
            event.stopImmediatePropagation();
        }
    });

    $doc.ready(function() {
        App.afterDOMReady();
    });
    $(window).on('load', function() {

        DOMDfd.done(function() {
            App.afterOuterResourcesLoaded();
        });

        // Vertical menu

        $('.mad-vr-nav > ul > li.menu-item-has-children > a').on('click', function (e) {
            e.preventDefault();
            $(this).next('.sub-menu').slideToggle();
            $(this).parent().siblings().children('.sub-menu').slideUp();
        });
        
    });

    /* ---------------------------------------------------- */
    /*	Elevate zoom										*/
    /* ---------------------------------------------------- */

    if ($('[data-zoom-image]').length) {

        var button = $('.qv-preview');

        $("#zoom-image").elevateZoom({
            gallery: 'thumbnails',
            galleryActiveClass: 'active',
            zoomType: "inner",
            cursor: "crosshair",
            responsive: true,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            easing: true,
            lensFadeIn: 500,
            lensFadeOut: 500
        });

    }

    /* ---------------------------------------------------- */
    /*	Elevate zoom										*/
    /* ---------------------------------------------------- */

    /* ---------------------------------------------------- */
    /*	Quantity											*/
    /* ---------------------------------------------------- */

    if ($('.quantity').length) {
        var q = $('.quantity');
        q.each(function () {
            var $this = $(this),
                button = $this.children('button'),
                input = $this.children('input[type="text"]'),
                val = +input.val();
            button.on('click', function () {
                if ($(this).hasClass('qty-minus')) {
                    if (val === 1) return false;
                    input.val(--val);
                }
                else {
                    input.val(++val);
                }
            });
        });
    }

    /* ---------------------------------------------------- */
    /*	Quantity											*/
    /* ---------------------------------------------------- */

    /* ---------------------------------------------------- */
    /*	Team Section										*/
    /* ---------------------------------------------------- */

    if ($('.mad-team-section').length) {
        $('.mad-col').on('mouseenter', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        })
    };

    /* ---------------------------------------------------- */
    /*	Team Section										*/
    /* ---------------------------------------------------- */

    $(window).on('scroll resize load', function () {
        if ($(window).width() > 1280) {
            if ($(this).scrollTop() > 450) {
                $('.mad-element').addClass("mad-fixed");
                $('.mad-property-section').css({ 'padding-top': ($(".mad-element").height() + 'px') });
            } else {
                $('.mad-element').removeClass("mad-fixed");
                $('.mad-property-section').css({ 'padding-top': (0 + 'px') });
            }
            if ($('.mad-element.mad-fixed')) {
                $('.mad-element.mad-fixed').css({ 'top': ($(".mad-header-section--sticked").height() + 'px') });
            }
        } else {
            return false;
        }
    });

    /* ---------------------------------------------------- */
    /*	Animate a regular anchor navigation					*/
    /* ---------------------------------------------------- */

    if ($('a.animated').length) {

        $('body').localScroll({
            hash: true,
            filter: '.animated',
            onBefore: function () {
                this.offset = -300;
            }
        });

        // highlight menu element on scroll
        calculateScroll();
        $(window).scroll(function (event) {
            calculateScroll();
        });

        /*  Automatically Highlights Navigation Item */
        var rangeTop = 400; //rangeTop is used for changing the class a little sooner that reaching the top of the page
        var rangeBottom = 400; //rangeBottom is similar but used for when scrolling bottom to top
        function calculateScroll() {
            var winTop = $(window).scrollTop();
            var contentTop = [];
            var contentBottom = [];
            $('#menu').find('a.animated').each(function () {
                contentTop.push($($(this).attr('href')).offset().top);
                contentBottom.push($($(this).attr('href')).offset().top + $($(this).attr('href')).height());
            })

            $.each(contentTop, function (i) {
                if (winTop > contentTop[i] - rangeTop && winTop < contentBottom[i] - rangeBottom) {
                    $('#menu > span').removeClass('tab-active').eq(i).addClass('tab-active');
                }
            })
        }

    }

    /* ---------------------------------------------------- */
    /*	Multiscroll											*/
    /* ---------------------------------------------------- */

    if ($('#myContainer').length) {

        if ($(window).width() <= 1024) {

            $('.ms-right .ms-section').unwrap().appendTo('.ms-left');

            var ul = $('.ms-left').find('.ms-section').sort(function (a, b) {
                return $(a).data('id') - $(b).data('id')
            })

            $('.ms-left').empty().append(ul);

        } else {
            $('#myContainer').multiscroll({
                navigation: true,
                loopBottom: true,
                css3: true
            });
        }

    }

    // Click btns

    if ($('.mad-calendar').length) {
        $('.mad-calendar-item').on('click', function () {
            $('.mad-calendar-item').removeClass('active')
            $(this).addClass('active');
        });
    }

    if ($('.toggle-btn').length) {
        $('.toggle-btn').on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('toggled');
            $(this).siblings('.toggle-section').slideToggle();
            setTimeout(function () {
                $('.mad-tabs').data('tabs').updateContainer();
            }, 300);
            $(this).siblings('.mad-table-wrap').find('.toggle-section').slideToggle();
        })
    }

    return App;

})(window.jQuery);

/*
Plugin Name: 	SVG for jQuery.
*/
$(function () {
    jQuery('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
});

/*
Video Play
*/
$(document).on('click', '.js-videoPoster', function (e) {
    //отменяем стандартное действие button
    e.preventDefault();
    var poster = $(this);
    // ищем родителя ближайшего по классу
    var wrapper = poster.closest('.js-videoWrapper');
    videoPlay(wrapper);
});

//вопроизводим видео, при этом скрывая постер
function videoPlay(wrapper) {
    var iframe = wrapper.find('.js-videoIframe');
    // Берем ссылку видео из data
    var src = iframe.data('src');
    // скрываем постер
    wrapper.addClass('videoWrapperActive');
    // подставляем в src параметр из data
    iframe.attr('src', src);
}

/* ------------------------------------------------
    Sticky sidebar
------------------------------------------------ */

$(window).on("load resize", function () {

    if ($(window).width() > 992 && $('.sticky-bar').length) {

        $('.content, .sidebar , #sidebar').theiaStickySidebar({
            // Settings
            additionalMarginTop: 130
        });

    }

});
