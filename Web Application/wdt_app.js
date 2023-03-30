//Current time on webpage, also returns current time for use in methods.
function digitalClock(){
    const date = new Date();
    const time = date.toLocaleTimeString();
    const today = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    document.getElementById("time").innerHTML =  today + "-" + month + "-"+ year + " " + " " + time;
    return time;
    }
setInterval(digitalClock,1000);

//parent class Employees
class Employee{
    constructor(obj){
        this.name = obj.name;
        this.surname = obj.surname;
    }
}

//Staff class inherits from Employee
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
        if(this.expectedReturn <= digitalClock()){
            let x = this.name;
            let y = this.surname;
            document.addEventListener("DOMContentLoaded", function(){
                $("#staffToastmessage").prepend(`Staff not returned at expected time : `, x + " " +y);  
                 $("#staffToast").toast("show");   
            })     
            }
        }     
    }

//Delivery driver class inherits from Employee
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
        if(this.returnTime <= digitalClock()){
            let x = this.name;
            let y = this.surname;
            let z = this.telephone;
            let æ = this.deliveryAdress;
            let ø = this.returnTime;
            document.addEventListener("DOMContentLoaded", function(){
            $("#deliveryToastmessage").prepend(`Delivery driver overdue expected return : <br> ${x} ${y}. <br> Phone number: ${z}. <br> Delivery Adress: ${æ}. <br> Supposed return time: ${ø}`);
             $("#deliveryToast").toast("show");
            })
        }
    }
}

//get API "staff member"
function staffUserGet(){
let result = {};
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
        result = new StaffMember(obj);
    }
  });
return result;
};

//5 "staff members"
const employee1 = staffUserGet();
const employee2 = staffUserGet();
const employee3 = staffUserGet();
const employee4 = staffUserGet();
const employee5 = staffUserGet();

//staffTable rows and cells
function staffTable(obj){
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
staffTable(employee1);
staffTable(employee2);
staffTable(employee3);
staffTable(employee4);
staffTable(employee5);

//table animation on click Table
$(document).ready(function(){
    $("#staffTable tr").click(function(){
      let row = $(this).hasClass("rowselected");
       $("#staffTable tr").removeClass("rowselected")
      if(!row)
      $(this).addClass("rowselected");
    }) 
})

//option for user, Staff end day or break.
function outOrEnd(){
   $("#staffOutToast").toast("show"); 
}

//staff goin out for "break" from workday, displaying break specs.
function staffOut(){
    $("#staffOutToast").toast("hide");
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    let time = "";
    let away = prompt("Enter estimated away time in minutes:","enter minutes")
    $("#staffTable .rowselected td").eq(4).html("Break");
    if(minutes < 10){
        $("#staffTable .rowselected td").eq(5).html(hours + ":0" + minutes);
    }
    $("#staffTable .rowselected td").eq(5).html(hours + ":" + minutes);
    if(away < 60){
    $("#staffTable .rowselected td").eq(6).html(away)    
    } 
    let x = +away + +minutes;
    if(x >= 60){
    while (x > 60){
        x -= 60;
        hours += 1;
    }
    if(x < 10){
        $("#staffTable .rowselected td").eq(7).html(hours + ":0" + x);
    }
    if(x > 10)
    $("#staffTable .rowselected td").eq(7).html(hours + ":" + x);
    }
    else{
        $("#staffTable .rowselected td").eq(6).html(x);
        $("#staffTable .rowselected td").eq(7).html(hours + ":" + x);  
    }
}

//staff goin home for the day, status out and clears time, duration, expected return.
function staffEnd(){
    $("#staffOutToast").toast("hide");
    let selected = $("#staffTable .rowselected")
    $("#staffTable .rowselected td").eq(4).html("Out");
    $("#staffTable .rowselected td").eq(5).html(null);
    $("#staffTable .rowselected td").eq(6).html(null);
    $("#staffTable .rowselected td").eq(7).html(null);
    if(!selected)
    alert("No staff member selected");
}

//changes status to in on relevant object, clears out time, duration, expected return.
function staffIn(){
    let selected = $("#staffTable .rowselected")
    $("#staffTable .rowselected td").eq(4).html("In");
    $("#staffTable .rowselected td").eq(5).html(null);
    $("#staffTable .rowselected td").eq(6).html(null);
    $("#staffTable .rowselected td").eq(7).html(null);
    $("#staffTable .rowselected td").eq(8).html(null);
    if(!selected)
    alert("No staff member selected");
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
    let vehicle = document.getElementById("vehicleInput").value;
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

 
