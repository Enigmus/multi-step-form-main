const multistep = document.getElementById('multistep');

const steps = document.querySelectorAll('.steps__step');
const sideBarStepCircle = document.querySelectorAll('.sidebar__step-circle');
const plans = document.querySelectorAll('.plan');
const duration = document.getElementById('duration');
const addOns = document.querySelectorAll('.add-on__label');

let dataPricePlan;                      //Массив тарифов
let dataAddOns;                         //Масиив дополнений
let activeStep = 2;                     //стартовый шаг
let totalSteps = steps.length;          //всего шагов
const lengthTel = 11;                   //количество символов в номере телефона
let durationCheck = false;              //начальное положение переключателя месяц/год    

const phone = IMask(
    document.getElementById('phone'), {
      mask: '+{7} 000 000 00 00'
    }); 


//Buttons
const btnBack = document.getElementById('btnBack');
const btnNext = document.getElementById('btnNext');
const btnConfirm = document.getElementById('btnConfirm');
const btns = document.querySelector('.multistep__buttons');
const changeLink = document.querySelector('.finishing__plan-link');

//Events
btnNext.addEventListener('click', handlerBtnNext);          //нажатие на кнопку назад
btnBack.addEventListener('click', handlerBtnBack);          //нажатие на кнопку следующий
duration.addEventListener('change', changeDuration);        //нажатие на переключатель срока (месяц / год)
changeLink.addEventListener('click', clickChangeLink);      //нажатие на ссылку Change
btnConfirm.addEventListener('click', handlerbtnConfirm);
multistep.addEventListener('submit', handlerSubmitForm);

document.addEventListener('DOMContentLoaded', init);        //Стартовые установки


//Handlers
//Стартовые установки
function init(){    
    activeStepShow(activeStep);
    dataPricePlan = addDataPlan();
    dataAddOns = addDataAddOn();
}

function handlerBtnNext(){
    if(validData()){    
        activeStep++;
        activeStepShow(activeStep);
    }
    if(activeStep === totalSteps -1){
        generateTotal();
    }
}

function handlerBtnBack(){
    activeStep--;
    activeStepShow(activeStep);
}

//переключатель месяц / год
function changeDuration(){
    durationCheck = duration.checked;
    if(duration.checked){
        document.querySelectorAll('.plan__price').forEach((planPrice, index)=>{
            planPrice.innerText = `$${dataPricePlan[index].pyear}/yr`;
            planPrice.nextElementSibling.classList.remove('plan__gift_hide');
        });
        document.querySelectorAll('.add-on__price').forEach((addonPrice, index)=>{
            addonPrice.innerText = `$${dataAddOns[index].pyear}/yr`;
        });
    }else{
        document.querySelectorAll('.plan__price').forEach((planPrice, index)=>{
            planPrice.innerText = `$${dataPricePlan[index].pmonth}/mo`;
            planPrice.nextElementSibling.classList.add('plan__gift_hide');
        });
        document.querySelectorAll('.add-on__price').forEach((addonPrice, index)=>{
            addonPrice.innerText = `$${dataAddOns[index].pmonth}/mo`;
        });
    }
}

function clickChangeLink(event){
    event.preventDefault();
    activeStep = 2;
    activeStepShow(activeStep);
}

function handlerSubmitForm(event){
    event.preventDefault();
}

function handlerbtnConfirm(event){
    serializeForm(multistep);
    
    activeStep = totalSteps;
    activeStepShow(activeStep);
}


//***************************/
function serializeForm(formNode) {
    const { elements } = formNode

    const data = Array.from(elements)
      .map((element) => {
        const { name, type } = element
        const value = type === 'checkbox' ? element.checked : element.value
        if(type === 'radio'){
            if(!element.checked){
                return false;
            }
        }  
        if(!value){
            return false;
        }
        return { name, value }
      })
      .filter((item) => !!item.name)
  
    console.log(data)
}
//Проверяем, введены ли данные Имя, Почта, Телефон
function validData(){
    clearError();
    
    const name = document.getElementById('name');
    if(name.value.trim() === ''){
        document.getElementById('nameError').classList.add('personal-info__error_show');
        return false;
    }
    const email = document.getElementById('email');
    if(!validateEmail(email.value)){
        document.getElementById('emailError').classList.add('personal-info__error_show');
        return false;
    }

    const phone = document.getElementById('phone');
    if(phone.value.replace(/[^0-9]/g,'').length != lengthTel){
        document.getElementById('phoneError').classList.add('personal-info__error_show');
        return false;
    }
    return true;
}

//Валидация емейла
function validateEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email.toLowerCase());
};


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
            num = totalSteps - 1;
        }
        sideBarStepCircle.forEach((circle)=>circle.classList.remove('sidebar__step-circle_active'));
        sideBarStepCircle[num - 1].classList.add('sidebar__step-circle_active');
    } catch (err){
        console.dir(err.message);
    }
}

function clearError(){
    const errors = document.querySelectorAll('.personal-info__error');
    errors.forEach((error) => error.classList.remove('personal-info__error_show'));
}


function addDataPlan(){
    let data = [];
    plans.forEach((plan) => {
        const checked = plan.querySelector('.plan__radio').checked;
        const planName = plan.querySelector('.plan__title').innerText
        const planPrice = plan.querySelector('.plan__price');
        const planPriceMonth = planPrice.dataset.month;
        const planPriceYear = planPrice.dataset.year;
        return data.push(                
                {   
                    checked,
                    planName,
                    pmonth: planPriceMonth,
                    pyear: planPriceYear,
                }
        );
    });
    return data;
}

function addDataAddOn(){
    let data = [];
    addOns.forEach((addon)=>{
        const checked = addon.previousElementSibling.checked;
        const nameAddon = addon.querySelector('.add-on__title').innerText;
        const priceAddon = addon.querySelector('.add-on__price');
        const pmonth = priceAddon.dataset.month;
        const pyear = priceAddon.dataset.year;
        return data = [
            ...data,
            {   
                checked,
                nameAddon,
                pmonth,
                pyear
            }
        ]
    });   
    return data;
}


function generateTotal(){
    let totalPrice = 0;    
    let month = '(Monthly)';
    let year = '(Yearly)';

    const plans = addDataPlan();
    const addons = addDataAddOn();

    const planName = document.querySelector('.finishing__plan-name');
    const planPeriod = document.querySelector('.finishing__plan-period');
    const planPrice = document.querySelector('.finishing__plan-price');

    const listAddons = document.querySelector('.finishing__addons');
    listAddons.innerHTML = '';

    const total = document.querySelector('.finishing__total-price');
    const totalPeriod = document.querySelector('.finishing__total-period');

    plans.forEach((plan)=>{
        if(plan.checked){
            planName.innerText = plan.planName;
            if(!durationCheck){
                planPrice.innerText = `$${plan.pmonth}/mo`;
                planPeriod.innerText = month
                totalPrice += +plan.pmonth;
            }else{
                planPrice.innerText = `$${plan.pyear}/yr`;
                planPeriod.innerText = year;
                totalPrice += +plan.pyear;
            }
        }
    })
    addons.forEach((addon)=>{
        if(addon.checked){
            const divAddon = document.createElement('div');
            divAddon.className = 'finishing__addon';
            const divAddonName = document.createElement('div');
            divAddonName.className = 'finishing__addon-name'
            divAddonName.innerText = addon.nameAddon;
            const divAddonPrice = document.createElement('div');
            divAddonPrice.className = 'finishing__addon-price';
            
            if(!durationCheck){
                divAddonPrice.innerText = `$${addon.pmonth}/mo`;
                totalPrice += +addon.pmonth;
            }else{
                divAddonPrice.innerText = `$${addon.pyear}/yr`;
                totalPrice += +addon.pyear;
            }
            divAddon.appendChild(divAddonName);
            divAddon.appendChild(divAddonPrice);

            listAddons.appendChild(divAddon)
        }
    });

    if(!durationCheck){
        total.innerText = `+$${totalPrice}/mo`;
        totalPeriod.innerText = '(per month)';
    }else{
        total.innerText = `+$${totalPrice}/yr`;
        totalPeriod.innerText = '(per year)';
    }       
}


