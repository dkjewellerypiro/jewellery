// =======================================
// DK Jewellery Showcase
// Main Gallery
// =======================================

const slider = document.getElementById("imageSlider");

const slides = [...document.querySelectorAll(".gallery-slide")];

const thumbs = [...document.querySelectorAll(".thumb")];

const dots = [...document.querySelectorAll(".dot")];

let currentSlide = 0;

let startX = 0;

let isDragging = false;

const totalSlides = slides.length;


// =======================================
// Update Gallery
// =======================================

function updateGallery(animated = true){

    if(!slider) return;

    slider.style.transition = animated
        ? "transform .35s ease"
        : "none";

    slider.style.transform =
        `translateX(-${currentSlide*100}%)`;

    thumbs.forEach((thumb,index)=>{

        thumb.classList.toggle(
            "active",
            index===currentSlide
        );

    });

    dots.forEach((dot,index)=>{

        dot.classList.toggle(
            "active",
            index===currentSlide
        );

    });

}


// =======================================
// Show Slide
// =======================================

function showSlide(index){

    if(index<0){

        index=0;

    }

    if(index>=totalSlides){

        index=totalSlides-1;

    }

    currentSlide=index;

    updateGallery();

}


// =======================================
// Next
// =======================================

function nextSlide(){

    currentSlide++;

    if(currentSlide>=totalSlides){

        currentSlide=0;

    }

    updateGallery();

}


// =======================================
// Previous
// =======================================

function previousSlide(){

    currentSlide--;

    if(currentSlide<0){

        currentSlide=totalSlides-1;

    }

    updateGallery();

}


// =======================================
// Thumbnail Click
// =======================================

thumbs.forEach((thumb,index)=>{

    thumb.onclick=()=>{

        showSlide(index);

    };

});


// =======================================
// Dot Click
// =======================================

dots.forEach((dot,index)=>{

    dot.onclick=()=>{

        showSlide(index);

    };

});


// =======================================
// Swipe Main Gallery
// =======================================

if(slider){

    slider.addEventListener(
        "touchstart",
        e=>{

            startX =
                e.touches[0].clientX;

            isDragging=true;

        },
        {passive:true}
    );

    slider.addEventListener(
        "touchend",
        e=>{

            if(!isDragging)
                return;

            isDragging=false;

            const endX =
                e.changedTouches[0].clientX;

            const diff =
                endX-startX;

            if(Math.abs(diff)<50)
                return;

            if(diff<0){

                nextSlide();

            }else{

                previousSlide();

            }

        },
        {passive:true}
    );

}
// =======================================
// Fullscreen Viewer
// =======================================

const viewer = document.getElementById("imageViewer");

const viewerImage = document.getElementById("viewerImage");

const closeViewer = document.getElementById("closeViewer");

const prevBtn = document.getElementById("prevImage");

const nextBtn = document.getElementById("nextImage");

const counter = document.getElementById("viewerCounter");

let viewerIndex = 0;


// =======================================
// Update Viewer
// =======================================

function updateViewer(){

    if(!viewerImage) return;

    const img =
        slides[viewerIndex]
        ?.querySelector("img");

    if(!img) return;

    viewerImage.src = img.src;

    if(counter){

        counter.textContent =
            `${viewerIndex+1} / ${totalSlides}`;

    }

}


// =======================================
// Open Viewer
// =======================================

function openViewer(index){

    if(!viewer) return;

    viewerIndex = index;

    updateViewer();

    viewer.classList.add("show");

    document.body.style.overflow="hidden";

}


// =======================================
// Close Viewer
// =======================================

function hideViewer(){

    if(!viewer) return;

    viewer.classList.remove("show");

    document.body.style.overflow="";

}


// =======================================
// Main Image Click
// =======================================

slides.forEach((slide,index)=>{

    slide.onclick = ()=>{

        openViewer(index);

    };

});


// =======================================
// Close Button
// =======================================

if(closeViewer){

    closeViewer.onclick = hideViewer;

}


// =======================================
// Background Click
// =======================================

if(viewer){

    viewer.addEventListener("click",e=>{

        if(e.target===viewer){

            hideViewer();

        }

    });

}


// =======================================
// Previous Image
// =======================================

if(prevBtn){

    prevBtn.onclick=()=>{

        viewerIndex--;

        if(viewerIndex<0){

            viewerIndex=totalSlides-1;

        }

        updateViewer();

    };

}


// =======================================
// Next Image
// =======================================

if(nextBtn){

    nextBtn.onclick=()=>{

        viewerIndex++;

        if(viewerIndex>=totalSlides){

            viewerIndex=0;

        }

        updateViewer();

    };

}


// =======================================
// Keyboard
// =======================================

document.addEventListener("keydown",e=>{

    if(!viewer) return;

    if(!viewer.classList.contains("show"))
        return;

    switch(e.key){

        case "ArrowLeft":

            prevBtn?.click();

            break;

        case "ArrowRight":

            nextBtn?.click();

            break;

        case "Escape":

            hideViewer();

            break;

    }

});
// =======================================
// Image Loading
// =======================================

document.querySelectorAll(".product-image").forEach(img=>{

    img.addEventListener("load",()=>{

        img.classList.add("loaded");

    });

    if(img.complete){

        img.classList.add("loaded");

    }

});


// =======================================
// Preload Images
// =======================================

slides.forEach(slide=>{

    const img = slide.querySelector("img");

    if(!img) return;

    const preload = new Image();

    preload.src = img.src;

});


// =======================================
// Swipe Viewer
// =======================================

let viewerTouchStart = 0;

if(viewer){

    viewer.addEventListener("touchstart",e=>{

        viewerTouchStart =
            e.touches[0].clientX;

    },{passive:true});

    viewer.addEventListener("touchend",e=>{

        const end =
            e.changedTouches[0].clientX;

        const diff = end - viewerTouchStart;

        if(Math.abs(diff)<50)
            return;

        if(diff<0){

            if(nextBtn)
                nextBtn.click();

        }else{

            if(prevBtn)
                prevBtn.click();

        }

    },{passive:true});

}


// =======================================
// Double Tap Zoom
// =======================================

let zoomed = false;

let lastTap = 0;

if(viewerImage){

    viewerImage.addEventListener("touchend",()=>{

        const now = Date.now();

        if(now-lastTap<300){

            zoomed=!zoomed;

            viewerImage.style.transition =
                "transform .25s ease";

            viewerImage.style.transform =
                zoomed
                ? "scale(2)"
                : "scale(1)";

        }

        lastTap=now;

    });

}


// =======================================
// Prevent Image Drag
// =======================================

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});


// =======================================
// Sync Viewer With Gallery
// =======================================

function syncViewer(){

    if(!viewer) return;

    if(!viewer.classList.contains("show"))
        return;

    viewerIndex=currentSlide;

    updateViewer();

}


// =======================================
// Override Gallery Functions
// =======================================

const originalNext = nextSlide;

const originalPrev = previousSlide;

nextSlide = function(){

    originalNext();

    syncViewer();

}

previousSlide = function(){

    originalPrev();

    syncViewer();

}


// =======================================
// Orientation Change
// =======================================

window.addEventListener("resize",()=>{

    updateGallery(false);

});


// =======================================
// Initial Load
// =======================================

window.addEventListener("load",()=>{

    updateGallery(false);

});


// =======================================
// Done
// =======================================

console.log("DK Jewellery Showcase Loaded");