//Current time on webpage, also returns current time for use in methods.
function digitalClock(){
    const date = new Date();
    const time = date.toLocaleTimeString();
    const today = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    document.getElementById("time").innerHTML =  today + "-" + month + "-"+ year + " " + " " + time;
    return time.slice(0,5);
    }
setInterval(digitalClock,1000);

//parent class Employees
class Employee{
    constructor(obj){
        this.name = obj.name;
        this.surname = obj.surname;
    }
}

//StaffMember class inherits from Employee
class StaffMember extends Employee{
    constructor(obj){
    super(obj);
        this.picture = obj.picture;
        this.email = obj.email;
        this.status = obj.status;
        this.outTime = obj.outTime;
        this.duration = obj.duration;
        this.expectedReturn = obj.expectedReturn;
    }
    //method to alert user if staff member is delayed on office break.
    staffMemberIsLate(picture,name,surname,duration){
          $("#staffToastmessage").prepend(`<image src="${picture}"> </image><br> Staff not returned at expected time : ${name} ${surname} <br> Staff has been out of office for : ${duration}`);  
                $("#staffToast").toast("show");   
            }               
}

//DeliveryDriver class inherits from Employee
class DeliveryDriver extends Employee{
    constructor(obj){
    super(obj);
        this.vehicle = obj.vehicle;
        this.telephone = obj.telephone;
        this.deliveryAdress = obj.deliveryAdress;
        this.returnTime = obj.returnTime;
    }
    //method to alert user if delivery is delayed on route.
    deliveryDriverIsLate(name,surname,telephone,deliveryAdress,returnTime){
            $("#deliveryLateToastmessage").prepend(`Delivery driver overdue expected return : <br> ${name} ${surname}. <br> Phone number: ${telephone}. <br> Delivery Adress: ${deliveryAdress}. <br> Estimated return time: ${returnTime}`);
                $("#deliveryLateToast").toast("show");
        }
}

//get API "staff member".
function staffUserGet(){
let staff = {};
$.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    async: false,
    success: function(data){
        let obj = {
            picture : data.results[0].picture.thumbnail,
            name : data.results[0].name.first,
            surname : data.results[0].name.last,
            email : data.results[0].email,
            status : "Out",
            outTime : null,
            duration : null,
            expectedReturn : null
        }
        staff = new StaffMember(obj);
    },
    error: function(){
        alert("Staff unable to upload, apologies for the inconvenience, please retry later.")
    }
  });
return staff;
};

//5 "staff members".
let employee0 = staffUserGet();
let employee1 = staffUserGet();
let employee2 = staffUserGet();
let employee3 = staffUserGet();
let employee4 = staffUserGet();
let staff = [employee0,employee1,employee2,employee3,employee4];

//staffTable rows and cells
function fillStaffTable(obj){
    const tablebody = document.querySelector("#staffTable tbody");
    const row = tablebody.insertRow();
    row.insertCell(0).innerHTML = `<image src="${obj.picture}"></image>`;
    row.insertCell(1).innerHTML = obj.name;
    row.insertCell(2).innerHTML = obj.surname;
    row.insertCell(3).innerHTML = obj.email;
    row.insertCell(4).innerHTML = obj.status;
    row.insertCell(5).innerHTML = obj.outTime;
    row.insertCell(6).innerHTML = obj.duration;
    row.insertCell(7).innerHTML = obj.expectedReturn;   
};

//load employees onto staffTable
fillStaffTable(employee0);
fillStaffTable(employee1);
fillStaffTable(employee2);
fillStaffTable(employee3);
fillStaffTable(employee4);

//table animation on click staffTable, adding class for when selected.
$("#staffTable tr").click(function(){
      let rowSelected = $(this).hasClass("rowselected");
       $("#staffTable tr").removeClass("rowselected");
      if(!rowSelected)
      $(this).addClass("rowselected");
}); 

//option for user, Staff end day or break.
function outOrEnd(){
   $("#staffOutToast").toast("show"); 
}

//hides staffToast and clears info.
function takeActionStaff(){
    $("#staffToast").toast("hide");
    clearToast('staff');
}

//get selected object in array of staffmembers, matching the rownumber in tbody.
function getSelectedObject(){
    let rowSelected = $(".rowselected");
    let index = $("tbody tr").index(rowSelected);
    let obj = staff[index];
    return obj;
}

//staff goin out for break/awaytime from workday.
function staffOut(){
    $("#staffOutToast").toast("hide");
    let obj = getSelectedObject();
    let hours = parseInt(digitalClock().slice(0,2));
    const minutes = parseInt(digitalClock().slice(3,5));
    let away = prompt("Enter estimated away time in minutes:","enter minutes")
    obj.status = "Break";
    obj.outTime = (minutes < 10) ? (hours + ":0" + minutes) : (hours + ":" + minutes);
        let hour = Math.floor(+away/60);
        let minute = (+away-(hour*60));
    obj.duration = (+away < 60) ?  (away + "min") : (hour + "hr " + minute + "min");
        let x = +away + minutes;
        while(x >= 60){x -= 60;hours += 1; obj.expectedReturn = (x <= 10) ? (hours + ":0" + x) : (hours + ":" + x);}       
    obj.expectedReturn = (hours + ":" + x);
    obj.minutesaway = away; 
        updateTable(obj);                   
}

//staff going home for the day, status out and clears time, duration, expected return.
function staffEnd(){
    $("#staffOutToast").toast("hide");
    obj = getSelectedObject();
    obj.status = "Out";
    obj.outTime = null;
    obj.duration = null;
    obj.expectedReturn = null;
    updateTable(obj); 
}

//changes status to in on relevant object, clears out time, duration, expected return.
function staffIn(){
    obj = getSelectedObject();
    obj.status = "In";
    obj.outTime = null;
    obj.duration = null;
    obj.expectedReturn = null;
    updateTable(obj);
}

//Timeout for staff tracking return Time.
let staffTimeout; 

//updates table after object update.
function updateTable(obj){
    let rowSelected = $(".rowselected")
    let index = $("tr").index(rowSelected);
    let cells = document.getElementById("staffTable").rows[index].cells;
    cells[4].innerHTML = obj.status;
    cells[5].innerHTML = obj.outTime;
    cells[6].innerHTML = obj.duration;
    cells[7].innerHTML = obj.expectedReturn;
    if(obj.expectedReturn != null){
        const x = obj.minutesaway * 60000;
        staffTimeout = setTimeout(obj.staffMemberIsLate, x,obj.picture, obj.name, obj.surname, obj.duration);
    }
}

//Clearing timeout if staff clicked In before expecte return.
const noStaffTimeout = () => clearTimeout(staffTimeout); 

//checking for only letter input.
function lettersOnly(obj){
    let check = /^[ÆØÅæøåA-Za-z ]+$/;
    return check.test(obj);
}
//checking for only number input.
function numbersOnly(obj){
    let check = /^\d+$/;
    return check.test(obj);
}
//Checking for only numbers AND letters(delivery Adress)
function numbersAndLetters(obj){
    let check = /^[0-9ÆØÅæøåa-zA-Z\s,-]+$/;
    return check.test(obj);
}

//validating correct input by user, if wrong, prompt.
function validateDelivery(){
    const vehicle = $("#vehicleInput").find(":selected").val();
    const name = $("#nameInput").val();
    const surname = $("#surnameInput").val();
    const telephone = $("#telephoneInput").val();
    const deliveryAdress = $("#deliveryInput").val();
    const returnTime = $("#returnInput").val();
    if(vehicle == "Transport" || !lettersOnly(name) || !lettersOnly(surname) || !numbersOnly(telephone) || !numbersAndLetters(deliveryAdress) || returnTime == null){
        alert(`Invalid input, correct format:\nVehicle: Select vehicle. \nName and surname: letters only. \nTelephone: numbers only. \nDelivery Adress: letters and numbers.`);
    }
    else{
        const deliveryDriver = {vehicle,name,surname,telephone,deliveryAdress,returnTime}
        addDelivery(deliveryDriver);  
    }
}

//Delivery Driver Timeout.
let deliveryTimeout;

//make input value into object, insert into Delivey Board.
function addDelivery(obj){
    const tablebody = document.querySelector("#deliveryTable tbody");
    const row = tablebody.insertRow();
    const obj1 = new DeliveryDriver(obj);
    if(obj1.vehicle == "Car"){
    row.insertCell(0).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16">
    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
  </svg>`;
    //Fiat 500 by Icons8
    }
    else{
    row.insertCell(0).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-bicycle" viewBox="0 0 16 16">
    <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5zm1.5 2.443-.508.814c.5.444.85 1.054.967 1.743h1.139L5.5 6.943zM8 9.057 9.598 6.5H6.402L8 9.057zM4.937 9.5a1.997 1.997 0 0 0-.487-.877l-.548.877h1.035zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765l1.027-1.643zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53L11.55 8.623z"/>
  </svg>`;
    }
    row.insertCell(1).innerHTML = obj1.name;
    row.insertCell(2).innerHTML = obj1.surname;
    row.insertCell(3).innerHTML = obj1.telephone;
    row.insertCell(4).innerHTML = obj1.deliveryAdress;
    row.insertCell(5).innerHTML = obj1.returnTime;
    clearToast("form");
    let hours = parseInt(digitalClock().slice(0,2));
    let minutes = parseInt(digitalClock().slice(3,5));
    let x = parseInt(obj1.returnTime.slice(0,2)) - hours;
    let y = parseInt(obj1.returnTime.slice(3,5)) - minutes;
    while(x > 0){x -= 1;y += 60}
    let z = y * 60000;
    deliveryTimeout = (setTimeout(obj1.deliveryDriverIsLate, z,obj1.name,obj1.surname,obj1.telephone,obj1.deliveryAdress,obj1.returnTime))
}

//removes timeout for delivery driver onclick toast remove.
const nodeliveryTimeout = () => clearTimeout(deliveryTimeout);

//animation for Delivery Board rows and select.
$("#deliveryTable tbody").on("click","tr",function(){
      let row = $(this).hasClass("selected");
       $("#deliveryTable tr").removeClass("selected")
      if(!row)
      $(this).addClass("selected");
    }) 

//Toast for Delivery Board delete selected row.
 function deliveryBoard(){
    $("#deliveryClearToast").toast("show");  
 }

//removes the row selected by user.
 function deliveryClear(){
    $("#deliveryClearToast").toast("hide");
    let selected = $("#deliveryTable .selected");
    selected.remove();
 } 

 //hide deliverylateToast and clear toast of information.
 function deliveryAction(){
    $("#deliveryLateToast").toast("hide");
    clearToast("delivery");
 }

 //clears toast of name after display, onclick.
function clearToast(type){
    switch(type){
        case "staff":
            $("#staffToastmessage").text("");
            break;
        case "delivery":
             $("#deliveryLateToastmessage").text("");
             break;
        case "form":
            $("#deliveryDriverForm").trigger("reset");
           break;
    }
}

