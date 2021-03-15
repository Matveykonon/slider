const input = document.querySelector('#file');
const carousel = document.querySelector('#carousel');
//buttons
const open = document.querySelector('#open');
const timerBtn = document.querySelector('#timer');
const leftArea = document.querySelector('.toggle-left');
const rightArea = document.querySelector('.toggle-right');
//settings
const width = 700;
let reverseStep = 0;
let step = 0;
let offset = 0;
const interval = 3000;
const time = 15;
input.setAttribute('multiple', true);
input.setAttribute('accept', '.png, .jpeg, .jpg'); // type of images

const openInput = () => input.click()

async function imagesSelected(event) {
    carousel.querySelectorAll('.carousel__image').forEach(el => el.parentNode.removeChild(el));
    const files = [...event.target.files];
    images = await Promise.all(files.map(f=>{return readAsDataURL(f)}));
    if (images.length < 3) {
        alertMessage('Минимальное количество слайдов: 3');
        return;
    } else {
        activeteButtons();
        firstRender(images);
    }
}


function readAsDataURL(file) {
    return new Promise((resolve)=>{
        let fileReader = new FileReader();
        fileReader.onload = function(){
            return resolve(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    })
} 


const alertMessage = (message) => {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    dialog.innerHTML = message;
    document.body.append(dialog)
    setTimeout(() => {
        dialog.remove()
    }, 3000)
}


const firstRender = arr => {
    if (!arr) {
        return
    }
    let emp = []
    let off = 0;
    let firstArr = emp.concat(arr[arr.length-1], arr[0], arr[1]);
    for (let i = 0; i < firstArr.length; i++) {
        const img = document.createElement('img');
        img.src = firstArr[i];
        img.classList.add('carousel__image');
        img.style.left = -width + off*width + 'px';
        carousel.append(img);
        off++;
    }
    if (arr.length > 2) {
        reverseStep = arr.length - 2;
        step = 2;
    } else {
        reverseStep = arr.length - 1;
        step = arr.length - 1;
    }
}


function render(direction) {
    switch (direction) {
        case 'left':
            const img = document.createElement('img');
            img.src = images[step];
            img.classList.add('carousel__image');
            img.style.left = width + 'px';
            carousel.append(img);
            if (step + 1 === images.length) {
                step = 0;
            } else {
                step++;
            }
            if (reverseStep + 1 === images.length) {
                reverseStep = 0;
            } else {
                reverseStep++;
            }
        break;
        case 'right':
            const image = document.createElement('img');
            image.src = images[reverseStep];
            image.classList.add('carousel__image');
            image.style.left = -width + 'px';
            carousel.prepend(image);
            if (step === 0) {
                step = images.length - 1;
            } else {
                step--;
            }
            if (reverseStep === 0) {
                reverseStep = images.length - 1
            } else {
                reverseStep--;
            }
        break;
  
    }
}


const left = () => {
    rightArea.onclick = null;
    let visibleSlides = Array.from(document.querySelectorAll('.carousel__image'));
    let offsetVisible = -1;
    for (let i = 0; i < visibleSlides.length; i++) {
        visibleSlides[i].style.left = offsetVisible*width - width + 'px';
        offsetVisible++;
    }
    setTimeout(()=>{
        visibleSlides[0].remove();
        render('left');
        rightArea.onclick = left;
    }, 700)
}


const right = () => {
    leftArea.onclick = null;
    let visibleSlides = Array.from(document.querySelectorAll('.carousel__image'));
    let offsetVisible = -1;
    for (let i = 0; i < visibleSlides.length; i++) {
        visibleSlides[i].style.left = offsetVisible*width + width + 'px';
        offsetVisible++;
    }
    setTimeout(()=>{
        visibleSlides[visibleSlides.length-1].remove();
        render('right');
        leftArea.onclick = right;
    }, 700)
}


const timer = () => {
    open.setAttribute('disabled', true)
    const times = images.length;
    const i = setInterval(left, 2000);
    setTimeout(() => {
        clearInterval(i);
        open.removeAttribute("disabled")
    }, times*6000);
    
}


function activeteButtons() {
    rightArea.onclick = left;
    leftArea.onclick = right;
    timerBtn.onclick = timer;
}


open.addEventListener('click', openInput);
input.addEventListener('change', imagesSelected);