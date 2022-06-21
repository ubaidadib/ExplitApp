getFriendListFromGrpSS = (grpName) => {
    groupListfromSS = JSON.parse(sessionStorage.getItem('groups'))
    return groupListfromSS[grpName]
}

setFriendList = () => {

    friendLsitFromSS = JSON.parse(sessionStorage.getItem('friends'))
    groupListfromSS = Object.keys(JSON.parse(sessionStorage.getItem('groups')))

    friendSelectElement = $('#emailAddress_addExp');

    friendSelectElement.append("<option value=none type=\"none\"></option>")

    groupListfromSS.forEach(grp => {
        friendSelectElement.append("<option value=" + grp + " type=\"grps\">" + grp + "</option>")
    })
    friendLsitFromSS.forEach(frnd => {
        friendSelectElement.append("<option value=" + frnd + " type=\"frnd\">" + frnd + "</option>")
    })
}

getinvolvedFriendList = (type, name) => {
    if (type == "grps") {
        frnds = getFriendListFromGrpSS(name)
        return ["you", ...frnds]

    } else if (type = "frnd") {
        return ["you", name]
    }
}

updateSplitByAmount = () => {
    splitTypeElement = $('#splitType')
    sType = $("#splitType option:selected").attr("type")
    sVal = $("#splitType option:selected").attr("value")

    friendSelectElement = $('#emailAddress_addExp');
    fType = $("#emailAddress_addExp option:selected").attr("type")
    fValue = $("#emailAddress_addExp option:selected").attr("value")

    amount = $('#amount').val()
    if (amount == "") {
        amount = 0
    } else {
        amount = parseInt(amount)
    }

    currency = $("#currency option:selected").val()

    invFrnd = getinvolvedFriendList(fType, fValue)

    if (sType == "none") {
        $('#splitValue').hide()
    } else if (sType == "eq") {
        $("#splitByAmount").hide()
        $('#splitValue').show()

        numOfFrnd = invFrnd.length;
        eqAmt = (amount / numOfFrnd).toFixed(2)
        string = `${currency} ${eqAmt}/person`

        $("#splitEqualMsg").empty()
        $("#splitEqualMsg").append(string)
        $("#splitEqualMsg").show()
    } else if (sType == "exact") {
        $("#splitEqualMsg").hide()
        $('#splitValue').show()

        $("#splitByAmount").empty()
        invFrnd.forEach(frnd => {
            $("#splitByAmount").append(getSplitElement(frnd))
        })

        $("#splitByAmount").show()
    }
}

// onchange amount
amountUpdated = () => {
    updateSplitByAmount()
}

// onchange currency
currencyUpdate = () => {
    updateSplitByAmount()
}

// onchange emailAddress_addExp
selectModal = () => {
    friendSelectElement = $('#emailAddress_addExp');
    type = $("#emailAddress_addExp option:selected").attr("type")
    value = $("#emailAddress_addExp option:selected").attr("value")

    if (type != "none") {
        $('#expBox').show()
    } else {
        $('#expBox').hide()
    }

    paidBy = $("#paidBy")
    paidBy.empty()
    frndList = getinvolvedFriendList(type, value)
    frndList.forEach(frnd => {
        paidBy.append("<option value=" + frnd + ">" + frnd + "</option>")
    })

}

getSplitElement = (name) => {
    return `<div class="row mt-2">
                <div class="col-md">${name}</div>
                <div class="col-md">
                    <input type="text" class="form-control" placeholder="0.00">
                </div>
            </div>`
}

// onchange split type
splitTypeChanged = () => {
    updateSplitByAmount()
}

addFriendsDataToSessionStore = (groupData) => {
    grpData = {}
    friendList = []

    groupData.forEach(data => {
        console.log(`group:${data.groupName}, name:${data.groupMember}`)
        grpNameData = grpData[data.groupName];

        if (grpNameData == undefined) {
            grpData[data.groupName] = [data.groupMember]
        } else {
            grpNameData = [...grpNameData, data.groupMember]
            grpData[data.groupName] = grpNameData
        }

        friendList = [...friendList, data.groupMember]
    })

    sessionStorage.setItem("friends", JSON.stringify(friendList))
    sessionStorage.setItem("groups", JSON.stringify(grpData))
}


function SignIn() {

    var failureResult = document.getElementById("failureSignIn");
    var email = document.getElementById("signin_email").value;
    var password = document.getElementById("signin_password").value;

    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/user/signin",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ username: email, password: password }),

        success: function (response) {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', 'false');
            getUserInfo();
            window.location.href = "../pages/dashboard.html";

        },
        error: function (error) {

            var failureMessage = "Invalid Email Address or Password ...";
            failureResult.innerHTML = '<div class="alert alert-danger" role="alert">' + failureMessage + '</div>';
        }
    });
}
function SignUp() {

    var failureResult = document.getElementById("failureSignUp");
    var fullname = document.getElementById("full_name").value;
    var email = document.getElementById("signup_email").value;
    var password = document.getElementById("signup_password").value;

    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/user/signup",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ fullname: fullname, email: email, password: password }),

        success: function (response) {
            sessionStorage.setItem('signUpEmail', email);
            // var succesMessage = "Nice to have you with Us "+ fullname;
            // failureResult.innerHTML = '<div class="alert alert-sucess" role="alert">' + succesMessage + '</div>';

            window.location.href = "../pages/signin.html";
        },
        error: function (error) {

            var failureMessage = "Invalid Email Address or Password ! -_- !";
            failureResult.innerHTML = '<div class="alert alert-danger" role="alert">' + failureMessage + '</div>';


        }
    });
}

function SignOut() {

    sessionStorage.removeItem('userFullName');
    sessionStorage.removeItem('email');
    sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', 'true');
    sessionStorage.removeItem('friends');
    sessionStorage.removeItem('groups');
    window.location.href = "../index.html";

}
function getUserInfo() {

    var user = sessionStorage.getItem('email');

    // var navBarUsername = document.getElementById('userName');

    $.ajax({
        url: "https://explits.azurewebsites.net/api/v1/user/" + user,
        dataType: 'JSON',
        type: 'GET',
        success: function (results) {
            sessionStorage.setItem('userFullName', results.fullName);
            //console.log(results.fullName);

        },
        error: function (e) {
            //called when there is an error
            console.log(e.message);
        }
    });
}
function createGroup() {

    var grpName = document.getElementById("grpname").value;
    var firstMemEmail = document.getElementById("mem_email001").value;
    var secondMemEmail = document.getElementById("mem_email002").value;
    var thirdMemEmail = document.getElementById("mem_email003").value;
    var fourthMemEmail = document.getElementById("mem_email004").value;
    var groupType = document.getElementById("grp_type");
    var gpTypeValue = groupType.options[groupType.selectedIndex].value;
    var groupCreator = sessionStorage.getItem('email');

    console.log(grpName, groupCreator, gpTypeValue, firstMemEmail, secondMemEmail, thirdMemEmail, fourthMemEmail);

    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/group/create",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(
            {
                "GroupName": grpName,
                "CreatedBy": groupCreator,
                "GroupType": gpTypeValue,
                "AddGroupMember": [
                    { "Member": firstMemEmail },
                    { "Member": secondMemEmail },
                    { "Member": thirdMemEmail },
                    { "Member": fourthMemEmail }]
            }
        ),
        //
        success: function (response) {
            console.log('This is the error response', response);

        },

        error: function (error) {
            console.log('This is the success response', error);
            window.location.href = "../pages/dashboard.html";
        }
    });
}

function getUserGroups() {

    var groupCreator = sessionStorage.getItem('email');
    var items = document.getElementById('groupList');


    $.ajax({
        url: "http://explits.azurewebsites.net/api/v1/mygroupnames/" + groupCreator,
        dataType: 'JSON',
        type: 'GET',
        success: function (results) {
            //console.log(results.length==0);
            if (results.length !== 0) {
                $('#groupList').empty();
                //var listItems = "";
                results.forEach(element => {
                    var x = document.createElement("LI");
                    x.className = "list-group-item";
                    var t = document.createTextNode(element);
                    x.appendChild(t);
                    items.appendChild(x);

                });
            }
            else {
                items.innerHTML= `<li class="list-group-item">No groups found, please add one.</li>`

            }



        },
        error: function (e) {
            //called when there is an error
            console.log(e.message);
        }
    });
}

function getFriends() {

    var groupCreator = sessionStorage.getItem('email');
    var friendList = document.getElementById('friendList');


    $.ajax({
        url: "https://explits.azurewebsites.net/api/v1/mygroups/" + groupCreator,
        dataType: 'JSON',
        type: 'GET',
        success: function (results) {

            if(results.length !== 0){
                $('#friendList').empty();

                // console.log(results);
                addFriendsDataToSessionStore(results)
                results.forEach(element => {
                    var x = document.createElement("LI");
                    x.className = "list-group-item";
    
                    var t = document.createTextNode(element.groupMember);
                    x.appendChild(t);
                    friendList.appendChild(x);
    
                });
            }
            else{
                friendList.innerHTML= `<li class="list-group-item">No friends found, please add one.</li>`

            }

            




        },
        error: function (e) {
            //called when there is an error
            console.log(e.message);
        }
    });
}

function getSessionName() {

    let userName = document.getElementById('userName');
    var sessionName = sessionStorage.getItem('userFullName');
    //var sessionEmail = sessionStorage.getItem('email');
    if (sessionStorage.getItem('userFullName') == null) {
        userName.innerHTML = ' <i class="fas fa-user-circle fa-xl"></i> ';

    }
    else {
        userName.innerHTML = ' <i class="fas fa-user-circle fa-xl"></i> Welcome,  ' + sessionName;

    }

}

function isLoggedIn() {

    var navBarMenu = document.getElementById('navBarMenu');
    var firstTime = sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer');

    if (firstTime == 'true') {
        navBarMenu.innerHTML = `<div class="container px-5">`
            + `<a class="navbar-brand" href="../index.html">Explit</a>`
            + `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>`
            + `<div class="collapse navbar-collapse" id="navbarSupportedContent">`
            + `<ul class="navbar-nav ms-auto mb-2 mb-lg-0">`
            + `<li class="nav-item"><a class="nav-link text-white" href="../index.html">Home</a></li>`
            + `<li class="nav-item"><a class="nav-link text-white" href="../pages/about.html">About</a></li>`
            + `<li class="nav-item"><a class="nav-link text-white" href="../pages/contact.html">Contact</a></li>`
            + `<li class="nav-item"><a class="nav-link text-white" href="../pages/faq.html">FAQ</a></li>`
            + `<li class="nav-item dropdown" id="isLoggedIn">`
            + `<a class="nav-link text-white" href="../pages/signin.html"><i class="fa fa-sign-in" aria-hidden="true"></i> / <i class="fa-solid fa-user-plus"></i></a>`
            + `<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="">`
            + `<li><a class="dropdown-item" href="../pages/dashboard.html">Dashboard</a></li>`
            + `<li><a class="dropdown-item" href="../pages/groups.html">Create a group</a></li>`
            + `<li><a class="dropdown-item" href="#" onclick="SignOut()">Logout</a></li>`
            + `</ul>`
            + `</li>`
            + `</ul>`
            + `</div>`
            + `</div>`



    }
    else {

        navBarMenu.innerHTML = `<div class="container px-5">`
            + `<a class="navbar-brand" href="../pages/dashboard.html">Explit</a>`
            + `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>`
            + `<div class="collapse navbar-collapse" id="navbarSupportedContent">`
            + `<ul class="navbar-nav ms-auto mb-2 mb-lg-0">`
            + `<li class="nav-item dropdown" id="isLoggedIn">`
            + `<a class="nav-link dropdown-toggle text-white" id="userName" href="#" role="button"
            data-bs-toggle="dropdown" aria-expanded="false"></a>`
            + `<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="">`
            + `<li><a class="dropdown-item" href="../pages/dashboard.html">Dashboard</a></li>`
            + `<li><a class="dropdown-item" href="../pages/groups.html">Create a group</a></li>`
            + `<li><a class="dropdown-item" href="../pages/contact.html">Contact Support</a></li>`
            + `<li><a class="dropdown-item" href="#" onclick="SignOut()">Logout</a></li>`
            + `</ul>`
            + `</li>`
            + `</ul>`
            + `</div>`
            + `</div>`




    }

}

function contactUs() {
    var msg_error = document.getElementById("failureMessageSending");
    var senderName = document.getElementById("senderFullName").value;
    var senderEmail = document.getElementById("senderEmail").value;
    var senderNumber = document.getElementById("senderPhoneNumber").value;
    var senderMessage = document.getElementById("senderMessage").value;

    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/contact/create",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ FullName: senderName, PhoneNumber: senderNumber, EmailAddress: senderEmail, Message: senderMessage }),

        success: function (response) {

            var failureMessage = "Something went wrong please try again ";
            msg_error.innerHTML = '<div class="alert alert-danger" role="alert">' + failureMessage + '</div>';

        },
        error: function (error) {
            var failureMessage = "Thank You, we recieved your message and we will contact you soon .. ";
            msg_error.innerHTML = '<div class="alert alert-success" role="alert">' + failureMessage + '</div>';





        }
    });
}

function splitExpense() {
    var expGroupNameSelect = document.getElementById("emailAddress_addExp");
    var expGroupNameValue = select.options[expGroupNameSelect.selectedIndex].value;
    var currencySelect = document.getElementById("currency");
    var currencyValue = select.options[currencySelect.selectedIndex].value;
    var groupID = document.getElementById("groupID");
    var shareTyp = document.getElementById("shareBy");

    var expenseCategoryOption = document.getElementById("expense_category");
    var expenseCategoryValue = expenseCategoryOption.value;
    var description = document.getElementById("expDes");

    var paidBySelect = document.getElementById("paidBy");
    var paidByValue = select.options[paidBySelect.selectedIndex].value;

    var nearBySelect = document.getElementById("nearbyPlaces");
    var nearByValue = select.options[nearBySelect.selectedIndex].value;

    var amountByEach = document.getElementById("amountByEach");
    var amountDistribution = document.getElementById("amountDistribution");

    var email = document.getElementById("signin_email").value;
    var password = document.getElementById("signin_password").value;

    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/split/create",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            GroupName: expGroupNameValue,
            GroupId: groupID,
            ShareType: shareTyp,
            ExpenseCategory: expenseCategoryValue,
            Description: description,
            Currency: currencyValue,
            PaidBy: paidByValue,
            AmountByEach: amountByEach,
            AmountDistribution: amountDistribution
        }),

        success: function (response) {

            alert('Expense is Splitted ' + shareTyp + 'between You and ' + paidBy);

        },
        error: function (error) {

            alert('Something went wrong, please try again ');
        }
    });
}
function setEmailField() {

}
function buttonToggle() {

    var signin_btn = document.getElementById('signInButton');
    var firstTime = sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer');


    if (firstTime == 'true') {
        signin_btn.innerHTML = `<a class="btn btn-lg px-4 me-sm-3 text-white" href="pages/signin.html" style="background-color: #135017;">Sign Up &nbsp; <i class="fa-solid fa-user-plus"></i></a>`;

    }
    else {
        signin_btn.innerHTML = `<a class="btn btn-lg px-4 me-sm-3 text-white" href="../pages/dashboard.html" style="background-color: #135017;">Dashboard &nbsp; <i class="fa-solid fa-gauge"></i></a>`;

    }
}
function InviteFriends() {

    var friendEmail = document.getElementById("friendEmailAddress").value;
    var friendName = document.getElementById("friendName").value;

    console.log(friendEmail, friendName);
    jQuery.ajax({
        url: "https://explits.azurewebsites.net/api/v1/notifications/invite",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ FullName: friendName, Receiver: friendEmail }),

        success: function (succes) {
            console.log(error);
            alert("Something Went Wrong Please check your Inputs field");

        },
        error: function (error) {
            alert("An Invitation to " + friendName + " sent successfully");
            $("#addFriends").modal("hide");
            document.getElementById("friendEmailAddress").value = "";
            document.getElementById("friendName").value = "";



        }
    });
}


// Reset Input and Toggle Class Expense Modal
$('#addExpense').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
    this.querySelector('.box').style.display = "none";
})




