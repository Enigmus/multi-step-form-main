const miltistep = document.querySelector('.multistep');

const steps = document.querySelectorAll('.steps__step');
const sideBarStepCircle = document.querySelectorAll('.sidebar__step-circle');

console.log(sideBarStepCircle[5]);

let activeStep = 1;
let totalSteps = steps.length;

const em = '/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

const phone = IMask(
    document.getElementById('phone'), {
      mask: '+{7} 000 000 00 00'
    }); 

    console.log(phone);

//Buttons
const btnBack = document.getElementById('btnBack');
const btnNext = document.getElementById('btnNext');
const btnConfirm = document.getElementById('btnConfirm');

const btns = document.querySelector('.miltistep__buttons');

//Events
btnNext.addEventListener('click', handlerBtnNext);
btnBack.addEventListener('click', handlerBtnBack);

document.addEventListener('DOMContentLoaded', init);


//Handlers
function init(){    
    activeStepShow(activeStep);
}
function handlerBtnNext(){
    if(validData){    
        console.log(phone.unmaskedValue        );
        activeStep++;
        activeStepShow(activeStep);
    }
}

function handlerBtnBack(){
    activeStep--;
    activeStepShow(activeStep);
}


//***************************/
//Проверяем, введены ли данные Имя, Почта, Телефон
function validData(){
    return true;
}

//Отобразить нужный шаг
function activeStepShow(num){
   steps.forEach((step)=>step.classList.add('step_hide')); 
   steps[num - 1].classList.remove('step_hide');
   showBtn(num);
   sideBarStepCircleActive(num);
}


//В зависимости от этапа отображаем кнопки, вперед, назад, отправить
function showBtn(num){
    if(num === 1){
        btnBack.classList.add('btn_invisible');
    }else{
        btnBack.classList.remove('btn_invisible');
    }
    if(num === totalSteps -1){
        btnNext.classList.remove('btn_show');
        btnConfirm.classList.add('btn_show');
    }else{
        btnNext.classList.add('btn_show');
        btnConfirm.classList.remove('btn_show');
    }
    if(num === totalSteps){
        btns.style.display = 'none';
    }
}

//Подсвечиваем кружок в боковой панеле
function sideBarStepCircleActive(num){
    try{
        if(sideBarStepCircle[num - 1] === undefined){
            throw new Error('Не найден объект с классом .sidebar__step-circle');
        }
        sideBarStepCircle.forEach((circle)=>circle.classList.remove('sidebar__step-circle_active'));
        sideBarStepCircle[num - 1].classList.add('sidebar__step-circle_active');
    } catch (err){
        console.dir(err.message);
    }
}

