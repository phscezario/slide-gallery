/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/phscezario
 **/
 (function() {
    let isLgView = Boolean(document.body.clientWidth <= 1028);
    let isMdView = Boolean(document.body.clientWidth <= 768);
    let isSmView = Boolean(document.body.clientWidth <= 414);

    document.querySelectorAll('.my-slider-gallery').forEach( gallery => {
        let resizeTimeout;
        
        // Adiciona controladores
        gallery.innerHTML += `<div class="left"><span>‹</span></div>\n<div class="right"><span>›</span></div>\n<div class="dots"></div>`;

        const galleryData = getData(gallery);

        widthVerify(galleryData, true);
        
        // Adiciona Listeners
        galleryData.left.addEventListener('click', () => {
            moveLeft(galleryData);
        });
        galleryData.right.addEventListener('click', () => {
            moveRight(galleryData );
        });  

        if(galleryData.dots.innerHTML != '') {
            galleryData.left.style.height = `${galleryData.height}px`;
            galleryData.right.style.height = `${galleryData.height}px`;
        }
        else {
            galleryData.left.style.display = 'none';
            galleryData.right.style.display = 'none';
        }

        moveSlider(galleryData);

        // Auto Play 
        if (galleryData.autoPlay === 'yes') {
            if (galleryData.timeToPlay === 0 || isNaN(galleryData.timeToPlay)) 
            galleryData.timeToPlay = 10;
            autoPlay(galleryData);
        }

        window.addEventListener('resize', () => {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(() => {
                  resizeTimeout = null;
                  resizeWindow(galleryData);
                 }, 1000);
              }
        });
    });

    function getData(gallery) {
        const data  = {
            elementHTML: gallery,
            container: gallery.querySelector('.container'),
            children: gallery.querySelector('.container').querySelectorAll('.item'),
            left: gallery.querySelector('.left'),
            right: gallery.querySelector('.right'),
            dots: gallery.querySelector('.dots'),
            width: parseFloat(gallery.scrollWidth),
            height: Number(gallery.getAttribute('data-height')),
            itemsToShow: Number(gallery.getAttribute('data-show')),
            itemsSpacing: parseFloat(gallery.getAttribute('data-spacing')),
            autoPlay: gallery.getAttribute('data-autoplay'),
            timeToPlay: Number(gallery.getAttribute('data-time')),
            childrenWidth: null,
            totalWidth: gallery.offsetWidth,   
            monitorData: {
                itemsToShow: Number(gallery.getAttribute('data-lg-show')),
                monitorSpacing: Number(gallery.getAttribute('data-lg-spacing')),
                monitorHeight: Number(gallery.getAttribute('data-lg-height')),
            },
            tableData: {
                itemsToShow: Number(gallery.getAttribute('data-md-show')),
                itemsSpacing: Number(gallery.getAttribute('data-md-spacing')),
                height: Number(gallery.getAttribute('data-md-height')),
            },
            mobileData: {
                itemsToShow: Number(gallery.getAttribute('data-sm-show')),
                itemsSpacing: Number(gallery.getAttribute('data-sm-spacing')),
                height:  Number(gallery.getAttribute('data-sm-height'))
            }        
        };
        return setData(data);
    }

    function setData(data) {
        if (data.itemsToShow === 0 || isNaN(data.itemsToShow)) data.itemsToShow = 4;

        if (data.itemsSpacing === 0 || isNaN(data.itemsSpacing)) data.itemsSpacing = 10;

        if (data.height === 0 || isNaN(data.height)) data.height = data.children[0].style.height;

        if (isSmView) {
            if (data.mobileData.height !== 0 || isNaN(data.mobileData.height)) data.height = data.mobileData.height;

            if (data.mobileData.itemsSpacing !== 0 || isNaN(data.mobileData.itemsSpacing)) data.itemsSpacing =  data.mobileData.itemsSpacing;

            if (data.mobileData.itemsToShow !== 0 || isNaN(data.mobileData.itemsToShow )) data.itemsToShow = data.mobileData.itemsToShow;
            else data.itemsToShow = 2;

        } 
        else if (isMdView) {
            if (data.tabletData.height !== 0 || isNaN(data.tabletData.height)) data.height = data.tableData.height;

            if (data.tabletData.itemsSpacing !== 0 || isNaN(data.tabletData.itemsSpacing)) data.itemsSpacing =  data.tabletData.itemsSpacing;

            if (data.tabletData.itemsToShow !== 0 || isNaN(data.tabletData.itemsToShow)) data.itemsToShow = data.tabletData.itemsToShow;
            else data.itemsToShow = 4;            
        }
        else if (isLgView) {
            if (data.monitorData.height !== 0 || isNaN(data.monitorData.height)) data.height = data.monitorData.height;

            if (data.monitorData.itemsSpacing !== 0 || isNaN(data.monitorData.itemsSpacing)) data.itemsSpacing =  data.monitorSpacing;

            if (data.monitorData.itemsToShow !== 0 || isNaN(data.monitorData.itemsToShow)) data.itemsToShow = data.monitorData.itemsToShow;
            else data.itemsToShow = 6;
        }

        return data;
    }

    // Eventos
    function moveLeft(gallery) {
        if (gallery.container.scrollLeft === 0) gallery.container.scrollLeft = gallery.totalWidth;
        else gallery.container.scrollLeft -= gallery.childrenWidth + gallery.itemsSpacing;        

        verifyActiveDot(gallery);

        if (gallery.autoPlay === 'yes') autoPlay(gallery);

    }

    function moveRight(gallery) {
        if ((gallery.container.scrollLeft + gallery.width) + (gallery.itemsSpacing * 2) >= gallery.container.scrollWidth) 
            gallery.container.scrollLeft = 0;    

        else gallery.container.scrollLeft += gallery.childrenWidth + gallery.itemsSpacing;        

        verifyActiveDot(gallery);

        if (gallery.autoPlay === 'yes') autoPlay(gallery);
        
    }
    
    function widthVerify(gallery, firstTime = false) {        
        gallery.childrenWidth = Math.floor((gallery.width / gallery.itemsToShow) + (gallery.itemsSpacing / gallery.itemsToShow) - gallery.itemsSpacing);
        gallery.totalWidth = (gallery.childrenWidth + gallery.itemsSpacing) * gallery.children.length - gallery.itemsSpacing;

        gallery.children.forEach( e => {
            e.style.height = `${gallery.height}px`;
            e.style.width = `${gallery.childrenWidth}px`;
            e.style.marginRight = `${gallery.itemsSpacing}px`;

            if (firstTime) {
                e.addEventListener('selectstart', preventEvent); 
                e.addEventListener('dragstart', preventEvent);
            }
        });

        addDots(gallery);
    }

    function addDots(gallery){
        const dotNum = gallery.totalWidth / gallery.width;
        
        if (dotNum > 1){
            let position = 0 - gallery.itemsSpacing;
            let i;

            for(i = 1; i < dotNum; i++){
                gallery.dots.innerHTML += `<div rel="${i}" data-location="${position}"></div>`;
                position += (gallery.width - i); 
            }
            if (gallery.totalWidth - position > gallery.childrenWidth){
                gallery.dots.innerHTML += `<div rel="${i}" data-location="${position}"></div>`;
            }

            gallery.container.scrollLeft = 0;
            gallery.dots.childNodes[0].classList.add('active');

            gallery.dots.querySelectorAll('div').forEach( element => {
                element.addEventListener('click', () => {
                    verifyActiveDot(gallery, element);
                });
            });
        }
    }

    function autoPlay(gallery){
        if (!gallery.isChanging) {
            clearTimeout(gallery.galleryAutoPlay);
            
            gallery.elementHTML.addEventListener('mouseover', () => {
                clearTimeout(gallery.galleryAutoPlay);
            });

            gallery.galleryAutoPlay =  setTimeout(() => {
                return  moveRight(gallery);
            }, gallery.timeToPlay * 1000);

            gallery.elementHTML.addEventListener('mouseleave', () => {
                gallery.galleryAutoPlay =  setTimeout(() => {
                    return  moveRight(gallery);
                }, gallery.timeToPlay * 1000);
            });

            gallery.isChanging = true;    

            setTimeout(() => {
            gallery.isChanging = false;
            }, 500); 
        }
    }

    // Mouse slider
    function moveSlider(gallery) {
        const items = gallery.children;
        let isDown = false;
        let startX;
        let scrollLeft;        

   
        gallery.container.addEventListener('mousedown', e => {
            isDown = true;
            gallery.container.classList.add('slider');
            startX = e.pageX - gallery.container.offsetLeft; // Define local do click no eixo X
            scrollLeft = gallery.container.scrollLeft;      // Define o local do scroll              
        });
        gallery.container.addEventListener('mouseup', e => {
            isDown = false;
            gallery.container.classList.remove('slider');   
            items[0].style.marginLeft = '0px';
            items[items.length - 1].style.marginRight = '0px';  
            
            preventClick(e, gallery, startX);
        });

        gallery.container.addEventListener('mouseout', e => {
            isDown = false;
            gallery.container.classList.remove('slider');   
            items[0].style.marginLeft = '0px';
            items[items.length - 1].style.marginRight = '0px';  
            
            preventClick(e, gallery, startX);
        });

        gallery.container.addEventListener('mousemove', e => {
            if (!isDown) return; // Parar de executar se for false
            e.preventDefault();
            const x = e.pageX - gallery.container.offsetLeft; // Define local onde click foi solto
            const walk = (x - startX);              // Distancia a percorrer, aumentar a velocidade com * N
            gallery.container.scrollLeft = scrollLeft - walk; // Movimenta scroll do elemento
            
            if (gallery.container.scrollLeft == 0 && startX < x) {
            items[0].style.marginLeft = '20px';
            }
            if (gallery.container.scrollLeft === gallery.container.scrollWidth - gallery.container.clientWidth && startX > x){
                items[items.length - 1].style.marginRight = '20px';
            }

            verifyActiveDot(gallery); 
        });

        gallery.container.addEventListener('touchstart', e => {
            isDown = true;
            gallery.container.classList.add('slider');
            startX = e.changedTouches[0].pageX - gallery.container.offsetLeft; // Define local do click no eixo X
            scrollLeft = gallery.container.scrollLeft;                        // Define a local do scroll 
            
        });
        gallery.container.addEventListener('touchend', e => {
            isDown = false;
            gallery.container.classList.remove('slider');   
            items[0].style.marginLeft = '0px';
            items[items.length - 1].style.marginRight = '0px';

            preventClick(e, gallery, startX);
        });
        gallery.container.addEventListener('touchmove', e => {
            if (!isDown) return; // Parar de executar se for false
            e.preventDefault();
            const x = e.changedTouches[0].pageX - gallery.container.offsetLeft; // Define local onde click foi solto
            gallery.container.scrollLeft = scrollLeft - (x - startX);         // Movimenta scroll do elemento
            
            if (gallery.container.scrollLeft == 0 && startX < x) {
            items[0].style.marginLeft = '20px';
            }
            if (gallery.container.scrollLeft === gallery.container.scrollWidth - gallery.container.clientWidth && startX > x){
                items[items.length - 1].style.marginRight = '20px';
            }

            verifyActiveDot(gallery); 
        });               
    }

    function preventClick(e, gallery, startX) {
        // Impede que links funcionem se mouse estiver em movimento
        if (startX != e.pageX - gallery.container.offsetLeft) {
            gallery.children.forEach(el => {
                el.querySelectorAll('a').forEach(e => {
                    e.addEventListener('click', preventEvent);
                });
            })

            // Executa o SNAP que da erro apenas com CSS em todos navegadores
            for(let i = 0; i <= gallery.children.length; i++){
                const width = gallery.children[0].scrollWidth;
                const position = ((width * (i + 1)) + (width / 2)) + (gallery.itemsSpacing * (i + 1));
                
                if (gallery.container.scrollLeft < (width / 2) + gallery.itemsSpacing / 2) {
                    gallery.container.scrollLeft = 0;
                    break;
                }

                if ((gallery.container.scrollLeft + gallery.width) + (gallery.itemsSpacing * 2) >= gallery.container.scrollWidth) {
                    gallery.container.scrollLeft = gallery.totalWidth;
                    break;
                }

                if (gallery.container.scrollLeft < position + gallery.itemsSpacing / 2) {
                    gallery.container.scrollLeft = position - (width / 2);
                    break;
                }
            }
        }
        else {
            gallery.children.forEach(el => {
            el.querySelectorAll('a').forEach(e => {
                e.removeEventListener('click', preventEvent);
                });
            });
        }
    }

    //Verificar dots que vai "acender"
    function  verifyActiveDot(gallery, element = null){
        setTimeout( () => { 
            for (let i = 0; i < gallery.dots.childNodes.length; i++) {
                const prevChild = i - 1;
                const nextChild = i + 1;
                const e = gallery.dots.childNodes[i];
                const location = Number(e.getAttribute('data-location'));         

                if (element !== null){
                    const elLoc = Number(element.getAttribute('data-location'));
                    element.classList.add('active');
                    if (elLoc === location) gallery.container.scrollLeft = elLoc + (gallery.itemsSpacing * nextChild);
                    else e.classList.remove('active');
                }
                else {
                    if ((gallery.container.scrollLeft - (gallery.itemsSpacing * nextChild)) >= location) {
                        if ( nextChild > 1 ) gallery.dots.childNodes[prevChild].classList.remove('active');
                        e.classList.add('active');

                    } else {
                        e.classList.remove('active');

                        if ((gallery.container.scrollLeft + gallery.width) + (gallery.itemsSpacing * 2) >= gallery.container.scrollWidth) {
                            gallery.dots.childNodes[ gallery.dots.childNodes.length - 2 ].classList.remove('active');
                            gallery.dots.childNodes[ gallery.dots.childNodes.length - 1 ].classList.add('active');
                        }
                    }
                }
            };
        }, 200);
    }
   
    function resizeWindow(gallery) {
        isLgView = Boolean(document.body.clientWidth <= 1028);
        isMdView = Boolean(document.body.clientWidth <= 768);
        isSmView = Boolean(document.body.clientWidth <= 414);

        gallery.dots.innerHTML = '';
        widthVerify(gallery);
        gallery.container.style.height = `${gallery.height}px`;
    }

    // O método preventDefault foi colocado em um função para ser removido facilmente
    function preventEvent(element){    
        element.preventDefault();
    }
})();