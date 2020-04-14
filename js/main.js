$(document).ready(function () {

    var header = $('.header');
    
    $(window).scrollTop(0)

    $(document).on('scroll', function () {
        var scroll = $(window).scrollTop();

        if (scroll > header.outerHeight()) {
            if (!header.hasClass('scroll')) {
                header.addClass('scroll');
                $('body').addClass('fixed');
            }
        } else {
            header.removeClass('scroll');
            $('body').removeClass('fixed');
        }
    });

    $('.menu').on('click', '.menu-btn', function () {
        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
            $('body').removeClass('overflow');
        } else {
            $(this).parent().addClass('active');
            $('body').addClass('overflow');
        }
    })


    var controller = new ScrollMagic.Controller();
    var homeRows = document.querySelectorAll('.animation');
    homeRows.forEach(function (homeRow) {
        var scene = new ScrollMagic.Scene({
                triggerElement: homeRow,
                triggerHook: 0.9,
                duration: "80%",
                offset: 100
            })
            .on("enter", function () {
                homeRow.classList.add('animated')
            })
            .on("leave", function () {
                scene.destroy();
            })
            .addTo(controller);
    })

    if ($('.single__challenge-slider-box').length) {

        var slideCount = 0;
        $('.single__challenge-slider-box').slick({
            arrows: false,
            dots: true,
            autoplay:true,
            autoplaySpeed:5000,
            customPaging: function (slider, i) {
                slideCount = slider.slideCount;
                return  `<span data-slide-id="${i}"></span>`;
            }
        })

        insertDots(slideCount)

        function insertDots(slideCount) {
            var numItems = slideCount;
            var svg = document.querySelector(".slider-dots");
            var spacing = 50;
            var radius = 8;
            var strokeWidth = 2;
            var index = 0;
            var ringList = [];
            var initX = (300 - spacing * (numItems - 1)) * .5;
            var dot = createElement("circle", {
                cx: initX + (index * spacing),
                cy: '50%',
                fill: "#fff",
                r: radius - (strokeWidth * 2)
            });
            svg.appendChild(dot);
            paginate();
            disable(ringList[index]);

            gotoIndex(0);

            function onSelect(e) {
                gotoIndex(e.target.index);
                $('.single__challenge-slider-box').slick('slickGoTo', e.target.index, false);
            }

            $('.single__challenge-slider-box').on('swipe', function(event, slick, direction){
                gotoIndex(slick.currentSlide);
            });

            $('.single__challenge-slider-box').on('afterChange', function (event, slick, currentSlide) {
                gotoIndex(currentSlide);
            });

            function gotoIndex(targetIndex) {
                var distance = Math.abs(targetIndex - index) * spacing * .5;
                var duration = Math.min((distance / spacing) * .2, .4);
                TweenMax.to(dot, .15, {
                    scaleX: 1.5,
                    scaleY: .5,
                    transformOrigin: "bottom",
                    ease: Sine.easeOut,
                    yoyo: true,
                    repeat: 1
                });
                TweenMax.to(dot, duration, {
                    delay: .175,
                    x: targetIndex * spacing,
                    ease: Sine.easeInOut
                });
                TweenMax.to(dot, duration * .5, {
                    delay: .175,
                    y: -distance,
                    ease: Sine.easeOut,
                    yoyo: true,
                    repeat: 1,
                });
                enable(ringList[index]);
                disable(ringList[targetIndex]);
                index = targetIndex;
            }

            function enable(target) {
                target.setAttribute("pointer-events", "all");
            }

            function disable(target) {
                target.setAttribute("pointer-events", "none");
            }

            function paginate() {
                for (var i = 0; i < numItems; i++) {
                    var ring = createElement("circle", {
                        cx: initX + (i * spacing),
                        cy: "50%",
                        fillOpacity: 0,
                        r: radius,
                        stroke: '#ffffff',
                        cursor: "pointer",
                        strokeWidth: strokeWidth,
                    });
                    ring.index = i;
                    ringList.push(ring);
                    ring.color = '#ffffff';
                    ring.addEventListener("click", onSelect);
                    svg.appendChild(ring);
                }
            }

            function setAttributes(element, attributes) {
                var keyword, key;
                for (keyword in attributes) {
                    key = keyword.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                    element.setAttributeNS(keyword === "xlink:href" ? "http://www.w3.org/1999/xlink" : null, key, attributes[keyword]);
                }
            }

            function createElement(type, attributes) {
                var element = document.createElementNS("http://www.w3.org/2000/svg", type);
                setAttributes(element, attributes);
                return element;
            }
        }
    }

    function singleVideo() {
        var container = $('.single__video');
        var btn = $('.single__video-play');
        var video = container.find('video');

        btn.on('click', function () {
            container.addClass('played');
            video[0].play();
            video[0].controls = true;
        });
        video.on('click', function () {
            if (this.played) {
                this.pause();
                this.controls = false;
                container.removeClass('played');
            }
        })
    }
    singleVideo();

    var aboutController = {
        page: $('.page-template-about'),
        anchors: $('.about__benefits-box'),
        sections: document.querySelectorAll('.about__section'),
        footer: document.querySelectorAll('.footer'),
        copy: $('.copyright'),
        init: function () {
            this.initController();
            this.initAnchors();
        },
        initController: function () {
            anchors = this.anchors;
            sections = this.sections;
            footer = this.footer;
            sections.forEach(function (section) {
                var scene = new ScrollMagic.Scene({
                        triggerElement: section,
                        triggerHook: 0.9,
                        duration: "80%",
                        offset: 10
                    })
                    .on("enter", function () {
                        var sectionAttr = section.getAttribute('data-section');
                        anchors.find(`.about__benefits-item[data-section-anchor="${sectionAttr}"]`).addClass('active-item').removeClass('removePadding')
                    })
                    .on("leave", function () {
                        var sectionAttr = section.getAttribute('data-section');
                        anchors.find(`.about__benefits-item[data-section-anchor="${sectionAttr}"]`).removeClass('active-item').addClass('removePadding')
                    })
                    .addTo(controller);   
            })
            var footerScene = new ScrollMagic.Scene({
                triggerElement: footer,
                triggerHook: 0.9,
                duration: "100%",
                offset: 0
            })
            .on("enter", function () {     
                setTimeout(function () {
                    $('.page-template-about').addClass('hideSidebar');
                }, 500)
            })
            .on("leave", function () {
                $('.page-template-about').removeClass('hideSidebar');
            })
            .addTo(controller);   
        },
        initAnchors: function () {
            this.anchors.on('click', '.about__benefits-item', function () {
                var attr = $(this).attr('data-section-anchor');
                var offset = $('.main').find(`.about__section[data-section="${attr}"]`).offset().top;
                window.scrollTo({
                    top: offset - 120,
                    behavior: "smooth"
                });
            })
        }
    } 
    aboutController.init();
})