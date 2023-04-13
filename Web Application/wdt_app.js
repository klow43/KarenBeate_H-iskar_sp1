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
    staffMemberIsLate(){
           $("#staffToastmessage").prepend(`Staff not returned at expected time : ${this.name} + " " + ${this.surname}`);  
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
    deliveryDriverIsLate(){
            $("#deliveryToastmessage").prepend(`Delivery driver overdue expected return : <br> ${this.name} ${this.surname}. <br> Phone number: ${this.telephone}. <br> Delivery Adress: ${this.deliveryAdress}. <br> Supposed return time: ${this.returnTime}`);
             $("#deliveryToast").toast("show");
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
    let time = digitalClock()
    let hours = parseInt(time.slice(0,2));
    const minutes = parseInt(time.slice(3,5));
    let away = prompt("Enter estimated away time in minutes:","enter minutes")
    obj.status = "Break";
    obj.outTime = (minutes < 10) ? (hours + ":0" + minutes) : (hours + ":" + minutes);
    let hour = Math.floor(away/60);
    let minute = (away-(hour*60));
    obj.duration = (+away < 60) ?  (away + "min") : (hour + "hr " + minute + "min");
    let x = +away + minutes;
    if(x >= 60){
        while (x > 60){x -= 60;hours += 1;}
        obj.expectedReturn = (x < 10) ? (hours + ":0" + x) : (hours + ":" + x);}       
    else{obj.expectedReturn = (hours + ":" + x);}   
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

//updates table after object update.
function updateTable(obj){
    let rowSelected = $(".rowselected")
    let index = $("tr").index(rowSelected);
    let cells = document.getElementById("staffTable").rows[index].cells;
    cells[4].innerHTML = obj.status;
    cells[5].innerHTML = obj.outTime;
    cells[6].innerHTML = obj.duration;
    cells[7].innerHTML = obj.expectedReturn;
}

//checking for only letter input.
function lettersOnly(obj){
    let check = /^[A-Za-z]+$/;
    return check.test(obj);
}
//checking for only number input.
function numbersOnly(obj){
    let check = /^\d+$/;
    return check.test(obj);
}
//Checking for only numbers AND letters(delivery Adress)
function numbersAndLetters(obj){
    let check = /^[0-9a-zA-Z\s,-]+$/;
    return check.test(obj);
}

//validating correct input by user, if wrong, prompt.
function validateDelivery(){
    const vehicle = document.getElementById("vehicleInput").value;
    const name = document.getElementById("nameInput").value;
    const surname = document.getElementById("surnameInput").value;
    const telephone = document.getElementById("telephoneInput").value;
    const deliveryAdress = document.getElementById("deliveryInput").value;
    const returnTime = document.getElementById("returnInput").value;
    if(vehicle == "Transport" || !lettersOnly(name) || !lettersOnly(surname) || !numbersOnly(telephone) || !numbersAndLetters(deliveryAdress) || !numbersOnly(returnTime)){
        alert(`Invalid input, correct format for each option:\nVehicle: please choose transport from selection. \nName and surname: letters only. \nTelephone: numbers only. \nDelivery Adress: letters and number(no special characters). \nReturn Time: only numbers`);
    }
    else{
        let deliveryDriver = {vehicle,name,surname,telephone,deliveryAdress,returnTime}
        addDelivery(deliveryDriver);
    }
}

//make input value into object, insert into Delivey Board.
function addDelivery(obj){
    const tablebody = document.querySelector("#deliveryTable tbody");
    const row = tablebody.insertRow();
    let deliveryDriver = new DeliveryDriver(obj);
    if(deliveryDriver.vehicle == "Car"){
    row.insertCell(0).innerHTML = `<img src="car.png" alt="Car" width="50" height="50"></img>`;
    }
    else{
    row.insertCell(0).innerHTML = `<img src="motorcycle.jpg" alt="Motorcycle" width="50" height="50"></img>`;
    }
    row.insertCell(1).innerHTML = obj.name;
    row.insertCell(2).innerHTML = obj.surname;
    row.insertCell(3).innerHTML = obj.telephone;
    row.insertCell(4).innerHTML = obj.deliveryAdress;
    row.insertCell(5).innerHTML = obj.returnTime;
}

//animation for Delivery Board rows and select.
$("#deliveryTable tbody").on("click","tr",function(){
      let row = $(this).hasClass("selected");
       $("#deliveryTable tr").removeClass("selected")
      if(!row)
      $(this).addClass("selected");
    }) 

//Toast for Delivery Board delete selected row.
 function deliveryBoard(){
    let selected = $("#deliveryTable .selected");
    $("#deliveryClearToast").toast("show");  
 }

//removes the row selected by user
 function deliveryClear(){
    $("#deliveryClearToast").toast("hide");
    let selected = $("#deliveryTable .selected");
    selected.remove();
 }

//  //checking if late. setInterval, clearInterval()
//  function staffLate(obj){
//     obj.expectedReturn ? obj.staffMemberIsLate() : obj.deliveryDriverIsLate();
//  }
 

 // activate staffLate and driverLate and keep them checking if time is overdue.
