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

//get API "staff member"
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

//5 "staff members"
const employee0 = staffUserGet();
const employee1 = staffUserGet();
const employee2 = staffUserGet();
const employee3 = staffUserGet();
const employee4 = staffUserGet();
const staff = [employee0,employee1,employee2,employee3,employee4];

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

//table animation on click Table
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

const staffTable = $("#staffTable");

function getSelectedObject(){
    selected = $(".rowselected");
    let row = $("tr").index(selected);
    let obj = staff[row - 1];
    return obj;
}
//staff goin out for "break" from workday, displaying break specs.
function staffOut(){
    $("#staffOutToast").toast("hide");
    obj = getSelectedObject();
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    let away = prompt("Enter estimated away time in minutes:","enter minutes")
    obj.status = "Break";
    if(minutes < 10){
        //adding leading 0 for estetics if x is under 10
        obj.outTime = (hours + ":0" + minutes);
    }
    else{obj.outTime = (hours + ":" + minutes);}
        if(away < 60){obj.outTime = (away + "min"); } 
    else{
        let hour = Math.floor(away/60);
        let minutes = (away-(hour*60));
        obj.duration = (hour + "hr " + minutes + "min");
    }
        let x = +away + minutes;
        if(x >= 60){
        while (x > 60){x -= 60;hours += 1;}
        if(x < 10){ 
            //adding leading 0 for estetics if x is under 10
            obj.expectedReturn = (hours + ":0" + x);
            }
            else if(x >= 10){ obj.expectedReturn = (hours + ":" + x); }  
        }
        else{obj.expectedReturn = (hours + ":" + x);}
        $("#staffTable").on("change",obj);
    staffLate(obj);     
}

//staff going home for the day, status out and clears time, duration, expected return.
function staffEnd(){
    obj = getSelectedObject()
    if(obj.keys.length == 0)alert("No staff member selected");
    $("#staffOutToast").toast("hide");
    obj.status = ("Out");
    obj.outTime = (null);
    obj.duration = (null);
    obj.expectedReturn = (null);  
}

//changes status to in on relevant object, clears out time, duration, expected return.
function staffIn(){
    obj = getSelectedObject();
    if(obj.keys.length == 0)alert("No staff member selected")
    obj.status = ("In");
    obj.outTime = (null);
    obj.duration = (null);
    obj.expectedReturn = (null);
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

//make input value into object, insert into Delivey Board
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
    driverLate(obj)
}

//animation for Delivery Board rows and select.
$("#deliveryTable tbody").on("click","tr",function(){
      let row = $(this).hasClass("selected");
       $("#deliveryTable tr").removeClass("selected")
      if(!row)
      $(this).addClass("selected");
    }) 

//Toast for Delivery Board delete selcted row
 function deliveryBoard(){
    let selected = $("#deliveryTable .selected");
    if(selected.length == 0){alert("No driver selected, please click driver to select.")}
    else{$("#deliveryClearToast").toast("show");}  
 }

//removes the row selected by user
 function deliveryClear(){
    $("#deliveryClearToast").toast("hide");
    let selected = $("#deliveryTable .selected");
    selected.remove();
 }

 function driverLate(obj){
        if(obj.returnTime < digitalClock()){
         obj.deliveryDriverIsLate();   
        }     
 }

 function staffLate(obj){
    if(obj.returnTime < digitalClock()){
        obj.staffMemberIsLate();
    }
 }
 

 //refresh table after object update, activate staffLate and driverLate and keep them checking if time is overdue.
